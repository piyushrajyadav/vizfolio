'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BeamsBackground } from '@/components/ui/beams-background';
import { getCurrentUser, getProfile, getProjects, getSkills, Profile, Project, Skill } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import {
  UserIcon,
  FolderIcon,
  BrainIcon,
  PaletteIcon,
  SparklesIcon,
  EyeIcon,
  SettingsIcon,
  LoaderIcon,
} from 'lucide-react';

import { ProfileTab } from '@/components/dashboard/profile-tab';
import { ProjectsTab } from '@/components/dashboard/projects-tab';
import { SkillsTab } from '@/components/dashboard/skills-tab';
import { ThemesTab } from '@/components/dashboard/themes-tab';
import { AIAssistantTab } from '@/components/dashboard/ai-assistant-tab';
import { PreviewTab } from '@/components/dashboard/preview-tab';

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'projects', label: 'Projects', icon: FolderIcon },
  { id: 'skills', label: 'Skills', icon: BrainIcon },
  { id: 'themes', label: 'Themes', icon: PaletteIcon },
  { id: 'ai-assistant', label: 'AI Assistant', icon: SparklesIcon },
  { id: 'preview', label: 'Preview', icon: EyeIcon },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { user } = await getCurrentUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await getProfile(user.id);
        setProfile(profileData);
        
        const { data: projectsData } = await getProjects(user.id);
        setProjects(projectsData || []);
        
        const { data: skillsData } = await getSkills(user.id);
        setSkills(skillsData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const { data: profileData } = await getProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshProjects = async () => {
    if (user) {
      const { data: projectsData } = await getProjects(user.id);
      setProjects(projectsData || []);
    }
  };

  const refreshSkills = async () => {
    if (user) {
      const { data: skillsData } = await getSkills(user.id);
      setSkills(skillsData || []);
    }
  };

  const refreshData = async () => {
    await Promise.all([
      refreshProfile(),
      refreshProjects(),
      refreshSkills(),
    ]);
  };

  if (loading) {
    return (
      <BeamsBackground className="min-h-screen" intensity="medium">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 text-white">
            <LoaderIcon className="size-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </BeamsBackground>
    );
  }

  if (!user) {
    return (
      <BeamsBackground className="min-h-screen" intensity="medium">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8">
            <CardContent className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
              <p className="text-white/70 mb-6">Please sign in to access your dashboard</p>
              <Button asChild>
                <a href="/auth">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </BeamsBackground>
    );
  }

  return (
    <BeamsBackground className="min-h-screen" intensity="medium">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back{profile?.name ? `, ${profile.name}` : ''}!
              </h1>
              <p className="text-white/70">
                {profile?.role || 'Set up your profile to get started'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setActiveTab('preview')}
              >
                <EyeIcon className="size-4 mr-2" />
                Preview Portfolio
              </Button>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <SettingsIcon className="size-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 rounded-lg bg-white/10 p-1 backdrop-blur-sm overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-md py-3 px-4 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <ProfileTab 
                key="profile"
                user={user} 
                profile={profile} 
                onProfileUpdate={refreshProfile}
              />
            )}
            {activeTab === 'projects' && (
              <ProjectsTab 
                key="projects"
                user={user}
                projects={projects}
                onProjectsUpdate={refreshProjects}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsTab 
                key="skills"
                user={user}
                skills={skills}
                onSkillsUpdate={refreshSkills}
              />
            )}
            {activeTab === 'themes' && (
              <ThemesTab 
                key="themes"
                user={user}
                profile={profile}
                onProfileUpdate={refreshProfile}
              />
            )}
            {activeTab === 'ai-assistant' && (
              <AIAssistantTab 
                key="ai-assistant"
                user={user}
                profile={profile}
                projects={projects}
                skills={skills}
                onDataUpdate={refreshData}
              />
            )}
            {activeTab === 'preview' && (
              <PreviewTab 
                key="preview"
                user={user}
                profile={profile}
                projects={projects}
                skills={skills}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </BeamsBackground>
  );
}