from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BusinessCreate(BaseModel):
    name: str
    industry: str
    annual_revenue: float | None = None
    employee_count: int | None = None
    years_in_operation: int | None = None
    website_url: str | None = None
    customer_rating: float | None = None
    review_count: int | None = None
    has_compliance_cert: bool = False
    debt_to_equity_ratio: float | None = None
    profit_margin: float | None = None


class BusinessUpdate(BaseModel):
    name: str | None = None
    industry: str | None = None
    annual_revenue: float | None = None
    employee_count: int | None = None
    years_in_operation: int | None = None
    website_url: str | None = None
    customer_rating: float | None = None
    review_count: int | None = None
    has_compliance_cert: bool | None = None
    debt_to_equity_ratio: float | None = None
    profit_margin: float | None = None


class BusinessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    industry: str
    annual_revenue: float | None = None
    employee_count: int | None = None
    years_in_operation: int | None = None
    website_url: str | None = None
    customer_rating: float | None = None
    review_count: int | None = None
    has_compliance_cert: bool
    debt_to_equity_ratio: float | None = None
    profit_margin: float | None = None
    created_at: datetime
    updated_at: datetime | None = None


class BusinessListResponse(BaseModel):
    businesses: list[BusinessResponse]
    total: int
