import { Resend } from 'resend';

// Initialize Resend client (only if API key is available)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@indigorootsvibe.com';
const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName?: string) => ({
    subject: 'Reset Your Password - Indigo Roots Vibe',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Indigo Roots Vibe</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Reset Your Password</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello${userName ? ` ${userName}` : ''}!</h2>
            
            <p>We received a request to reset your password for your Indigo Roots Vibe account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.<br>
              This email was sent to you because you requested a password reset.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Reset Your Password - Indigo Roots Vibe
      
      Hello${userName ? ` ${userName}` : ''}!
      
      We received a request to reset your password for your Indigo Roots Vibe account. If you made this request, click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
      
      © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.
    `
  }),

  welcome: (userName: string, _userEmail: string) => ({
    subject: 'Welcome to Indigo Roots Vibe! 🎵',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Indigo Roots Vibe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎵 Indigo Roots Vibe</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Welcome to the Family!</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Welcome, ${userName}! 🎉</h2>
            
            <p>Thank you for joining the Indigo Roots Vibe community! We're thrilled to have you as part of our musical family.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; padding-left: 20px;">
                <li>Check out our latest <strong>music releases</strong> and upcoming shows</li>
                <li>Follow us on social media for behind-the-scenes content</li>
                <li>Join our <strong>fan community</strong> discussions</li>
                <li>Get exclusive access to <strong>merchandise</strong> and early ticket sales</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Explore Our Site
              </a>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">🎤 Upcoming Shows</h3>
              <p style="color: #666; margin: 0;">Stay tuned for announcements about our next live performances and special events!</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.<br>
              You're receiving this email because you signed up for an account.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Indigo Roots Vibe! 🎵
      
      Welcome, ${userName}! 🎉
      
      Thank you for joining the Indigo Roots Vibe community! We're thrilled to have you as part of our musical family.
      
      What's Next?
      • Check out our latest music releases and upcoming shows
      • Follow us on social media for behind-the-scenes content
      • Join our fan community discussions
      • Get exclusive access to merchandise and early ticket sales
      
      Explore our site: ${SITE_URL}
      
      Upcoming Shows
      Stay tuned for announcements about our next live performances and special events!
      
      © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.
    `
  }),

  emailVerification: (verificationUrl: string, userName?: string) => ({
    subject: 'Verify Your Email - Indigo Roots Vibe',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Indigo Roots Vibe</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Verify Your Email</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello${userName ? ` ${userName}` : ''}!</h2>
            
            <p>Thank you for signing up! Please verify your email address to complete your account setup and access all features.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 5px; 
                        font-weight: bold; 
                        display: inline-block;
                        font-size: 16px;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.<br>
              This email was sent to verify your account.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `
      Verify Your Email - Indigo Roots Vibe
      
      Hello${userName ? ` ${userName}` : ''}!
      
      Thank you for signing up! Please verify your email address to complete your account setup and access all features.
      
      Verify your email: ${verificationUrl}
      
      This link will expire in 24 hours. If you didn't create an account, please ignore this email.
      
      © ${new Date().getFullYear()} Indigo Roots Vibe. All rights reserved.
    `
  })
};

// Email service functions
export class EmailService {
  /**
   * Send a password reset email
   */
  static async sendPasswordResetEmail(
    email: string, 
    resetToken: string, 
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!resend) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      const resetUrl = `${SITE_URL}/auth/reset-password?token=${resetToken}`;
      const template = emailTemplates.passwordReset(resetUrl, userName);

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.warn('Password reset email sent:', result);
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send a welcome email to new users
   */
  static async sendWelcomeEmail(
    email: string, 
    userName: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!resend) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      const template = emailTemplates.welcome(userName, email);

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.warn('Welcome email sent:', result);
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send an email verification email
   */
  static async sendEmailVerification(
    email: string, 
    verificationToken: string, 
    userName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!resend) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      const verificationUrl = `${SITE_URL}/auth/verify-email?token=${verificationToken}`;
      const template = emailTemplates.emailVerification(verificationUrl, userName);

      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      console.warn('Email verification sent:', result);
      return { success: true };
    } catch (error) {
      console.error('Failed to send email verification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Test email service configuration
   */
  static async testEmailService(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!resend) {
        throw new Error('RESEND_API_KEY is not configured');
      }

      // Send a test email to verify configuration
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ['test@example.com'], // This will fail but we can check the API key
        subject: 'Test Email',
        html: '<p>This is a test email</p>',
      });

      return { success: true };
    } catch (error) {
      // If it's an API key error, that's what we want to catch
      if (error instanceof Error && error.message.includes('API key')) {
        return { 
          success: false, 
          error: 'Invalid or missing RESEND_API_KEY' 
        };
      }
      
      // Other errors might be expected (like invalid email)
      return { success: true };
    }
  }
}

export default EmailService;
