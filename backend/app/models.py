from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base


class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    skills = Column(Text)
    experience = Column(String)
    location = Column(String)
    match_score = Column(Float, default=0)
    interest_score = Column(Float, default=0)


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
