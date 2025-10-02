'use client';

import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Profile, Project, Skill } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  ExternalLinkIcon, 
  EditIcon, 
  SparklesIcon,
  FolderIcon,
  UserIcon,
  BrainIcon,
  PaletteIcon,
  EyeIcon
} from 'lucide-react';

interface DashboardHomeProps {
  user: User;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  onNavigate: (tab: string) => void;
  refreshData: () => void;
}

export function DashboardHome({ user, profile, projects, skills, onNavigate, refreshData }: DashboardHomeProps) {
  const hasPortfolio = profile && projects.length > 0;
  const username = profile?.name?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0];

  const shortcutCards = [
    { title: 'Edit Profile', icon: UserIcon, tab: 'profile', description: 'Update your personal information' },
    { title: 'Add Projects', icon: FolderIcon, tab: 'projects', description: 'Showcase your work' },
    { title: 'Manage Skills', icon: BrainIcon, tab: 'skills', description: 'List your expertise' },
    { title: 'Choose Theme', icon: PaletteIcon, tab: 'themes', description: 'Customize your portfolio' },
  ];

  const themesPreviews = [
    { name: 'Minimal White', image: '/themes/minimal-preview.jpg' },
    { name: 'Professional Dark', image: '/themes/dark-preview.jpg' },
    { name: 'Creative Neon', image: '/themes/creative-preview.jpg' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Hi {profile?.name || user.email?.split('@')[0]}, welcome back 👋
        </h1>
        <p className="text-white/70 text-lg">
          Ready to build something amazing today?
        </p>
      </motion.div>

      {/* Portfolio Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            {hasPortfolio ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Live Portfolio</h3>
                    <p className="text-white/70 text-sm">vizfolio.com/u/{username}</p>
                    <p className="text-white/60 text-xs mt-1">Last updated: Just now</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate('preview')}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <EyeIcon className="size-4 mr-2" />
                      View Live
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onNavigate('profile')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <EditIcon className="size-4 mr-2" />
                      Edit Portfolio
                    </Button>
                  </div>
                </div>
                
                {/* Portfolio Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{projects.length}</div>
                    <div className="text-white/60 text-sm">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{skills.length}</div>
                    <div className="text-white/60 text-sm">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">1</div>
                    <div className="text-white/60 text-sm">Theme</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderIcon className="size-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">You haven&apos;t created a portfolio yet</h3>
                <p className="text-white/70 mb-6">Get started by adding your profile information</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => onNavigate('profile')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Start Building
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('ai-assistant')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <SparklesIcon className="size-4 mr-2" />
                    ✨ Generate with AI
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shortcutCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-105"
                onClick={() => onNavigate(card.tab)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{card.title}</h3>
                  <p className="text-white/60 text-sm">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Theme Inspiration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Theme Inspiration</h2>
          <Button
            variant="outline"
            onClick={() => onNavigate('themes')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            See All Themes
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themesPreviews.map((theme, index) => (
            <Card
              key={theme.name}
              className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-105"
              onClick={() => onNavigate('themes')}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <span className="text-white/60">Preview Image</span>
              </div>
              <CardContent className="p-4">
                <h3 className="text-white font-semibold">{theme.name}</h3>
                <p className="text-white/60 text-sm">Click to preview</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}