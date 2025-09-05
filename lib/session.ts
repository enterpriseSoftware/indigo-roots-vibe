import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { UserRole } from './auth'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
  image?: string | null
}

export interface SessionInfo {
  user: SessionUser
  expires: string
  isExpired: boolean
  timeUntilExpiry: number
  isRememberMe: boolean
}

/**
 * Get the current server-side session
 */
export async function getCurrentSession(): Promise<SessionInfo | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return null
    }

    const now = new Date()
    const expires = new Date(session.expires)
    const isExpired = expires < now
    const timeUntilExpiry = Math.max(0, expires.getTime() - now.getTime())
    
    // Check if this is a "Remember Me" session (30 days)
    const isRememberMe = timeUntilExpiry > 7 * 24 * 60 * 60 * 1000 // More than 7 days

    return {
      user: session.user as SessionUser,
      expires: session.expires,
      isExpired,
      timeUntilExpiry,
      isRememberMe,
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const session = await getCurrentSession()
  if (!session) return false

  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    BLOG_EDITOR: 2,
    ADMIN: 3,
  }

  return roleHierarchy[session.user.role] >= roleHierarchy[requiredRole]
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession()
  return session !== null && !session.isExpired
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN')
}

/**
 * Check if user is blog editor or admin
 */
export async function isEditor(): Promise<boolean> {
  return hasRole('BLOG_EDITOR')
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getCurrentSession()
  return session?.user.role || null
}

/**
 * Get user ID
 */
export async function getUserId(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user.id || null
}

/**
 * Get user email
 */
export async function getUserEmail(): Promise<string | null> {
  const session = await getCurrentSession()
  return session?.user.email || null
}

/**
 * Check if session is about to expire (within 1 hour)
 */
export async function isSessionExpiringSoon(): Promise<boolean> {
  const session = await getCurrentSession()
  if (!session) return false

  const oneHour = 60 * 60 * 1000
  return session.timeUntilExpiry < oneHour && session.timeUntilExpiry > 0
}

/**
 * Get session expiry information
 */
export async function getSessionExpiryInfo(): Promise<{
  expiresAt: Date | null
  timeUntilExpiry: number
  isExpired: boolean
  isExpiringSoon: boolean
  isRememberMe: boolean
} | null> {
  const session = await getCurrentSession()
  if (!session) return null

  const expiresAt = new Date(session.expires)
  const oneHour = 60 * 60 * 1000
  const isExpiringSoon = session.timeUntilExpiry < oneHour && session.timeUntilExpiry > 0

  return {
    expiresAt,
    timeUntilExpiry: session.timeUntilExpiry,
    isExpired: session.isExpired,
    isExpiringSoon,
    isRememberMe: session.isRememberMe,
  }
}

/**
 * Format time until expiry for display
 */
export function formatTimeUntilExpiry(timeUntilExpiry: number): string {
  if (timeUntilExpiry <= 0) return 'Expired'
  
  const days = Math.floor(timeUntilExpiry / (24 * 60 * 60 * 1000))
  const hours = Math.floor((timeUntilExpiry % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((timeUntilExpiry % (60 * 60 * 1000)) / (60 * 1000))

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  }
}

/**
 * Session validation for API routes
 */
export async function validateSession(): Promise<{
  isValid: boolean
  user?: SessionUser
  error?: string
}> {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return {
        isValid: false,
        error: 'No active session'
      }
    }

    if (session.isExpired) {
      return {
        isValid: false,
        error: 'Session has expired'
      }
    }

    return {
      isValid: true,
      user: session.user
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return {
      isValid: false,
      error: 'Session validation failed'
    }
  }
}