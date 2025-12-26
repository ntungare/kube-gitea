# Gitea on Kubernetes

This project provides a complete setup for deploying and running [Gitea](https://gitea.io/) on a Kubernetes cluster.

## Project Structure

- **`code/`**: Contains everything needed to deploy the project. See [code/README.md](./code/README.md) for detailed deployment instructions, manifests, and helper scripts.
- **`storage/`**: The host location where Kubernetes PersistentVolumes (PV) and PersistentVolumeClaims (PVC) store data. This project uses Rancher's **local-path-provisioner** concept (implemented via hostPath PVs pointing here).
    - `storage/gitea`: Stores Gitea repositories and data.
    - `storage/postgresql`: Stores the PostgreSQL database files.
- **`backups/`**: The destination directory for manually generated backups.
- **`make-backup.sh`**: A script to create a manual backup of the project state.

## Backups

To create a manual backup of the project (including configuration and the `storage` data), run:

```bash
./make-backup.sh
```

This will create a compressed archive in the `backups/` directory (e.g., `backup-YYYY-MM-DD...tar.gz`).
The backup excludes:
- `code/scripts/node_modules` (dependencies)
- `code/config.yml` (credentials file for easy reading)
- `backups/` (the backup directory itself)

## Deployment

For detailed installation and deployment instructions, please refer to the [Technical Documentation](./code/README.md).
