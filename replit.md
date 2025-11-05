# KPOP Idol Position Analyzer

## Overview

This is a full-stack web application that analyzes users' personality traits and photo uploads to determine their ideal KPOP idol position. The app features a multi-step quiz system, photo upload functionality, and generates shareable results cards with personalized KPOP group positions and styling recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### 2025-11-05
- **Photo Analysis System**: Integrated face-api.js for comprehensive facial feature detection
  - Age detection for age-based member matching
  - Gender detection for group filtering
  - Expression detection (7 emotions: neutral, happy, sad, angry, fearful, disgusted, surprised)
- **Score-based Matching Engine**: Replaced LLM-only matching with hybrid scoring system
  - Quiz answers (50%): Position preference matching from 8-question personality assessment
  - Photo analysis (30%): Age similarity and expression-personality matching
  - Position alignment (20%): Role compatibility scoring
  - **Gender filtering**: Prevents cross-gender matches using genderGroupMap (male users → BTS/Stray Kids, female users → BLACKPINK/IVE/aespa/NewJeans)
- **KPOP Database Enhancement**: Added birthYear and personality metadata to 34 members across 6 major groups
  - BTS (7 members), BLACKPINK (4), IVE (6), aespa (4), NewJeans (5), Stray Kids (8)
  - Bilingual metadata support (Korean and English)
  - Both datasets use English group names for consistent filtering
- **Data Pipeline Completion**: End-to-end flow for photo analysis metadata
  - Frontend: face-api.js detection → sessionStorage
  - Backend: API validation → database persistence (age, expression, gender columns)
  - Schema updates: shared/schema.ts and D1 migration files

### 2025-10-14
- **Quiz Expansion**: Extended quiz options from 4 to 6 per question (8 questions total, 48 options)
- **Multilingual Support**: Added English language support for entire user flow (Home → Quiz → Results)
  - Language selection persists via localStorage
  - All UI text translated for Korean and English
- **Cloudflare Workers Photo Fix**: Implemented chunked base64 conversion (32KB chunks) to prevent stack overflow for large photo files

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
- **ORM**: Drizzle ORM with dual dialect support (PostgreSQL/SQLite)
- **Schema**: Shared TypeScript schema definitions for type safety
- **Storage**: Environment-based storage selection:
  - **Development**: MemStorage (in-memory, fast iteration)
  - **Production**: Cloudflare D1 (SQLite-based, globally distributed)
- **Database Management**: 
  - Cloudflare Wrangler CLI for D1 operations
  - Automatic table initialization
  - Real-time analytics counting

### Authentication & Session Management
- **Session Storage**: Basic session-based tracking using generated session IDs
- **User Management**: User schema with username/password authentication (not actively used in current flow)

### Photo Processing
- **Upload Handling**: Multer with memory storage and 5MB file size limit
- **Format Support**: Base64 encoding for storage and display
- **Cloudflare Workers**: Chunked conversion (32KB chunks) to prevent stack overflow on large files
- **Validation**: File type and size validation

### Quiz System
- **Multi-step Process**: Progressive quiz with 8 questions covering personality, performance style, and fashion
- **Options**: 6 options per question (48 total options)
- **Multilingual**: Full Korean and English support
- **Validation**: Zod schema validation for quiz answers
- **Progress Tracking**: Client-side progress indicators

### Analysis Engine
- **Hybrid Scoring System**: Multi-factor matching algorithm combining quiz, photo analysis, and position data
  - **Quiz Score (50%)**: Analyzes 8 personality/performance questions to determine position preferences
  - **Photo Score (30%)**: Age similarity (±2 years = 30 pts, ±5 years = 20 pts) + expression-personality matching
  - **Position Score (20%)**: Alignment between user preferences and member roles
- **LLM Integration**: Cloudflare Workers AI generates personalized descriptions for matched members
  - Primary: Score-based matching determines the member
  - Secondary: LLM creates engaging character descriptions and style tags
  - Fallback: Template-based descriptions if LLM unavailable
- **Member Database**: 34 enriched member profiles with birthYear and personality traits
  - Supports both male and female KPOP groups
  - Bilingual data (Korean/English) for international users

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
- **Platform**: Cloudflare Workers for serverless deployment
- **Database**: Cloudflare D1 (SQLite) with global replication
- **Storage**: Dual-layer implementation (MemStorage for dev, D1Storage for production)
- **Build Process**: 
  1. Vite builds client assets to `dist/public`
  2. esbuild bundles server code to `dist/index.js`
  3. Wrangler deploys to Cloudflare Workers
- **Real-time Stats**: Live analysis count via D1 database queries

### Configuration Management
- **Environment Variables**: DATABASE_URL for production database connection
- **Path Aliases**: TypeScript path mapping for clean imports
- **Build Optimization**: Separate client and server build processes

The application prioritizes user experience with smooth transitions, loading states, and mobile-responsive design while maintaining type safety throughout the stack.