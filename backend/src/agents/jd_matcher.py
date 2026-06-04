import json

from pydantic import ValidationError

from src.agents.base import BaseAgent
from src.config import Settings
from src.schemas.jd_match import JDMatchResult
from src.schemas.resume import ParsedResume


class JDMatcherAgent(BaseAgent):
    """
    Agent responsible for matching a parsed resume against a job description.
    Returns a JDMatchResult with a score, skill analysis, and summary.
    """

    def __init__(self, settings: Settings):
        super().__init__(settings=settings)
        self.prompt_template = self._load_prompt("jd_match.txt")

    def _call_llm(self, prompt: str) -> JDMatchResult:
        """Call the LLM and validate the response against JDMatchResult schema."""
        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        raw_json = response.choices[0].message.content
        data = json.loads(raw_json)
        return JDMatchResult(**data)

    def run(self, parsed_resume: ParsedResume, jd_text: str) -> JDMatchResult:
        """
        Match a parsed resume against a job description.
        Returns a validated JDMatchResult with score, skills, and summary.
        """
        resume_json = parsed_resume.model_dump_json()
        prompt = self.prompt_template.replace("{resume_json}", resume_json)
        prompt = prompt.replace("{jd_text}", jd_text)

        self.logger.info("Starting JD matching")

        try:
            return self._call_llm(prompt)
        except (json.JSONDecodeError, ValidationError) as error:
            self.logger.warning(f"First attempt failed: {error}. Retrying with feedback.")
            retry_prompt = (
                prompt
                + f"\n\nYour previous response failed validation with this error:\n{error}\n"
                + "Return valid JSON matching the schema exactly."
            )
            return self._call_llm(retry_prompt)
