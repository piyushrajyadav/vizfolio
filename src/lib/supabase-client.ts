import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Profile {
  id: string
  user_id: string
  username: string | null
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  location: string | null
  skills: string[] | null
  theme: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  profile_id: string
  title: string
  description: string | null
  image_url: string | null
  demo_url: string | null
  github_url: string | null
  technologies: string[] | null
  category: string | null
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

// Database functions
export const profileService = {
  // Get profile by user ID
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  },

  // Get profile by username
  async getProfileByUsername(username: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .eq('is_public', true)
      .single()
    
    if (error) {
      console.error('Error fetching profile by username:', error)
      return null
    }
    
    return data
  },

  // Create or update profile
  async upsertProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()
    
    if (error) {
      console.error('Error upserting profile:', error)
      return null
    }
    
    return data
  },

  // Delete profile
  async deleteProfile(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error deleting profile:', error)
      return false
    }
    
    return true
  }
}

export const projectService = {
  // Get projects by profile ID
  async getProjectsByProfile(profileId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('profile_id', profileId)
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    
    return data || []
  },

  // Get featured projects by profile ID
  async getFeaturedProjects(profileId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('profile_id', profileId)
      .eq('featured', true)
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching featured projects:', error)
      return []
    }
    
    return data || []
  },

  // Create project
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating project:', error)
      return null
    }
    
    return data
  },

  // Update project
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating project:', error)
      return null
    }
    
    return data
  },

  // Delete project
  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting project:', error)
      return false
    }
    
    return true
  },

  // Reorder projects
  async reorderProjects(projectIds: string[]): Promise<boolean> {
    const updates = projectIds.map((id, index) => ({
      id,
      order_index: index
    }))

    const { error } = await supabase
      .from('projects')
      .upsert(updates)
    
    if (error) {
      console.error('Error reordering projects:', error)
      return false
    }
    
    return true
  }
}

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    return { data, error }
  },

  // Sign in with email
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { data, error }
  },

  // Sign in with OAuth provider
  async signInWithProvider(provider: 'google' | 'github' | 'discord') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    return { data, error }
  }
}

export const storageService = {
  // Upload avatar
  async uploadAvatar(file: File, userId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  },

  // Upload project image
  async uploadProjectImage(file: File, projectId: string): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${projectId}-${Math.random()}.${fileExt}`
    const filePath = `projects/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('projects')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading project image:', uploadError)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('projects')
      .getPublicUrl(filePath)

    return publicUrl
  },

  // Delete file
  async deleteFile(bucket: string, path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  }
}