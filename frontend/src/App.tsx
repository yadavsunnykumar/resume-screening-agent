import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { GeneratedQuestions, JDMatchResult, ParsedResume, generateQuestions } from './api/client'
import { JDInput } from './components/JDInput'
import { MatchScoreCard } from './components/MatchScoreCard'
import { ParsedResumeView } from './components/ParsedResumeView'
import { QuestionsList } from './components/QuestionsList'
import { ResumeUploader } from './components/ResumeUploader'
import { useSession } from './hooks/useSession'

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored === 'dark') return true
    if (stored === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return { dark, toggle: () => setDark((d) => !d) }
}

const STEPS = ['Upload Resume', 'Match JD', 'Questions']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                border-2 transition-all duration-300
                ${i < current
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-300/40 dark:shadow-indigo-900/60'
                  : i === current
                    ? 'bg-white dark:bg-gray-800 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                }`}
            >
              {i < current ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs mt-2 font-medium hidden sm:block whitespace-nowrap transition-colors duration-300
                ${i <= current ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mx-1.5 sm:mx-2 mb-4 sm:mb-5 rounded-full transition-all duration-500
                ${i < current ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

export default function App() {
  const { sessionId, loading, resetSession } = useSession()
  const { dark, toggle } = useDarkMode()
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [matchResult, setMatchResult] = useState<JDMatchResult | null>(null)
  const [questions, setQuestions] = useState<GeneratedQuestions | null>(null)

  const questionsMutation = useMutation({
    mutationFn: () => generateQuestions(sessionId!),
    onSuccess: (data) => setQuestions(data.questions),
  })

  const handleReset = async () => {
    await resetSession()
    setParsedResume(null)
    setMatchResult(null)
    setQuestions(null)
  }

  const currentStep = !parsedResume ? 0 : !matchResult ? 1 : 2

  if (loading || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-gray-950">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-indigo-200 dark:border-indigo-900 rounded-full" />
            <div className="absolute inset-0 w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Initialising session…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-200">

      {/* Sticky glassmorphism header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
        border-b border-gray-200/70 dark:border-gray-800/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center shadow-md shadow-indigo-300/30 dark:shadow-indigo-900/40 shrink-0">
              <span className="text-lg leading-none">🤖</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight truncate">
                Resume Screening Agent
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
                AI-powered candidate evaluation
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-lg flex items-center justify-center
                bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
                text-gray-600 dark:text-gray-300 transition-all duration-200"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Desktop reset */}
            <button
              onClick={handleReset}
              className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
                hover:text-red-500 dark:hover:text-red-400 transition-colors
                px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg
                hover:border-red-300 dark:hover:border-red-800"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              New Session
            </button>

            {/* Mobile reset */}
            <button
              onClick={handleReset}
              aria-label="New session"
              className="w-9 h-9 rounded-lg flex items-center justify-center sm:hidden
                bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/30
                text-gray-500 dark:text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600
        dark:from-indigo-900 dark:via-purple-900 dark:to-blue-900">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <p className="inline-flex items-center gap-1.5 bg-white/20 dark:bg-white/10 text-white/90 text-xs font-medium
            px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            AI Model Ready
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            AI-Powered Resume Screening
          </h2>
          <p className="text-indigo-200 dark:text-indigo-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Upload a resume, match it against any job description, and generate tailored interview questions — all in seconds.
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <StepIndicator current={currentStep} />

        <div className="space-y-5">

          {/* Step 1 — Upload */}
          {!parsedResume ? (
            <ResumeUploader
              sessionId={sessionId}
              onSuccess={(resume) => {
                setParsedResume(resume)
                setMatchResult(null)
                setQuestions(null)
              }}
            />
          ) : (
            <div className="space-y-3">
              <ParsedResumeView resume={parsedResume} />
              <button
                onClick={() => { setParsedResume(null); setMatchResult(null); setQuestions(null) }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
                  hover:underline flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Upload a different resume
              </button>
            </div>
          )}

          {/* Step 2 — JD */}
          {parsedResume && !matchResult && (
            <JDInput
              sessionId={sessionId}
              onSuccess={(result, jdText) => {
                setMatchResult(result)
                setQuestions(null)
                void jdText
              }}
            />
          )}

          {matchResult && (
            <div className="space-y-3">
              <MatchScoreCard result={matchResult} />
              <button
                onClick={() => { setMatchResult(null); setQuestions(null) }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
                  hover:underline flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Try a different job description
              </button>
            </div>
          )}

          {/* Step 3 — Generate */}
          {matchResult && !questions && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm
              border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
              <div className="flex flex-col items-center text-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600
                  flex items-center justify-center text-3xl shadow-lg shadow-purple-300/30 dark:shadow-purple-900/50">
                  🎤
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Generate Interview Questions
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                    AI will craft 10 technical + 10 behavioral questions tailored to this candidate and role.
                  </p>
                </div>
                <button
                  onClick={() => questionsMutation.mutate()}
                  disabled={questionsMutation.isPending}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-purple-600 to-indigo-600
                    hover:from-purple-700 hover:to-indigo-700
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 transition-all duration-200
                    shadow-lg shadow-purple-300/30 dark:shadow-purple-900/50
                    hover:shadow-xl hover:shadow-purple-300/40 dark:hover:shadow-purple-900/60
                    hover:-translate-y-0.5 active:translate-y-0"
                >
                  {questionsMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating questions…
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Generate Questions
                    </>
                  )}
                </button>
                {questionsMutation.isError && (
                  <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                    rounded-xl flex items-center justify-center gap-2">
                    <span className="text-red-500">⚠</span>
                    <p className="text-red-600 dark:text-red-400 text-sm">Failed to generate questions. Please try again.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Questions result */}
          {questions && (
            <div className="space-y-3">
              <QuestionsList questions={questions} />
              <button
                onClick={() => setQuestions(null)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
                  hover:underline flex items-center gap-1 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Regenerate questions
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-600 pt-10 pb-6 space-y-1">
          <p>Built with FastAPI · React · OpenAI GPT-4o-mini</p>
          <p className="text-gray-300 dark:text-gray-700">Session: {sessionId.slice(0, 8)}…</p>
        </div>
      </main>
    </div>
  )
}
