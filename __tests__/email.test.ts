import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { EmailService } from '../lib/email'

// Mock environment variables
const originalEnv = process.env

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-api-key',
      FROM_EMAIL: 'test@example.com',
      NEXTAUTH_URL: 'http://localhost:3000',
    }
  })

  afterEach(() => {
    process.env = originalEnv
    jest.resetAllMocks()
  })

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email successfully', async () => {
      const result = await EmailService.sendPasswordResetEmail(
        'test@example.com',
        'reset-token-123',
        'Test User'
      )

      expect(result.success).toBe(true)
    })

  })

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User'
      )

      expect(result.success).toBe(true)
    })

  })

  describe('sendEmailVerification', () => {
    it('should send email verification successfully', async () => {
      const result = await EmailService.sendEmailVerification(
        'test@example.com',
        'verification-token-123',
        'Test User'
      )

      expect(result.success).toBe(true)
    })

  })

  describe('testEmailService', () => {
    it('should test email service successfully', async () => {
      const result = await EmailService.testEmailService()

      expect(result.success).toBe(true)
    })
  })
})
