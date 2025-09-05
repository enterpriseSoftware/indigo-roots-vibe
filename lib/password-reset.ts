import { db } from './db'
import { EmailService } from './email'
import crypto from 'crypto'

// Password reset token configuration
const TOKEN_LENGTH = 32
const TOKEN_EXPIRY_HOURS = 1

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex')
}

/**
 * Check if a password reset token is valid and not expired
 */
export async function validateResetToken(token: string): Promise<{
  valid: boolean
  user?: { id: string; email: string }
  error?: string
}> {
  try {
    const resetRecord = await db.passwordReset.findUnique({
      where: { token },
    })

    if (!resetRecord) {
      return { valid: false, error: 'Invalid token' }
    }

    if (resetRecord.used) {
      return { valid: false, error: 'Token has already been used' }
    }

    if (resetRecord.expires < new Date()) {
      return { valid: false, error: 'Token has expired' }
    }

    // Get user information
    const user = await db.user.findUnique({
      where: { email: resetRecord.email },
      select: { id: true, email: true, name: true },
    })

    if (!user) {
      return { valid: false, error: 'User not found' }
    }

    return { valid: true, user }
  } catch (error) {
    console.error('Error validating reset token:', error)
    return { valid: false, error: 'Internal server error' }
  }
}

/**
 * Create a password reset request and send email
 */
export async function createPasswordResetRequest(email: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Check if user exists
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return { success: true }
    }

    // Generate reset token
    const token = generateResetToken()
    const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000)

    // Delete any existing reset tokens for this email
    await db.passwordReset.deleteMany({
      where: { email },
    })

    // Create new reset token
    await db.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Send password reset email
    const emailResult = await EmailService.sendPasswordResetEmail(
      email,
      token,
      user.name || undefined
    )

    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.error)
      // Don't fail the request if email fails
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating password reset request:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Reset password using token
 */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    // Validate token
    const tokenValidation = await validateResetToken(token)
    if (!tokenValidation.valid || !tokenValidation.user) {
      return { success: false, error: tokenValidation.error }
    }

    // Hash new password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await db.user.update({
      where: { id: tokenValidation.user.id },
      data: {
        passwordHash: hashedPassword,
      },
    })

    // Mark token as used
    await db.passwordReset.update({
      where: { token },
      data: { used: true },
    })

    return { success: true }
  } catch (error) {
    console.error('Error resetting password:', error)
    return { success: false, error: 'Internal server error' }
  }
}

/**
 * Clean up expired password reset tokens
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await db.passwordReset.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    })
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error)
  }
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
