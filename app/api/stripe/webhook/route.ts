import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.warn('Payment succeeded:', paymentIntent.id)
      // TODO: Handle successful payment
      break

    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      console.warn('Subscription created:', subscription.id)
      // TODO: Handle new subscription
      break

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription
      console.warn('Subscription updated:', updatedSubscription.id)
      // TODO: Handle subscription update
      break

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      console.warn('Subscription deleted:', deletedSubscription.id)
      // TODO: Handle subscription cancellation
      break

    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice
      console.warn('Invoice payment succeeded:', invoice.id)
      // TODO: Handle successful invoice payment
      break

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice
      console.warn('Invoice payment failed:', failedInvoice.id)
      // TODO: Handle failed invoice payment
      break

    default:
      console.warn(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
