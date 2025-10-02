import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { generateResetToken, validateResetToken, createPasswordResetRequest } from '../lib/password-reset'

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    passwordReset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}))

// Mock database
jest.mock('../lib/db', () => ({
  db: {
    passwordReset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

const mockCrypto = require('crypto')
const mockBcrypt = require('bcrypt')
const mockDb = require('../lib/db').db

describe('Password Reset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('generateResetToken', () => {
    it('should generate a reset token', () => {
      const mockToken = Buffer.from('test-token')
      mockCrypto.randomBytes.mockReturnValue(mockToken)

      const result = generateResetToken()

      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32)
      expect(result).toBe(mockToken.toString('hex'))
    })
  })

  describe('validateResetToken', () => {
    it('should validate a valid token', async () => {
      const mockToken = 'valid-token'
      const mockEmail = 'test@example.com'
      const mockExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      mockDb.passwordReset.findUnique.mockResolvedValue({
        id: 'reset123',
        email: mockEmail,
        token: mockToken,
        expires: mockExpires,
        used: false,
      })

      mockDb.user.findUnique.mockResolvedValue({
        id: 'reset123',
        email: mockEmail,
        name: 'Test User',
      })

      const result = await validateResetToken(mockToken)

      expect(mockDb.passwordReset.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken },
      })
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockEmail },
        select: { id: true, email: true, name: true },
      })
      expect(result).toEqual({
        valid: true,
        user: {
          id: 'reset123',
          email: mockEmail,
          name: 'Test User',
        },
      })
    })

    it('should reject expired token', async () => {
      const mockToken = 'expired-token'
      const mockEmail = 'test@example.com'
      const mockExpires = new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago

      mockDb.passwordReset.findUnique.mockResolvedValue({
        id: 'reset123',
        email: mockEmail,
        token: mockToken,
        expires: mockExpires,
        used: false,
      })

      const result = await validateResetToken(mockToken)

      expect(result).toEqual({
        valid: false,
        error: 'Token has expired',
      })
    })

    it('should reject used token', async () => {
      const mockToken = 'used-token'
      const mockEmail = 'test@example.com'
      const mockExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

      mockDb.passwordReset.findUnique.mockResolvedValue({
        id: 'reset123',
        email: mockEmail,
        token: mockToken,
        expires: mockExpires,
        used: true,
      })

      const result = await validateResetToken(mockToken)

      expect(result).toEqual({
        valid: false,
        error: 'Token has already been used',
      })
    })

    it('should reject non-existent token', async () => {
      const mockToken = 'non-existent-token'

      mockDb.passwordReset.findUnique.mockResolvedValue(null)

      const result = await validateResetToken(mockToken)

      expect(result).toEqual({
        valid: false,
        error: 'Invalid token',
      })
    })
  })

})
