# backend/app/ai.py

import os
import random
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


def parse_jd(jd):
    prompt = f"""
    Extract:
    1. Job Title
    2. Required Skills list

    From this JD:
    {jd}

    Return JSON only.
    """

    try:
        res = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)

        text = res.text.lower()

        # fallback simple parser
        skills = []
        possible = [
            "python",
            "django",
            "react",
            "mongodb",
            "ai",
            "tensorflow",
            "nlp",
            "sql",
            "pandas",
        ]

        for p in possible:
            if p in jd.lower():
                skills.append(p)

        return {"title": "AI Developer", "skills": skills}

    except:
        return {"title": "Developer", "skills": ["python"]}


def calculate_match_score(candidate_skills, jd_skills, exp):
    matched = len(set(candidate_skills) & set(jd_skills))
    total = len(jd_skills) if len(jd_skills) > 0 else 1

    skill_score = (matched / total) * 80
    exp_score = min(exp * 5, 20)

    return round(skill_score + exp_score, 2)


def simulate_interest(name, role):
    base = random.randint(65, 95)

    if "ai" in role.lower():
        base += 3

    return min(base, 100)
