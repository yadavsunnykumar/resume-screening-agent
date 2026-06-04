import json

from pydantic import ValidationError

from src.agents.base import BaseAgent
from src.config import Settings
from src.schemas.resume import ParsedResume


class ResumeExtractorAgent(BaseAgent):
    """
    Agent responsible for extracting structured information from resume text.
    Makes an LLM call with the resume extraction prompt and validates
    the response against the ParsedResume Pydantic schema.
    Retries once on validation failure with error feedback.
    """

    def __init__(self, settings: Settings):
        super().__init__(settings=settings)
        self.prompt_template = self._load_prompt("resume_extract.txt")

    def _call_llm(self, prompt: str) -> ParsedResume:
        """Call the LLM and validate the response against ParsedResume schema."""
        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        raw_json = response.choices[0].message.content
        data = json.loads(raw_json)
        return ParsedResume(**data)

    def run(self, resume_text: str) -> ParsedResume:
        """
        Parse resume text and return a validated ParsedResume object.
        Retries once on JSON or validation failure, sending error feedback.
        """
        prompt = self.prompt_template.replace("{resume_text}", resume_text)
        self.logger.info("Starting resume extraction")

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
