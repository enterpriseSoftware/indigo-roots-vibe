import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { EmailService } from '@/lib/email'
import { validatePasswordStrength } from '@/lib/password-reset'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

// Validation schema for user registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
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
    const validation = registerSchema.safeParse(body)
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

    const { name, email, password } = validation.data

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

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email already exists' 
        },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'USER',
        emailVerified: null, // Will be set when email is verified
      },
    })

    // Store verification token
    await db.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: verificationExpires,
      },
    })

    // Send welcome email with verification link
    try {
      const emailResult = await EmailService.sendEmailVerification(
        user.email,
        verificationToken,
        user.name || 'User'
      )
      
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error)
        // Don't fail registration if email fails
      }
    } catch (error) {
      console.error('Email service error:', error)
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify your account before signing in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
