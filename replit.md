# KPOP Idol Position Analyzer

## Overview

This is a full-stack web application that analyzes users' personality traits and photo uploads to determine their ideal KPOP idol position. The app features a multi-step quiz system, photo upload functionality, and generates shareable results cards with personalized KPOP group positions and styling recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server responsibilities:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom KPOP-themed color variables
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **File Upload**: Multer middleware for photo processing
- **Development**: Hot module replacement via Vite integration

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Shared TypeScript schema definitions for type safety
- **Storage**: Dual implementation with in-memory storage for development and PostgreSQL for production
- **Migrations**: Drizzle Kit for database schema management

### Authentication & Session Management
- **Session Storage**: Basic session-based tracking using generated session IDs
- **User Management**: User schema with username/password authentication (not actively used in current flow)

### Photo Processing
- **Upload Handling**: Multer with memory storage and 5MB file size limit
- **Format Support**: Base64 encoding for storage and display
- **Validation**: File type and size validation

### Quiz System
- **Multi-step Process**: Progressive quiz with personality, music genre, and fashion style questions
- **Validation**: Zod schema validation for quiz answers
- **Progress Tracking**: Client-side progress indicators

### Analysis Engine
- **Algorithm**: Rule-based analysis mapping quiz answers to KPOP positions
- **Results Generation**: Dynamic group names, positions, and character descriptions
- **Style Tags**: Personalized hashtags based on user preferences

## Data Flow

1. **User Onboarding**: Home page → Photo upload → Multi-step quiz
2. **Analysis Process**: Quiz completion → Loading screen → Server-side analysis
3. **Result Generation**: Analysis algorithm → Database storage → Result display
4. **Social Sharing**: Result cards → Share functionality → External platforms

### API Endpoints
- `POST /api/analyze` - Process quiz answers and photo for analysis
- `GET /api/results/:sessionId` - Retrieve analysis results by session

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for production
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM
- **multer**: File upload handling
- **wouter**: Lightweight React router

### UI/UX Libraries
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **zod**: Runtime type validation

## Deployment Strategy

### Development Environment
- **Server**: Express with Vite middleware for HMR
- **Database**: In-memory storage for rapid development
- **Build**: Vite development server with proxy setup

### Production Environment
- **Server**: Express serving static files and API routes
- **Database**: PostgreSQL via Neon Database with connection pooling
- **Build Process**: 
  1. Vite builds client assets to `dist/public`
  2. esbuild bundles server code to `dist/index.js`
  3. Static file serving from Express

### Configuration Management
- **Environment Variables**: DATABASE_URL for production database connection
- **Path Aliases**: TypeScript path mapping for clean imports
- **Build Optimization**: Separate client and server build processes

The application prioritizes user experience with smooth transitions, loading states, and mobile-responsive design while maintaining type safety throughout the stack.