# FarmaPlus - Pharmaceutical E-Commerce Platform

## Overview

FarmaPlus is a modern pharmaceutical e-commerce platform built as a full-stack web application. The system enables customers to browse medications, supplements, and personal care products, add items to a shopping cart, and complete purchases through a streamlined checkout process. The platform emphasizes medical trust, accessibility, and professional credibility while providing an efficient browsing and purchasing experience.

The application is designed with a clear separation between client and server, using React for the frontend and Express for the backend, with Supabase as the database backend for persistent data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and data fetching
- Tailwind CSS with shadcn/ui component library for styling

**Design System:**
- Based on shadcn/ui "new-york" style with Radix UI primitives
- Custom color system with CSS variables for theming
- Typography: Inter font for headings/navigation, System UI for body text
- Responsive design with mobile-first approach
- Accessibility built-in through Radix UI components

**State Management:**
- Context API for cart state (`CartContext`)
- localStorage for cart persistence across sessions
- React Query for server data caching and synchronization
- Form state managed by react-hook-form with Zod validation

**Routing Structure:**
- `/` - Home page with hero section and featured products
- `/productos` - Full product catalog with filtering
- `/checkout` - Checkout form for order completion
- `/confirmacion/:id` - Order confirmation page
- `/admin/login` - Admin employee login portal
- `/admin` - Protected admin dashboard for product management

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety
- ESM (ES Modules) for modern JavaScript module system

**Data Layer:**
- **Supabase** as PostgreSQL backend with real-time capabilities
- **@supabase/supabase-js** SDK for database interactions
- TypeScript-first approach with proper type mapping between frontend/backend
- Schema defined in shared directory for type consistency
- Automatic data transformation between TypeScript camelCase and PostgreSQL snake_case

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Validation using Zod schemas
- Error handling with appropriate HTTP status codes

**API Endpoints:**
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve single product
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Retrieve order details
- `GET /api/orders/:id/items` - Retrieve order items
- `POST /api/admin/login` - Employee login (returns JWT token)
- `POST /api/admin/products` - Create new product (admin only)
- `PATCH /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

**Environment-Specific Builds:**
- Development: Hot module reloading with Vite middleware
- Production: Static file serving from compiled build

### Data Models

**Products:**
- Fields: id, name, description, price, category, imageUrl, requiresPrescription, stock
- Categories: Medicamentos, Suplementos, Cuidado Personal
- Images stored in attached_assets directory

**Orders:**
- Fields: id, customerName, customerEmail, customerPhone, deliveryAddress, deliveryCity, deliveryPostalCode, total, status, createdAt
- Status tracking: pending, processing, completed, cancelled

**Order Items:**
- Links products to orders with quantity and price snapshot
- Maintains product name for historical accuracy

### Key Architectural Decisions

**Monorepo Structure:**
- Shared types and schemas in `/shared` directory
- Client code in `/client` directory
- Server code in `/server` directory
- Path aliases configured for clean imports (`@/`, `@shared/`)

**Type Safety:**
- End-to-end type safety using TypeScript
- Shared Zod schemas for runtime validation and type inference
- Drizzle-zod integration for database schema validation

**Storage Strategy:**
- Supabase PostgreSQL database for persistent data storage
- `SupabaseStorage` class implements `IStorage` interface
- Automatic data mapping between TypeScript types and database columns
- Initial product data automatically seeded on first application startup
- Support for transactions and data consistency

**Form Validation:**
- Client-side validation with react-hook-form
- Schema validation using Zod
- Server-side validation as backup layer

**Asset Management:**
- Static assets served from `/attached_assets` route
- Pre-generated product images
- Responsive image handling

## Admin Panel Features

**Authentication:**
- Uses Supabase Auth for employee authentication
- JWT tokens for session management (24-hour expiry)
- Protected routes with client-side and server-side validation

**Product Management:**
- View all products in a responsive table
- Create new products with all details (name, description, price, category, stock, etc.)
- Edit existing products inline
- Delete products with confirmation
- Real-time updates using React Query cache invalidation

## External Dependencies

### UI Component Library
- **shadcn/ui**: Unstyled, accessible component system built on Radix UI
- **Radix UI**: Low-level UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant system for components
- **lucide-react**: Icon library

### Data Fetching & State
- **TanStack Query**: Server state management, caching, and synchronization
- **react-hook-form**: Performant form state management
- **@hookform/resolvers**: Zod integration for form validation

### Validation & Schema
- **Zod**: Schema validation and TypeScript type inference
- **drizzle-zod**: Generate Zod schemas from Drizzle database schemas

### Database & Backend
- **@supabase/supabase-js**: Supabase JavaScript client for PostgreSQL database operations
- **Supabase PostgreSQL**: Cloud database with automatic backups and scaling
- **jsonwebtoken**: JWT token generation for admin authentication

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Static type checking
- **PostCSS**: CSS transformation (Tailwind CSS processing)
- **@replit/* plugins**: Replit-specific development enhancements

### Routing & Navigation
- **wouter**: Minimalist routing library (1.5KB alternative to React Router)

### Session Management (Configured)
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used)

### Build & Deployment
- **esbuild**: Fast JavaScript bundler for server production build
- **tsx**: TypeScript execution for development server