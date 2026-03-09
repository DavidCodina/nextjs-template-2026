# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run typescript` - Type check without emitting files
- `npm run typescript:watch` - Type check in watch mode

### Testing
- `npm test` - Run Jest tests
- `npm run test:verbose` - Run tests with verbose output
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Database
- `npx prisma generate` - Generate Prisma client
- `npx prisma migrate deploy` - Deploy migrations (production)
- `npx prisma db seed` - Seed database
- `npx prisma studio` - Open Prisma Studio

### Storybook
- `npm run storybook` - Start Storybook dev server on port 6006
- `npm run build-storybook` - Build Storybook for production

## Project Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js v5 (Auth.js) with Prisma adapter
- **Database**: PostgreSQL with Prisma ORM and Neon serverless driver
- **UI Framework**: React 19 with ShadCN/UI components based on Radix UI
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **State Management**: Zustand for client state, React Context for app-wide state
- **Testing**: Jest with React Testing Library
- **Type Safety**: TypeScript with strict configuration

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `(root)/` - Main application routes with shared layout
  - `(auth)/` - Authentication pages (login, register)
  - `api/` - API routes
- `src/components/` - Reusable UI components (custom ShadCN/UI implementations)
- `src/lib/` - Utility libraries and configurations
  - `db/` - Prisma client and database utilities
- `src/contexts/` - React contexts (theme, session, app state)
- `src/styles/` - Global CSS and Tailwind configuration
- `prisma/` - Database schema and migrations

### Authentication Architecture
- Uses NextAuth.js v5 with custom configuration split between `auth.config.ts` (edge-compatible) and full auth setup
- Middleware handles route protection with public/private route definitions in `src/routes.ts`
- Session management through React Context in `src/contexts/SessionProvider.tsx`
- Protected routes redirect to `/login` with automatic `callbackUrl` handling

### Component Architecture
- Custom ShadCN/UI components in individual directories under `src/components/`
- Each component follows the pattern: main component file, variants using `class-variance-authority`, and index export
- Components use Radix UI primitives with custom styling
- Sidebar navigation system with persistent state via cookies

### Database Setup
- Prisma schema outputs client to `src/generated/prisma/` (excluded from git)
- Uses Neon serverless driver with connection pooling
- Edge-compatible setup for middleware and API routes
- Seed scripts available in `src/lib/db/seed.ts`

### Configuration Notes
- TypeScript paths configured with `@/*` alias pointing to `src/`
- ESLint uses flat config with custom rules in `custom-eslint-plugin/`
- Tailwind CSS v4 with component-specific CSS files where needed
- Material Symbols font loaded via npm package rather than Google Fonts CDN

### Development Patterns
- Route groups for organizing pages with shared layouts
- Server components by default with client components explicitly marked
- Form handling with `react-hook-form` and Zod validation
- Error boundaries and custom error pages
- Responsive design with mobile-first approach using Tailwind breakpoints