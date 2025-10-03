#!/bin/bash
set -e
BASE=${BASE:-http://localhost:8080}
echo "Running provisioning tests against $BASE"
PROV=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"eid":"eid-test","iccid":"iccid-test","profile":{}}' $BASE/provision)
echo $PROV
ID=$(echo $PROV | jq -r .id)
curl -s $BASE/query/$ID | jq .
