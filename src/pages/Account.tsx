import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { supabase } from '@/lib/supabase/client'

type AuthMode =
  | 'signin'
  | 'signup'
  | 'forgot'
  | 'recovery'

export default function Account() {
  usePageTitle('Account')

  const {
    user,
    loading,
    configured,
    syncStatus,
    signOut,
  } = useAuth()

  const [mode, setMode] =
    useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [submitting, setSubmitting] =
    useState(false)
  const [message, setMessage] =
    useState<string | null>(null)
  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setMode('recovery')
          setPassword('')
          setConfirmPassword('')
          setMessage(
            'Enter a new password for your Pathway account.',
          )
          setError(null)
        }
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
      if (mode === 'forgot') {
        const { error: resetError } =
          await supabaseClient.auth
            .resetPasswordForEmail(
              email.trim(),
              {
                redirectTo:
                  `${window.location.origin}/account?recovery=1`,
              },
            )

        if (resetError) {
          throw resetError
        }

        setMessage(
          'If an account exists for that email, a password reset link has been sent. Check your inbox.',
        )
        return
      }

      if (mode === 'recovery') {
        if (password !== confirmPassword) {
          throw new Error(
            'The passwords do not match.',
          )
        }

        const { error: updateError } =
          await supabaseClient.auth.updateUser({
            password,
          })

        if (updateError) {
          throw updateError
        }

        setPassword('')
        setConfirmPassword('')
        setMode('signin')
        setMessage(
          'Your password has been updated successfully.',
        )
        return
      }

      if (mode === 'signup') {
        const { data, error: signUpError } =
          await supabaseClient.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo:
                `${window.location.origin}/account`,
            },
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

        return
      }

      const { error: signInError } =
        await supabaseClient.auth
          .signInWithPassword({
            email: email.trim(),
            password,
          })

      if (signInError) {
        throw signInError
      }

      setMessage('Signed in successfully.')
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

  if (user && mode !== 'recovery') {
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
            Your saved characters, notes, study
            progress, and generated studies are
            synchronized with your Pathway account.
          </p>

          <p className="mt-2 text-sm text-mute">
            Cloud sync:{' '}
            <span className="font-semibold">
              {syncStatus === 'syncing'
                ? 'Syncing…'
                : syncStatus === 'synced'
                  ? 'Up to date'
                  : syncStatus === 'error'
                    ? 'Needs attention'
                    : 'Waiting'}
            </span>
          </p>

          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleSignOut()}
            className="mt-6 rounded-lg border border-line px-4 py-2 text-sm font-semibold hover:border-acc hover:text-acc disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? 'Signing out…'
              : 'Sign out'}
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

  const title =
    mode === 'signup'
      ? 'Create your Pathway account'
      : mode === 'forgot'
        ? 'Reset your password'
        : mode === 'recovery'
          ? 'Choose a new password'
          : 'Sign in to Pathway'

  const subtitle =
    mode === 'forgot'
      ? 'Enter your account email and Pathway will send you a password reset link.'
      : mode === 'recovery'
        ? 'Create a new password for your Pathway account.'
        : 'Your account keeps your studies available across devices.'

  return (
    <div className="py-8">
      <SectionHeader
        title={title}
        subtitle={subtitle}
      />

      <form
        onSubmit={(event) =>
          void handleSubmit(event)
        }
        className="card mt-6 max-w-xl"
      >
        {mode !== 'recovery' && (
          <>
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
          </>
        )}

        {mode !== 'forgot' && (
          <>
            <label
              htmlFor="account-password"
              className={
                mode === 'recovery'
                  ? 'text-sm font-semibold'
                  : 'mt-5 block text-sm font-semibold'
              }
            >
              {mode === 'recovery'
                ? 'New password'
                : 'Password'}
            </label>

            <input
              id="account-password"
              type="password"
              autoComplete={
                mode === 'signin'
                  ? 'current-password'
                  : 'new-password'
              }
              required
              minLength={6}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
            />
          </>
        )}

        {mode === 'recovery' && (
          <>
            <label
              htmlFor="confirm-password"
              className="mt-5 block text-sm font-semibold"
            >
              Confirm new password
            </label>

            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              className="mt-2 w-full rounded-xl border border-line bg-transparent px-4 py-3 text-ink outline-none focus:border-acc"
            />
          </>
        )}

        {mode === 'signin' && (
          <button
            type="button"
            className="mt-3 block text-sm font-semibold text-acc"
            onClick={() => {
              setMode('forgot')
              setPassword('')
              setMessage(null)
              setError(null)
            }}
          >
            Forgot password?
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 rounded-lg bg-acc px-5 py-2.5 text-sm font-semibold text-on disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? 'Please wait…'
            : mode === 'signup'
              ? 'Create account'
              : mode === 'forgot'
                ? 'Send reset link'
                : mode === 'recovery'
                  ? 'Update password'
                  : 'Sign in'}
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

        {mode !== 'recovery' && (
          <div className="mt-6 border-t border-line pt-5">
            {mode === 'forgot' ? (
              <button
                type="button"
                className="text-sm font-semibold text-acc"
                onClick={() => {
                  setMode('signin')
                  setMessage(null)
                  setError(null)
                }}
              >
                Back to sign in
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
