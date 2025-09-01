import { Card, CardTitle, CardContent } from '@/components/ui/card'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardTitle className="text-indigo-blue">Admin Dashboard</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <p>
                🎉 Welcome to the admin area! You have successfully accessed a
                protected route.
              </p>

              <p className="text-brand-gray">
                This page is only accessible to users with the ADMIN role.
              </p>

              <div className="bg-leaf-green/10 p-4 rounded-lg border border-leaf-green/20">
                <p className="text-sm">
                  <strong>Protected Route:</strong> /admin/**
                  <br />
                  <strong>Required Role:</strong> ADMIN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
