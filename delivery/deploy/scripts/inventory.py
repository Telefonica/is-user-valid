#!/usr/bin/env python

import os
import sys
import json

from novaclient import client

NOVACLIENT_VERSION = "2"
NETWORK_NAME = "private_management" # XXX this is tied to a specific openstack environment

# Manual tunning of the inventory
# Useful when you have duplicate common infrastructure like database (during a migration process)
SKIP = []

def main():
    inventory = get_inventory()
    print(json.dumps(inventory, indent=4))


def get_inventory():
    credentials = get_credentials_from_environment()
    nt = client.Client(NOVACLIENT_VERSION,
                       credentials['USERNAME'], credentials['PASSWORD'], credentials['TENANT_NAME'],
                       credentials['AUTH_URL'], service_type="compute", insecure=False,
                       cacert=credentials['OS_CACERT'])

    inventory = {"_meta": {"hostvars": {}}}
    user = None

    for server in nt.servers.list():
        ansible_host_groups = server.metadata.get("ansible_host_groups")
        user = server.metadata.get("user")
        tag = server.metadata.get("tag")

        if tag != 'is-user-valid':
            continue

        if ansible_host_groups:
            ansible_host_groups = map(lambda x: x.strip(), ansible_host_groups.split(','))
            management_role = filter(lambda x: x == 'management', ansible_host_groups)
            non_management_roles = filter(lambda x: x != 'management', ansible_host_groups)

            if NETWORK_NAME in server.addresses:
                floating_ips = filter(lambda x: x['OS-EXT-IPS:type'] == 'floating', server.addresses[NETWORK_NAME])
                fixed_ips = filter(lambda x: x['OS-EXT-IPS:type'] == 'fixed', server.addresses[NETWORK_NAME])

                # if len(floating_ips) > 0 and len(management_role) == 1:
                #     add_server_to_host_groups(management_role, server, floating_ips[0]['addr'], inventory, user)

                # if len(fixed_ips) > 0 and len(non_management_roles) > 0:
                #     add_server_to_host_groups(non_management_roles, server, fixed_ips[0]['addr'], inventory, user)

                # XXX this works when a floating ip is assigned to each machine
                if len(floating_ips) > 0:
                    if len(management_role) == 1:
                        add_server_to_host_groups(management_role, server, floating_ips[0]['addr'], inventory, user)
                    else:
                        add_server_to_host_groups(non_management_roles, server, floating_ips[0]['addr'], inventory, user)

    add_server_to_host_groups(['localhost'], 'localhost', 'localhost', inventory, user)

    return inventory


def add_server_to_host_groups(groups, server, ip_address, inventory, user):
    if ip_address is None:
        print("ERROR: no management IP for host: " + server.name)
        sys.exit(-1)

    for group in groups:
        server_name = server if type(server) is str else server.name
        host_group = inventory.get(group, {})
        hosts = host_group.get('hosts', [])
        hosts.append(server_name)
        host_group['hosts'] = hosts
        inventory[group] = host_group
        inventory["_meta"]["hostvars"].update({server_name: {"ansible_ssh_host": ip_address}})
        if user:
            inventory["_meta"]["hostvars"][server_name].update({"ansible_ssh_user": user})


def get_credentials_from_environment():
    credentials = {}
    try:
        credentials['USERNAME'] = os.environ['OS_USERNAME']
        credentials['PASSWORD'] = os.environ['OS_PASSWORD']
        credentials['TENANT_NAME'] = os.environ['OS_TENANT_NAME']
        credentials['AUTH_URL'] = os.environ['OS_AUTH_URL']
        credentials['OS_CACERT'] = os.environ['OS_CACERT']
    except KeyError as e:
        print("ERROR: environment variable %s is not defined" % e)
        sys.exit(-1)

    return credentials


if __name__ == "__main__":
    main()
