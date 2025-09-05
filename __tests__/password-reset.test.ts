import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { generateResetToken, validateResetToken, hashPassword } from '../lib/password-reset'

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}))

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}))

// Mock database
jest.mock('../lib/db', () => ({
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
}))

const mockCrypto = require('crypto')
const mockBcrypt = require('bcrypt')
const mockDb = require('../lib/db')

describe('Password Reset', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('generateResetToken', () => {
    it('should generate a reset token and save to database', async () => {
      const mockToken = Buffer.from('test-token')
      const mockEmail = 'test@example.com'
      const mockExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      mockCrypto.randomBytes.mockReturnValue(mockToken)
      mockDb.passwordReset.create.mockResolvedValue({
        id: 'reset123',
        email: mockEmail,
        token: mockToken.toString('hex'),
        expires: mockExpires,
      })

      const result = await generateResetToken(mockEmail)

      expect(mockCrypto.randomBytes).toHaveBeenCalledWith(32)
      expect(mockDb.passwordReset.create).toHaveBeenCalledWith({
        data: {
          email: mockEmail,
          token: mockToken.toString('hex'),
          expires: expect.any(Date),
        },
      })
      expect(result).toEqual({
        token: mockToken.toString('hex'),
        expires: expect.any(Date),
      })
    })

    it('should handle database errors', async () => {
      const mockEmail = 'test@example.com'
      const mockError = new Error('Database error')

      mockCrypto.randomBytes.mockReturnValue(Buffer.from('test-token'))
      mockDb.passwordReset.create.mockRejectedValue(mockError)

      await expect(generateResetToken(mockEmail)).rejects.toThrow('Database error')
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

      const result = await validateResetToken(mockToken)

      expect(mockDb.passwordReset.findUnique).toHaveBeenCalledWith({
        where: { token: mockToken },
      })
      expect(result).toEqual({
        valid: true,
        user: {
          id: 'reset123',
          email: mockEmail,
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

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const mockPassword = 'testpassword123'
      const mockHashedPassword = 'hashed-password'

      mockBcrypt.hash.mockResolvedValue(mockHashedPassword)

      const result = await hashPassword(mockPassword)

      expect(mockBcrypt.hash).toHaveBeenCalledWith(mockPassword, 12)
      expect(result).toBe(mockHashedPassword)
    })

    it('should handle hashing errors', async () => {
      const mockPassword = 'testpassword123'
      const mockError = new Error('Hashing error')

      mockBcrypt.hash.mockRejectedValue(mockError)

      await expect(hashPassword(mockPassword)).rejects.toThrow('Hashing error')
    })
  })
})
