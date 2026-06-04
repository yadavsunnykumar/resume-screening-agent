from pydantic import BaseModel


class TechnicalQuestion(BaseModel):
    question: str
    topic: str
    difficulty: str
    why_asked: str


class BehavioralQuestion(BaseModel):
    question: str
    competency: str
    why_asked: str


class GeneratedQuestions(BaseModel):
    technical: list[TechnicalQuestion]
    behavioral: list[BehavioralQuestion]


class QuestionResponse(BaseModel):
    session_id: str
    status: str
    questions: GeneratedQuestions
