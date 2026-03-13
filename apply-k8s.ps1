# PowerShell script to apply all Kubernetes resources
#
# HOW TO RUN IN POWERSHELL:
# =========================
# Option 1: Run directly with PowerShell
#   .\apply-k8s.ps1
#
# Option 2: If you get execution policy error, run this first:
#   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#   Then run: .\apply-k8s.ps1
#
# Option 3: Run with explicit PowerShell command
#   powershell -ExecutionPolicy Bypass -File .\apply-k8s.ps1
#
# Option 4: Apply directly without script (single command)
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
# =========================

Write-Host "Applying Kubernetes manifest..." -ForegroundColor Green
kubectl apply -f k8s-manifest.yaml

Write-Host "`nWaiting for deployments to be ready..." -ForegroundColor Yellow
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-user-service
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-category-service
kubectl wait --for=condition=available --timeout=300s deployment/quote-backend-quote-service
kubectl wait --for=condition=available --timeout=300s deployment/mongo

Write-Host "`nDeployment Status:" -ForegroundColor Green
kubectl get deployments
kubectl get services
kubectl get pods

Write-Host "`nAll services are deployed!" -ForegroundColor Green
