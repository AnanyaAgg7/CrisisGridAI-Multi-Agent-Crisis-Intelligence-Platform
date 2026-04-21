# CrisisGrid AI Backend

This is the Python FastAPI backend for the CrisisGrid AI Multi-Agent Crisis Intelligence Platform.

## Endpoints
- `GET /districts` — List all monitored sectors
- `GET /dashboard-summary` — Aggregated threat statistics
- `POST /analyze-district` — Run deterministic scoring + multi-agent AI council
- `POST /simulate-scenario` — Apply synthetic crisis parameters

## Setup
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
