#!/bin/bash
# Bash script to apply all Kubernetes resources
#
# HOW TO RUN:
# ==========
# Option 1: Make executable and run (Linux/Mac/Git Bash)
#   chmod +x apply-k8s.sh
#   ./apply-k8s.sh
#
# Option 2: Run with bash directly
#   bash apply-k8s.sh
#
# Option 3: Apply directly without script (single command)
#   kubectl apply -f k8s-manifest.yaml
#
# HOW TO RUN IN POWERSHELL (Windows):
# ===================================
# Option 1: Use the PowerShell script instead
#   .\apply-k8s.ps1
#
# Option 2: If you have Git Bash or WSL, you can run this script
#   bash apply-k8s.sh
#
# Option 3: Apply directly (works in PowerShell)
#   kubectl apply -f k8s-manifest.yaml
#
# To check status after deployment:
#   kubectl get pods
#   kubectl get services
#   kubectl get deployments
#
# To delete all resources:
#   kubectl delete -f k8s-manifest.yaml
#
# ==========

echo "Applying Kubernetes manifest..."
kubectl apply -f k8s-manifest.yaml

echo ""
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-user-service
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-category-service
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-quote-service
kubectl wait --for=condition=available --timeout=300s deployment/mongo

echo ""
echo "Deployment Status:"
kubectl get deployments
kubectl get services
kubectl get pods

echo ""
echo "All services are deployed!"
