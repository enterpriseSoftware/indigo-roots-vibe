# User Guide - Authentication System

## Getting Started

Welcome to the Indigo Roots Vibe authentication system! This guide will help you understand how to create an account, sign in, and manage your profile.

## Table of Contents

1. [Creating an Account](#creating-an-account)
2. [Signing In](#signing-in)
3. [Password Management](#password-management)
4. [Profile Management](#profile-management)
5. [Session Management](#session-management)
6. [Troubleshooting](#troubleshooting)

## Creating an Account

### Step 1: Visit the Sign Up Page

Navigate to `/signup` or click "Sign up here" on the sign-in page.

### Step 2: Fill Out the Registration Form

**Required Information:**
- **Name**: Your full name (e.g., "John Doe")
- **Email**: A valid email address (e.g., "john@example.com")
- **Password**: Must be at least 8 characters with:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Confirm Password**: Must match your password exactly

**Example:**
```
Name: John Doe
Email: john@example.com
Password: SecurePass123
Confirm Password: SecurePass123
```

### Step 3: Email Verification

After successful registration:
1. Check your email inbox
2. Look for an email from "Indigo Roots Vibe"
3. Click the verification link in the email
4. You'll be redirected to a confirmation page

**Note**: You must verify your email before you can sign in.

## Signing In

### Option 1: Email and Password

1. Go to `/signin`
2. Enter your email and password
3. Check "Remember me for 30 days" if you want to stay signed in
4. Click "Sign In"

### Option 2: Social Login

**Google Sign-In:**
1. Click "Continue with Google"
2. Sign in with your Google account
3. Grant permissions when prompted

**Facebook Sign-In:**
1. Click "Continue with Facebook"
2. Sign in with your Facebook account
3. Grant permissions when prompted

**Note**: Social logins automatically create an account if you don't have one.

## Password Management

### Forgot Your Password?

1. Go to `/forgot-password`
2. Enter your email address
3. Check your email for a password reset link
4. Click the link to go to the reset password page
5. Enter your new password twice
6. Click "Reset Password"

### Password Requirements

Your password must meet these criteria:
- **Minimum 8 characters**
- **At least one uppercase letter** (A-Z)
- **At least one lowercase letter** (a-z)
- **At least one number** (0-9)

**Good Examples:**
- `MyPassword123`
- `SecurePass456`
- `StrongP@ssw0rd`

**Bad Examples:**
- `password` (no uppercase, no numbers)
- `PASSWORD123` (no lowercase)
- `MyPass` (too short)

## Profile Management

### Viewing Your Profile

1. Sign in to your account
2. Go to `/profile`
3. View your account information:
   - Name
   - Email address
   - Role (USER, BLOG_EDITOR, or ADMIN)
   - Profile picture (if using social login)

### Session Information

On your profile page, you can see:
- **Session Status**: Active or Expired
- **Remember Me**: Whether you're using extended sessions
- **Time Remaining**: How long until your session expires
- **Refresh Session**: Button to refresh your session

## Session Management

### Understanding Sessions

**Regular Sessions:**
- Last for 24 hours
- Automatically expire
- Require re-sign-in

**Remember Me Sessions:**
- Last for 30 days
- Stay active across browser restarts
- Automatically refresh when you use the site

### Session Expiry

- **Expiring Soon**: Sessions show a warning when they have less than 1 hour remaining
- **Auto-Refresh**: Sessions automatically refresh when you use the site
- **Manual Refresh**: Use the "Refresh Session" button on your profile page

### Signing Out

1. Go to your profile page
2. Click "Sign Out"
3. You'll be redirected to the home page

## User Roles

### USER
- Basic account access
- Can view and edit profile
- Access to public features

### BLOG_EDITOR
- All USER permissions
- Can create and edit blog posts
- Access to editor dashboard

### ADMIN
- All BLOG_EDITOR permissions
- Full administrative access
- Can manage users and content
- Access to admin dashboard

## Troubleshooting

### Common Issues

**"Invalid email or password"**
- Check that your email is correct
- Ensure your password meets requirements
- Try resetting your password

**"Email not verified"**
- Check your email inbox (including spam folder)
- Click the verification link in the email
- Request a new verification email if needed

**"Session expired"**
- Sign in again
- Check "Remember me" for longer sessions
- Clear browser cookies if issues persist

**"User already exists"**
- Try signing in instead of registering
- Use the "Forgot Password" feature
- Contact support if you can't access your account

### Password Reset Issues

**"Invalid or expired token"**
- Request a new password reset email
- Check that you're using the latest email
- Tokens expire after 1 hour

**"Passwords do not match"**
- Ensure both password fields are identical
- Check for extra spaces or characters
- Try typing the password again

### Email Issues

**Not receiving emails:**
- Check spam/junk folder
- Verify email address is correct
- Wait a few minutes for delivery
- Contact support if still not receiving emails

**Email verification not working:**
- Ensure you're clicking the correct link
- Check that the link hasn't expired
- Try requesting a new verification email

### Browser Issues

**Sign-in not working:**
- Clear browser cookies and cache
- Try a different browser
- Disable browser extensions temporarily
- Check that JavaScript is enabled

**Session keeps expiring:**
- Check your system clock is correct
- Clear browser data
- Try using "Remember me" option
- Contact support if problem persists

## Security Tips

### Password Security
- Use a unique password for this site
- Don't share your password with others
- Change your password regularly
- Use a password manager if possible

### Account Security
- Sign out from shared computers
- Don't check "Remember me" on public computers
- Keep your email account secure
- Report suspicious activity immediately

### Privacy
- Your email is only used for account management
- We don't share your information with third parties
- You can delete your account at any time
- Contact us with privacy concerns

## Getting Help

If you're still having issues:

1. **Check this guide** for common solutions
2. **Try the troubleshooting steps** above
3. **Contact support** with specific error messages
4. **Include details** about what you were trying to do

**Support Information:**
- Email: support@indigorootsvibe.com
- Include your email address and a description of the issue
- Screenshots are helpful if possible

## Account Deletion

To delete your account:
1. Sign in to your account
2. Go to your profile page
3. Contact support to request account deletion
4. Provide your email address for verification

**Note**: Account deletion is permanent and cannot be undone.
