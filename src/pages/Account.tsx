import {
  useState,
  type FormEvent,
} from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { supabase } from '@/lib/supabase/client'

type AuthMode = 'signin' | 'signup'

export default function Account() {
  usePageTitle('Account')

  const {
    user,
    loading,
    configured,
    signOut,
  } = useAuth()

  const [mode, setMode] =
    useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] =
    useState(false)
  const [message, setMessage] =
    useState<string | null>(null)
  const [error, setError] =
    useState<string | null>(null)

  if (loading) {
    return (
      <div
        role="status"
        className="py-16 text-center text-mute"
      >
        Loading account…
      </div>
    )
  }

  if (!configured || !supabase) {
    return (
      <div className="py-8">
        <SectionHeader
          title="Account"
          subtitle="Account services are temporarily unavailable."
        />
      </div>
    )
  }

  const supabaseClient = supabase

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } =
          await supabaseClient.auth.signUp({
            email: email.trim(),
            password,
          })

        if (signUpError) {
          throw signUpError
        }

        if (data.session) {
          setMessage(
            'Your Pathway account has been created.',
          )
        } else {
          setMessage(
            'Account created. Check your email to confirm your address, then sign in.',
          )
        }
      } else {
        const { error: signInError } =
          await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password,
          })

        if (signInError) {
          throw signInError
        }

        setMessage('Signed in successfully.')
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Pathway could not complete this request. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    setSubmitting(true)
    setMessage(null)
    setError(null)

    try {
      await signOut()
      setMessage('Signed out successfully.')
    } catch {
      setError(
        'Pathway could not sign you out. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (user) {
    return (
      <div className="py-8">
        <SectionHeader
          title="Your Account"
          subtitle="Your Pathway account is connected."
        />

        <div className="card mt-6 max-w-xl">
          <p className="text-sm text-mute">
            Signed in as
          </p>

          <p className="mt-1 break-all font-semibold">
            {user.email ?? 'Pathway user'}
          </p>

          <p className="mt-4 text-sm text-mute">
            Cloud study sync will be connected in the
            next step. Your existing studies remain
            safely stored on this device.
          </p>

          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSignOut()}
            className="mt-6 rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-acc hover:text-acc disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing out…' : 'Sign out'}
          </button>

          {message && (
            <p
              className="mt-4 text-sm font-semibold text-acc"
              role="status"
            >
              {message}
            </p>
          )}

          {error && (
            <p
              className="mt-4 text-sm text-red-600"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <SectionHeader
        title={
          mode === 'signin'
            ? 'Sign in to Pathway'
            : 'Create your Pathway account'
        }
        subtitle="Your account will allow Pathway to keep your studies available across devices."
      />

      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="card mt-6 max-w-xl"
      >
        <label
          htmlFor="account-email"
          className="text-sm font-semibold"
        >
          Email
        </label>

        <input
          id="account-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
        />

        <label
          htmlFor="account-password"
          className="mt-5 block text-sm font-semibold"
        >
          Password
        </label>

        <input
          id="account-password"
          type="password"
          autoComplete={
            mode === 'signup'
              ? 'new-password'
              : 'current-password'
          }
          required
          minLength={6}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 rounded-lg bg-acc px-5 py-2.5 text-sm font-semibold text-on disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? 'Please wait…'
            : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
        </button>

        {message && (
          <p
            className="mt-4 text-sm font-semibold text-acc"
            role="status"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            className="mt-4 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-sm text-mute">
            {mode === 'signin'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </p>

          <button
            type="button"
            className="mt-2 text-sm font-semibold text-acc"
            onClick={() => {
              setMode(
                mode === 'signin'
                  ? 'signup'
                  : 'signin',
              )
              setMessage(null)
              setError(null)
            }}
          >
            {mode === 'signin'
              ? 'Create account'
              : 'Sign in instead'}
          </button>
        </div>
      </form>
    </div>
  )
}
