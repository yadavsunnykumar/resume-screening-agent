# AI-Powered Resume Screening & Interview Question Generator

An intelligent HR assistant that parses resumes, matches them against job descriptions, and generates tailored interview questions using modular AI agents.

## Architecture

```
React Frontend (Vite + TypeScript + Tailwind)
        ↓ REST / JSON
FastAPI Backend
        ↓
   Supervisor (state machine)
   ↙        ↓        ↘
Resume    JD        Q-Gen
Extractor Matcher   Agent
   ↓        ↓        ↓
        OpenAI gpt-4o-mini
        Session Store (in-memory)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS + TanStack Query |
| Backend | FastAPI + Python 3.11 |
| LLM | OpenAI gpt-4o-mini |
| Agents | BaseAgent (abstract) → Resume Extractor, JD Matcher, Q-Gen, Supervisor |
| Memory | UUID-based in-memory session store |
| Dependency Management | UV |

## Agents

- **Resume Extractor Agent** — Parses PDF/DOCX/TXT into structured `ParsedResume` schema with retry logic
- **JD Matcher Agent** — Scores candidate fit 0-100 with matched/missing skills, strengths, gaps, summary
- **Q-Gen Agent** — Generates 10 technical + 10 behavioral questions grounded in resume & JD context
- **Supervisor** — Deterministic state machine coordinating agents and validating session state

## Project Structure

```
resume-screening-agent/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI app + endpoints
│   │   ├── config.py            # Pydantic-settings config
│   │   ├── supervisor.py        # Supervisor state machine
│   │   ├── agents/
│   │   │   ├── base.py          # BaseAgent abstract class
│   │   │   ├── resume_extractor.py
│   │   │   ├── jd_matcher.py
│   │   │   └── q_gen.py
│   │   ├── schemas/
│   │   │   ├── resume.py        # ParsedResume schema
│   │   │   ├── jd_match.py      # JDMatchResult schema
│   │   │   ├── question.py      # GeneratedQuestions schema
│   │   │   └── session.py       # API response schemas
│   │   ├── parsers/
│   │   │   └── file_parser.py   # PDF/DOCX/TXT extraction
│   │   ├── prompts/
│   │   │   ├── resume_extract.txt
│   │   │   ├── jd_match.txt
│   │   │   ├── q_gen_technical.txt
│   │   │   └── q_gen_behavioral.txt
│   │   └── memory/
│   │       └── session_store.py # In-memory session store
│   ├── pyproject.toml
│   ├── .env_example
│   └── .python-version
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # Axios API client
│   │   ├── hooks/
│   │   │   └── useSession.ts    # Session management hook
│   │   ├── components/
│   │   │   ├── ResumeUploader.tsx
│   │   │   ├── ParsedResumeView.tsx
│   │   │   ├── JDInput.tsx
│   │   │   ├── MatchScoreCard.tsx
│   │   │   └── QuestionsList.tsx
│   │   ├── data/sampleJDs.ts    # Sample job descriptions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env_example
│   ├── package.json
│   └── vite.config.ts
├── evaluation/
│   └── manual_eval.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- UV package manager: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- OpenAI API key with credits

### Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Copy and configure environment
cp .env_example .env
# Edit .env and add your OPENAI_API_KEY

# Start the server
uv run uvicorn src.main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment
cp .env_example .env.local
# Edit .env.local if your backend is not on localhost:8000

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /sessions | Create new session |
| POST | /sessions/{id}/resume | Upload and parse resume |
| POST | /sessions/{id}/jd | Match JD against resume |
| POST | /sessions/{id}/questions | Generate interview questions |
| GET | /sessions/{id} | Retrieve full session state |

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:8000
```

## Known Limitations
- Session store is in-memory — sessions reset on server restart
- No authentication — single-user local use only
- Tested on standard resume formats; heavily stylized templates may parse with lower accuracy
- Scanned PDF (image-only) resumes are not supported

## Future Improvements

### Backend
- Redis session store with TTL-based expiry
- Async agent orchestration for parallel LLM calls
- Vector store + RAG for skill matching
- Evaluator agent for self-critique loop

### Frontend
- Streaming chat via Server-Sent Events
- Candidate comparison view
- Export questions to PDF
- Auth / multi-user support
