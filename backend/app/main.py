import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
from pydantic import BaseModel

from .scoring import DistrictInput, calculate_scores, ScoringResult
from .mock_data import districts_mock
from .agents import run_crisis_council, generate_scenario_summary, MODEL_NAME

app = FastAPI(title="CrisisGrid AI: Multi-Agent Crisis Intelligence API")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class DistrictScenarioResult(BaseModel):
    district_name: str
    scores: ScoringResult

class ScenarioResponse(BaseModel):
    status: str
    scenario_applied: str
    districts_affected: int
    results: List[DistrictScenarioResult]
    ai_summary: str


# ── Health Check ───────────────────────────────────────────────────────

@app.get("/health")
async def health_check():
    """Lightweight health check — does NOT waste a Gemini API call."""
    api_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "ok",
        "gemini_model": MODEL_NAME,
        "api_key_set": bool(api_key),
        "api_key_preview": f"{api_key[:8]}...{api_key[-4:]}" if api_key and len(api_key) > 12 else "not_set",
        "districts_loaded": len(districts_mock),
    }


# ── API Status ─────────────────────────────────────────────────────────

@app.get("/api-status")
async def api_status():
    """Returns the current API configuration and readiness."""
    return {
        "model": MODEL_NAME,
        "api_key_configured": bool(os.getenv("GEMINI_API_KEY")),
        "rate_limit_strategy": "Serialized queue with 4s minimum gap, exponential backoff on 429",
        "fallback_enabled": True,
        "total_districts": len(districts_mock),
    }


# ── Districts ──────────────────────────────────────────────────────────

@app.get("/districts")
def get_districts():
    """Returns a list of all monitored districts."""
    return {"data": districts_mock}

@app.get("/dashboard-summary")
def get_dashboard_summary():
    """Aggregate stats for the UI Dashboard — computed from real scoring."""
    critical = 0
    high = 0
    total_pop = 0
    diversion_flags = 0

    for d in districts_mock:
        try:
            inp = DistrictInput(**{k: v for k, v in d.items() if k in DistrictInput.model_fields})
            result = calculate_scores(inp)
            if result.priority_score >= 80:
                critical += 1
            elif result.priority_score >= 65:
                high += 1
            # Count diversion flags
            if d.get("black_market_risk_score", 0) > 70 or d.get("diversion_risk_score", 0) > 70:
                diversion_flags += 1
            total_pop += d.get("population", 0)
        except Exception:
            pass

    # Format population
    if total_pop >= 1_000_000:
        pop_str = f"{total_pop / 1_000_000:.1f}M"
    elif total_pop >= 1_000:
        pop_str = f"{total_pop / 1_000:.0f}K"
    else:
        pop_str = str(total_pop)

    return {
        "total_districts": len(districts_mock),
        "critical_count": critical,
        "high_priority_count": high,
        "affected_population": pop_str,
        "diversion_flags": diversion_flags,
        "global_risk_level": "Critical" if critical >= 3 else "Elevated" if high >= 3 else "Stable"
    }


# ── Core Analysis ──────────────────────────────────────────────────────

@app.post("/analyze-district", response_model=AnalysisResponse)
async def analyze_district(payload: DistrictInput):
    """Core endpoint that runs deterministic scoring + multi-agent Gemini debate."""
    try:
        # 1. Deterministic scoring
        result = calculate_scores(payload)

        # 2. Unified Agent Council call (with built-in fallback)
        data_str = payload.model_dump_json()
        council_result = await run_crisis_council(data_str)

        response = AnalysisResponse(
            scores=result,
            agents=council_result
        )

        return response

    except Exception as e:
        print(f"[ERROR] analyze-district failed: {e}")
        # Even on error, return something useful
        result = calculate_scores(payload)
        from .agents import _generate_council_fallback
        fallback = _generate_council_fallback(payload.model_dump_json())
        return AnalysisResponse(scores=result, agents=fallback)


# ── Scenario Simulation ───────────────────────────────────────────────

SCENARIO_OVERRIDES = {
    "flood": {
        "road_access_score": 15,
        "flood_or_disruption_flag": True,
        "last_mile_feasibility_score": 10,
    },
    "supply": {
        "current_lpg_stock": 15,
        "expected_refill_demand": 95,
        "recent_supply_drop_percent": 55,
    },
    "demand": {
        "urban_induction_shift_percent": 70,
        "rural_lpg_dependency_percent": 95,
    },
    "leakage": {
        "black_market_risk_score": 90,
        "diversion_risk_score": 85,
    },
}

@app.post("/simulate-scenario", response_model=ScenarioResponse)
async def simulate_scenario(payload: ScenarioInput):
    """Simulate a global shock across all districts and get AI summary."""
    try:
        overrides = SCENARIO_OVERRIDES.get(payload.scenario_type, {})

        district_results = []
        for d in districts_mock:
            merged = {**d, **overrides}
            try:
                inp = DistrictInput(**{k: v for k, v in merged.items() if k in DistrictInput.model_fields})
                scores = calculate_scores(inp)
                district_results.append(DistrictScenarioResult(
                    district_name=d["district_name"],
                    scores=scores,
                ))
            except Exception:
                pass

        # Build summary data for AI
        summary_data = [
            {
                "name": r.district_name,
                "priority": r.scores.priority_score,
                "band": r.scores.priority_band
            }
            for r in district_results
        ]

        # Get AI summary (with built-in fallback — never fails)
        try:
            ai_summary = await generate_scenario_summary(
                payload.scenario_type,
                payload.severity_multiplier,
                summary_data
            )
        except Exception as e:
            print(f"[WARN] AI summary generation failed, using fallback: {e}")
            from .agents import _generate_scenario_fallback
            ai_summary = _generate_scenario_fallback(
                payload.scenario_type,
                len(district_results),
                payload.severity_multiplier,
                summary_data
            )

        return ScenarioResponse(
            status="success",
            scenario_applied=payload.scenario_type,
            districts_affected=len(district_results),
            results=district_results,
            ai_summary=ai_summary,
        )

    except Exception as e:
        print(f"[ERROR] simulate-scenario failed: {e}")
        # NEVER return an HTTP error — always provide a valid response
        from .agents import _generate_scenario_fallback
        fallback_summary = _generate_scenario_fallback(
            payload.scenario_type,
            len(districts_mock),
            payload.severity_multiplier,
            []
        )
        return ScenarioResponse(
            status="success",
            scenario_applied=payload.scenario_type,
            districts_affected=len(districts_mock),
            results=[],
            ai_summary=fallback_summary,
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
