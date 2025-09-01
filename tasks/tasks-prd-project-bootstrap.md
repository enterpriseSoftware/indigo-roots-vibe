## Relevant Files

- `package.json` - Project dependencies and scripts
- `next.config.js` - Next.js configuration with TypeScript and build settings
- `tsconfig.json` - TypeScript configuration with strict mode
- `tailwind.config.ts` - Tailwind configuration with brand theme and dark mode
- `components.json` - ShadCN UI configuration
- `prisma/schema.prisma` - Database schema with User model and roles
- `lib/auth.ts` - NextAuth.js configuration and authentication utilities
- `lib/db.ts` - Prisma database connection
- `lib/utils.ts` - Utility functions for authentication and UI
- `middleware.ts` - Route protection middleware
- `app/api/auth/[...nextauth]/route.ts` - NextAuth.js API routes
- `app/api/stripe/webhook/route.ts` - Stripe webhook endpoint placeholder
- `app/layout.tsx` - Root layout with theme provider and navigation
- `app/page.tsx` - Home page component
- `app/admin/layout.tsx` - Admin area layout with protection
- `app/editor/layout.tsx` - Editor area layout with protection
- `app/signin/page.tsx` - Sign-in page
- `components/ui/` - ShadCN UI components with brand styling
- `components/navigation.tsx` - Role-based navigation component
- `components/theme-provider.tsx` - Dark theme provider
- `.env.example` - Environment variables template
- `jest.config.js` - Jest testing configuration
- `__tests__/` - Test files directory
- `vercel.json` - Vercel deployment configuration
- `README.md` - Setup and deployment instructions

### Notes

- Unit tests should be placed in `__tests__/` directory following Next.js conventions
- Use `npm test` to run Jest tests
- Use `npm run dev` to start development server
- Use `npx prisma studio` to manage database in development

## Tasks

- [x] 1.0 Project Foundation Setup
  - [x] 1.1 Initialize Next.js 14+ project with App Router and TypeScript
  - [x] 1.2 Configure TypeScript with strict mode settings
  - [x] 1.3 Install and configure Tailwind CSS
  - [x] 1.4 Install and initialize ShadCN UI components
  - [x] 1.5 Set up basic project structure following ProStore patterns

- [x] 2.0 Brand Theme & UI Configuration
  - [x] 2.1 Extract color palette from indigo-roots-band.png logo file
  - [x] 2.2 Configure Tailwind theme with brand colors and dark mode
  - [x] 2.3 Create custom ShadCN component variants with brand styling
  - [x] 2.4 Implement base layout components with dark theme

- [x] 3.0 Database & Authentication Implementation
  - [x] 3.1 Install and configure Prisma ORM with PostgreSQL
  - [x] 3.2 Create User schema with role enum (User, BlogEditor, Admin)
  - [x] 3.3 Install and configure NextAuth.js with PostgreSQL adapter
  - [x] 3.4 Set up authentication pages and session management
  - [x] 3.5 Implement role-based authentication utilities

- [x] 4.0 Route Protection & Middleware
  - [x] 4.1 Create middleware for /admin/\*\* route protection
  - [x] 4.2 Create middleware for /editor/\*\* route protection
  - [x] 4.3 Implement unauthorized access redirects
  - [x] 4.4 Create role-based navigation components

- [x] 5.0 Payment Integration Foundation
  - [x] 5.1 Install and configure Stripe SDK
  - [x] 5.2 Create webhook endpoint placeholder structure
  - [x] 5.3 Set up Stripe environment variables configuration

- [x] 6.0 Development Environment & Testing
  - [x] 6.1 Install and configure Jest with React Testing Library
  - [x] 6.2 Create smoke test for main application
  - [x] 6.3 Configure ESLint with Next.js and TypeScript rules
  - [x] 6.4 Configure Prettier with consistent formatting
  - [x] 6.5 Create comprehensive .env.example file

- [ ] 7.0 Deployment Configuration
  - [x] 7.1 Configure Vercel deployment settings
  - [ ] 7.2 Set up preview environments for branches
  - [ ] 7.3 Create production-ready README.md with setup instructions
