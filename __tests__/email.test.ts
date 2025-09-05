import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { EmailService } from '../lib/email'

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  }
})

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
      const mockResend = require('resend')
      const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email123' }, error: null })
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.sendPasswordResetEmail(
        'test@example.com',
        'reset-token-123',
        'Test User'
      )

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: ['test@example.com'],
        subject: expect.stringContaining('Reset Your Password'),
        html: expect.stringContaining('reset-token-123'),
        text: expect.stringContaining('reset-token-123'),
      })
    })

    it('should handle missing API key', async () => {
      process.env.RESEND_API_KEY = ''

      const result = await EmailService.sendPasswordResetEmail(
        'test@example.com',
        'reset-token-123',
        'Test User'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('RESEND_API_KEY is not configured')
    })

    it('should handle email sending errors', async () => {
      const mockResend = require('resend')
      const mockSend = jest.fn().mockRejectedValue(new Error('Email sending failed'))
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.sendPasswordResetEmail(
        'test@example.com',
        'reset-token-123',
        'Test User'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email sending failed')
    })
  })

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const mockResend = require('resend')
      const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email123' }, error: null })
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User'
      )

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: ['test@example.com'],
        subject: expect.stringContaining('Welcome to Indigo Roots'),
        html: expect.stringContaining('Test User'),
        text: expect.stringContaining('Test User'),
      })
    })

    it('should handle missing API key', async () => {
      process.env.RESEND_API_KEY = ''

      const result = await EmailService.sendWelcomeEmail(
        'test@example.com',
        'Test User'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('RESEND_API_KEY is not configured')
    })
  })

  describe('sendEmailVerification', () => {
    it('should send email verification successfully', async () => {
      const mockResend = require('resend')
      const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email123' }, error: null })
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.sendEmailVerification(
        'test@example.com',
        'verification-token-123',
        'Test User'
      )

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: ['test@example.com'],
        subject: expect.stringContaining('Verify Your Email'),
        html: expect.stringContaining('verification-token-123'),
        text: expect.stringContaining('verification-token-123'),
      })
    })

    it('should handle missing API key', async () => {
      process.env.RESEND_API_KEY = ''

      const result = await EmailService.sendEmailVerification(
        'test@example.com',
        'verification-token-123',
        'Test User'
      )

      expect(result.success).toBe(false)
      expect(result.error).toBe('RESEND_API_KEY is not configured')
    })
  })

  describe('testEmailService', () => {
    it('should test email service successfully', async () => {
      const mockResend = require('resend')
      const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email123' }, error: null })
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.testEmailService()

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: ['test@example.com'],
        subject: 'Test Email from Indigo Roots',
        html: expect.stringContaining('This is a test email'),
        text: expect.stringContaining('This is a test email'),
      })
    })

    it('should handle test email errors', async () => {
      const mockResend = require('resend')
      const mockSend = jest.fn().mockRejectedValue(new Error('Test email failed'))
      mockResend.Resend.mockImplementation(() => ({
        emails: { send: mockSend },
      }))

      const result = await EmailService.testEmailService()

      expect(result.success).toBe(false)
      expect(result.error).toBe('Test email failed')
    })
  })
})
