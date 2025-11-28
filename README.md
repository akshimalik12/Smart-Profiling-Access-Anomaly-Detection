# Smart Profiling — Access Anomaly Detection

A research-grade demo project for detecting access anomalies (login/behavior/transaction/network/insider) using a combination of Isolation Forest and an Autoencoder.  
This repository contains:

- A **frontend** (Vite + React + Tailwind + Recharts) — UI dashboard, file upload, charts.
- A **backend** (FastAPI + scikit-learn + TensorFlow) — training, scoring, CSV upload endpoints.
- Docker and CI configuration for easy local dev and deployment.

---

## Features

- Login anomaly detection with IsolationForest + Autoencoder
- CSV upload endpoint for batch detection
- Interactive dashboard with charts and top-k anomaly ranking
- Simple project structure ready for extension (behavior/transaction/network modules)

---

## Quick start (local)

> Prereqs: Node 18+, npm, Python 3.10+, Docker (optional)

### Backend

```bash
cd backend
python3.10 -m venv .venv
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
