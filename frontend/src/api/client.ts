import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Types ────────────────────────────────────────────────────────────────────

export interface ExperienceItem {
  company: string
  role: string
  start_date: string
  end_date: string
  description: string
}

export interface EducationItem {
  institution: string
  degree: string
  field: string
  year: string
}

export interface ParsedResume {
  name: string
  email: string | null
  phone: string | null
  skills: string[]
  experience: ExperienceItem[]
  education: EducationItem[]
  total_years_experience: number
  summary: string | null
}

export interface JDMatchResult {
  score: number
  matched_skills: string[]
  missing_skills: string[]
  strengths: string[]
  gaps: string[]
  summary: string
}

export interface TechnicalQuestion {
  question: string
  topic: string
  difficulty: string
  why_asked: string
}

export interface BehavioralQuestion {
  question: string
  competency: string
  why_asked: string
}

export interface GeneratedQuestions {
  technical: TechnicalQuestion[]
  behavioral: BehavioralQuestion[]
}

// ── API functions ─────────────────────────────────────────────────────────────

export const createSession = async (): Promise<{ session_id: string }> => {
  const res = await api.post('/sessions')
  return res.data
}

export const getSession = async (sessionId: string): Promise<Record<string, unknown>> => {
  const res = await api.get(`/sessions/${sessionId}`)
  return res.data
}

export const uploadResume = async (
  sessionId: string,
  file: File
): Promise<{ session_id: string; status: string; parsed_resume: ParsedResume }> => {
  const form = new FormData()
  form.append('file', file)
  const res = await api.post(`/sessions/${sessionId}/resume`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const matchJD = async (
  sessionId: string,
  jdText: string
): Promise<{ session_id: string; status: string; match_result: JDMatchResult }> => {
  const res = await api.post(`/sessions/${sessionId}/jd`, { jd_text: jdText })
  return res.data
}

export const generateQuestions = async (
  sessionId: string
): Promise<{ session_id: string; status: string; questions: GeneratedQuestions }> => {
  const res = await api.post(`/sessions/${sessionId}/questions`)
  return res.data
}
