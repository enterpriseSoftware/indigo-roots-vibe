import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'

// Mock Next.js request/response
const mockRequest = (body: any = {}, headers: any = {}) => ({
  json: jest.fn().mockResolvedValue(body),
  text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  headers: {
    get: jest.fn((key: string) => headers[key]),
    ...headers,
  },
})

const mockResponse = () => {
  const res: any = {
    json: jest.fn().mockReturnValue(res),
    status: jest.fn().mockReturnValue(res),
  }
  return res
}

// Mock dependencies
jest.mock('../lib/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  passwordReset: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  verificationToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('../lib/email', () => ({
  EmailService: {
    sendPasswordResetEmail: jest.fn(),
    sendWelcomeEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
  },
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}))

const mockDb = require('../lib/db')
const mockEmailService = require('../lib/email').EmailService
const mockBcrypt = require('bcrypt')
const mockCrypto = require('crypto')

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email for existing user', async () => {
      const { POST } = require('../app/api/auth/forgot-password/route')
      
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      }

      mockDb.user.findUnique.mockResolvedValue(mockUser)
      mockCrypto.randomBytes.mockReturnValue(Buffer.from('test-token'))
      mockDb.passwordReset.create.mockResolvedValue({
        id: 'reset123',
        email: 'test@example.com',
        token: 'test-token',
        expires: new Date(),
      })
      mockEmailService.sendPasswordResetEmail.mockResolvedValue({ success: true })

      const req = mockRequest({ email: 'test@example.com' })
      const res = mockResponse()

      await POST(req)

      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com',
        'test-token',
        'Test User'
      )
    })

    it('should return error for non-existent user', async () => {
      const { POST } = require('../app/api/auth/forgot-password/route')
      
      mockDb.user.findUnique.mockResolvedValue(null)

      const req = mockRequest({ email: 'nonexistent@example.com' })
      const res = mockResponse()

      const result = await POST(req)

      expect(result.status).toHaveBeenCalledWith(404)
      expect(result.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
      })
    })

    it('should handle validation errors', async () => {
      const { POST } = require('../app/api/auth/forgot-password/route')

      const req = mockRequest({ email: 'invalid-email' })
      const res = mockResponse()

      const result = await POST(req)

      expect(result.status).toHaveBeenCalledWith(400)
      expect(result.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid email format',
      })
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register new user successfully', async () => {
      const { POST } = require('../app/api/auth/register/route')
      
      mockDb.user.findUnique.mockResolvedValue(null) // User doesn't exist
      mockBcrypt.hash.mockResolvedValue('hashed-password')
      mockDb.user.create.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      })
      mockCrypto.randomBytes.mockReturnValue(Buffer.from('verification-token'))
      mockDb.verificationToken.create.mockResolvedValue({
        token: 'verification-token',
        identifier: 'test@example.com',
        expires: new Date(),
      })
      mockEmailService.sendEmailVerification.mockResolvedValue({ success: true })

      const req = mockRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      const res = mockResponse()

      const result = await POST(req)

      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed-password',
          role: 'USER',
        },
      })
      expect(mockEmailService.sendEmailVerification).toHaveBeenCalledWith(
        'test@example.com',
        'verification-token',
        'Test User'
      )
    })

    it('should return error for existing user', async () => {
      const { POST } = require('../app/api/auth/register/route')
      
      mockDb.user.findUnique.mockResolvedValue({
        id: 'user123',
        email: 'test@example.com',
      })

      const req = mockRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      const res = mockResponse()

      const result = await POST(req)

      expect(result.status).toHaveBeenCalledWith(400)
      expect(result.json).toHaveBeenCalledWith({
        success: false,
        error: 'User already exists',
      })
    })

    it('should validate password confirmation', async () => {
      const { POST } = require('../app/api/auth/register/route')

      const req = mockRequest({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different-password',
      })
      const res = mockResponse()

      const result = await POST(req)

      expect(result.status).toHaveBeenCalledWith(400)
      expect(result.json).toHaveBeenCalledWith({
        success: false,
        error: 'Passwords do not match',
      })
    })
  })

  describe('GET /api/auth/session', () => {
    it('should return session info for authenticated user', async () => {
      const { GET } = require('../app/api/auth/session/route')
      
      // Mock getCurrentSession
      jest.doMock('../lib/session', () => ({
        getCurrentSession: jest.fn().mockResolvedValue({
          user: {
            id: 'user123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'USER',
            image: null,
          },
          expires: '2024-12-31T23:59:59.000Z',
          isExpired: false,
          timeUntilExpiry: 86400000,
          isRememberMe: true,
        }),
        getSessionExpiryInfo: jest.fn().mockResolvedValue({
          expiresAt: new Date('2024-12-31T23:59:59.000Z'),
          timeUntilExpiry: 86400000,
          isExpired: false,
          isExpiringSoon: false,
          isRememberMe: true,
        }),
        formatTimeUntilExpiry: jest.fn().mockReturnValue('1 day'),
      }))

      const req = mockRequest()
      const res = mockResponse()

      const result = await GET(req)

      expect(result.json).toHaveBeenCalledWith({
        success: true,
        session: expect.objectContaining({
          user: expect.objectContaining({
            id: 'user123',
            email: 'test@example.com',
            name: 'Test User',
            role: 'USER',
          }),
        }),
      })
    })

    it('should return error for unauthenticated user', async () => {
      const { GET } = require('../app/api/auth/session/route')
      
      // Mock getCurrentSession to return null
      jest.doMock('../lib/session', () => ({
        getCurrentSession: jest.fn().mockResolvedValue(null),
      }))

      const req = mockRequest()
      const res = mockResponse()

      const result = await GET(req)

      expect(result.status).toHaveBeenCalledWith(401)
      expect(result.json).toHaveBeenCalledWith({
        success: false,
        error: 'No active session',
      })
    })
  })
})
