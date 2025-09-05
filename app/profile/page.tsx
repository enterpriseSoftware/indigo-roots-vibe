'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SessionManager } from '@/components/session-manager'
import { Card, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-blue mx-auto mb-4"></div>
            <p className="text-brand-gray">Loading profile...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-indigo-blue">User</span>{' '}
            <span className="text-earthy-brown">Profile</span>
          </h1>
          <p className="text-brand-gray text-center">
            Manage your account and session information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile Card */}
          <Card className="w-full">
            <div className="p-6">
              <CardTitle className="mb-4">
                <span className="text-indigo-blue">Profile</span>{' '}
                <span className="text-earthy-brown">Information</span>
              </CardTitle>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1">
                    Name
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {session?.user?.name || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1">
                    Email
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {session?.user?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-gray mb-1">
                    Role
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session?.user?.role === 'ADMIN' 
                        ? 'bg-red-100 text-red-800'
                        : session?.user?.role === 'BLOG_EDITOR'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {session?.user?.role}
                    </span>
                  </div>
                </div>

                {session?.user?.image && (
                  <div>
                    <label className="block text-sm font-medium text-brand-gray mb-1">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <span className="text-sm text-brand-gray">Profile image from OAuth provider</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Session Manager Card */}
          <SessionManager />
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="w-full">
            <div className="p-6">
              <CardTitle className="mb-4">
                <span className="text-indigo-blue">Quick</span>{' '}
                <span className="text-earthy-brown">Actions</span>
              </CardTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push('/forgot-password')}
                  variant="outline"
                  className="w-full"
                >
                  Change Password
                </Button>
                
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full"
                >
                  Go Home
                </Button>
                
                <Button
                  onClick={() => router.push('/signin')}
                  variant="outline"
                  className="w-full"
                >
                  Sign In Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
