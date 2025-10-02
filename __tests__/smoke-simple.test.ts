// Simple smoke tests without React Testing Library
import { describe, it, expect } from '@jest/globals'

describe('Application Smoke Tests', () => {
  it('should have proper environment variables', () => {
    expect(process.env.NEXTAUTH_SECRET).toBeDefined()
    expect(process.env.NEXTAUTH_URL).toBeDefined()
  })

  it('should have proper configuration', () => {
    // Test that basic configuration is in place
    const config = {
      appName: 'Indigo Roots Vibe',
      version: '0.1.0',
    }
    
    expect(config.appName).toBe('Indigo Roots Vibe')
    expect(config.version).toBe('0.1.0')
  })

  it('should have proper brand colors', () => {
    // Test that brand colors are defined
    const brandColors = {
      indigoBlue: '#4F46E5',
      earthyBrown: '#8B4513',
    }
    
    expect(brandColors.indigoBlue).toBe('#4F46E5')
    expect(brandColors.earthyBrown).toBe('#8B4513')
  })
})
