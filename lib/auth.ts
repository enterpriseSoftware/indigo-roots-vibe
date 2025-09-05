import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { db } from './db'
import bcrypt from 'bcryptjs'

// User roles as string constants
export const USER_ROLES = {
  USER: 'USER',
  BLOG_EDITOR: 'BLOG_EDITOR', 
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),
    
    // Facebook OAuth Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'email,public_profile',
        },
      },
    }),
    
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days for "Remember Me"
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days for "Remember Me"
  },
  callbacks: {
    async signIn({ user: _user, account, profile: _profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        return true
      }
      
      // For credentials, check if user exists and password is valid
      if (account?.provider === 'credentials') {
        return true
      }
      
      return false
    },
    
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        // Handle OAuth providers
        if (account.provider === 'google' || account.provider === 'facebook') {
          // Check if user exists in database
          let dbUser = await db.user.findUnique({
            where: { email: user.email! },
          })
          
          // Create user if doesn't exist
          if (!dbUser) {
            dbUser = await db.user.create({
              data: {
                email: user.email!,
                name: user.name || profile?.name || '',
                image: user.image || profile?.picture || profile?.image_url || '',
                emailVerified: new Date(),
                role: 'USER', // Default role for OAuth users
              },
            })
          } else {
            // Update existing user with OAuth data
            dbUser = await db.user.update({
              where: { id: dbUser.id },
              data: {
                name: user.name || profile?.name || dbUser.name,
                image: user.image || profile?.picture || profile?.image_url || dbUser.image,
                emailVerified: new Date(),
              },
            })
          }
          
          return {
            ...token,
            sub: dbUser.id,
            role: dbUser.role as UserRole,
            email: dbUser.email,
            name: dbUser.name,
            picture: dbUser.image,
          }
        }
        
        // Handle credentials provider
        if (account.provider === 'credentials') {
          return {
            ...token,
            sub: user.id,
            role: user.role as UserRole,
            email: user.email,
            name: user.name,
          }
        }
      }
      
      return token
    },
    
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as UserRole
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Utility functions for role checking
export const isAdmin = (role: UserRole) => role === USER_ROLES.ADMIN
export const isBlogEditor = (role: UserRole) =>
  role === USER_ROLES.BLOG_EDITOR || role === USER_ROLES.ADMIN
export const isUser = (role: UserRole) =>
  role === USER_ROLES.USER ||
  role === USER_ROLES.BLOG_EDITOR ||
  role === USER_ROLES.ADMIN
