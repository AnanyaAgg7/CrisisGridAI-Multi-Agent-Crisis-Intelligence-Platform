import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
from pydantic import BaseModel
import asyncio

from .scoring import DistrictInput, calculate_scores, ScoringResult
from .mock_data import districts_mock
from .agents import (
    run_equity_agent,
    run_logistics_agent,
    run_risk_agent,
    run_demand_agent,
    run_moderator_agent
)

app = FastAPI(title="CrisisGrid AI: Multi-Agent Crisis Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResponse(BaseModel):
    scores: ScoringResult
    agents: Dict[str, str]

class ScenarioInput(BaseModel):
    scenario_type: str
    severity_multiplier: float

@app.get("/districts")
def get_districts():
    """Returns a list of all monitored districts."""
    # TODO: [FIRESTORE INTEGRATION] Replace mock data with `db.collection(os.getenv("FIRESTORE_COLLECTION_DISTRICTS")).stream()`
    return {"data": districts_mock}

@app.get("/dashboard-summary")
def get_dashboard_summary():
    """Aggregate stats for the UI Dashboard."""
    # TODO: [FIRESTORE INTEGRATION] Aggregate doc statistics here.
    return {
        "total_districts": len(districts_mock),
        "critical_count": 2,
        "high_priority_count": 5,
        "global_risk_level": "Elevated"
    }

@app.post("/analyze-district", response_model=AnalysisResponse)
async def analyze_district(payload: DistrictInput):
    """Core endpoint that runs deterministic scoring + multi-agent Gemini debate."""
    # 1. Deterministic scoring
    result = calculate_scores(payload)
    
    # 2. Async Parallel Agent invocations
    data_str = payload.json()
    e_task = run_equity_agent(data_str, result.E)
    l_task = run_logistics_agent(data_str, result.L)
    r_task = run_risk_agent(data_str, result.R)
    d_task = run_demand_agent(data_str, result.D)
    
    e_txt, l_txt, r_txt, d_txt = await asyncio.gather(e_task, l_task, r_task, d_task)
    
    # 3. Synchronous Moderator invocation
    m_txt = await run_moderator_agent(data_str, e_txt, l_txt, r_txt, d_txt)
    
    response = AnalysisResponse(
        scores=result,
        agents={
            "equity_agent": e_txt,
            "logistics_agent": l_txt,
            "risk_agent": r_txt,
            "demand_agent": d_txt,
            "moderator_agent": m_txt
        }
    )
    
    # TODO: [FIRESTORE INTEGRATION] Save response data to `db.collection(os.getenv("FIRESTORE_COLLECTION_ANALYSIS")).add(response.dict())`
    return response

@app.post("/simulate-scenario")
async def simulate_scenario(payload: ScenarioInput):
    """Simulate a global shock parameter across all districts."""
    # TODO: Fetch all districts from Firestore, apply multiplication factor, and return shifted scores array
    return {
        "status": "success",
        "scenario_applied": payload.scenario_type,
        "message": "Scenario applied to 15 districts successfully."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
