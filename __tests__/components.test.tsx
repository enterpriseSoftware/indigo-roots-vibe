import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { Card, CardTitle, CardContent } from '@/components/ui/card'

describe('Component Tests', () => {
  describe('Button Component', () => {
    test('renders button with default variant', () => {
      render(<Button>Default Button</Button>)
      const button = screen.getByRole('button', { name: /default button/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-foreground')
    })

    test('renders button with primary variant', () => {
      render(<Button variant="primary">Primary Button</Button>)
      const button = screen.getByRole('button', { name: /primary button/i })
      expect(button).toHaveClass('bg-indigo-blue')
    })

    test('renders button with secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>)
      const button = screen.getByRole('button', { name: /secondary button/i })
      expect(button).toHaveClass('bg-earthy-brown')
    })

    test('handles click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button', { name: /click me/i })
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test('renders disabled button', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button', { name: /disabled button/i })
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })
  })

  describe('Card Components', () => {
    test('renders card with title and content', () => {
      render(
        <Card>
          <CardTitle>Test Title</CardTitle>
          <CardContent>Test content goes here</CardContent>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test content goes here')).toBeInTheDocument()
    })

    test('card has proper styling classes', () => {
      render(
        <Card data-testid="card">
          <CardTitle>Title</CardTitle>
          <CardContent>Content</CardContent>
        </Card>
      )

      const card = screen.getByTestId('card')
      expect(card).toHaveClass('rounded-lg', 'border', 'shadow-sm')
    })
  })
})
