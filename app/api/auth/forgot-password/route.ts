import { NextRequest, NextResponse } from 'next/server'
import { createPasswordResetRequest } from '@/lib/password-reset'
import { z } from 'zod'

// Validation schema for password reset request
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Create password reset request
    const result = await createPasswordResetRequest(email)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to process password reset request' 
        },
        { status: 500 }
      )
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
