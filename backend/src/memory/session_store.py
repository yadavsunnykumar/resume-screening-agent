import uuid


class SessionStore:
    """
    In-memory session store using a plain dict.
    Each session is keyed by a UUID string and stores
    arbitrary dict data (parsed resume, JD, match result, questions).

    Note: Sessions are lost on server restart.
    Production use should replace this with Redis.
    """

    def __init__(self):
        self._sessions: dict[str, dict] = {}

    def create(self) -> str:
        """Create a new empty session and return its ID."""
        session_id = str(uuid.uuid4())
        self._sessions[session_id] = {}
        return session_id

    def get(self, session_id: str) -> dict | None:
        """Return session data or None if not found."""
        return self._sessions.get(session_id)

    def update(self, session_id: str, data: dict) -> None:
        """Merge new data into an existing session."""
        self._sessions[session_id].update(data)

    def exists(self, session_id: str) -> bool:
        """Check whether a session exists."""
        return session_id in self._sessions


# Module-level singleton — shared across all FastAPI requests
session_store = SessionStore()
