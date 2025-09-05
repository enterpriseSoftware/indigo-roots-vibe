# PRD: Authentication System Enhancements

## Introduction/Overview

Extend the existing NextAuth.js authentication system in Indigo Roots Vibe to provide a more complete user experience. Currently, the app has basic authentication with role-based access control. This enhancement adds OAuth providers (Google, Facebook), user registration flows, and password reset functionality to create a production-ready authentication system suitable for a band's fan community.

**Problem**: The current auth system only supports sign-in but lacks user registration, password recovery, and popular OAuth options that fans expect in modern web applications.

**Goal**: Transform the existing basic auth into a comprehensive system that reduces friction for new users while maintaining security and role-based access.

## Goals

1. **Reduce User Friction**: Enable quick sign-up via Google/Facebook OAuth
2. **Self-Service Registration**: Allow users to create accounts without admin intervention
3. **Password Recovery**: Provide secure password reset functionality
4. **Enhanced User Experience**: Improve existing auth flows with better UX
5. **Maintain Security**: Keep existing role-based access control intact
6. **Production Ready**: Ensure all flows work in deployed environment

## User Stories

### OAuth Integration

- **As a Fan**, I want to sign in with Google so I can quickly access the site without creating another password
- **As a Fan**, I want to sign in with Facebook so I can use my existing social account
- **As a New User**, I want OAuth sign-in to automatically create my account with USER role

### User Registration

- **As a New Fan**, I want to create an account with email/password so I can access member features
- **As a New User**, I want clear feedback during registration so I know if my account was created successfully
- **As a Site Owner**, I want new registrations to default to USER role for security

### Password Reset

- **As a Forgetful User**, I want to reset my password via email so I can regain access to my account
- **As a User**, I want password reset links to expire for security
- **As a User**, I want confirmation when my password is successfully changed

### Enhanced UX

- **As a User**, I want better error messages so I understand what went wrong
- **As a User**, I want loading states during auth operations so I know the system is working
- **As a Returning User**, I want to be redirected to where I was trying to go after login

## Functional Requirements

### 1. OAuth Provider Integration

1.1. Configure Google OAuth provider in NextAuth.js
1.2. Configure Facebook OAuth provider in NextAuth.js  
1.3. Add OAuth sign-in buttons to existing sign-in page
1.4. Auto-create user accounts with USER role on first OAuth sign-in
1.5. Link OAuth accounts to existing email accounts when emails match
1.6. Handle OAuth errors gracefully with user-friendly messages

### 2. User Registration System

2.1. Create `/signup` page with email/password form
2.2. Implement email validation (format + uniqueness check)
2.3. Implement password strength requirements (min 8 chars, mixed case, numbers)
2.4. Hash passwords securely before database storage
2.5. Send welcome email after successful registration
2.6. Redirect to appropriate page after registration
2.7. Prevent duplicate accounts with same email

### 3. Password Reset Functionality

3.1. Create "Forgot Password" link on sign-in page
3.2. Create `/forgot-password` page with email input
3.3. Generate secure password reset tokens (expire in 1 hour)
3.4. Send password reset emails with secure links
3.5. Create `/reset-password/[token]` page for password update
3.6. Validate reset tokens and expiration
3.7. Update password and invalidate reset token
3.8. Show success/error messages throughout flow

### 4. Enhanced Auth UX

4.1. Add loading spinners to all auth forms
4.2. Improve error message display and clarity
4.3. Add form validation with real-time feedback
4.4. Implement redirect after login to original destination
4.5. Add "Remember me" functionality for longer sessions
4.6. Show user-friendly success messages

### 5. Email Integration

5.1. Configure email service (Resend or SendGrid)
5.2. Create email templates for welcome and password reset
5.3. Handle email delivery failures gracefully
5.4. Ensure emails work in production environment

## Non-Goals (Out of Scope)

- **Two-Factor Authentication** - Can be added in future iterations
- **Account Deletion** - Not needed for MVP enhancement
- **Profile Picture Upload** - Separate feature for later
- **Email Verification** - Optional for initial release
- **Additional OAuth Providers** (Twitter, Discord, etc.) - Focus on Google/Facebook first
- **Admin User Management** - Keep existing role system unchanged
- **Password History** - Not required for band website use case

## Design Considerations

### UI/UX Requirements

- Use existing ShadCN UI components for consistency
- Follow current Indigo brand colors and typography
- Ensure mobile-responsive design
- Add smooth transitions and loading states
- Use existing form validation patterns

### Email Templates

- Match band branding with purple/indigo theme
- Include clear call-to-action buttons
- Ensure compatibility across email clients
- Keep text concise and action-oriented

## Technical Considerations

### NextAuth.js Configuration

- Extend existing `authOptions` in `/app/api/auth/[...nextauth]/route.ts`
- Configure OAuth providers with proper scopes
- Maintain existing JWT and session callbacks
- Keep current role-based access middleware

### Database Changes

- Add `emailVerified` field to User model (for future use)
- Add `PasswordReset` model for reset tokens
- Ensure existing Prisma schema compatibility

### Environment Variables

```env
# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Email Service (Resend)
RESEND_API_KEY=
FROM_EMAIL=noreply@indigorootsvibe.com

# OAuth Scopes
GOOGLE_SCOPES=email,profile,picture
FACEBOOK_SCOPES=email,public_profile
```

### Security Considerations

- Use secure random tokens for password reset
- Implement rate limiting on password reset requests
- Sanitize all user inputs
- Ensure HTTPS in production for OAuth callbacks

## Success Metrics

1. **User Adoption**: 40% of new users sign up via OAuth within first month
2. **Registration Completion**: 85% completion rate on new user registration flow
3. **Password Reset Usage**: <5% of users need password reset per month (indicating good UX)
4. **Error Reduction**: 90% reduction in auth-related support requests
5. **Performance**: All auth operations complete within 2 seconds
6. **Security**: Zero security incidents related to auth system

## Open Questions - RESOLVED

1. **Email Service**: ✅ **Resend** - Simpler setup and good for band website needs
2. **OAuth Scope**: ✅ **Email, name, profile photo** - Essential data for fan profiles and personalization
3. **Welcome Email**: ✅ **Yes** - Include band info, upcoming events, and getting started guide
4. **Password Requirements**: ✅ **8+ characters minimum** - Good balance of security and usability
5. **Session Duration**: ✅ **30-day "Remember me"** - Better user experience for returning fans

## Implementation Priority

### Phase 1 (High Priority)

- User registration page and flow
- Password reset functionality
- Enhanced error handling and UX

### Phase 2 (Medium Priority)

- Google OAuth integration
- Email service setup and templates
- Welcome email flow

### Phase 3 (Lower Priority)

- Facebook OAuth integration
- "Remember me" functionality
- Advanced form validation

---

**Next Steps**: All questions resolved! Ready to use `generate tasks` to create implementation plan.
