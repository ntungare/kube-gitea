#!/usr/bin/env sh
set -e

NAMESPACE="gitea"

kubectl port-forward -n gitea svc/gitea-http 3000:3000 &
PID_HTTP_PORT=$!
echo "Starting Gitea HTTP port forward, pid $PID_HTTP_PORT"

kubectl port-forward -n gitea svc/gitea-ssh 2222:2222 &
PID_SSH_PORT=$!
echo "Starting Gitea SSH port forward, pid $PID_SSH_PORT"

kubectl port-forward -n gitea svc/postgresql 5432:5432 &
PID_POSTGRESQL_PORT=$!
echo "Starting PostgreSQL port forward, pid $PID_POSTGRESQL_PORT"

kubectl port-forward -n gitea svc/redis-master 6379:6379 &
PID_REDIS_PORT=$!
echo "Starting Gitea SSH port forward, pid $PID_REDIS_PORT"

cleanup() {
    echo "\nStopping port forwards..."
    kill $PID_HTTP_PORT
    kill $PID_SSH_PORT
    kill $PID_POSTGRESQL_PORT
    kill $PID_REDIS_PORT
    exit 0
}

trap cleanup SIGINT SIGTERM

while true; do
    sleep 1
done
