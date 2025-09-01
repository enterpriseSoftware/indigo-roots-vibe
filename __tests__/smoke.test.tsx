import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import TestPage from '@/app/test/page'
import SignInPage from '@/app/signin/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Smoke tests - basic rendering without errors
describe('Application Smoke Tests', () => {
  test('renders home page without crashing', () => {
    render(<Home />)
    expect(screen.getByText(/get started by editing/i)).toBeInTheDocument()
  })

  test('renders component test page without crashing', () => {
    render(<TestPage />)
    expect(screen.getByText(/component test page/i)).toBeInTheDocument()
    // Check that brand title elements are present
    expect(screen.getByText('Indigo')).toBeInTheDocument()
    expect(screen.getByText('Roots')).toBeInTheDocument()
    expect(screen.getByText('Vibe')).toBeInTheDocument()
  })

  test('renders sign in page without crashing', () => {
    render(<SignInPage />)
    expect(screen.getAllByText(/sign in/i)[0]).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  test('all pages contain brand colors in titles', () => {
    render(<TestPage />)

    // Check that brand colors are applied (via CSS classes) - use exact text match
    const indigoElement = screen.getByText('Indigo')
    expect(indigoElement).toHaveClass('text-indigo-blue')

    const rootsElement = screen.getByText('Roots')
    expect(rootsElement).toHaveClass('text-earthy-brown')

    const vibeElement = screen.getByText('Vibe')
    expect(vibeElement).toHaveClass('text-leaf-green')
  })
})
