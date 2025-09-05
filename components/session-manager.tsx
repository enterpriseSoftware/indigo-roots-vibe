'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

interface SessionInfo {
  user: {
    id: string
    email: string
    name?: string | null
    role: string
    image?: string | null
  }
  expires: string
  isExpired: boolean
  timeUntilExpiry: number
  timeUntilExpiryFormatted: string
  isRememberMe: boolean
  expiryInfo?: {
    expiresAt: string
    timeUntilExpiry: number
    isExpired: boolean
    isExpiringSoon: boolean
    isRememberMe: boolean
  } | null
}

export function SessionManager() {
  const { status } = useSession()
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch detailed session info
  const fetchSessionInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/session')
      const data = await response.json()

      if (data.success) {
        setSessionInfo(data.session)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch session info')
      }
    } catch {
      setError('Failed to fetch session info')
    } finally {
      setLoading(false)
    }
  }

  // Refresh session
  const refreshSession = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/session', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setSessionInfo(data.session)
        setError('')
      } else {
        setError(data.error || 'Failed to refresh session')
      }
    } catch {
      setError('Failed to refresh session')
    } finally {
      setLoading(false)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch {
      setError('Failed to sign out')
    }
  }

  // Fetch session info on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessionInfo()
    }
  }, [status])

  // Auto-refresh session info every minute
  useEffect(() => {
    if (status === 'authenticated') {
      const interval = setInterval(() => {
        fetchSessionInfo()
      }, 60000) // 1 minute

      return () => clearInterval(interval)
    }
  }, [status])

  if (status === 'loading') {
    return (
      <Card className="w-full max-w-md">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-blue mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading session...</p>
        </div>
      </Card>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Card className="w-full max-w-md">
        <div className="p-6 text-center">
          <CardTitle className="mb-4">
            <span className="text-indigo-blue">Session</span>{' '}
            <span className="text-earthy-brown">Manager</span>
          </CardTitle>
          <p className="text-brand-gray mb-4">You are not signed in</p>
          <Button
            onClick={() => window.location.href = '/signin'}
            variant="primary"
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      </Card>
    )
  }

  if (!sessionInfo) {
    return (
      <Card className="w-full max-w-md">
        <div className="p-6 text-center">
          <CardTitle className="mb-4">
            <span className="text-indigo-blue">Session</span>{' '}
            <span className="text-earthy-brown">Manager</span>
          </CardTitle>
          <p className="text-brand-gray mb-4">Loading session information...</p>
          <Button
            onClick={fetchSessionInfo}
            variant="outline"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <div className="p-6">
        <CardTitle className="mb-4">
          <span className="text-indigo-blue">Session</span>{' '}
          <span className="text-earthy-brown">Manager</span>
        </CardTitle>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-brand-gray mb-2">User Information</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p><strong>Name:</strong> {sessionInfo.user.name || 'Not provided'}</p>
              <p><strong>Email:</strong> {sessionInfo.user.email}</p>
              <p><strong>Role:</strong> {sessionInfo.user.role}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-brand-gray mb-2">Session Information</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1">
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  sessionInfo.isExpired 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {sessionInfo.isExpired ? 'Expired' : 'Active'}
                </span>
              </p>
              <p><strong>Remember Me:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  sessionInfo.isRememberMe 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {sessionInfo.isRememberMe ? 'Yes' : 'No'}
                </span>
              </p>
              <p><strong>Time Remaining:</strong> {sessionInfo.timeUntilExpiryFormatted}</p>
              {sessionInfo.expiryInfo?.isExpiringSoon && (
                <p className="text-orange-600 font-medium">
                  ⚠️ Session expires soon!
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={refreshSession}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Session'}
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex-1"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
