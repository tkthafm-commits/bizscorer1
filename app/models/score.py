from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    business_id: Mapped[int] = mapped_column(Integer, ForeignKey("businesses.id"), nullable=False)
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    financial_health: Mapped[float] = mapped_column(Float, default=0.0)
    online_presence: Mapped[float] = mapped_column(Float, default=0.0)
    customer_satisfaction: Mapped[float] = mapped_column(Float, default=0.0)
    operational_efficiency: Mapped[float] = mapped_column(Float, default=0.0)
    compliance: Mapped[float] = mapped_column(Float, default=0.0)
    grade: Mapped[str] = mapped_column(String(2), nullable=False)
    scored_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="scores")
