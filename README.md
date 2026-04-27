# CrisisGrid AI: Multi-Agent Crisis Intelligence Platform

**CrisisGrid AI** is a multi-agent crisis intelligence platform designed for government authorities to allocate essential resources — fuel, food, medical supplies, and disaster relief — fairly during emergencies.

## Live Demo  
🔗 https://crisis-grid-ai.vercel.app/

## Contributions & Deployment

This repository is a fork of the original project.

In this version:
- Deployed full-stack application (Frontend on Vercel, Backend on Render)
- Fixed deployment and runtime issues
- Integrated API endpoints with production URLs
- Ensured end-to-end working MVP for real-time usage

This version represents the fully functional and deployable system.

## Stack
- **Frontend**: React + Vite + Tailwind CSS v4 + Recharts
- **Backend**: Python FastAPI + Pydantic
- **AI**: Google Gemini 1.5 integration-ready
- **Deployment**: Vercel + Render 

## Quick Start

### Terminal 1 — Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173/` (or whichever port Vite assigns).

## Architecture
- **Deterministic Scoring**: Math-driven baselines (E, L, R, D → Priority Score)
- **Multi-Agent Council**: Equity, Logistics, Risk, Demand agents + Moderator
- **Resource Agnostic**: Deployable across LPG, food grain, medical supply, water, disaster relief
