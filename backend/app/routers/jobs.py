# backend/app/routers/jobs.py

from fastapi import APIRouter
from app.ai import parse_jd
import requests

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/analyze")
def analyze_job(data: dict):
    result = parse_jd(data["description"])

    requests.post(
        "http://127.0.0.1:8000/candidates/set-job",
        json={"title": result["title"], "skills": result["skills"]},
    )

    return {"analysis": result}
