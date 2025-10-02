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

// Database types
export interface Profile {
  id: string
  name: string
  role: string
  bio: string
  avatar_url: string
  tagline?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  instagram?: string
  social_links: {
    github?: string
    linkedin?: string
    instagram?: string
    behance?: string
    youtube?: string
    website?: string
  }
  subscription_plan: 'free' | 'pro' | 'enterprise'
  subscription_status: 'active' | 'cancelled' | 'expired'
  subscription_ends_at?: string
  theme_selected: string
  username: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  image_url: string
  tags: string[]
  live_url?: string
  repo_url?: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  user_id: string
  skill_name: string
  name: string
  level: 'beginner' | 'intermediate' | 'expert'
  created_at: string
}

// Profile functions
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function createProfile(profile: Omit<Profile, 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()
  return { data, error }
}

// Project functions
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  return { data, error }
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  return { error }
}

// Skill functions
export async function getSkills(userId: string) {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('user_id', userId)
    .order('skill_name', { ascending: true })
  return { data, error }
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single()
  return { data, error }
}

export async function updateSkill(id: string, skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)
  return { error }
}

// Alias functions for better naming
export const addProject = createProject
export const addSkill = createSkill

// Upload avatar function
export async function uploadAvatar(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`
  
  const { data, error } = await uploadFile(file, 'avatars', filePath)
  
  if (error) return { data: null, error }
  
  const publicUrl = getPublicUrl('avatars', filePath)
  return { data: publicUrl, error: null }
}

// File upload function
export async function uploadFile(file: File, bucket: string, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    return { data, error }
  } catch (error) {
    const err = error as Error & { message?: string; status?: number };
    console.error('Storage upload error:', error)
    return { 
      data: null, 
      error: { 
        message: err.message || 'Storage upload failed',
        status: err.status || 500
      } 
    }
  }
}

// Get public URL for uploaded files
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}