#!/bin/bash

echo "🚀 TaskFlow Platform — K8s Deploy Starting..."

# Step 1 — Docker images build
echo "📦 Building Docker images..."
docker build -f Dockerfile.backend -t task-manager-backend:latest .
docker build -f Dockerfile.frontend -t task-manager-frontend:latest ./frontend

# Step 2 — Secret create (agar already exist kare toh skip)
echo "🔐 Creating Secret..."
kubectl create secret generic task-manager-secret \
  --from-literal=DB_PASSWORD=tera123 \
  --namespace=task-manager \
  --dry-run=client -o yaml | kubectl apply -f -

# Step 3 — Helm deploy
echo "⎈ Deploying via Helm..."
helm upgrade --install task-manager ./helm/task-manager

echo "✅ Deploy Complete!"
echo "🌐 Access: http://localhost:30080"

# Step 4 — Pods status
kubectl get pods -n task-manager