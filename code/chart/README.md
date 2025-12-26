# Helm Chart & Deployment

This directory contains the Helm configuration for deploying the Gitea stack (Gitea, PostgreSQL, Redis).

## Files

- **`helmfile.yaml.gotmpl`**: definition of the releases.
- **`localhelm.sh`**: Wrapper script to help with secret management and deployment.
- **`port-forward.sh`**: Utility to forward local ports to the cluster services.
- **`values/`**: Value overrides for the charts.
- **`rendered.yaml`**: (Optional) Output verification file often used for debugging `helmfile template`. This file is gitignored.

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

## Access & Debugging

### Port Forwarding

To access the services locally without configuring Ingress, you can use the `port-forward.sh` script:

```bash
./port-forward.sh
```

This will forward the following ports from `localhost` to the `gitea` namespace:
- **3000**: Gitea HTTP
- **2222**: Gitea SSH
- **5432**: PostgreSQL
- **6379**: Redis
