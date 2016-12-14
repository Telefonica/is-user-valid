#!/usr/bin/env bash

# This script is in delivery/scripts BASE_DIR. Note: $0/.. is CWD
BASE_DIR=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' $0/../../..)

# Openstack configuration
export OS_USERNAME=${OS_USERNAME:-tdaf-jenkins-ost}
export OS_PASSWORD=${OS_PASSWORD:-password}
export OS_TENANT_NAME=${OS_TENANT_NAME:-1170-General}
export OS_AUTH_URL=${OS_AUTH_URL:-https://openstack-epg.hi.inet:13000/v2.0}
export OS_REGION_NAME=${OS_REGION_NAME:-regionOne}
export OS_CACERT=${OS_CACERT:-${BASE_DIR}/delivery/deploy/openstack/ca_openstack_epg.crt}

${BASE_DIR}/delivery/scripts/deploy.sh
