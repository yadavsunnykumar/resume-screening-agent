import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { ParsedResume, uploadResume } from '../api/client'

interface Props {
  sessionId: string
  onSuccess: (resume: ParsedResume) => void
}

export function ResumeUploader({ sessionId, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const mutation = useMutation({
    mutationFn: (file: File) => uploadResume(sessionId, file),
    onSuccess: (data) => onSuccess(data.parsed_resume),
  })

  const handleFile = (file: File) => {
    const allowed = ['pdf', 'docx', 'txt']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowed.includes(ext)) {
      alert('Please upload a PDF, DOCX, or TXT file.')
      return
    }
    mutation.mutate(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      {/* Card header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30
          flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Upload Resume</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500">Step 1 of 3</p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
        className={`relative border-2 border-dashed rounded-xl p-10 sm:p-14 text-center cursor-pointer
          transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
          ${dragOver
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]'
            : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
          }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {mutation.isPending ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/60 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">Parsing your resume…</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">AI is extracting key information</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
              ${dragOver
                ? 'bg-indigo-100 dark:bg-indigo-800/50 scale-110'
                : 'bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/40 dark:to-blue-900/40'
              }`}>
              <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                {dragOver ? 'Release to upload' : 'Drop your resume here'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">or click to browse files</p>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                {['PDF', 'DOCX', 'TXT'].map((f) => (
                  <span key={f}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400
                      text-xs rounded-md font-mono tracking-wide">
                    .{f.toLowerCase()}
                  </span>
                ))}
                <span className="text-xs text-gray-300 dark:text-gray-600">·</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">Max 10 MB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {mutation.isError && (
        <div className="mt-4 p-3 flex items-center gap-2.5
          bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/60 rounded-xl">
          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 dark:text-red-400 text-sm">Upload failed. Please try again.</p>
        </div>
      )}
    </div>
  )
}
