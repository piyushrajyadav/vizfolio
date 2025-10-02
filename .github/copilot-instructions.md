# GitHub Copilot Instructions for Vizfolio

This project is **Vizfolio** - a modern portfolio builder for freelancers, students, and professionals.

## Project Overview
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Supabase
- **Purpose**: Create and publish professional portfolios with multiple themes
- **Target Users**: Freelancers, students, developers, designers, photographers

## Key Features
- Multi-theme portfolio builder (6 themes)
- Supabase authentication and storage
- Project management dashboard
- Real-time portfolio preview
- One-click publishing to custom URLs
- Mobile-responsive design

## Architecture Guidelines
- Use Next.js App Router for all routes
- Components are in `src/components/ui/` for reusable UI and `src/components/themes/` for portfolio themes
- All styling uses Tailwind CSS with shadcn/ui components
- Animations are handled with Framer Motion
- Database operations use Supabase client

## Code Style
- TypeScript for all files
- Functional components with hooks
- Use shadcn/ui components when possible
- Consistent naming: kebab-case for files, camelCase for variables
- Export interfaces for TypeScript types
- Use 'use client' directive for client components

## Theme Development
- Each theme is a standalone component in `src/components/themes/`
- Themes receive `profile` and `projects` props
- Maintain consistent interface across all themes
- Support both dark and light modes where applicable
- Use motion.div for animations

## Database Schema
- `profiles` table for user data
- `projects` table for portfolio projects
- Use TypeScript interfaces defined in `src/lib/supabase.ts`

## Current Status
✅ Landing page with hero section and features
✅ Authentication page UI
✅ Dashboard with WebGL shader background
✅ Two theme examples (Minimalist & Dark)
✅ Theme preview system
✅ Supabase configuration
✅ Project structure and documentation

## Next Steps
- Implement Supabase authentication
- Add project CRUD operations
- Complete remaining 4 themes
- Add image upload functionality
- Implement portfolio publishing system