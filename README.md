# BizScorer

A business scoring and rating platform that evaluates businesses across multiple dimensions and provides composite scores.

## Features

- **Multi-criteria scoring**: Financial health, online presence, customer satisfaction, operational efficiency, and compliance
- **REST API**: Full CRUD for businesses with automatic scoring
- **Leaderboard**: Ranked view of all scored businesses
- **Score history**: Track how business scores change over time
- **Web UI**: Dashboard, submission form, and detailed score reports

## Quick Start

```bash
pip install -r requirements.txt
python run.py
```

The app will be available at `http://localhost:8000`. API docs are at `http://localhost:8000/docs`.

## API Endpoints

### Businesses
- `POST /api/businesses/` - Create a business (auto-scored)
- `GET /api/businesses/` - List businesses (paginated)
- `GET /api/businesses/{id}` - Get a business
- `PUT /api/businesses/{id}` - Update a business
- `DELETE /api/businesses/{id}` - Delete a business

### Scores
- `POST /api/scores/calculate/{business_id}` - Recalculate score
- `GET /api/scores/{business_id}` - Get latest score
- `GET /api/scores/{business_id}/history` - Score history
- `GET /api/scores/leaderboard` - Top businesses by score

## Scoring Methodology

Each business is scored across five categories (0-100 each), combined with configurable weights:

| Category | Weight | Factors |
|---|---|---|
| Financial Health | 30% | Profit margin, debt-to-equity, revenue |
| Customer Satisfaction | 25% | Rating, review volume |
| Operational Efficiency | 20% | Revenue per employee, years in operation |
| Online Presence | 15% | Website, review count |
| Compliance | 10% | Certification, business maturity |

Grades: A+ (90+), A (80+), B+ (70+), B (60+), C+ (50+), C (40+), D (30+), F (<30)

## Running Tests

```bash
pytest
```
