from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.score import Score
from app.schemas.score import ScoreResponse, ScoreSummary
from app.services.scoring_engine import scoring_engine
from app.services import business_service

router = APIRouter(prefix="/api/scores", tags=["Scores"])


@router.get("/leaderboard", response_model=list[ScoreSummary])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    # Get the latest score per business, ordered by overall_score desc
    from sqlalchemy import func

    subq = (
        db.query(Score.business_id, func.max(Score.id).label("max_id"))
        .group_by(Score.business_id)
        .subquery()
    )
    scores = (
        db.query(Score)
        .join(subq, Score.id == subq.c.max_id)
        .order_by(Score.overall_score.desc())
        .limit(limit)
        .all()
    )
    result = []
    for s in scores:
        result.append(
            ScoreSummary(
                business_id=s.business_id,
                business_name=s.business.name,
                industry=s.business.industry,
                overall_score=s.overall_score,
                grade=s.grade,
            )
        )
    return result


@router.post("/calculate/{business_id}", response_model=ScoreResponse)
def calculate_score(business_id: int, db: Session = Depends(get_db)):
    business = business_service.get_business(db, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    score_data = scoring_engine.calculate_score(business)
    score = Score(business_id=business.id, **score_data)
    db.add(score)
    db.commit()
    db.refresh(score)
    return score


@router.get("/{business_id}", response_model=ScoreResponse)
def get_latest_score(business_id: int, db: Session = Depends(get_db)):
    score = (
        db.query(Score)
        .filter(Score.business_id == business_id)
        .order_by(Score.scored_at.desc())
        .first()
    )
    if not score:
        raise HTTPException(status_code=404, detail="No score found for this business")
    return score


@router.get("/{business_id}/history", response_model=list[ScoreResponse])
def get_score_history(business_id: int, db: Session = Depends(get_db)):
    scores = (
        db.query(Score)
        .filter(Score.business_id == business_id)
        .order_by(Score.scored_at.desc())
        .all()
    )
    return scores
