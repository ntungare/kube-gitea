#!/usr/bin/env sh

DIR="$( cd "$( dirname "$0" )" && pwd )"

sh $DIR/delete-pvs.sh
sh $DIR/make-pvs.sh
