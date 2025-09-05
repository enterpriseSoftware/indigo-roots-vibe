'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token')
      setValidating(false)
      return
    }

    // Validate token on page load
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setUserEmail(data.user?.email || '')
          setValidating(false)
        } else {
          setError(data.error || 'Invalid or expired reset token')
          setValidating(false)
        }
      } catch {
        setError('Failed to validate reset token')
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Client-side validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Password strength validation
    const passwordErrors = []
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push('at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      passwordErrors.push('at least one lowercase letter')
    }
    if (!/\d/.test(password)) {
      passwordErrors.push('at least one number')
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      passwordErrors.push('at least one special character')
    }

    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(', ')}`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setPassword('')
        setConfirmPassword('')
        
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } else {
        if (data.details) {
          setError(data.details.map((d: { message: string }) => d.message).join(', '))
        } else {
          setError(data.error || 'An error occurred. Please try again.')
        }
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-blue mx-auto mb-4"></div>
            <p className="text-brand-gray">Validating reset token...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="text-red-500 text-sm mb-4">{error}</div>
            <Button
              onClick={() => router.push('/forgot-password')}
              variant="primary"
              className="w-full"
            >
              Request New Reset Link
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <CardTitle className="text-center mb-6">
            <span className="text-indigo-blue">Reset</span>{' '}
            <span className="text-earthy-brown">Password</span>
          </CardTitle>

          {message ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm">
                {message}
              </div>
              <div className="text-sm text-brand-gray">
                Redirecting to sign in page...
              </div>
              <Button
                onClick={() => router.push('/signin')}
                variant="primary"
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <>
              {userEmail && (
                <p className="text-center text-brand-gray mb-6">
                  Reset password for <strong>{userEmail}</strong>
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Enter your new password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <div className="text-xs text-brand-gray">
                  <p className="mb-1">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>

              <div className="text-center text-sm text-brand-gray mt-6">
                Remember your password?{' '}
                <Link 
                  href="/signin" 
                  className="text-indigo-blue hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
