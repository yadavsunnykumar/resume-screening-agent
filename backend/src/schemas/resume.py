from pydantic import BaseModel


class ExperienceItem(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str
    description: str


class EducationItem(BaseModel):
    institution: str
    degree: str
    field: str
    year: str


class ParsedResume(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    skills: list[str]
    experience: list[ExperienceItem]
    education: list[EducationItem]
    total_years_experience: float
    summary: str | None = None
