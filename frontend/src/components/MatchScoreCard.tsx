import { JDMatchResult } from '../api/client'

interface Props {
  result: JDMatchResult
}

function ScoreRing({ score }: { score: number }) {
  const size = 128
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Low'
  const labelColor = score >= 80
    ? 'text-green-600 dark:text-green-400'
    : score >= 60
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-500 dark:text-red-400'

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-100 dark:text-gray-700"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none tabular-nums">
            {score}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">/100</span>
        </div>
      </div>
      <span className={`text-xs font-bold uppercase tracking-wider ${labelColor}`}>
        {label} Match
      </span>
    </div>
  )
}

export function MatchScoreCard({ result }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 text-base">
        <span className="text-xl">🎯</span>
        JD Match Analysis
      </h3>

      {/* Score + summary */}
      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-7">
        <ScoreRing score={result.score} />
        <div className="flex-1 w-full">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed
            bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4
            border border-gray-100 dark:border-gray-700">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4
          border border-green-100 dark:border-green-800/40">
          <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider mb-3
            flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Matched Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.matched_skills.length === 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">None found</span>
            )}
            {result.matched_skills.map((s) => (
              <span key={s}
                className="bg-green-100 dark:bg-green-800/40 text-green-800 dark:text-green-300
                  text-xs px-2.5 py-1 rounded-lg font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4
          border border-red-100 dark:border-red-800/40">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3
            flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.missing_skills.length === 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">None — great fit!</span>
            )}
            {result.missing_skills.map((s) => (
              <span key={s}
                className="bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300
                  text-xs px-2.5 py-1 rounded-lg font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Strengths
          </p>
          <ul className="space-y-2.5">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40
                  flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Gaps
          </p>
          <ul className="space-y-2.5">
            {result.gaps.map((g, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/40
                  flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
