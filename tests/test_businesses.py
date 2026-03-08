SAMPLE_BUSINESS = {
    "name": "Acme Corp",
    "industry": "Technology",
    "annual_revenue": 5000000,
    "employee_count": 50,
    "years_in_operation": 10,
    "website_url": "https://acme.com",
    "customer_rating": 4.2,
    "review_count": 150,
    "has_compliance_cert": True,
    "profit_margin": 15.0,
    "debt_to_equity_ratio": 0.8,
}


def test_create_business(client):
    resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Acme Corp"
    assert data["id"] is not None


def test_list_businesses(client):
    client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    resp = client.get("/api/businesses/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 1
    assert len(data["businesses"]) == 1


def test_get_business(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    resp = client.get(f"/api/businesses/{biz_id}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Acme Corp"


def test_get_business_not_found(client):
    resp = client.get("/api/businesses/999")
    assert resp.status_code == 404


def test_update_business(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    resp = client.put(f"/api/businesses/{biz_id}", json={"name": "Acme Inc"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Acme Inc"


def test_delete_business(client):
    create_resp = client.post("/api/businesses/", json=SAMPLE_BUSINESS)
    biz_id = create_resp.json()["id"]
    resp = client.delete(f"/api/businesses/{biz_id}")
    assert resp.status_code == 204
    resp = client.get(f"/api/businesses/{biz_id}")
    assert resp.status_code == 404
