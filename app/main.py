from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.config import settings
from app.database import Base, engine
from app.routers import businesses, scores

app = FastAPI(title=settings.APP_TITLE)

app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(businesses.router)
app.include_router(scores.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/submit")
def submit_page(request: Request):
    return templates.TemplateResponse("submit.html", {"request": request})


@app.get("/report/{business_id}")
def report_page(request: Request, business_id: int):
    return templates.TemplateResponse(
        "report.html", {"request": request, "business_id": business_id}
    )
