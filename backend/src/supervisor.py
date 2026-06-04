import logging

from src.agents.jd_matcher import JDMatcherAgent
from src.agents.q_gen import QGenAgent
from src.agents.resume_extractor import ResumeExtractorAgent
from src.config import Settings
from src.schemas.jd_match import JDMatchResult
from src.schemas.question import GeneratedQuestions
from src.schemas.resume import ParsedResume


class Supervisor:
    """
    Deterministic state machine that orchestrates the agent workflow.
    Validates preconditions before delegating to each agent.
    All FastAPI endpoints call the Supervisor rather than agents directly.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.resume_agent = ResumeExtractorAgent(settings)
        self.jd_agent = JDMatcherAgent(settings)
        self.qgen_agent = QGenAgent(settings)
        self.logger = logging.getLogger("Supervisor")

    def handle_resume(self, session_id: str, resume_text: str) -> ParsedResume:
        """Parse resume text and return structured ParsedResume."""
        self.logger.info(f"[{session_id}] Handling resume extraction")
        return self.resume_agent.run(resume_text)

    def handle_jd(
        self, session_id: str, parsed_resume: ParsedResume, jd_text: str
    ) -> JDMatchResult:
        """
        Match a parsed resume against a job description.
        Requires resume to have been processed first.
        """
        if parsed_resume is None:
            raise ValueError("Resume must be processed before JD matching.")
        self.logger.info(f"[{session_id}] Retrieved resume context for JD matching")
        return self.jd_agent.run(parsed_resume, jd_text)

    def handle_questions(
        self,
        session_id: str,
        parsed_resume: ParsedResume,
        jd_text: str,
        match_result: JDMatchResult,
    ) -> GeneratedQuestions:
        """
        Generate interview questions using resume and JD context.
        Requires both resume and JD match to have been completed first.
        """
        if parsed_resume is None or match_result is None:
            raise ValueError("Both resume and JD match must be completed before generating questions.")
        self.logger.info(f"[{session_id}] Retrieved resume + match context for question generation")
        return self.qgen_agent.run(parsed_resume, jd_text)
