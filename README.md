# 🚀 Vizfolio - Modern Portfolio Builder

Create stunning portfolios with multiple themes. Perfect for freelancers, students, and professionals.

![Vizfolio Hero](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop)

## ✨ Features

- 🎨 **6 Beautiful Themes** - Minimalist, Dark, Professional, Glassmorphism, Creative, Photography
- 🔐 **Secure Authentication** - Google, GitHub, Discord OAuth + Email/Password
- 📱 **Fully Responsive** - Looks great on all devices
- ⚡ **Lightning Fast** - Built with Next.js 14 and optimized for performance
- 🌙 **Dark/Light Mode** - Interactive theme switcher with smooth transitions
- 📊 **Real-time Dashboard** - Manage projects with live preview
- 🔗 **Custom URLs** - Share your portfolio with memorable links
- 📸 **Image Upload** - Supabase Storage integration for project images
- 🎯 **SEO Optimized** - Meta tags and structured data for better visibility

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion
- **Backend**: Supabase (Auth, Storage, Database)
- **Deployment**: Vercel

## 📁 Project Structure

```
vizfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication page
│   │   ├── dashboard/         # User dashboard
│   │   ├── preview/           # Theme preview page
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── background-paths.tsx
│   │   │   ├── auth-page.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── themes-section.tsx
│   │   │   ├── how-it-works-section.tsx
│   │   │   ├── footer-section.tsx
│   │   │   ├── web-gl-shader.tsx
│   │   │   └── liquid-button.tsx
│   │   └── themes/            # Portfolio themes
│   │       ├── minimalist-theme.tsx
│   │       └── dark-theme.tsx
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
