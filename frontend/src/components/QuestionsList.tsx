import { useState } from 'react'
import { BehavioralQuestion, GeneratedQuestions, TechnicalQuestion } from '../api/client'

interface Props {
  questions: GeneratedQuestions
}

const difficultyStyles: Record<string, string> = {
  Easy: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

function TechnicalItem({ q, index, expanded, onToggle }: {
  q: TechnicalQuestion
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200
      ${expanded
        ? 'border-indigo-200 dark:border-indigo-700/60 shadow-sm'
        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700/40'
      }`}>
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-gray-300 dark:text-gray-600 text-xs font-mono tabular-nums mt-0.5 w-5 shrink-0 text-right">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug text-left">
            {q.question}
          </p>
          <div className="flex items-center gap-2 shrink-0 ml-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-lg font-semibold
              ${difficultyStyles[q.difficulty] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
              {q.difficulty}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-indigo-50/80 dark:bg-indigo-900/20 border-t border-indigo-100 dark:border-indigo-800/40">
          <div className="pt-3 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300
                px-2.5 py-0.5 rounded-lg font-medium">
                {q.topic}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-bold text-gray-700 dark:text-gray-300 not-italic">Why asked: </span>
              {q.why_asked}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function BehavioralItem({ q, index, expanded, onToggle }: {
  q: BehavioralQuestion
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200
      ${expanded
        ? 'border-purple-200 dark:border-purple-700/60 shadow-sm'
        : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700/40'
      }`}>
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/40 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="text-gray-300 dark:text-gray-600 text-xs font-mono tabular-nums mt-0.5 w-5 shrink-0 text-right">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-200 font-medium leading-snug text-left">
            {q.question}
          </p>
          <div className="flex items-center gap-2 shrink-0 ml-1">
            <span className="text-xs px-2.5 py-0.5 rounded-lg font-semibold
              bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 max-w-[120px] truncate">
              {q.competency}
            </span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 bg-purple-50/80 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800/40">
          <div className="pt-3 space-y-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-bold text-gray-700 dark:text-gray-300 not-italic">Why asked: </span>
              {q.why_asked}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export function QuestionsList({ questions }: Props) {
  const [tab, setTab] = useState<'technical' | 'behavioral'>('technical')
  const [expanded, setExpanded] = useState<number | null>(null)

  const toggleExpand = (i: number) => setExpanded(expanded === i ? null : i)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-base">
        <span className="text-xl">🎤</span>
        Interview Questions
      </h3>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-700/60 p-1 rounded-xl">
        {(['technical', 'behavioral'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setExpanded(null) }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
              text-sm font-semibold transition-all duration-200
              ${tab === t
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            <span>{t === 'technical' ? '⚙️' : '💬'}</span>
            <span>{t === 'technical' ? 'Technical' : 'Behavioral'}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
              ${tab === t
                ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
              {t === 'technical' ? questions.technical.length : questions.behavioral.length}
            </span>
          </button>
        ))}
      </div>

      {/* Question lists */}
      <div className="space-y-2.5">
        {tab === 'technical' &&
          questions.technical.map((q, i) => (
            <TechnicalItem
              key={i}
              q={q}
              index={i}
              expanded={expanded === i}
              onToggle={() => toggleExpand(i)}
            />
          ))
        }
        {tab === 'behavioral' &&
          questions.behavioral.map((q, i) => (
            <BehavioralItem
              key={i}
              q={q}
              index={i}
              expanded={expanded === i}
              onToggle={() => toggleExpand(i)}
            />
          ))
        }
      </div>
    </div>
  )
}
