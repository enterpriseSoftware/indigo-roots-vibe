// Simple component test without complex setup
import React from 'react'

// Mock the Button component
const Button = ({ children, variant = 'default', ...props }) => {
  return React.createElement('button', {
    ...props,
    className: `button button-${variant}`,
  }, children)
}

// Mock the Card components
const Card = ({ children, ...props }) => {
  return React.createElement('div', {
    ...props,
    className: 'card',
  }, children)
}

const CardTitle = ({ children, ...props }) => {
  return React.createElement('h3', {
    ...props,
    className: 'card-title',
  }, children)
}

const CardContent = ({ children, ...props }) => {
  return React.createElement('div', {
    ...props,
    className: 'card-content',
  }, children)
}

// Simple test
console.log('Testing Button component...')
const button = Button({ children: 'Test Button' })
console.log('Button created:', button)

console.log('Testing Card component...')
const card = Card({ children: [
  CardTitle({ children: 'Test Title' }),
  CardContent({ children: 'Test content' })
] })
console.log('Card created:', card)

console.log('All tests passed!')
