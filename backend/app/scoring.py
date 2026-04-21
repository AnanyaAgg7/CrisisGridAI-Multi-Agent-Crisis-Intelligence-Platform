from pydantic import BaseModel
from typing import Optional

class DistrictInput(BaseModel):
    district_name: str
    population: int
    bpl_ratio: float
    vulnerable_household_ratio: float
    hospital_demand_index: float
    current_lpg_stock: float
    expected_refill_demand: float
    road_access_score: float
    flood_or_disruption_flag: bool
    black_market_risk_score: float
    diversion_risk_score: float
    urban_induction_shift_percent: float
    rural_lpg_dependency_percent: float
    recent_supply_drop_percent: float
    last_mile_feasibility_score: float
    
class ScoringResult(BaseModel):
    E: float
    L: float
    R: float
    D: float
    priority_score: float
    priority_band: str
    recommendation: str

def clamp(val: float, min_val: float=0.0, max_val: float=100.0) -> float:
    return max(min_val, min(val, max_val))

def calculate_scores(data: DistrictInput) -> ScoringResult:
    # Deterministic scoring for E
    e_raw = (data.bpl_ratio * 0.4) + (data.vulnerable_household_ratio * 0.4) + (data.hospital_demand_index * 0.2)
    E = clamp(e_raw)

    # Deterministic scoring for L
    l_raw = (data.road_access_score * 0.6) + (data.last_mile_feasibility_score * 0.4)
    if data.flood_or_disruption_flag:
        l_raw -= 40
    L = clamp(l_raw)

    # Deterministic scoring for R
    r_raw = (data.black_market_risk_score * 0.5) + (data.diversion_risk_score * 0.5)
    if data.recent_supply_drop_percent > 30:
        r_raw += 20
    R = clamp(r_raw)

    # Deterministic scoring for D
    d_raw = (data.expected_refill_demand * 0.5) + (data.rural_lpg_dependency_percent * 0.5) - (data.urban_induction_shift_percent * 0.5)
    D = clamp(d_raw)

    # Priority Score = 0.35E + 0.25L + 0.20(100 - R) + 0.20D
    priority_score = (0.35 * E) + (0.25 * L) + (0.20 * (100 - R)) + (0.20 * D)
    priority_score = clamp(priority_score)

    # Score Bands
    if priority_score >= 80:
        priority_band = "Critical Priority"
    elif priority_score >= 65:
        priority_band = "High Priority"
    elif priority_score >= 45:
        priority_band = "Moderate Monitoring"
    else:
        priority_band = "Low Priority / Manual Review"
        
    # Recommendation Logic
    recommendation = "Maintain allocation"
    
    if priority_score >= 80:
        recommendation = "Increase LPG allocation urgently"
    elif R > 75:
        recommendation = "Flag for fraud / misuse review"
    elif data.urban_induction_shift_percent > 30 and data.rural_lpg_dependency_percent > 70:
        recommendation = "Shift subsidy priority"
    elif priority_score >= 65:
        if L < 45 and E > 60:
            recommendation = "Route priority delivery support"
        else:
            recommendation = "Increase LPG allocation urgently" # fallback for high priority
    elif priority_score < 45:
        recommendation = "Manual policy review required"

    return ScoringResult(
        E=E, 
        L=L, 
        R=R, 
        D=D, 
        priority_score=priority_score, 
        priority_band=priority_band, 
        recommendation=recommendation
    )
