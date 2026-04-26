# backend/app/routers/jobs.py

from fastapi import APIRouter
from app.ai import parse_jd
from app.routers import candidates

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post("/analyze")
def analyze_job(data: dict):
    result = parse_jd(data["description"])

    # Directly update current job in memory
    candidates.current_job["title"] = result["title"]
    candidates.current_job["skills"] = result["skills"]

    return {"analysis": result}
