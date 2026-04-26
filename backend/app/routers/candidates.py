from fastapi import APIRouter
from app.ai import calculate_match_score, simulate_interest

router = APIRouter(prefix="/candidates", tags=["Candidates"])

sample = [
    {"name": "Rahul", "skills": ["python", "django", "react", "sql"], "experience": 3},
    {"name": "Priya", "skills": ["python", "ai", "mongodb", "django"], "experience": 2},
    {
        "name": "Amit",
        "skills": ["tensorflow", "nlp", "python", "pandas"],
        "experience": 4,
    },
    {"name": "Sneha", "skills": ["java", "spring", "mysql"], "experience": 5},
]

latest_job = {"title": "", "skills": []}


@router.post("/set-job")
def set_job(data: dict):
    latest_job["title"] = data["title"]
    latest_job["skills"] = data["skills"]
    return {"message": "stored"}


@router.get("/ranked")
def ranked():
    results = []

    for c in sample:

        match_score = calculate_match_score(
            c["skills"], latest_job["skills"], c["experience"]
        )

        interest_score = simulate_interest(c["name"], latest_job["title"])

        final_score = round((match_score + interest_score) / 2, 2)

        matched = list(set(c["skills"]) & set(latest_job["skills"]))
        missing = list(set(latest_job["skills"]) - set(c["skills"]))

        reason = f"{len(matched)}/{len(latest_job['skills'])} skills matched"

        outreach = f"{c['name']} is interested in {latest_job['title']} role and open for discussion."

        results.append(
            {
                "name": c["name"],
                "match_score": match_score,
                "interest_score": interest_score,
                "final_score": final_score,
                "reason": reason,
                "matched_skills": matched,
                "missing_skills": missing,
                "outreach": outreach,
            }
        )

    results.sort(key=lambda x: x["final_score"], reverse=True)

    return results
