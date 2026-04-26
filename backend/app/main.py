from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, jobs, candidates

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Talent Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)


@app.get("/")
def home():
    return {"message": "AI Talent Agent Running"}
