import { Card, CardTitle, CardContent } from '@/components/ui/card'

export default function StripeTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardTitle className="text-indigo-blue">
            Stripe Integration Test
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              <p>
                💳 Stripe SDK has been installed and configured for the Indigo
                Roots platform.
              </p>

              <p className="text-brand-gray">
                This foundation supports one-time purchases, subscriptions, and
                donations as specified in the PRD.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Payment Types Supported</CardTitle>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-blue/10 p-4 rounded-lg border border-indigo-blue/20">
                <h3 className="font-semibold mb-2 text-indigo-blue">
                  One-Time Purchases
                </h3>
                <p className="text-sm text-brand-gray">
                  Merchandise, albums, tickets, and digital downloads
                </p>
              </div>

              <div className="bg-earthy-brown/10 p-4 rounded-lg border border-earthy-brown/20">
                <h3 className="font-semibold mb-2 text-earthy-brown">
                  Subscriptions
                </h3>
                <p className="text-sm text-brand-gray">
                  Monthly/yearly fan memberships with exclusive content
                </p>
              </div>

              <div className="bg-leaf-green/10 p-4 rounded-lg border border-leaf-green/20">
                <h3 className="font-semibold mb-2 text-leaf-green">
                  Donations
                </h3>
                <p className="text-sm text-brand-gray">
                  Support the band with flexible donation amounts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardTitle>Configuration Status</CardTitle>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-leaf-green">✅</span>
                <span>Stripe SDK installed and configured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-leaf-green">✅</span>
                <span>Webhook endpoint created at /api/stripe/webhook</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-leaf-green">✅</span>
                <span>Environment variables structure defined</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-gray">⚠️</span>
                <span className="text-brand-gray">
                  Environment variables need to be configured
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-brand-gray/10 rounded-lg">
              <p className="text-sm">
                <strong>Next Steps:</strong> Add your Stripe API keys to
                .env.local to enable payments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
