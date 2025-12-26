#!/usr/bin/env sh

NAMESPACE="gitea"

kubectl delete persistentvolumeclaims gitea-pvc --namespace $NAMESPACE
kubectl delete persistentvolumeclaims postgresql-pvc --namespace $NAMESPACE
kubectl delete persistentvolumes gitea-pv
kubectl delete persistentvolumes postgresql-pv
