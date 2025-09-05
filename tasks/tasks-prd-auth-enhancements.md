## Relevant Files

- `lib/auth.ts` - NextAuth configuration and role utilities
- `prisma/schema.prisma` - Database schema with User, Account, Session models
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API route
- `app/signin/page.tsx` - Current sign-in page
- `lib/session.ts` - Session utilities
- `types/next-auth.d.ts` - NextAuth type definitions
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variables template

## Tasks

- [ ] 1.0 Database Schema Updates
  - [x] 1.1 Add PasswordReset model to Prisma schema for password reset tokens
  - [ ] 1.2 Add emailVerified field to User model (already exists, verify)
  - [ ] 1.3 Run Prisma migration to update database schema
  - [ ] 1.4 Update Prisma client generation

- [ ] 2.0 Email Service Setup
  - [ ] 2.1 Install Resend package for email functionality
  - [ ] 2.2 Create email service utility in `lib/email.ts`
  - [ ] 2.3 Create email templates for welcome and password reset
  - [ ] 2.4 Add Resend environment variables to `.env.example`
  - [ ] 2.5 Test email service configuration

- [ ] 3.0 User Registration System
  - [ ] 3.1 Create `/signup` page with email/password form using ShadCN UI
  - [ ] 3.2 Implement email validation (format + uniqueness check)
  - [ ] 3.3 Implement password strength validation (8+ chars, mixed case, numbers)
  - [ ] 3.4 Create user registration API endpoint `/api/auth/register`
  - [ ] 3.5 Add password hashing with bcrypt in registration flow
  - [ ] 3.6 Implement duplicate email prevention
  - [ ] 3.7 Add loading states and error handling to signup form
  - [ ] 3.8 Send welcome email after successful registration
  - [ ] 3.9 Add "Sign Up" link to existing sign-in page

- [ ] 4.0 Password Reset Functionality
  - [ ] 4.1 Create "Forgot Password" link on sign-in page
  - [ ] 4.2 Create `/forgot-password` page with email input form
  - [ ] 4.3 Create password reset API endpoint `/api/auth/forgot-password`
  - [ ] 4.4 Generate secure password reset tokens with 1-hour expiration
  - [ ] 4.5 Create `/reset-password/[token]` page for password update
  - [ ] 4.6 Create password reset API endpoint `/api/auth/reset-password`
  - [ ] 4.7 Validate reset tokens and handle expiration
  - [ ] 4.8 Update password and invalidate reset token
  - [ ] 4.9 Add success/error message handling throughout flow
  - [ ] 4.10 Implement rate limiting on password reset requests

- [ ] 5.0 OAuth Provider Integration
  - [ ] 5.1 Install NextAuth OAuth providers (Google, Facebook)
  - [ ] 5.2 Configure Google OAuth provider in `lib/auth.ts`
  - [ ] 5.3 Configure Facebook OAuth provider in `lib/auth.ts`
  - [ ] 5.4 Add OAuth sign-in buttons to sign-in page
  - [ ] 5.5 Implement auto-account creation for OAuth users with USER role
  - [ ] 5.6 Handle OAuth account linking for existing email accounts
  - [ ] 5.7 Add OAuth error handling with user-friendly messages
  - [ ] 5.8 Test OAuth flows in development environment

- [ ] 6.0 Enhanced Authentication UX
  - [ ] 6.1 Add loading spinners to all auth forms
  - [ ] 6.2 Improve error message display and clarity
  - [ ] 6.3 Add real-time form validation feedback
  - [ ] 6.4 Implement redirect after login to original destination
  - [ ] 6.5 Add "Remember me" functionality with 30-day sessions
  - [ ] 6.6 Show user-friendly success messages
  - [ ] 6.7 Add form field validation with visual feedback
  - [ ] 6.8 Improve mobile responsiveness of auth forms

- [ ] 7.0 NextAuth Configuration Updates
  - [ ] 7.1 Extend existing `authOptions` with OAuth providers
  - [ ] 7.2 Update JWT callback to handle OAuth user data
  - [ ] 7.3 Update session callback to include OAuth profile data
  - [ ] 7.4 Configure OAuth scopes (email, profile, picture)
  - [ ] 7.5 Add OAuth provider environment variables
  - [ ] 7.6 Test NextAuth configuration with all providers

- [ ] 8.0 Environment Configuration
  - [ ] 8.1 Add Google OAuth credentials to environment variables
  - [ ] 8.2 Add Facebook OAuth credentials to environment variables
  - [ ] 8.3 Add Resend API key to environment variables
  - [ ] 8.4 Update `.env.example` with all new variables
  - [ ] 8.5 Configure production environment variables in Vercel
  - [ ] 8.6 Test environment configuration in development

- [ ] 9.0 Testing Implementation
  - [ ] 9.1 Create unit tests for email service utilities
  - [ ] 9.2 Create unit tests for password reset token generation
  - [ ] 9.3 Create unit tests for OAuth account creation logic
  - [ ] 9.4 Create integration tests for registration flow
  - [ ] 9.5 Create integration tests for password reset flow
  - [ ] 9.6 Create smoke tests for OAuth sign-in flows
  - [ ] 9.7 Test all auth flows in production environment

- [ ] 10.0 Documentation and Deployment
  - [ ] 10.1 Update README.md with new auth features
  - [ ] 10.2 Document OAuth provider setup instructions
  - [ ] 10.3 Document email service configuration
  - [ ] 10.4 Update environment variables documentation
  - [ ] 10.5 Test all features in production deployment
  - [ ] 10.6 Verify email delivery in production
  - [ ] 10.7 Test OAuth flows in production environment
  - [ ] 10.8 Create user guide for new auth features

- [ ] 11.0 Security and Performance
  - [ ] 11.1 Implement rate limiting on auth endpoints
  - [ ] 11.2 Add CSRF protection to auth forms
  - [ ] 11.3 Validate all user inputs and sanitize data
  - [ ] 11.4 Ensure HTTPS enforcement in production
  - [ ] 11.5 Test security headers and configurations
  - [ ] 11.6 Optimize auth flow performance
  - [ ] 11.7 Add monitoring for auth-related errors

- [ ] 12.0 Final Integration and Testing
  - [ ] 12.1 Run full test suite to ensure no regressions
  - [ ] 12.2 Test all auth flows end-to-end
  - [ ] 12.3 Verify role-based access control still works
  - [ ] 12.4 Test email delivery and templates
  - [ ] 12.5 Verify OAuth providers work correctly
  - [ ] 12.6 Test password reset flow completely
  - [ ] 12.7 Validate user registration process
  - [ ] 12.8 Deploy to production and verify all features
