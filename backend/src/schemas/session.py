from pydantic import BaseModel
from src.schemas.resume import ParsedResume


class SessionResponse(BaseModel):
    session_id: str


class ResumeUploadResponse(BaseModel):
    session_id: str
    status: str
    parsed_resume: ParsedResume
