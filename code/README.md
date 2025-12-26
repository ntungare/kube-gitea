# Project Code

This directory contains the operational code for the project, including scripts, charts, and manifest templates.

## Directory Structure

- **[`chart/`](./chart/README.md)**: Helm charts and `helmfile` configuration for deploying Gitea, Postgres, and Redis.
- **[`kubefiles/`](./kubefiles/README.md)**: Templates for Kubernetes PersistentVolumes and Claims.
- **[`scripts/`](./scripts/README.md)**: TypeScript utilities for key management and encryption.

## Root Scripts

Helper scripts located in this directory:

### `make-pvs.sh`
Creates the PersistentVolumes and Claims required by the stack.
- resolves absolute paths to the `../storage` directory.
- applies templates from `kubefiles/`.

**Usage:**
```bash
./make-pvs.sh
```

### `delete-pvs.sh`
Deletes the PersistentVolumes and Claims. **Warning:** This will disconnect the storage from Kubernetes, but _does not_ delete the actual data on disk.

**Usage:**
```bash
./delete-pvs.sh
```

### `pvs-recreate.sh`
A convenience script to delete and then immediately re-create the PVs/PVCs. Useful during development if storage paths change.

**Usage:**
```bash
./pvs-recreate.sh
```

## Prerequisites

To run these tools, ensure you have:
- Kubernetes cluster
- `kubectl`
- `helm`
- `helm-diff` plugin for `helm`
- `helmfile`
