import Stripe from 'stripe'

// For build-time safety, only initialize Stripe if the secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables'
    )
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}
