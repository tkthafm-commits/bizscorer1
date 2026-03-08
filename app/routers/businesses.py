from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.business import (
    BusinessCreate,
    BusinessListResponse,
    BusinessResponse,
    BusinessUpdate,
)
from app.services import business_service

router = APIRouter(prefix="/api/businesses", tags=["Businesses"])


@router.post("/", response_model=BusinessResponse, status_code=201)
def create_business(data: BusinessCreate, db: Session = Depends(get_db)):
    return business_service.create_business(db, data)


@router.get("/", response_model=BusinessListResponse)
def list_businesses(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    businesses, total = business_service.list_businesses(db, skip, limit)
    return BusinessListResponse(businesses=businesses, total=total)


@router.get("/{business_id}", response_model=BusinessResponse)
def get_business(business_id: int, db: Session = Depends(get_db)):
    business = business_service.get_business(db, business_id)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.put("/{business_id}", response_model=BusinessResponse)
def update_business(business_id: int, data: BusinessUpdate, db: Session = Depends(get_db)):
    business = business_service.update_business(db, business_id, data)
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    return business


@router.delete("/{business_id}", status_code=204)
def delete_business(business_id: int, db: Session = Depends(get_db)):
    if not business_service.delete_business(db, business_id):
        raise HTTPException(status_code=404, detail="Business not found")
