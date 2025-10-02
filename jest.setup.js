// Mock environment variables for testing
process.env.NEXTAUTH_SECRET = 'test-secret'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
  UserRole: {
    USER: 'USER',
    BLOG_EDITOR: 'BLOG_EDITOR',
    ADMIN: 'ADMIN',
  },
}))

// Mock database
jest.mock('./lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    passwordReset: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn(),
}))

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(),
    },
  }))
})

// Mock bcrypt (virtual mock to avoid installing dependency)
jest.mock(
  'bcrypt',
  () => ({
    hash: jest.fn(),
    compare: jest.fn(),
  }),
  { virtual: true }
)

// Mock next-auth server
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(async () => null),
  default: jest.fn(),
}))

// Mock Resend email service
process.env.RESEND_API_KEY = 'test-key'
process.env.FROM_EMAIL = 'test@example.com'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

const mockSend = jest.fn(async () => ({ id: 'mock-id' }))
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: mockSend },
  })),
}))

// Mock NextResponse globally
global.NextResponse = {
  json: jest.fn().mockImplementation((data, init) => ({
    json: () => data,
    status: init?.status || 200,
    headers: init?.headers || {},
  })),
}

// Mock NextRequest globally
global.NextRequest = jest.fn().mockImplementation((url, init) => ({
  url,
  json: jest.fn(),
  headers: new Map(),
  ...init,
}))

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    json: jest.fn(),
    headers: new Map(),
    ...init,
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => data,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}))

// Mock NextResponse as default export for internal Next.js imports
jest.mock('next/dist/server/web/exports/next-response', () => ({
  default: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => data,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}))

// Mock all Next.js server web exports
jest.mock('next/dist/server/web/exports', () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    json: jest.fn(),
    headers: new Map(),
    ...init,
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      json: () => data,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}))

// Mock zod
jest.mock('zod', () => ({
  z: {
    object: jest.fn().mockReturnValue({
      parse: jest.fn(),
      safeParse: jest.fn(),
    }),
    string: jest.fn().mockReturnValue({
      email: jest.fn().mockReturnThis(),
      min: jest.fn().mockReturnThis(),
    }),
  },
}))
