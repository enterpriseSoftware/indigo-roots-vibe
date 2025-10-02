import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { getCurrentSession, hasRole, isAuthenticated, isAdmin, isEditor, getUserRole, getUserId, getUserEmail } from '../lib/session'
import { UserRole } from '../lib/auth'

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock database
jest.mock('../lib/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}))

const mockGetServerSession = require('next-auth').getServerSession

describe('Session Management', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getCurrentSession', () => {
    it('should return null when no session exists', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getCurrentSession()
      expect(result).toBeNull()
    })

    it('should return session info when session exists', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
          image: 'https://example.com/avatar.jpg',
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentSession()
      
      expect(result).toEqual({
        user: mockSession.user,
        expires: mockSession.expires,
        isExpired: false,
        timeUntilExpiry: expect.any(Number),
        isRememberMe: true, // 30 days is > 7 days
      })
    })

    it('should detect expired session', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: pastDate,
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getCurrentSession()
      
      expect(result?.isExpired).toBe(true)
    })
  })

  describe('hasRole', () => {
    it('should return true for matching role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await hasRole('ADMIN')
      expect(result).toBe(true)
    })

    it('should return true for higher role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await hasRole('BLOG_EDITOR')
      expect(result).toBe(true)
    })

    it('should return false for lower role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await hasRole('ADMIN')
      expect(result).toBe(false)
    })

    it('should return false when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await hasRole('USER')
      expect(result).toBe(false)
    })
  })

  describe('isAuthenticated', () => {
    it('should return true for valid session', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isAuthenticated()
      expect(result).toBe(true)
    })

    it('should return false for expired session', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: pastDate,
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isAuthenticated()
      expect(result).toBe(false)
    })

    it('should return false when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await isAuthenticated()
      expect(result).toBe(false)
    })
  })

  describe('isAdmin', () => {
    it('should return true for admin role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isAdmin()
      expect(result).toBe(true)
    })

    it('should return false for non-admin role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isAdmin()
      expect(result).toBe(false)
    })
  })

  describe('isEditor', () => {
    it('should return true for editor role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'BLOG_EDITOR' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isEditor()
      expect(result).toBe(true)
    })

    it('should return true for admin role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isEditor()
      expect(result).toBe(true)
    })

    it('should return false for user role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await isEditor()
      expect(result).toBe(false)
    })
  })

  describe('getUserRole', () => {
    it('should return user role', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getUserRole()
      expect(result).toBe('ADMIN')
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getUserRole()
      expect(result).toBeNull()
    })
  })

  describe('getUserId', () => {
    it('should return user ID', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getUserId()
      expect(result).toBe('user123')
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getUserId()
      expect(result).toBeNull()
    })
  })

  describe('getUserEmail', () => {
    it('should return user email', async () => {
      const mockSession = {
        user: {
          id: 'user123',
          email: 'test@example.com',
          name: 'Test User',
          role: 'USER' as UserRole,
        },
        expires: '2024-12-31T23:59:59.000Z',
      }

      mockGetServerSession.mockResolvedValue(mockSession)

      const result = await getUserEmail()
      expect(result).toBe('test@example.com')
    })

    it('should return null when no session', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const result = await getUserEmail()
      expect(result).toBeNull()
    })
  })
})
