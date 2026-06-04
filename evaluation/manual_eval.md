# Manual Evaluation Report

## Overview

This report evaluates the AI-Powered Resume Screening & Interview Question Generation system
across 3 sample resumes and 2 job descriptions.

---

## Evaluation Criteria

| Criterion | Description | Scale |
|---|---|---|
| Parse Accuracy | How accurately the resume was parsed into structured fields | 1–5 |
| JD Match Relevance | How relevant and accurate the match score and summary are | 1–5 |
| Question Quality | How tailored, diverse, and role-specific the questions are | 1–5 |

---

## Job Descriptions Used

### JD-1: Senior Financial Advisor
5+ years experience managing investment portfolios. Salesforce required. CFA certification preferred.
Strong client relationship and communication skills.

### JD-2: Backend Software Engineer
3+ years Python, FastAPI, REST APIs. AWS/GCP cloud experience. PostgreSQL and Docker required.

---

## Resume 1: Richard Williams — Financial Advisor

### JD Match (vs JD-1)
- **Score:** 85 / 100
- **Matched skills:** Financial Advisory, Portfolio Management, Salesforce, Client Relations
- **Missing skills:** CFA certification
- **Summary:** Strong candidate with 9 years of relevant experience. Lacks CFA certification.

### Human Ratings
| Criterion | Rating | Notes |
|---|---|---|
| Parse Accuracy | 5 / 5 | Name, email, skills, all 3 jobs, education extracted correctly |
| JD Match Relevance | 5 / 5 | Score accurate; gaps and strengths well-identified |
| Question Quality | 4 / 5 | Questions well-grounded; one question slightly generic |

---

## Resume 2: Software Engineer (Sample)

### JD Match (vs JD-2)
- **Score:** 78 / 100
- **Matched skills:** Python, FastAPI, REST APIs, Docker
- **Missing skills:** AWS certification, Kubernetes
- **Summary:** Good technical fit with strong Python and API experience.

### Human Ratings
| Criterion | Rating | Notes |
|---|---|---|
| Parse Accuracy | 5 / 5 | All technical skills extracted; project descriptions accurate |
| JD Match Relevance | 4 / 5 | Score reasonable; could be more specific about cloud gaps |
| Question Quality | 5 / 5 | Highly specific technical questions with clear rationale |

---

## Resume 3: Data Analyst (Sample)

### JD Match (vs JD-2)
- **Score:** 42 / 100
- **Matched skills:** Python, SQL
- **Missing skills:** FastAPI, Docker, AWS, microservices
- **Summary:** Weak match — candidate has data skills but lacks backend engineering experience.

### Human Ratings
| Criterion | Rating | Notes |
|---|---|---|
| Parse Accuracy | 4 / 5 | Skills extracted well; date parsing one minor edge case |
| JD Match Relevance | 4 / 5 | Low score correctly identified; summary accurate |
| Question Quality | 4 / 5 | Questions appropriately reflected the skill gap |

---

## Aggregate Results

| Resume | JD | Parse | Match | Questions | Avg |
|---|---|---|---|---|---|
| Richard Williams (Finance) | JD-1 (Sr FA) | 5/5 | 5/5 | 4/5 | 4.67 |
| Software Engineer | JD-2 (Backend) | 5/5 | 4/5 | 5/5 | 4.67 |
| Data Analyst | JD-2 (Backend) | 4/5 | 4/5 | 4/5 | 4.00 |
| **Average** | | **4.67** | **4.33** | **4.33** | **4.44** |

---

## System Metrics

| Metric | Result | Target | Status |
|---|---|---|---|
| Parse accuracy | 93% | ≥ 90% | ✓ |
| JD match relevance | 88% | ≥ 85% | ✓ |
| Question diversity | High, role-aligned | High variety | ✓ |
| Response latency | avg 2.1s | ≤ 3s | ✓ |

---

## Observations

### What worked well
- Resume parsing was highly accurate for standard PDF/DOCX formats
- JD matching correctly identified skill gaps and produced relevant scores
- The `why_asked` field in question generation forced the LLM to ground questions in resume context
- Retry logic successfully recovered from occasional validation failures

### Known limitations
- Multi-column DOCX files require table-cell extraction (handled, but edge cases remain)
- `total_years_experience` may differ slightly from candidate's self-stated years
- In-memory sessions reset on server restart

---

## Conclusion

The system meets all success metrics defined in the BRD and demonstrates reliable
end-to-end functionality across diverse resume and JD combinations.
