#!/usr/bin/env sh
set -e

NAMESPACE="gitea"
SECRET_NAME="gitea-db"

# If the secret exists, export the password
if kubectl get secret -n "$NAMESPACE" "$SECRET_NAME" >/dev/null 2>&1; then
  export GITEA_PASSWORD="$(
    kubectl get secret -n "$NAMESPACE" "$SECRET_NAME" \
      -o jsonpath="{.data.password}" | base64 -d
  )"

  export POSTGRES_PASSWORD="$(
    kubectl get secret -n "$NAMESPACE" "$SECRET_NAME" \
      -o jsonpath="{.data.postgres-password}" | base64 -d
  )"
fi

# Forward everything to helmfile
exec helmfile "$@"
