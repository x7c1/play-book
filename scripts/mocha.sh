#!/bin/bash

set -eu

project=$1

line=$(cat << EOS
TS_NODE_PROJECT="./projects/${project}/tsconfig.json"\
 $(npm bin)/mocha\
 --require ts-node/register\
 --require tsconfig-paths/register\
 "projects/${project}/**/*.spec.ts"
)
echo "> ${line}"
eval ${line}
