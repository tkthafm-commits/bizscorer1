from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Business(Base):
    __tablename__ = "businesses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    industry: Mapped[str] = mapped_column(String(100), nullable=False)
    annual_revenue: Mapped[float | None] = mapped_column(Float, nullable=True)
    employee_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    years_in_operation: Mapped[int | None] = mapped_column(Integer, nullable=True)
    website_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    customer_rating: Mapped[float | None] = mapped_column(Float, nullable=True)
    review_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    has_compliance_cert: Mapped[bool] = mapped_column(Boolean, default=False)
    debt_to_equity_ratio: Mapped[float | None] = mapped_column(Float, nullable=True)
    profit_margin: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    scores = relationship("Score", back_populates="business", cascade="all, delete-orphan")
