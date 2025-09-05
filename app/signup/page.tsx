'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    // Password strength validation
    const passwordErrors = []
    if (!/[A-Z]/.test(formData.password)) {
      passwordErrors.push('at least one uppercase letter')
    }
    if (!/[a-z]/.test(formData.password)) {
      passwordErrors.push('at least one lowercase letter')
    }
    if (!/\d/.test(formData.password)) {
      passwordErrors.push('at least one number')
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      passwordErrors.push('at least one special character')
    }

    if (passwordErrors.length > 0) {
      setError(`Password must contain ${passwordErrors.join(', ')}`)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        
        // Redirect to sign in after 5 seconds
        setTimeout(() => {
          router.push('/signin')
        }, 5000)
      } else {
        if (data.details) {
          setError(data.details.map((d: { message: string }) => d.message).join(', '))
        } else {
          setError(data.error || 'An error occurred. Please try again.')
        }
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <CardTitle className="text-center mb-6">
            <span className="text-indigo-blue">Create</span>{' '}
            <span className="text-earthy-brown">Account</span>
          </CardTitle>

          {message ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-sm">
                {message}
              </div>
              <div className="text-sm text-brand-gray">
                Redirecting to sign in page...
              </div>
              <Button
                onClick={() => router.push('/signin')}
                variant="primary"
                className="w-full"
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <>
              <p className="text-center text-brand-gray mb-6">
                Join the Indigo Roots Vibe community and stay updated with our latest music and events.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-brand-gray/20 rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-blue"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <div className="text-xs text-brand-gray">
                  <p className="mb-1">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="text-center text-sm text-brand-gray mt-6">
                Already have an account?{' '}
                <Link 
                  href="/signin" 
                  className="text-indigo-blue hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
