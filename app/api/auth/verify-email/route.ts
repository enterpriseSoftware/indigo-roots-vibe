import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Validation schema for email verification
const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validation = verifyEmailSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { token } = validation.data

    // Find verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid verification token' 
        },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Verification token has expired' 
        },
        { status: 400 }
      )
    }

    // Find user by email (identifier)
    const user = await db.user.findUnique({
      where: { email: verificationToken.identifier },
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found' 
        },
        { status: 400 }
      )
    }

    // Update user email verification status
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    })

    // Delete the verification token
    await db.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check verification status
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

    // Find verification token
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid verification token' 
        },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Verification token has expired' 
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
      email: verificationToken.identifier,
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
