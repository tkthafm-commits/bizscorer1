from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ScoreResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    business_id: int
    overall_score: float
    financial_health: float
    online_presence: float
    customer_satisfaction: float
    operational_efficiency: float
    compliance: float
    grade: str
    scored_at: datetime


class ScoreSummary(BaseModel):
    business_id: int
    business_name: str
    industry: str
    overall_score: float
    grade: str
