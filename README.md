# TalentPilot AI 🚀

## Autonomous Hiring Intelligence Agent

TalentPilot AI helps recruiters discover, rank, and engage top candidates instantly using AI. It analyzes Job Descriptions, matches candidates, predicts candidate interest, and generates recruiter-ready ranked shortlists.

---

## Problem Statement

Recruiters spend hours manually screening resumes, matching skills, and chasing candidate interest. TalentPilot AI automates:

- Job Description Parsing  
- Candidate Matching  
- Interest Prediction  
- Ranked Shortlists  
- Outreach Simulation  

---

## Key Features

- AI Job Description Analysis  
- Dynamic Candidate Ranking  
- Match Score + Interest Score  
- Recruiter Ready Shortlist  
- Candidate Confidence Levels  
- CSV Export  
- AI Outreach Simulation  
- Modern Interactive Dashboard  

---

## Tech Stack

- React.js  
- Tailwind CSS  
- Axios  
- FastAPI  
- Python  
- Google Gemini API  

---

## How It Works

1. Recruiter pastes Job Description  
2. AI extracts title + required skills  
3. Candidate pool is evaluated  
4. Match Score + Interest Score generated  
5. Final ranked shortlist displayed instantly  

---

## Scoring Logic

Final Score = 70% Match Score + 30% Interest Score

---

## Architecture

React Frontend → FastAPI Backend → Gemini AI Parser → Candidate Scoring Engine → Ranked Shortlist Output

---

## Future Scope

- LinkedIn Talent Discovery  
- Resume Upload Parsing  
- ATS Integration  
- Auto Email Outreach  
- Interview Scheduling AI  

---

## Run Locally

```bash
uvicorn app.main:app --reload
npm install
npm run dev