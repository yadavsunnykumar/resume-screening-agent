import { useState } from 'react'
import { ParsedResume } from '../api/client'

interface Props {
  resume: ParsedResume
}

export function ParsedResumeView({ resume }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50/60
      dark:from-emerald-900/20 dark:to-green-900/10
      border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 sm:p-8">

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl
            flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Resume Parsed Successfully</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">AI has extracted key information</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400
            hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors
            flex items-center gap-1 shrink-0 mt-0.5"
        >
          {expanded ? 'Show less' : 'View details'}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Identity row */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold text-gray-900 dark:text-white text-base">{resume.name}</span>
        {resume.email && (
          <span className="text-sm text-gray-500 dark:text-gray-400">{resume.email}</span>
        )}
        {resume.phone && (
          <span className="text-sm text-gray-500 dark:text-gray-400">{resume.phone}</span>
        )}
        <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300
          px-2.5 py-0.5 rounded-lg text-xs font-bold">
          {resume.total_years_experience} yrs exp
        </span>
      </div>

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(showAllSkills ? resume.skills : resume.skills.slice(0, 12)).map((skill) => (
          <span key={skill}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600
              text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-lg font-medium shadow-sm">
            {skill}
          </span>
        ))}
        {resume.skills.length > 12 && (
          <button
            onClick={() => setShowAllSkills(s => !s)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300
              font-semibold flex items-center gap-0.5 px-1 transition-colors"
          >
            {showAllSkills ? '− Show less' : `+${resume.skills.length - 12} more`}
          </button>
        )}
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="mt-6 space-y-6 border-t border-emerald-200 dark:border-emerald-800/50 pt-6">

          {resume.summary && (
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Summary
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{resume.summary}</p>
            </div>
          )}

          {resume.experience.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Experience
              </p>
              <div className="space-y-3">
                {resume.experience.map((exp, i) => (
                  <div key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4
                      border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">{exp.role}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{exp.company}</p>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                        {exp.start_date} – {exp.end_date}
                      </p>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Education
              </p>
              <div className="space-y-2.5">
                {resume.education.map((edu, i) => (
                  <div key={i}
                    className="bg-white dark:bg-gray-800 rounded-xl p-4
                      border border-gray-100 dark:border-gray-700 shadow-sm">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                      {edu.institution} · {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
