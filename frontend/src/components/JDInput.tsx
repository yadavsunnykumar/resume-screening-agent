import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { JDMatchResult, matchJD } from '../api/client'
import { sampleJDs } from '../data/sampleJDs'

interface Props {
  sessionId: string
  onSuccess: (result: JDMatchResult, jdText: string) => void
}

export function JDInput({ sessionId, onSuccess }: Props) {
  const [jdText, setJdText] = useState('')
  const [selectedSample, setSelectedSample] = useState<string>('')

  const mutation = useMutation({
    mutationFn: (text: string) => matchJD(sessionId, text),
    onSuccess: (data) => onSuccess(data.match_result, jdText),
  })

  const handleSampleSelect = (title: string) => {
    const jd = sampleJDs.find((j) => j.title === title)
    if (jd) {
      setJdText(jd.text)
      setSelectedSample(title)
    }
  }

  const handleSubmit = () => {
    if (!jdText.trim()) return
    mutation.mutate(jdText.trim())
  }

  const charCount = jdText.length

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30
          flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Match Job Description</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Step 2 of 3</p>
        </div>
      </div>

      {/* Sample quick-select */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Quick select a sample
        </p>
        <div className="flex flex-wrap gap-2">
          {sampleJDs.map((jd) => (
            <button
              key={jd.title}
              onClick={() => handleSampleSelect(jd.title)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150
                ${selectedSample === jd.title
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200/60 dark:shadow-indigo-900/40'
                  : 'bg-white dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-300'
                }`}
            >
              {jd.title}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={jdText}
          onChange={(e) => {
            setJdText(e.target.value)
            setSelectedSample('')
          }}
          placeholder="Paste the full job description here…"
          rows={9}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-sm
            text-gray-700 dark:text-gray-200 bg-gray-50/80 dark:bg-gray-700/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
            resize-y placeholder-gray-400 dark:placeholder-gray-600 transition-all duration-200
            leading-relaxed"
        />
        <span className="absolute bottom-3 right-3 text-xs text-gray-300 dark:text-gray-600 select-none">
          {charCount} chars
        </span>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!jdText.trim() || mutation.isPending}
        className="mt-4 w-full py-3 rounded-xl font-semibold text-white
          bg-gradient-to-r from-indigo-600 to-blue-600
          hover:from-indigo-700 hover:to-blue-700
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center gap-2 transition-all duration-200
          shadow-sm shadow-indigo-200/60 dark:shadow-indigo-900/40
          hover:shadow-md hover:shadow-indigo-300/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        {mutation.isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Matching against resume…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyse Match
          </>
        )}
      </button>

      {mutation.isError && (
        <div className="mt-3 p-3 flex items-center gap-2.5
          bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 dark:text-red-400 text-sm">Matching failed. Please try again.</p>
        </div>
      )}
    </div>
  )
}
