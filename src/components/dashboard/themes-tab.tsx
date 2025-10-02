'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import { Profile, updateProfile } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  PaletteIcon,
  CheckIcon,
  EyeIcon,
  LoaderIcon,
} from 'lucide-react';
import NextImage from 'next/image';

interface ThemesTabProps {
  user: User;
  profile: Profile | null;
  onProfileUpdate: () => void;
}

const themes = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with focus on content',
    preview: '/themes/minimal-preview.jpg',
    colors: ['#ffffff', '#000000', '#6366f1'],
    features: ['Clean Typography', 'Minimalist Layout', 'Professional Look'],
    category: 'Professional',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Modern dark theme with striking visuals',
    preview: '/themes/dark-preview.jpg',
    colors: ['#0f0f23', '#1e1e2e', '#8b5cf6'],
    features: ['Dark Interface', 'Gradient Accents', 'Modern Design'],
    category: 'Modern',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Vibrant and artistic theme for creative professionals',
    preview: '/themes/creative-preview.jpg',
    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    features: ['Colorful Design', 'Artistic Elements', 'Creative Layouts'],
    category: 'Creative',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional business theme with clean lines',
    preview: '/themes/corporate-preview.jpg',
    colors: ['#1e3a8a', '#3b82f6', '#60a5fa'],
    features: ['Business Style', 'Professional Colors', 'Corporate Layout'],
    category: 'Professional',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Perfect for showcasing your work and projects',
    preview: '/themes/portfolio-preview.jpg',
    colors: ['#059669', '#10b981', '#34d399'],
    features: ['Project Focus', 'Gallery Style', 'Work Showcase'],
    category: 'Portfolio',
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Warm and friendly theme for personal branding',
    preview: '/themes/personal-preview.jpg',
    colors: ['#dc2626', '#ef4444', '#f87171'],
    features: ['Personal Touch', 'Warm Colors', 'Friendly Design'],
    category: 'Personal',
  },
];

export function ThemesTab({ user, profile, onProfileUpdate }: ThemesTabProps) {
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme_selected || 'minimal');
  const [loading, setLoading] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);

  const handleThemeSelect = async (themeId: string) => {
    if (!profile) {
      toast.error('Please complete your profile first');
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await updateProfile(user.id, {
        theme_selected: themeId,
      });

      if (error) throw error;

      setSelectedTheme(themeId);
      toast.success('Theme updated successfully!');
      onProfileUpdate();
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (themeId: string) => {
    // In a real app, this would open a preview in a modal or new tab
    const portfolioUrl = `${window.location.origin}/u/${profile?.username}?theme=${themeId}`;
    window.open(portfolioUrl, '_blank');
  };

  // Group themes by category
  const themesByCategory = themes.reduce((acc, theme) => {
    if (!acc[theme.category]) acc[theme.category] = [];
    acc[theme.category].push(theme);
    return acc;
  }, {} as Record<string, typeof themes>);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PaletteIcon className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Portfolio Themes</h2>
        </div>
        <Badge variant="outline" className="border-white/20 text-white">
          Current: {themes.find(t => t.id === selectedTheme)?.name || 'Minimal'}
        </Badge>
      </div>

      {/* Theme Categories */}
      <div className="space-y-8">
        {Object.entries(themesByCategory).map(([category, categoryThemes]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-white mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryThemes.map((theme) => (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className={`bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all h-full ${
                    selectedTheme === theme.id ? 'ring-2 ring-blue-500' : ''
                  }`}>
                    <CardContent className="p-0">
                      {/* Theme Preview Image */}
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-800 to-gray-900">
                        {theme.preview ? (
                          <NextImage
                            src={theme.preview}
                            alt={`${theme.name} theme preview`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-white/60">
                              <PaletteIcon className="size-12 mx-auto mb-2" />
                              <p>Preview Coming Soon</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Current Theme Badge */}
                        {selectedTheme === theme.id && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-blue-600 text-white">
                              <CheckIcon className="size-3 mr-1" />
                              Current
                            </Badge>
                          </div>
                        )}

                        {/* Preview Button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPreview(theme.id)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <EyeIcon className="size-3 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        {/* Theme Info */}
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {theme.name}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {theme.description}
                          </p>
                        </div>

                        {/* Color Palette */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-white/60 text-sm">Colors:</span>
                          <div className="flex gap-1">
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {theme.features.map((feature, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-white/10 text-white/80 text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleThemeSelect(theme.id)}
                          disabled={loading || selectedTheme === theme.id}
                          className={`w-full ${
                            selectedTheme === theme.id
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white`}
                        >
                          {loading ? (
                            <LoaderIcon className="size-4 mr-2 animate-spin" />
                          ) : selectedTheme === theme.id ? (
                            <>
                              <CheckIcon className="size-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            'Select Theme'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Customization Coming Soon */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="py-8 text-center">
          <PaletteIcon className="size-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Theme Customization</h3>
          <p className="text-white/60 mb-4">
            Advanced theme customization options coming soon! You'll be able to modify colors, fonts, and layouts.
          </p>
          <Badge variant="outline" className="border-white/20 text-white">
            Coming Soon
          </Badge>
        </CardContent>
      </Card>

      {/* Preview Instructions */}
      {profile?.username && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">Preview Your Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 mb-4">
              Your portfolio is live at:{' '}
              <code className="bg-white/10 px-2 py-1 rounded text-blue-400">
                vizfolio.com/u/{profile.username}
              </code>
            </p>
            <Button
              onClick={() => window.open(`${window.location.origin}/u/${profile.username}`, '_blank')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <EyeIcon className="size-4 mr-2" />
              View Live Portfolio
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}