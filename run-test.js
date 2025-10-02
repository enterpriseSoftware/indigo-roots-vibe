#!/usr/bin/env node

// Simple test runner for React components
const { execSync } = require('child_process');

try {
  // Install jest-environment-jsdom if not available
  console.log('Installing jest-environment-jsdom...');
  execSync('npm install --save-dev jest-environment-jsdom', { stdio: 'inherit' });
  
  // Run the test
  console.log('Running component tests...');
  execSync('npx jest __tests__/components.test.tsx --testEnvironment=jsdom', { stdio: 'inherit' });
} catch (error) {
  console.error('Test failed:', error.message);
  process.exit(1);
}
