import logging
from abc import ABC, abstractmethod
from pathlib import Path

from openai import OpenAI

from src.config import Settings


class BaseAgent(ABC):
    """
    Abstract base class for all agents.
    Provides shared OpenAI client, logger, and prompt loader.
    All concrete agents must implement the run() method.
    """

    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.logger = logging.getLogger(self.__class__.__name__)

    def _load_prompt(self, filename: str) -> str:
        """
        Load a prompt file from src/prompts/.
        Uses Path(__file__) so this works regardless of cwd.
        """
        prompts_dir = Path(__file__).parent.parent / "prompts"
        return (prompts_dir / filename).read_text(encoding="utf-8")

    @abstractmethod
    def run(self, *args, **kwargs):
        """Each agent implements its own run() with typed args."""
        pass
