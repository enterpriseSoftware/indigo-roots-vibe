// Mock Next.js server components
export const NextRequest = jest.fn().mockImplementation((url, init) => ({
  url,
  json: jest.fn(),
  headers: new Map(),
  ...init,
}))

export const NextResponse = {
  json: jest.fn().mockImplementation((data, init) => ({
    json: () => data,
    status: init?.status || 200,
    headers: init?.headers || {},
  })),
}
