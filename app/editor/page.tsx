import { Card, CardTitle, CardContent } from '@/components/ui/card'

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardTitle className="text-earthy-brown">Editor Dashboard</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <p>
                ✍️ Welcome to the editor area! You can manage blog content here.
              </p>

              <p className="text-brand-gray">
                This page is accessible to users with BLOG_EDITOR or ADMIN
                roles.
              </p>

              <div className="bg-earthy-brown/10 p-4 rounded-lg border border-earthy-brown/20">
                <p className="text-sm">
                  <strong>Protected Route:</strong> /editor/**
                  <br />
                  <strong>Required Roles:</strong> BLOG_EDITOR, ADMIN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
