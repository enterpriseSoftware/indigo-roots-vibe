'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setEmail('')
      } else {
        setError(data.error || 'An error occurred. Please try again.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <CardTitle className="text-center mb-6">
            <span className="text-indigo-blue">Forgot</span>{' '}
            <span className="text-earthy-brown">Password?</span>
          </CardTitle>

          {message ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm">
                {message}
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push('/signin')}
                  variant="primary"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
                <Button
                  onClick={() => {
                    setMessage('')
                    setEmail('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Try Another Email
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-brand-gray mb-6">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Enter your email address"
                    required
                  />
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
