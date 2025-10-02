import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Types for our database
export interface Profile {
  id: string
  email: string
  name: string
  role: string
  bio: string
  avatar_url: string
  skills: string[]
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  theme: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string
  tech_stack: string[]
  live_url?: string
  github_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}