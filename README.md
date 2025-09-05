# Indigo Roots Vibe

A modern Next.js application with authentication, role-based access control, and Stripe integration. Built with TypeScript, Tailwind CSS, and deployed on Vercel.

## 🚀 Features

- **Next.js 15.5.2** with App Router
- **TypeScript** for type safety
- **NextAuth.js** authentication with role-based access control
- **Prisma ORM** with SQLite database
- **Tailwind CSS** with custom brand styling
- **ShadCN UI** component library
- **Stripe** payment integration (webhook ready)
- **Jest & React Testing Library** for testing
- **ESLint & Prettier** for code quality
- **Vercel** deployment with preview environments

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma ORM with SQLite (development)
- **Payments**: Stripe
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **Code Quality**: ESLint, Prettier

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin-only pages
│   ├── editor/            # Editor role pages
│   └── ...                # Public pages
├── components/            # Reusable UI components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Database connection
│   ├── stripe.ts         # Stripe configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── __tests__/            # Test files
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/enterpriseSoftware/indigo-roots-vibe.git
   cd indigo-roots-vibe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:

   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Email Service (Resend)
   RESEND_API_KEY="re_your_resend_api_key"
   FROM_EMAIL="noreply@yourdomain.com"

   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   FACEBOOK_CLIENT_ID="your_facebook_client_id"
   FACEBOOK_CLIENT_SECRET="your_facebook_client_secret"

   # Stripe (optional for development)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Pages Locally

- **Home**: http://localhost:3000
- **Sign In**: http://localhost:3000/signin
- **Sign Up**: http://localhost:3000/signup
- **Profile** (protected): http://localhost:3000/profile
- **Admin** (protected): http://localhost:3000/admin
- **Editor** (protected): http://localhost:3000/editor
- **Forgot Password**: http://localhost:3000/forgot-password
- **Test Components**: http://localhost:3000/test

## 🎨 Development

### Code Quality

```bash
# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database
npx prisma studio
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Authentication & Roles

### Features

- **User Registration** with email verification
- **Password Reset** via email
- **OAuth Integration** (Google, Facebook)
- **Role-Based Access Control** (RBAC)
- **Session Management** with "Remember Me"
- **Email Service** integration (Resend)

### User Roles

- **USER**: Default role, basic access
- **BLOG_EDITOR**: Can access editor pages
- **ADMIN**: Full administrative access

### Authentication Methods

1. **Email/Password**: Traditional sign-in
2. **Google OAuth**: Sign in with Google account
3. **Facebook OAuth**: Sign in with Facebook account

### Protected Routes

- `/admin` - Admin only
- `/editor` - Blog editors and admins
- `/profile` - All authenticated users
- All other routes are public

### Authentication Pages

- `/signin` - Sign in page
- `/signup` - User registration
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/verify-email` - Email verification
- `/profile` - User profile management

## 💳 Stripe Integration

Stripe webhook endpoint is configured at `/api/stripe/webhook` and handles:

- `payment_intent.succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**
   - Import project from GitHub in Vercel dashboard
   - Vercel auto-detects Next.js configuration

2. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:

   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-production-secret
   DATABASE_URL=your-production-database-url
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **Deploy**
   - Push to `main` branch for production
   - Any other branch creates preview deployment

### Preview Environments

Vercel automatically creates preview deployments:

- **Production**: `https://indigo-roots-vibe.vercel.app` (main branch)
- **Preview**: `https://indigo-roots-vibe-git-[branch].vercel.app` (feature branches)

## 📝 Environment Variables

| Variable                             | Description                  | Required |
| ------------------------------------ | ---------------------------- | -------- |
| `DATABASE_URL`                       | Database connection string   | ✅       |
| `NEXTAUTH_URL`                       | Application URL              | ✅       |
| `NEXTAUTH_SECRET`                    | NextAuth.js secret key       | ✅       |
| `RESEND_API_KEY`                     | Resend email service API key | ✅       |
| `FROM_EMAIL`                         | Sender email address         | ✅       |
| `GOOGLE_CLIENT_ID`                   | Google OAuth client ID       | ⚠️       |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth client secret   | ⚠️       |
| `FACEBOOK_CLIENT_ID`                 | Facebook OAuth client ID     | ⚠️       |
| `FACEBOOK_CLIENT_SECRET`             | Facebook OAuth client secret | ⚠️       |
| `STRIPE_SECRET_KEY`                  | Stripe secret key            | ⚠️       |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key       | ⚠️       |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook secret        | ⚠️       |

⚠️ = Optional (required for specific features)

## 📚 Documentation

### API Documentation

- **[API Reference](docs/API.md)** - Complete API endpoint documentation
- **[User Guide](docs/USER_GUIDE.md)** - User authentication guide

### Authentication Flow

1. **Registration**: User signs up → Email verification required
2. **Sign In**: Email/password or OAuth → Session created
3. **Password Reset**: Request reset → Email sent → Reset password
4. **Session Management**: 30-day "Remember Me" or 24-hour sessions

### Testing

- **Unit Tests**: Core authentication utilities
- **Integration Tests**: API endpoint validation
- **Smoke Tests**: Basic functionality verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. **Create Branch**: `git checkout -b feature/your-feature`
2. **Develop**: Make changes, add tests
3. **Test**: `npm test && npm run lint`
4. **Commit**: Use conventional commits
5. **Push**: `git push origin feature/your-feature`
6. **PR**: Create pull request for review

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **Production**: https://indigo-roots-vibe.vercel.app
- **Repository**: https://github.com/enterpriseSoftware/indigo-roots-vibe
- **Issues**: https://github.com/enterpriseSoftware/indigo-roots-vibe/issues

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/enterpriseSoftware/indigo-roots-vibe/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using Next.js and deployed on Vercel**
