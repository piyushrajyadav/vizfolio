-- Vizfolio Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username VARCHAR(50) UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  location TEXT,
  skills TEXT[],
  theme VARCHAR(50) DEFAULT 'minimalist',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT profiles_username_check CHECK (username ~ '^[a-zA-Z0-9_-]+$'),
  CONSTRAINT profiles_username_length CHECK (length(username) >= 3)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  category VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security Policies

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profiles and public profiles
CREATE POLICY "Users can view own profile and public profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = user_id OR is_public = true
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = user_id
  );

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (
    auth.uid() = user_id
  );

-- Projects RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can view projects of public profiles and their own projects
CREATE POLICY "Users can view projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = projects.profile_id
      AND (profiles.user_id = auth.uid() OR profiles.is_public = true)
    )
  );

-- Users can insert projects to their own profile
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = projects.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true)
ON CONFLICT DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
  );

-- Storage policies for project images
CREATE POLICY "Project images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Users can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'projects' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own project images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'projects' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own project images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'projects' AND 
    auth.role() = 'authenticated'
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_is_public_idx ON public.profiles(is_public);
CREATE INDEX IF NOT EXISTS projects_profile_id_idx ON public.projects(profile_id);
CREATE INDEX IF NOT EXISTS projects_featured_idx ON public.projects(featured);
CREATE INDEX IF NOT EXISTS projects_order_idx ON public.projects(order_index);

-- Insert sample themes (optional)
INSERT INTO public.profiles (user_id, username, full_name, bio, theme, is_public)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'demo-user', 'Demo User', 'This is a demo portfolio', 'minimalist', true)
ON CONFLICT DO NOTHING;