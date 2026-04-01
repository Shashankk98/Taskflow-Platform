# 📋 Task Manager

A full-stack Task Management application built with **Spring Boot** + **Angular**, containerized with **Docker**, and deployed on **Kubernetes**.

> Built as a hands-on project to learn Kubernetes concepts — from basic Deployments to HPA and Helm charts.

---

## 🛠️ Tech Stack

### Backend
- Java 17 + Spring Boot 3
- Spring Data JPA + PostgreSQL
- REST API with full CRUD

### Frontend
- Angular 21
- Nginx (production static file serving)

### DevOps
- Docker + Docker Compose
- Kubernetes (Deployments, Services, ConfigMap, Secrets, HPA)
- Helm (environment-specific deployments)

---

## 🏗️ Architecture

```
Browser
  │
  ▼
[Nginx Container :80]          → Serves Angular Frontend
  │
  ▼ (API calls)
[Spring Boot Container :8080]  → REST API
  │
  ▼
[PostgreSQL Container :5432]   → Database (PVC for persistence)
```

### Kubernetes Architecture
```
namespace: task-manager
  │
  ├── frontend-deployment  (replicas: 2) ── frontend-service (NodePort :30080)
  ├── backend-deployment   (replicas: 3) ── backend-service  (ClusterIP)
  ├── postgres-deployment  (replicas: 1) ── postgres-service (ClusterIP)
  │       └── PVC (1Gi persistent storage)
  ├── ConfigMap  (DB_URL, DB_USERNAME)
  ├── Secret     (DB_PASSWORD)
  └── HPA        (min: 2, max: 10, CPU: 50%)
```

---

## 📁 Project Structure

```
task-manager/
├── src/                          # Spring Boot backend
├── frontend/                     # Angular frontend
├── k8s/                          # Raw Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml               # ⚠️ Not in Git (.gitignore)
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   └── hpa.yaml
├── helm/task-manager/            # Helm chart
│   ├── Chart.yaml
│   ├── values.yaml               # Dev defaults
│   ├── values-INT.yaml           # Integration
│   ├── values-VAL.yaml           # Validation (Pre-live)
│   ├── values-PROD.yaml          # Production
│   └── templates/                # Helm templates
├── Dockerfile.backend
├── Dockerfile.frontend
└── docker-compose.yml
```

---

## 🚀 How to Run

### 1. Local Development (without Docker)

**Prerequisites:** Java 17, Maven, Node.js 20, PostgreSQL

```bash
# Backend
./mvnw spring-boot:run

# Frontend (separate terminal)
cd frontend
npm install
ng serve
```

Access: `http://localhost:4200`

---

### 2. Docker Compose (Recommended for local)

```bash
# Build and start all services
docker compose up --build

# Stop
docker compose down
```

Access: `http://localhost`

---

### 3. Kubernetes (Docker Desktop)

**Prerequisites:** Docker Desktop with Kubernetes enabled, kubectl, Helm

#### Step 1 — Build Docker images
```bash
docker build -f Dockerfile.backend -t task-manager-backend:latest .
docker build -f Dockerfile.frontend -t task-manager-frontend:latest ./frontend
```

#### Step 2 — Create Secret (not in Git!)
```bash
kubectl create secret generic task-manager-secret \
  --from-literal=DB_PASSWORD=tera123 \
  --namespace=task-manager
```

#### Step 3 — Apply raw K8s manifests
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/hpa.yaml
```

#### Or use Helm (easier!)
```bash
# Dev
helm install task-manager ./helm/task-manager

# Integration
helm install task-manager ./helm/task-manager --values helm/task-manager/values-INT.yaml

# Production
helm install task-manager ./helm/task-manager --values helm/task-manager/values-PROD.yaml
```

Access: `http://localhost:30080`

---

### 4. Verify Deployment

```bash
# Check all pods running
kubectl get pods -n task-manager

# Check services
kubectl get services -n task-manager

# Check HPA
kubectl get hpa -n task-manager
```

---

## 🔑 K8s Concepts Covered

| Concept | Where Used |
|---------|-----------|
| Namespace | Isolated environment for all resources |
| Deployment | Backend (3 replicas), Frontend (2 replicas) |
| Service - ClusterIP | Backend ↔ Postgres (internal only) |
| Service - NodePort | Frontend exposed to browser |
| ConfigMap | Non-sensitive config (DB URL, username) |
| Secret | Sensitive data (DB password) |
| PVC | PostgreSQL data persistence |
| HPA | Auto-scale backend on CPU > 50% |
| Helm | Environment-specific deployments (INT/VAL/PROD) |

---

## 🌍 Environments (Helm)

| Environment | Replicas (BE) | Replicas (FE) | HPA Max | Tag |
|-------------|--------------|--------------|---------|-----|
| Dev | 3 | 2 | 10 | latest |
| INT | 2 | 1 | 5 | 1.0.0-RC |
| VAL (Pre-live) | 3 | 2 | 15 | 1.0.0-RC2 |
| PROD | 5 | 3 | 20 | 1.0.0 |

---

## 👨‍💻 Author

**Shashank Bukshetwar**  
Software Engineer — Java/Spring Boot + Microservices  
[GitHub](https://github.com/shashankbukshetwar)
