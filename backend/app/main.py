from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import Base, engine
from app.routers import auth, jobs, candidates

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Talent Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(candidates.router)


# Root supports GET
@app.get("/")
def home():
    return {"message": "AI Talent Agent Running"}


# Root supports POST too (stops 405)
@app.post("/")
def home_post():
    return {"message": "AI Talent Agent Running"}


# Root supports HEAD
@app.head("/")
def home_head():
    return JSONResponse(content={})


# Catch all OPTIONS preflight
@app.options("/{full_path:path}")
def options_handler(full_path: str):
    return {"ok": True}
