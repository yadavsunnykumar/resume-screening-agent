import logging

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.config import Settings, get_settings
from src.memory.session_store import session_store
from src.parsers.file_parser import extract_text
from src.schemas.jd_match import JDMatchRequest, JDMatchResponse, JDMatchResult
from src.schemas.question import GeneratedQuestions, QuestionResponse
from src.schemas.resume import ParsedResume
from src.schemas.session import ResumeUploadResponse, SessionResponse
from src.supervisor import Supervisor

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")

app = FastAPI(
    title="AI Resume Screening & Interview Question Generator",
    description="Parses resumes, matches JDs, and generates tailored interview questions using AI agents.",
    version="1.0.0",
)

# In main.py — replace both middleware calls with just this one:
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

def get_supervisor(settings: Settings = Depends(get_settings)) -> Supervisor:
    return Supervisor(settings)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/sessions", response_model=SessionResponse)
def create_session():
    """Create a new session and return its UUID."""
    session_id = session_store.create()
    return SessionResponse(session_id=session_id)


@app.get("/sessions/{session_id}")
def get_session(session_id: str):
    """Return full session state for frontend rehydration."""
    if not session_store.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")
    return session_store.get(session_id)


@app.post("/sessions/{session_id}/resume", response_model=ResumeUploadResponse)
async def upload_resume(
    session_id: str,
    file: UploadFile = File(...),
    settings: Settings = Depends(get_settings),
    supervisor: Supervisor = Depends(get_supervisor),
):
    """
    Upload a resume file (PDF, DOCX, or TXT).
    Parses it and stores the structured result in the session.
    """
    if not session_store.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")

    content = await file.read()

    try:
        resume_text = extract_text(file.filename, content)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    parsed_resume: ParsedResume = supervisor.handle_resume(session_id, resume_text)

    session_store.update(session_id, {
        "resume_raw": resume_text,
        "resume_parsed": parsed_resume.model_dump(),
    })

    return ResumeUploadResponse(
        session_id=session_id,
        status="success",
        parsed_resume=parsed_resume,
    )


@app.post("/sessions/{session_id}/jd", response_model=JDMatchResponse)
def match_job_description(
    session_id: str,
    request: JDMatchRequest,
    settings: Settings = Depends(get_settings),
    supervisor: Supervisor = Depends(get_supervisor),
):
    """
    Submit a job description and match it against the uploaded resume.
    Requires resume upload to have been completed first.
    """
    if not session_store.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")

    session = session_store.get(session_id)
    if "resume_parsed" not in session:
        raise HTTPException(status_code=400, detail="Please upload a resume first.")

    parsed_resume = ParsedResume(**session["resume_parsed"])
    result: JDMatchResult = supervisor.handle_jd(session_id, parsed_resume, request.jd_text)

    session_store.update(session_id, {
        "jd_text": request.jd_text,
        "match_result": result.model_dump(),
    })

    return JDMatchResponse(
        session_id=session_id,
        status="success",
        match_result=result,
    )


@app.post("/sessions/{session_id}/questions", response_model=QuestionResponse)
def generate_questions(
    session_id: str,
    settings: Settings = Depends(get_settings),
    supervisor: Supervisor = Depends(get_supervisor),
):
    """
    Generate tailored interview questions using the resume and JD context.
    Requires both resume upload and JD matching to be completed first.
    """
    if not session_store.exists(session_id):
        raise HTTPException(status_code=404, detail="Session not found")

    session = session_store.get(session_id)
    if "resume_parsed" not in session or "match_result" not in session:
        raise HTTPException(
            status_code=400,
            detail="Please complete resume upload and JD matching first.",
        )

    parsed_resume = ParsedResume(**session["resume_parsed"])
    match_result = JDMatchResult(**session["match_result"])
    jd_text = session["jd_text"]

    result: GeneratedQuestions = supervisor.handle_questions(
        session_id, parsed_resume, jd_text, match_result
    )

    session_store.update(session_id, {"questions": result.model_dump()})

    return QuestionResponse(
        session_id=session_id,
        status="success",
        questions=result,
    )
