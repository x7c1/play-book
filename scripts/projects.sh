#!/bin/sh

cmd=$1
name=tsconfig.json

find ./projects -name "${name}"\
 | sed -e "s/${name}//"\
 | sed -e "s/^/${cmd} /"\
 | sh
