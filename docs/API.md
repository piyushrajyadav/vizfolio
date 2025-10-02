# Vizfolio API Documentation

## Overview
Vizfolio provides a complete API for managing portfolios, projects, and user authentication. The API is built on Supabase and provides real-time capabilities.

## Base URL
```
Production: https://your-supabase-project.supabase.co
Development: http://localhost:3000/api
```

## Authentication
All API requests require authentication using Supabase Auth. Include the Bearer token in the Authorization header:

```
Authorization: Bearer <your_supabase_jwt_token>
```

## API Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

#### POST /auth/signin
Sign in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### POST /auth/signout
Sign out the current user.

#### POST /auth/oauth/{provider}
Sign in with OAuth provider (google, github, discord).

### Profiles

#### GET /api/profiles/me
Get current user's profile.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "bio": "Full-stack developer",
  "avatar_url": "https://...",
  "website": "https://johndoe.com",
  "location": "San Francisco, CA",
  "skills": ["React", "Node.js", "TypeScript"],
  "theme": "minimalist",
  "is_public": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/profiles/{username}
Get public profile by username.

#### PUT /api/profiles/me
Update current user's profile.

**Request Body:**
```json
{
  "username": "johndoe",
  "full_name": "John Doe",
  "bio": "Full-stack developer passionate about creating amazing user experiences",
  "website": "https://johndoe.com",
  "location": "San Francisco, CA",
  "skills": ["React", "Node.js", "TypeScript", "Python"],
  "theme": "dark",
  "is_public": true
}
```

#### DELETE /api/profiles/me
Delete current user's profile and account.

### Projects

#### GET /api/projects
Get all projects for the current user's profile.

**Query Parameters:**
- `featured`: boolean - Filter by featured projects only
- `category`: string - Filter by project category

**Response:**
```json
[
  {
    "id": "uuid",
    "profile_id": "uuid",
    "title": "E-commerce Platform",
    "description": "A modern e-commerce platform built with Next.js",
    "image_url": "https://...",
    "demo_url": "https://demo.example.com",
    "github_url": "https://github.com/username/project",
    "technologies": ["Next.js", "TypeScript", "Stripe"],
    "category": "Web Development",
    "featured": true,
    "order_index": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/projects/{id}
Get a specific project by ID.

#### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "title": "E-commerce Platform",
  "description": "A modern e-commerce platform built with Next.js",
  "demo_url": "https://demo.example.com",
  "github_url": "https://github.com/username/project",
  "technologies": ["Next.js", "TypeScript", "Stripe"],
  "category": "Web Development",
  "featured": true
}
```

#### PUT /api/projects/{id}
Update an existing project.

#### DELETE /api/projects/{id}
Delete a project.

#### POST /api/projects/reorder
Reorder projects by providing an array of project IDs.

**Request Body:**
```json
{
  "project_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### File Upload

#### POST /api/upload/avatar
Upload a new avatar image.

**Request:** Multipart form data with file field.

**Response:**
```json
{
  "url": "https://supabase-storage-url/avatars/filename.jpg"
}
```

#### POST /api/upload/project-image
Upload a project image.

**Request:** Multipart form data with file field and project_id.

### Public Portfolio

#### GET /portfolio/{username}
Get public portfolio page for a user.

**Response:** HTML page with portfolio content.

#### GET /api/portfolio/{username}
Get public portfolio data as JSON.

## Webhooks

### POST /api/webhooks/auth
Handle authentication events (user signup, signin, etc.).

### POST /api/webhooks/stripe
Handle Stripe payment events (for premium features).

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute
- Other endpoints: 100 requests per minute

## Error Responses

All API errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Username must be at least 3 characters long",
    "details": {
      "field": "username",
      "constraint": "min_length"
    }
  }
}
```

## Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

### React Hooks
```bash
npm install @supabase/auth-helpers-react
```

### Next.js Integration
```bash
npm install @supabase/auth-helpers-nextjs
```

## Example Usage

### Initialize Supabase Client
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)
```

### Fetch User Profile
```javascript
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id)
  .single()
```

### Create New Project
```javascript
const { data: project, error } = await supabase
  .from('projects')
  .insert({
    profile_id: profile.id,
    title: 'My New Project',
    description: 'Project description',
    technologies: ['React', 'Node.js']
  })
  .select()
  .single()
```

### Upload File
```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar.jpg`, file)
```

## Real-time Subscriptions

Listen to real-time changes:

```javascript
// Subscribe to profile changes
const profileSubscription = supabase
  .channel('profiles')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'profiles',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    console.log('Profile updated:', payload)
  })
  .subscribe()

// Subscribe to project changes
const projectSubscription = supabase
  .channel('projects')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects',
    filter: `profile_id=eq.${profile.id}`
  }, (payload) => {
    console.log('Project updated:', payload)
  })
  .subscribe()
```