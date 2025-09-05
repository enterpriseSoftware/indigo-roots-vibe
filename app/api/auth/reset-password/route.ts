import { NextRequest, NextResponse } from 'next/server'
import { resetPasswordWithToken, validatePasswordStrength } from '@/lib/password-reset'
import { z } from 'zod'

// Validation schema for password reset
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = resetPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { token, password } = validation.data

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password does not meet requirements',
          details: passwordValidation.errors 
        },
        { status: 400 }
      )
    }

    // Reset password with token
    const result = await resetPasswordWithToken(token, password)

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to reset password' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to validate token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token is required' 
        },
        { status: 400 }
      )
    }

    const { validateResetToken } = await import('@/lib/password-reset')
    const validation = await validateResetToken(token)

    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error || 'Invalid token' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      user: {
        email: validation.user?.email
      }
    })

  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
