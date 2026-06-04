import json

from src.agents.base import BaseAgent
from src.config import Settings
from src.schemas.question import (
    BehavioralQuestion,
    GeneratedQuestions,
    TechnicalQuestion,
)
from src.schemas.resume import ParsedResume


class QGenAgent(BaseAgent):
    """
    Agent responsible for generating tailored interview questions.
    Makes two separate LLM calls: one for technical, one for behavioral.
    Grounds every question in the candidate's resume and the JD context.
    """

    def __init__(self, settings: Settings):
        super().__init__(settings=settings)
        self.technical_prompt = self._load_prompt("q_gen_technical.txt")
        self.behavioral_prompt = self._load_prompt("q_gen_behavioral.txt")

    def _generate_technical(self, resume_json: str, jd_text: str) -> list[TechnicalQuestion]:
        """Generate 10 technical questions grounded in resume and JD."""
        prompt = self.technical_prompt.replace("{resume_json}", resume_json)
        prompt = prompt.replace("{jd_text}", jd_text)

        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content)
        return [TechnicalQuestion(**q) for q in data["technical"]]

    def _generate_behavioral(self, resume_json: str, jd_text: str) -> list[BehavioralQuestion]:
        """Generate 10 behavioral questions grounded in resume and JD."""
        prompt = self.behavioral_prompt.replace("{resume_json}", resume_json)
        prompt = prompt.replace("{jd_text}", jd_text)

        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content)
        return [BehavioralQuestion(**q) for q in data["behavioral"]]

    def run(self, parsed_resume: ParsedResume, jd_text: str) -> GeneratedQuestions:
        """
        Generate technical and behavioral interview questions.
        Uses two separate LLM calls for better quality.
        """
        resume_json = parsed_resume.model_dump_json()
        self.logger.info("Generating technical questions")
        technical = self._generate_technical(resume_json, jd_text)

        self.logger.info("Generating behavioral questions")
        behavioral = self._generate_behavioral(resume_json, jd_text)

        return GeneratedQuestions(technical=technical, behavioral=behavioral)
