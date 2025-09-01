cat > tasks/prd-project-bootstrap.md << 'EOF'

# Product Requirements Document: Project Bootstrap - Indigo Roots Band Website

## Introduction/Overview

The Project Bootstrap feature is a foundational setup for the Indigo Roots Band website that establishes a complete development environment, authentication system, and brand-consistent design framework. This greenfield project will create a production-ready foundation following the ProStore architecture while implementing the band's unique branding and identity.

The goal is to deliver a fully configured, deployable Next.js application with authentication, role-based access control, payment integration setup, and brand-consistent UI components within a couple of hours.

## Goals

1. **Rapid Setup**: Complete foundational setup in ~2 hours with minimal manual configuration
2. **Brand Consistency**: Implement Indigo Roots Band color scheme and dark theme throughout
3. **Security Foundation**: Establish role-based authentication with protected routes
4. **Payment Ready**: Configure Stripe integration for future commerce features
5. **Development Ready**: Provide complete dev environment with testing, linting, and deployment
6. **Scalable Architecture**: Follow ProStore patterns for easy feature additions

## User Stories

1. **As a Developer**, I want a fully configured Next.js environment so that I can immediately start building band-specific features without setup overhead.

2. **As a Band Admin**, I want secure admin access to manage all aspects of the website including content, users, and settings.

3. **As a Blog Editor**, I want restricted access to blog management functions so that I can create and edit content without accessing sensitive admin features.

4. **As a Site Visitor**, I want a visually consistent experience that reflects the Indigo Roots Band identity through proper branding and dark theme.

5. **As a Developer**, I want automated testing and deployment so that I can confidently push changes without manual verification steps.

## Functional Requirements

1. **Project Initialization**
   - 1.1: Initialize Next.js 14+ project with App Router
   - 1.2: Configure TypeScript in strict mode
   - 1.3: Set up Tailwind CSS with custom brand configuration
   - 1.4: Install and configure ShadCN UI components

2. **Brand Theme Implementation**
   - 2.1: Extract color palette from indigo-roots-band.png logo
   - 2.2: Configure Tailwind theme with brand colors (Indigo Blue #36A9E1, Earthy Brown #8B6B4C, Gray #6C6C6C, Leaf Green #6BBE45)
   - 2.3: Implement dark theme as default with black (#000000) background
   - 2.4: Create branded ShadCN component variants

3. **Database & Authentication Setup**
   - 3.1: Configure PostgreSQL with Prisma ORM
   - 3.2: Create User model with role field (User, BlogEditor, Admin)
   - 3.3: Set up NextAuth.js with PostgreSQL adapter
   - 3.4: Configure admin-only user creation (no self-registration)
   - 3.5: Implement session management and role checking

4. **Route Protection**
   - 4.1: Create middleware to protect /admin/\*\* routes (Admin only)
   - 4.2: Create middleware to protect /editor/\*\* routes (BlogEditor + Admin)
   - 4.3: Implement proper redirects for unauthorized access
   - 4.4: Add role-based navigation components

5. **Payment Integration Foundation**
   - 5.1: Install and configure Stripe SDK
   - 5.2: Set up webhook endpoint placeholder
   - 5.3: Create environment variable configuration for Stripe keys
   - 5.4: Prepare for one-time purchases, subscriptions, and donations

6. **Development Environment**
   - 6.1: Configure Jest with React Testing Library
   - 6.2: Create smoke test for main application
   - 6.3: Set up ESLint with Next.js configuration
   - 6.4: Configure Prettier with consistent formatting rules
   - 6.5: Create .env.example with all required variables

7. **Deployment Configuration**
   - 7.1: Configure for Vercel deployment
   - 7.2: Set up preview environments for branches
   - 7.3: Configure automatic deployments from main branch

## Non-Goals (Out of Scope)

- Actual blog content management system (future feature)
- Event/tour date management (future feature)
- Music/media gallery implementation (future feature)
- Complete e-commerce product catalog (future feature)
- Email integration and notifications (future feature)
- Advanced SEO optimization beyond basics (future feature)
- Multi-language support (future feature)
- Complex user profile management (future feature)

## Design Considerations

- **Color Palette**: Dark theme with brand colors from logo
- **Typography**: Use system fonts initially, can be enhanced later
- **Layout**: Follow ProStore responsive patterns
- **Components**: Leverage ShadCN UI for consistency
- **Accessibility**: Ensure proper contrast ratios with dark theme

## Technical Considerations

- **Framework**: Next.js 14+ with App Router for modern React patterns
- **Database**: PostgreSQL for production scalability
- **Authentication**: NextAuth.js for OAuth flexibility and security
- **Styling**: Tailwind CSS for rapid development and customization
- **Testing**: Jest + RTL for component and utility testing
- **Deployment**: Vercel for seamless Next.js integration

## Success Metrics

- Complete setup achievable in ~2 hours
- All authentication flows working correctly
- Brand colors properly implemented across all components
- Zero linting/formatting errors
- All tests passing
- Successful deployment to Vercel with preview environments
- Protected routes properly restricting access by role

## Open Questions

- Font selection for brand consistency (will use system fonts initially)
- Specific blog content structure (will be addressed in future PRD)
- Advanced Stripe webhook handling (basic setup only for now)

## Definition of Done

- [ ] Project successfully initializes and runs locally
- [ ] All three user roles (User, BlogEditor, Admin) can authenticate
- [ ] Route protection works for /admin/** and /editor/** paths
- [ ] Brand colors are properly applied throughout the UI
- [ ] Stripe integration is configured and ready for future development
- [ ] All tests pass and linting shows no errors
- [ ] Application deploys successfully to Vercel
- [ ] .env.example includes all required environment variables
- [ ] README.md provides clear setup instructions
      EOF
