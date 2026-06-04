from pydantic import BaseModel


class JDMatchResult(BaseModel):
    score: int
    matched_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    gaps: list[str]
    summary: str


class JDMatchRequest(BaseModel):
    jd_text: str


class JDMatchResponse(BaseModel):
    session_id: str
    status: str
    match_result: JDMatchResult
