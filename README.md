# 🎨 Vizfolio - Professional Portfolio Builder

> **Create stunning, customizable portfolios in minutes with our modern, theme-based platform.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Vizfolio Preview](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop&q=80)

---

## 🌟 Overview

**Vizfolio** is a cutting-edge portfolio builder designed for modern professionals, freelancers, students, and creatives. Built with the latest web technologies, it offers multiple professionally designed themes, seamless authentication, and real-time portfolio management.

### 🎯 Perfect For
- **Freelancers** - Showcase your services and attract clients
- **Developers** - Display your projects and technical skills  
- **Designers** - Present your creative work beautifully
- **Students** - Build your professional presence
- **Photographers** - Create stunning image galleries

---

## ✨ Key Features

### 🎨 **Six Premium Themes**
- **Minimalist** - Clean, elegant design with serif typography
- **Professional** - Corporate blue palette for business professionals
- **Dark Mode** - Sleek dark theme with neon accents and glow effects
- **Glassmorphism** - Modern frosted glass cards with blur effects
- **Creative** - Bold colors and asymmetric layouts for artists
- **Photography** - Visual-focused layout with masonry grid

### 🔐 **Secure Authentication System**
- Email/password authentication with validation
- Email verification workflow
- Secure session management with Supabase
- Password strength requirements (6+ characters)

### � **Responsive & Accessible**
- Fully responsive design across all devices
- Dark/light mode support with system preference detection
- Optimized for performance with Next.js Image optimization
- SEO-friendly with proper meta tags

### ⚡ **Modern Development Stack**
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations and interactions
- **shadcn/ui** for consistent, accessible UI components

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 14, TypeScript | React framework with type safety |
| **Styling** | Tailwind CSS, shadcn/ui | Utility-first CSS and component library |
| **Animation** | Framer Motion | Smooth animations and transitions |
| **Backend** | Supabase | Authentication, database, and storage |
| **Database** | PostgreSQL (Supabase) | Structured data storage |
| **Storage** | Supabase Storage | Image and file hosting |
| **Deployment** | Vercel | Serverless deployment platform |

---

## 📁 Project Architecture

```
vizfolio/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📄 layout.tsx          # Root layout with providers
│   │   ├── 📄 page.tsx            # Landing page
│   │   ├── 📂 auth/               # Authentication
│   │   │   └── 📄 page.tsx        # Login/signup page
│   │   ├── 📂 dashboard/          # User dashboard
│   │   │   └── 📄 page.tsx        # Project management
│   │   └── 📂 preview/            # Theme preview
│   │       └── 📄 page.tsx        # Portfolio preview
│   ├── 📂 components/
│   │   ├── 📂 ui/                 # Reusable UI components
│   │   │   ├── 📄 floating-nav.tsx        # Navigation bar
│   │   │   ├── 📄 enhanced-hero-section.tsx
│   │   │   ├── 📄 auth-page.tsx           # Authentication form
│   │   │   ├── 📄 features-section.tsx    # Features showcase
│   │   │   ├── 📄 themes-section.tsx      # Theme gallery
│   │   │   ├── 📄 testimonials.tsx        # User testimonials
│   │   │   ├── 📄 beams-background.tsx    # Animated background
│   │   │   └── 📄 web-gl-shader.tsx       # WebGL effects
│   │   └── 📂 themes/             # Portfolio themes
│   │       ├── 📄 minimalist-theme.tsx
│   │       ├── 📄 dark-theme.tsx
│   │       ├── 📄 professional-theme.tsx
│   │       ├── 📄 glassmorphism-theme.tsx
│   │       ├── 📄 creative-theme.tsx
│   │       └── 📄 photography-theme.tsx
│   ├── 📂 lib/
│   │   ├── 📄 supabase.ts         # Supabase client config
│   │   ├── 📄 supabase-server.ts  # Server-side Supabase
│   │   └── 📄 utils.ts            # Utility functions
│   └── 📂 types/                  # TypeScript definitions
├── 📂 public/                     # Static assets
├── 📄 package.json               # Dependencies and scripts
├── 📄 tailwind.config.ts         # Tailwind configuration
├── 📄 next.config.ts             # Next.js configuration
└── 📄 README.md                  # Project documentation
```

---
│   ├── lib/
│   │   ├── utils.ts          # Utility functions
│   │   └── supabase.ts       # Supabase configuration
│   └── hooks/                # Custom React hooks
├── public/                   # Static assets
└── docs/                    # Documentation
```

## 🎨 Available Themes

### 1. Minimalist
- Clean white background with elegant typography
- Serif fonts and subtle shadows
- Perfect for writers and consultants

### 2. Dark Mode
- Sleek dark theme with neon accents
- Glow effects and modern animations
- Ideal for developers and tech professionals

### 3. Professional (Coming Soon)
- Corporate blue palette
- Grid-based layout with neat cards
- Great for business professionals

### 4. Glassmorphism (Coming Soon)
- Frosted glass cards with blur effects
- Gradient backgrounds
- Futuristic aesthetic

### 5. Creative (Coming Soon)
- Bold colors and asymmetric layouts
- Hover animations
- Perfect for designers and artists

### 6. Photography (Coming Soon)
- Masonry-style gallery grid
- Minimal text, focus on visuals
- Ideal for photographers and visual artists

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vizfolio.git
   cd vizfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Supabase credentials to `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Schema

### Profiles Table
```sql
create table profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  name text,
  role text,
  bio text,
  avatar_url text,
  skills text[],
  social_links jsonb,
  theme text default 'minimalist',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);
```

### Projects Table
```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  tech_stack text[],
  live_url text,
  github_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

## 🚀 Deployment

1. **Deploy to Vercel**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Set up environment variables** in Vercel dashboard

3. **Configure custom domain** (optional)

## 🎯 Roadmap

- [ ] Add remaining 4 themes
- [ ] Implement Supabase authentication
- [ ] Add project CRUD operations
- [ ] Implement image upload with Supabase Storage
- [ ] Add portfolio publishing system
- [ ] Create admin dashboard
- [ ] Add analytics and metrics
- [ ] Implement custom domain support
- [ ] Add portfolio templates
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Acknowledgments

- Design inspiration from modern portfolio websites
- UI components from shadcn/ui
- Animations powered by Framer Motion
- Backend services by Supabase
# vizfolio
