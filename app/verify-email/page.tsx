'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

function VerifyEmailContent() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing verification token')
      setLoading(false)
      return
    }

    // Verify email on page load
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (data.success) {
          setMessage(data.message)
          setLoading(false)
        } else {
          setError(data.error || 'Failed to verify email')
          setLoading(false)
        }
      } catch {
        setError('Failed to verify email')
        setLoading(false)
      }
    }

    // First, check if token is valid
    const checkToken = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (data.success) {
          setEmail(data.email)
          // Token is valid, proceed with verification
          verifyEmail()
        } else {
          setError(data.error || 'Invalid verification token')
          setLoading(false)
        }
      } catch {
        setError('Failed to validate verification token')
        setLoading(false)
      }
    }

    checkToken()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-blue mx-auto mb-4"></div>
            <p className="text-brand-gray">Verifying your email...</p>
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
            <span className="text-indigo-blue">Email</span>{' '}
            <span className="text-earthy-brown">Verification</span>
          </CardTitle>

          {message ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm">
                {message}
              </div>
              <div className="text-sm text-brand-gray">
                Your email has been verified successfully!
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
            <div className="text-center space-y-4">
              <div className="text-red-500 text-sm">
                {error}
              </div>
              <div className="text-sm text-brand-gray">
                {email && `Email: ${email}`}
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push('/signin')}
                  variant="primary"
                  className="w-full"
                >
                  Go to Sign In
                </Button>
                <Button
                  onClick={() => router.push('/signup')}
                  variant="outline"
                  className="w-full"
                >
                  Try Signing Up Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-blue mx-auto mb-4"></div>
            <p className="text-brand-gray">Loading...</p>
          </div>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
