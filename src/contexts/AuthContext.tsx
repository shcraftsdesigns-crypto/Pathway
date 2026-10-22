import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  Session,
  User,
} from '@supabase/supabase-js'

import {
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase/client'
import {
  syncStudyData,
  uploadCurrentStudyData,
} from '@/lib/studyCloudSync'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  syncStatus:
    | 'idle'
    | 'syncing'
    | 'synced'
    | 'error'
  signOut: () => Promise<void>
}

const AuthContext =
  createContext<AuthContextValue | null>(null)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [session, setSession] =
    useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncStatus, setSyncStatus] =
    useState<AuthContextValue['syncStatus']>(
      'idle',
    )

  const syncedUserIdRef =
    useRef<string | null>(null)

  const uploadTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null,
    )

  const applyingCloudRef = useRef(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let active = true

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return
        setSession(data.session)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setSession(null)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!active) return
        setSession(nextSession)
        setLoading(false)
      },
    )

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const userId = session?.user.id

    if (!userId) {
      syncedUserIdRef.current = null
      setSyncStatus('idle')
      return
    }

    if (syncedUserIdRef.current === userId) {
      return
    }

    let cancelled = false

    const runInitialSync = async () => {
      setSyncStatus('syncing')
      applyingCloudRef.current = true

      try {
        await syncStudyData(userId)

        if (cancelled) return

        syncedUserIdRef.current = userId
        setSyncStatus('synced')
      } catch (error) {
        console.error(
          'Pathway study sync failed:',
          error,
        )

        if (!cancelled) {
          setSyncStatus('error')
        }
      } finally {
        window.setTimeout(() => {
          applyingCloudRef.current = false
        }, 0)
      }
    }

    void runInitialSync()

    return () => {
      cancelled = true
    }
  }, [session?.user.id])

  useEffect(() => {
    const userId = session?.user.id

    if (!userId) return

    const handleStudyChange = () => {
      if (applyingCloudRef.current) {
        return
      }

      if (syncedUserIdRef.current !== userId) {
        return
      }

      if (uploadTimerRef.current) {
        clearTimeout(uploadTimerRef.current)
      }

      uploadTimerRef.current = setTimeout(() => {
        setSyncStatus('syncing')

        void uploadCurrentStudyData(userId)
          .then(() => {
            setSyncStatus('synced')
          })
          .catch((error) => {
            console.error(
              'Pathway study upload failed:',
              error,
            )
            setSyncStatus('error')
          })
      }, 750)
    }

    window.addEventListener(
      'pathway-study-change',
      handleStudyChange,
    )

    return () => {
      window.removeEventListener(
        'pathway-study-change',
        handleStudyChange,
      )

      if (uploadTimerRef.current) {
        clearTimeout(uploadTimerRef.current)
        uploadTimerRef.current = null
      }
    }
  }, [session?.user.id])

  const signOut = useCallback(async () => {
    if (!supabase) return

    if (uploadTimerRef.current) {
      clearTimeout(uploadTimerRef.current)
      uploadTimerRef.current = null
    }

    const userId = session?.user.id

    if (userId && syncedUserIdRef.current === userId) {
      try {
        await uploadCurrentStudyData(userId)
      } catch (error) {
        console.error(
          'Final Pathway study sync failed:',
          error,
        )
      }
    }

    const { error } =
      await supabase.auth.signOut()

    if (error) {
      throw error
    }

    syncedUserIdRef.current = null
    setSyncStatus('idle')
  }, [session?.user.id])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: isSupabaseConfigured,
      syncStatus,
      signOut,
    }),
    [
      session,
      loading,
      syncStatus,
      signOut,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    )
  }

  return context
}
