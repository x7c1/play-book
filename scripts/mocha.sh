#!/bin/bash

set -eu

project=$1

line=$(cat << EOS
TS_NODE_PROJECT="${project}/tsconfig.json"\
 $(npm bin)/mocha\
 --require ts-node/register\
 --require tsconfig-paths/register\
 "${project}/**/*.spec.ts"
EOS
)
echo "> ${line}"
eval ${line}
