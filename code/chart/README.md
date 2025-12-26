# Helm Chart & Deployment

This directory contains the Helm configuration for deploying the Gitea stack (Gitea, PostgreSQL, Redis).

## Files

- **`helmfile.yaml.gotmpl`**: definition of the releases.
- **`localhelm.sh`**: Wrapper script to help with secret management and deployment.
- **`values/`**: Value overrides for the charts.

## Deployment

We use [helmfile](https://github.com/helmfile/helmfile) to manage the deployment. The `localhelm.sh` wrapper script simplifies extracting secrets if they already exist in the cluster.

### Initial Deployment

For the first run (or if secrets are missing), you must ensure the secrets exist.

Example of creating the `gitea-admin` secret:

```bash
kubectl create secret generic gitea-admin \
  -n gitea \
  --from-literal=email=dummy@email.com \
  --from-literal=username=dummy-user \
  --from-literal=password=dummy-password

kubectl create secret generic gitea-db \
  -n gitea \
  --from-literal=password=dummy-user-password \
  --from-literal=postgres-password=dummy-postgres-password
```

Then run the sync:

```bash
./localhelm.sh sync
```

### Updates

For subsequent runs, if the secrets are already in the `gitea` namespace, you can simply run:

```bash
./localhelm.sh sync
```
The script will fetch the existing passwords from the Kubernetes secrets and pass them to helmfile.
