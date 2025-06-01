from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
from datetime import datetime
from pydantic import BaseModel

from . import models, database
from .resume_parser import ResumeParser

app = FastAPI(title="Campus Resume Analyzer")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Initialize resume parser
resume_parser = ResumeParser()

class LoginRequest(BaseModel):
    name: str

@app.post("/login")
async def login(request: LoginRequest, db: Session = Depends(database.get_db)):
    """Login or register a new user."""
    try:
        user = db.query(models.User).filter(models.User.name == request.name).first()
        if user:
            return {"message": "Welcome back!", "user_id": user.id}
        
        new_user = models.User(name=request.name)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "Welcome to Campus Resume Analyzer!", "user_id": new_user.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(database.get_db)
):
    """Upload and analyze a resume."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(400, "Only PDF files are allowed")
    
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Parse and analyze resume
        text = resume_parser.parse_pdf(temp_path)
        analysis = resume_parser.analyze_resume(text)
        improvements = resume_parser.get_improvements(text)
        
        # Save to database
        resume = models.Resume(
            user_id=user_id,
            filename=file.filename,
            content=text,
            score=analysis["overall_score"],
            improvements=json.dumps(improvements)
        )
        db.add(resume)
        db.commit()
        db.refresh(resume)
        
        return {
            "message": "Resume uploaded successfully",
            "analysis": analysis,
            "improvements": improvements
        }
    finally:
        # Clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/history/{user_id}")
def get_history(user_id: int, db: Session = Depends(database.get_db)):
    """Get user's resume history."""
    resumes = db.query(models.Resume).filter(models.Resume.user_id == user_id).all()
    return [
        {
            "id": r.id,
            "filename": r.filename,
            "score": r.score,
            "created_at": r.created_at,
            "improvements": json.loads(r.improvements)
        }
        for r in resumes
    ]

@app.get("/about")
def about():
    """Get about information."""
    return {
        "message": "Campus Resume Analyzer is a student-first tool built by and for our college warriors. "
                  "It's designed to help you crush internships, placements, and off-campus dreams. "
                  "Built with ❤️ and madness."
    } 