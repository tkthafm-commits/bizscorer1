from unittest.mock import MagicMock

from app.services.scoring_engine import ScoringEngine


def make_business(**kwargs):
    defaults = {
        "id": 1,
        "name": "Test Corp",
        "industry": "Technology",
        "annual_revenue": None,
        "employee_count": None,
        "years_in_operation": None,
        "website_url": None,
        "customer_rating": None,
        "review_count": None,
        "has_compliance_cert": False,
        "debt_to_equity_ratio": None,
        "profit_margin": None,
    }
    defaults.update(kwargs)
    biz = MagicMock()
    for k, v in defaults.items():
        setattr(biz, k, v)
    return biz


class TestScoringEngine:
    def setup_method(self):
        self.engine = ScoringEngine()

    def test_all_null_fields(self):
        biz = make_business()
        result = self.engine.calculate_score(biz)
        assert result["overall_score"] >= 0
        assert result["grade"] in ("A+", "A", "B+", "B", "C+", "C", "D", "F")

    def test_perfect_business(self):
        biz = make_business(
            annual_revenue=50_000_000,
            employee_count=100,
            years_in_operation=15,
            website_url="https://example.com",
            customer_rating=5.0,
            review_count=1000,
            has_compliance_cert=True,
            debt_to_equity_ratio=0.3,
            profit_margin=25,
        )
        result = self.engine.calculate_score(biz)
        assert result["overall_score"] >= 80
        assert result["grade"] in ("A+", "A")

    def test_poor_business(self):
        biz = make_business(
            annual_revenue=10_000,
            employee_count=50,
            years_in_operation=1,
            customer_rating=1.5,
            review_count=2,
            has_compliance_cert=False,
            debt_to_equity_ratio=4.0,
            profit_margin=-5,
        )
        result = self.engine.calculate_score(biz)
        assert result["overall_score"] < 50

    def test_grade_boundaries(self):
        assert self.engine._assign_grade(95) == "A+"
        assert self.engine._assign_grade(85) == "A"
        assert self.engine._assign_grade(75) == "B+"
        assert self.engine._assign_grade(65) == "B"
        assert self.engine._assign_grade(55) == "C+"
        assert self.engine._assign_grade(45) == "C"
        assert self.engine._assign_grade(35) == "D"
        assert self.engine._assign_grade(20) == "F"

    def test_financial_health_scoring(self):
        biz = make_business(profit_margin=10, debt_to_equity_ratio=1.0, annual_revenue=1_000_000)
        score = self.engine._score_financial_health(biz)
        assert 0 <= score <= 100

    def test_online_presence_with_website(self):
        biz = make_business(website_url="https://test.com", review_count=250)
        score = self.engine._score_online_presence(biz)
        assert score >= 50

    def test_customer_satisfaction_high_rating(self):
        biz = make_business(customer_rating=4.5, review_count=100)
        score = self.engine._score_customer_satisfaction(biz)
        assert score >= 60

    def test_compliance_with_cert(self):
        biz = make_business(has_compliance_cert=True, years_in_operation=10)
        score = self.engine._score_compliance(biz)
        assert score == 100
