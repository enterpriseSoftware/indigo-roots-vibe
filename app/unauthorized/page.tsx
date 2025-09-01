import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <div className="p-6">
          <CardTitle className="mb-4 text-red-500">Access Denied</CardTitle>

          <CardContent>
            <div className="space-y-4">
              <p className="text-brand-gray">
                You don&apos;t have permission to access this area.
              </p>

              <p className="text-sm text-brand-gray">
                Contact an administrator if you believe this is an error.
              </p>

              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="primary">Go Home</Button>
                </Link>

                <Link href="/signin">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
