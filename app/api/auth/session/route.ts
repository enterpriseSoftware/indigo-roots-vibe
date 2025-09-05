import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSession, getSessionExpiryInfo, formatTimeUntilExpiry } from '@/lib/session'

// GET endpoint to get current session info
export async function GET(_request: NextRequest) {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No active session' 
        },
        { status: 401 }
      )
    }

    const expiryInfo = await getSessionExpiryInfo()
    
    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          image: session.user.image,
        },
        expires: session.expires,
        isExpired: session.isExpired,
        timeUntilExpiry: session.timeUntilExpiry,
        timeUntilExpiryFormatted: formatTimeUntilExpiry(session.timeUntilExpiry),
        isRememberMe: session.isRememberMe,
        expiryInfo: expiryInfo ? {
          expiresAt: expiryInfo.expiresAt,
          timeUntilExpiry: expiryInfo.timeUntilExpiry,
          isExpired: expiryInfo.isExpired,
          isExpiringSoon: expiryInfo.isExpiringSoon,
          isRememberMe: expiryInfo.isRememberMe,
        } : null,
      }
    })

  } catch (error) {
    console.error('Session info error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST endpoint to refresh session (if needed)
export async function POST(_request: NextRequest) {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No active session to refresh' 
        },
        { status: 401 }
      )
    }

    if (session.isExpired) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Session has expired' 
        },
        { status: 401 }
      )
    }

    // Session is still valid, return current info
    const expiryInfo = await getSessionExpiryInfo()
    
    return NextResponse.json({
      success: true,
      message: 'Session is valid',
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          image: session.user.image,
        },
        expires: session.expires,
        isExpired: session.isExpired,
        timeUntilExpiry: session.timeUntilExpiry,
        timeUntilExpiryFormatted: formatTimeUntilExpiry(session.timeUntilExpiry),
        isRememberMe: session.isRememberMe,
        expiryInfo: expiryInfo ? {
          expiresAt: expiryInfo.expiresAt,
          timeUntilExpiry: expiryInfo.timeUntilExpiry,
          isExpired: expiryInfo.isExpired,
          isExpiringSoon: expiryInfo.isExpiringSoon,
          isRememberMe: expiryInfo.isRememberMe,
        } : null,
      }
    })

  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
