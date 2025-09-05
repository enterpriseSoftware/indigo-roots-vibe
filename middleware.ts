import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/editor': ['BLOG_EDITOR', 'ADMIN'],
  '/profile': ['USER', 'BLOG_EDITOR', 'ADMIN'],
}

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/api/auth/signin',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/session',
]

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    )

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    // Check role-based access for protected routes
    for (const [route, requiredRoles] of Object.entries(protectedRoutes)) {
      if (pathname.startsWith(route)) {
        const userRole = token.role as string
        
        if (!requiredRoles.includes(userRole as any)) {
          // Redirect to appropriate page based on user role
          if (userRole === 'USER') {
            return NextResponse.redirect(new URL('/profile', req.url))
          } else {
            return NextResponse.redirect(new URL('/', req.url))
          }
        }
        break
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith(route + '/')
        )
        
        if (isPublicRoute) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
