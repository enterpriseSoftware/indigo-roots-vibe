// Environment variables validation for Stripe
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}

// Validate that required Stripe environment variables are present
export function validateStripeConfig() {
  const missing = []

  if (!stripeConfig.publishableKey) {
    missing.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  }

  if (!stripeConfig.secretKey) {
    missing.push('STRIPE_SECRET_KEY')
  }

  if (!stripeConfig.webhookSecret) {
    missing.push('STRIPE_WEBHOOK_SECRET')
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required Stripe environment variables: ${missing.join(', ')}\n` +
        'Please add these to your .env.local file.'
    )
  }

  return stripeConfig
}
