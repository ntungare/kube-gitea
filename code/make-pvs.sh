#!/usr/bin/env sh

DIR="$( cd "$( dirname "$0" )" && pwd )"

export GITEA_DATA_DIR=$(realpath "$DIR/../personal-git-storage/storage/gitea")
export POSTGRES_DATA_DIR=$(realpath "$DIR/../personal-git-storage/storage/postgresql")

echo $GITEA_DATA_DIR
echo $POSTGRES_DATA_DIR

envsubst < "$DIR/kubefiles/gitea-pv.yaml.tmpl" | kubectl apply -f -
envsubst < "$DIR/kubefiles/postgresql-pv.yaml.tmpl" | kubectl apply -f -
