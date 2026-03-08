SAMPLE_BUSINESS = {
    "name": "ScoreTest Inc",
    "industry": "Finance",
    "annual_revenue": 2000000,
    "employee_count": 20,
    "years_in_operation": 5,
    "customer_rating": 3.8,
    "review_count": 50,
    "has_compliance_cert": False,
    "profit_margin": 10.0,
    "debt_to_equity_ratio": 1.5,
}


def test_auto_score_on_create(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    resp = client.get(f"/api/scores/{biz_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert "overall_score" in data
    assert "grade" in data
    assert 0 <= data["overall_score"] <= 100


def test_recalculate_score(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    resp = client.post(f"/api/scores/calculate/{biz_id}")
    assert resp.status_code == 200
    assert resp.json()["overall_score"] >= 0


def test_score_history(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    # Auto-score + one recalculation = 2 entries
    client.post(f"/api/scores/calculate/{biz_id}")
    resp = client.get(f"/api/scores/{biz_id}/history")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


def test_leaderboard(client):
    client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    client.post("/api/businesses/", json={**SAMPLE_BUSINESS, "name": "Another Corp"})
    resp = client.get("/api/scores/leaderboard")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    # Should be sorted by score descending
    assert data[0]["overall_score"] >= data[1]["overall_score"]


def test_score_not_found(client):
    resp = client.get("/api/scores/999")
    assert resp.status_code == 404
