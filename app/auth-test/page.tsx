'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthTestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardTitle>NextAuth.js Status</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="text-indigo-blue">{status}</span>
                </p>
              </div>
              <div>
                <p>
                  <strong>Session:</strong>{' '}
                  <span className="text-indigo-blue">
                    {session ? 'Authenticated' : 'Not authenticated'}
                  </span>
                </p>
              </div>
              {session && (
                <div>
                  <p>
                    <strong>User:</strong>
                  </p>
                  <pre className="bg-brand-gray/10 p-3 rounded text-sm">
                    {JSON.stringify(session.user, null, 2)}
                  </pre>
                </div>
              )}
              <div className="space-y-3">
                <div className="text-sm text-brand-gray">
                  ✅ NextAuth.js session provider is working correctly yay!
                </div>

                <div className="flex gap-3">
                  {!session ? (
                    <Button variant="primary" onClick={() => signIn()}>
                      Sign In
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => signOut()}>
                      Sign Out
                    </Button>
                  )}
                </div>

                <div className="text-sm text-brand-gray">
                  Note: You'll need a user account in the database to sign in.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
