from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, jobs, candidates

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Talent Agent")

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)


# Home Route
@app.get("/")
def home():
    return {"message": "AI Talent Agent Running"}


# Preflight OPTIONS Fix
@app.options("/{full_path:path}")
def options_handler(full_path: str):
    return {"message": "OK"}
