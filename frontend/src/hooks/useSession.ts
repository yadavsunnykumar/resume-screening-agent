import { useEffect, useState } from 'react'
import { createSession, getSession } from '../api/client'

export function useSession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('session_id')
      if (stored) {
        try {
          await getSession(stored)
          setSessionId(stored)
        } catch {
          // Session expired — create a new one
          localStorage.removeItem('session_id')
          await createNew()
        }
      } else {
        await createNew()
      }
      setLoading(false)
    }

    const createNew = async () => {
      const { session_id } = await createSession()
      localStorage.setItem('session_id', session_id)
      setSessionId(session_id)
    }

    init()
  }, [])

  const resetSession = async () => {
    localStorage.removeItem('session_id')
    const { session_id } = await createSession()
    localStorage.setItem('session_id', session_id)
    setSessionId(session_id)
  }

  return { sessionId, loading, resetSession }
}
