#!/bin/bash

set -eu

project=$1
target=$2

line=$(cat << EOS
TS_NODE_PROJECT="${project}/tsconfig.json"\
 $(npm bin)/mocha\
 --require ts-node/register\
 --require tsconfig-paths/register\
 "${target}"
EOS
)
echo "> ${line}"
eval ${line}
