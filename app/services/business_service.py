from sqlalchemy.orm import Session

from app.models.business import Business
from app.models.score import Score
from app.schemas.business import BusinessCreate, BusinessUpdate
from app.services.scoring_engine import scoring_engine


def create_business(db: Session, data: BusinessCreate) -> Business:
    business = Business(**data.model_dump())
    db.add(business)
    db.commit()
    db.refresh(business)

    # Auto-score on creation
    score_data = scoring_engine.calculate_score(business)
    score = Score(business_id=business.id, **score_data)
    db.add(score)
    db.commit()
    db.refresh(business)
    return business


def get_business(db: Session, business_id: int) -> Business | None:
    return db.query(Business).filter(Business.id == business_id).first()


def list_businesses(db: Session, skip: int = 0, limit: int = 20) -> tuple[list[Business], int]:
    total = db.query(Business).count()
    businesses = db.query(Business).offset(skip).limit(limit).all()
    return businesses, total


def update_business(db: Session, business_id: int, data: BusinessUpdate) -> Business | None:
    business = get_business(db, business_id)
    if not business:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(business, key, value)
    db.commit()
    db.refresh(business)
    return business


def delete_business(db: Session, business_id: int) -> bool:
    business = get_business(db, business_id)
    if not business:
        return False
    db.delete(business)
    db.commit()
    return True
