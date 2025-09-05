# Authentication API Documentation

## Overview

This document describes the authentication API endpoints for the Indigo Roots Vibe application. The API provides user registration, login, password reset, email verification, and session management functionality.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`

## Authentication

Most endpoints require authentication via NextAuth.js JWT tokens. Include the session token in requests where required.

## Endpoints

### 1. User Registration

**POST** `/api/auth/register`

Register a new user account.

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

#### Validation Rules

- `name`: Required, string, max 255 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, must contain uppercase, lowercase, and number
- `confirmPassword`: Required, must match password

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": "user123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 2. Email Verification

**GET** `/api/auth/verify-email?token=verification_token`

Verify user email address using token sent during registration.

#### Query Parameters

- `token`: Required, verification token from email

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

### 3. Password Reset Request

**POST** `/api/auth/forgot-password`

Request a password reset email.

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Error (404)**
```json
{
  "success": false,
  "error": "User not found"
}
```

### 4. Password Reset

**POST** `/api/auth/reset-password`

Reset password using token from email.

#### Request Body

```json
{
  "token": "reset_token_123",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "Invalid token or validation error"
}
```

### 5. Session Information

**GET** `/api/auth/session`

Get current session information (requires authentication).

#### Response

**Success (200)**
```json
{
  "success": true,
  "session": {
    "user": {
      "id": "user123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "USER",
      "image": "https://example.com/avatar.jpg"
    },
    "expires": "2024-12-31T23:59:59.000Z",
    "isExpired": false,
    "timeUntilExpiry": 86400000,
    "timeUntilExpiryFormatted": "1 day",
    "isRememberMe": true,
    "expiryInfo": {
      "expiresAt": "2024-12-31T23:59:59.000Z",
      "timeUntilExpiry": 86400000,
      "isExpired": false,
      "isExpiringSoon": false,
      "isRememberMe": true
    }
  }
}
```

**Error (401)**
```json
{
  "success": false,
  "error": "No active session"
}
```

### 6. Session Refresh

**POST** `/api/auth/session`

Refresh current session (requires authentication).

#### Response

Same as GET `/api/auth/session`

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limiting

- Password reset requests: 5 attempts per 15 minutes per IP
- Registration attempts: 10 attempts per hour per IP
- General API requests: 100 requests per 15 minutes per IP

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with 30-day expiration for "Remember Me"
- CSRF protection via NextAuth.js
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Secure token generation for password reset and email verification

## OAuth Providers

### Google OAuth

**Configuration Required:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Scopes:** `openid email profile`

### Facebook OAuth

**Configuration Required:**
- `FACEBOOK_CLIENT_ID`
- `FACEBOOK_CLIENT_SECRET`

**Scopes:** `email,public_profile`

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `USER` | Regular user | Access to profile, basic features |
| `BLOG_EDITOR` | Content editor | All USER permissions + blog management |
| `ADMIN` | Administrator | All permissions + admin panel access |

## Environment Variables

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Email Service
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-client-id"
FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"
```

## Examples

### Complete Registration Flow

1. **Register User**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123"
  }'
```

2. **Verify Email** (using token from email)
```bash
curl "http://localhost:3000/api/auth/verify-email?token=verification_token_123"
```

### Password Reset Flow

1. **Request Reset**
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

2. **Reset Password** (using token from email)
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_123",
    "password": "NewSecurePass123",
    "confirmPassword": "NewSecurePass123"
  }'
```

### Session Management

```bash
# Get session info
curl -H "Authorization: Bearer your-jwt-token" \
  http://localhost:3000/api/auth/session

# Refresh session
curl -X POST -H "Authorization: Bearer your-jwt-token" \
  http://localhost:3000/api/auth/session
```
