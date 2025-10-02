'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, getProfile, getProjects, getSkills, Profile, Project, Skill } from '@/lib/supabase';
import { 
  HomeIcon, 
  UserIcon, 
  FolderIcon, 
  BrainIcon, 
  PaletteIcon, 
  SparklesIcon, 
  EyeIcon,
  LoaderIcon
} from 'lucide-react';

import { DashboardHome } from '@/components/dashboard/dashboard-home';
import { ProfileTab } from '@/components/dashboard/profile-tab';
import { ProjectsTab } from '@/components/dashboard/projects-tab';
import { SkillsTab } from '@/components/dashboard/skills-tab';
import { ThemesTab } from '@/components/dashboard/themes-tab';
import { AIAssistantTab } from '@/components/dashboard/ai-assistant-tab';
import { PreviewTab } from '@/components/dashboard/preview-tab';

interface DashboardTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: DashboardTab[] = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'projects', label: 'Projects', icon: FolderIcon },
  { id: 'skills', label: 'Skills', icon: BrainIcon },
  { id: 'themes', label: 'Themes', icon: PaletteIcon },
  { id: 'ai-assistant', label: 'AI Assistant', icon: SparklesIcon },
  { id: 'preview', label: 'Preview/Publish', icon: EyeIcon },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser();
      if (error || !currentUser) {
        window.location.href = '/auth';
        return;
      }

      setUser(currentUser);
      
      const [profileResult, projectsResult, skillsResult] = await Promise.all([
        getProfile(currentUser.id),
        getProjects(currentUser.id),
        getSkills(currentUser.id)
      ]);

      setProfile(profileResult.data);
      setProjects(projectsResult.data || []);
      setSkills(skillsResult.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <LoaderIcon className="size-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">Please sign in to access your dashboard</p>
          <a href="/auth" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome user={user} profile={profile} projects={projects} skills={skills} onNavigate={setActiveTab} refreshData={refreshData} />;
      case 'profile':
        return <ProfileTab user={user} profile={profile} refreshData={refreshData} />;
      case 'projects':
        return <ProjectsTab user={user} projects={projects} refreshData={refreshData} />;
      case 'skills':
        return <SkillsTab user={user} skills={skills} refreshData={refreshData} />;
      case 'themes':
        return <ThemesTab user={user} profile={profile} refreshData={refreshData} />;
      case 'ai-assistant':
        return <AIAssistantTab user={user} refreshData={refreshData} />;
      case 'preview':
        return <PreviewTab user={user} profile={profile} projects={projects} skills={skills} />;
      default:
        return <DashboardHome user={user} profile={profile} projects={projects} skills={skills} onNavigate={setActiveTab} refreshData={refreshData} />;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="relative z-10 flex">
        <div className="w-64 min-h-screen bg-black/20 backdrop-blur-sm border-r border-white/20 p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white backdrop-blur-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.email?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {profile?.name || user.email}
                  </p>
                  <p className="text-white/60 text-sm truncate">
                    {profile?.role || 'Portfolio Builder'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
