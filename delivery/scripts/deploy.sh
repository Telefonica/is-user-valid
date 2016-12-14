#!/usr/bin/env bash

while getopts ':v' FLAG; do
  case $FLAG in
  v)
    echo "Verbose flag detected"
    FLAGV="-vvvv"
    ;;
  ?)
    echo "Invalid flag: \""${OPTARG}"\""
    exit -1
    ;;
  esac
done

shift $(($OPTIND-1))

# This script is in delivery/scripts BASE_DIR. Note: $0/.. is CWD
BASE_DIR=$(python -c 'import os,sys;print os.path.realpath(sys.argv[1])' $0/../../..)

echo "######### Starting delivery/scripts/deploy.sh #########"

pushd "${BASE_DIR}/delivery/deploy" &> /dev/null

# Import the roles
ansible-galaxy install -r requirements.yml -p ./roles
if [ $? -ne 0 ]; then
  echo "Error importing roles"
  popd &> /dev/null
  exit 1
fi

# Execute the ansible playbook
# vault_pass.txt is needed to decrypt sensitive config params and keys. It is created in run time, won't be in repo
ansible-playbook playbook.yml -e @config.yml $FLAGV --vault-password-file vault_pass.txt
if [ $? -ne 0 ]; then
  echo "Error deploying accounts"
  popd &> /dev/null
  exit 1
fi

popd &> /dev/null

echo "######### Deploy successfully completed in ${ENVIRONMENT} #########"
