import math

from app.config import settings
from app.models.business import Business


class ScoringEngine:
    def __init__(self):
        self.weights = settings.scoring_weights

    def calculate_score(self, business: Business) -> dict:
        category_scores = {
            "financial_health": self._score_financial_health(business),
            "online_presence": self._score_online_presence(business),
            "customer_satisfaction": self._score_customer_satisfaction(business),
            "operational_efficiency": self._score_operational_efficiency(business),
            "compliance": self._score_compliance(business),
        }
        overall = self._compute_overall(category_scores)
        grade = self._assign_grade(overall)
        return {
            **category_scores,
            "overall_score": round(overall, 2),
            "grade": grade,
        }

    def _score_financial_health(self, biz: Business) -> float:
        score = 0.0

        # Profit margin: up to 40 points
        if biz.profit_margin is not None:
            if biz.profit_margin <= 0:
                score += 0
            elif biz.profit_margin >= 20:
                score += 40
            else:
                score += (biz.profit_margin / 20) * 40

        # Debt-to-equity ratio: up to 30 points (lower is better)
        if biz.debt_to_equity_ratio is not None:
            if biz.debt_to_equity_ratio <= 0.5:
                score += 30
            elif biz.debt_to_equity_ratio >= 3:
                score += 0
            else:
                score += 30 * (1 - (biz.debt_to_equity_ratio - 0.5) / 2.5)

        # Annual revenue: up to 30 points (log scale)
        if biz.annual_revenue is not None and biz.annual_revenue > 0:
            log_rev = math.log10(biz.annual_revenue)
            # 10M = 7 on log scale
            score += min(30, (log_rev / 7) * 30)

        return round(min(100, score), 2)

    def _score_online_presence(self, biz: Business) -> float:
        score = 0.0

        # Website exists: 50 points
        if biz.website_url:
            score += 50

        # Review count: up to 50 points
        if biz.review_count is not None:
            score += min(50, (biz.review_count / 500) * 50)

        return round(min(100, score), 2)

    def _score_customer_satisfaction(self, biz: Business) -> float:
        score = 0.0

        # Customer rating: 1.0-5.0 mapped to 0-70 points
        if biz.customer_rating is not None:
            normalized = max(0, min(1, (biz.customer_rating - 1) / 4))
            score += normalized * 70

        # Review count credibility bonus: 30 points if > 10 reviews
        if biz.review_count is not None and biz.review_count > 10:
            score += 30

        return round(min(100, score), 2)

    def _score_operational_efficiency(self, biz: Business) -> float:
        score = 0.0

        # Revenue per employee (log scale): up to 60 points
        if (
            biz.annual_revenue is not None
            and biz.employee_count is not None
            and biz.employee_count > 0
            and biz.annual_revenue > 0
        ):
            rev_per_emp = biz.annual_revenue / biz.employee_count
            log_rpe = math.log10(rev_per_emp)
            # 500k per employee (log10 = 5.7) is excellent
            score += min(60, (log_rpe / 5.7) * 60)

        # Years in operation: up to 40 points
        if biz.years_in_operation is not None:
            score += min(40, (biz.years_in_operation / 10) * 40)

        return round(min(100, score), 2)

    def _score_compliance(self, biz: Business) -> float:
        score = 0.0

        if biz.has_compliance_cert:
            score += 80
        else:
            score += 20

        # Longevity bonus
        if biz.years_in_operation is not None and biz.years_in_operation > 5:
            score += 20

        return round(min(100, score), 2)

    def _compute_overall(self, category_scores: dict) -> float:
        total = 0.0
        for category, weight in self.weights.items():
            total += category_scores.get(category, 0) * weight
        return total

    @staticmethod
    def _assign_grade(score: float) -> str:
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B+"
        elif score >= 60:
            return "B"
        elif score >= 50:
            return "C+"
        elif score >= 40:
            return "C"
        elif score >= 30:
            return "D"
        else:
            return "F"


scoring_engine = ScoringEngine()
