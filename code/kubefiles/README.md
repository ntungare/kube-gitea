# Kubernetes Manifest Templates

This directory contains `envsubst` templates for creating PersistentVolumes (PV) and PersistentVolumeClaims (PVC).

## Files

- **`gitea-pv.yaml.tmpl`**: PV/PVC definition for Gitea data.
- **`postgresql-pv.yaml.tmpl`**: PV/PVC definition for PostgreSQL data.

## Usage

These files are not meant to be applied directly. They contain variables (e.g., `${GITEA_DATA_DIR}`) that must be replaced with absolute paths from the host system.

The **`../make-pvs.sh`** script in the parent directory handles this substitution and applies the manifests.
