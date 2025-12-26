#!/usr/bin/env zsh

DIR="$( cd "$( dirname "$0" )" && pwd )"
echo "Creating backup in $DIR/backups"

DATE=$(date +%Y-%m-%dT%H:%M:%S%z)
mkdir -p backups
tar -czf ./backups/backup-$DATE.tar.gz --exclude backups --exclude ./code/config.yml --exclude ./code/scripts/node_modules .
