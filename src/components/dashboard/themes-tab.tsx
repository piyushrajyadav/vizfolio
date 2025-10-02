'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Profile, updateProfile } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckIcon,
  EyeIcon,
  PaletteIcon
} from 'lucide-react';

interface ThemesTabProps {
  user: User;
  profile: Profile | null;
  refreshData: () => void;
}

const themes = [
  {
    id: 'minimal',
    name: 'Minimal White',
    description: 'Clean and minimalist design with focus on content',
    preview: '/themes/minimal-preview.jpg',
    tags: ['Clean', 'Professional', 'Minimal'],
    color: 'from-gray-100 to-white'
  },
  {
    id: 'dark',
    name: 'Professional Dark',
    description: 'Dark theme perfect for developers and tech professionals',
    preview: '/themes/dark-preview.jpg',
    tags: ['Dark', 'Professional', 'Tech'],
    color: 'from-gray-900 to-black'
  },
  {
    id: 'creative',
    name: 'Creative Neon',
    description: 'Bold and creative with vibrant colors and gradients',
    preview: '/themes/creative-preview.jpg',
    tags: ['Creative', 'Colorful', 'Bold'],
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'grid',
    name: 'Grid Portfolio',
    description: 'Grid-based layout showcasing projects in an organized manner',
    preview: '/themes/grid-preview.jpg',
    tags: ['Grid', 'Organized', 'Portfolio'],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Modern glassmorphism design with blur effects and transparency',
    preview: '/themes/glass-preview.jpg',
    tags: ['Modern', 'Glass', 'Blur'],
    color: 'from-indigo-600 to-purple-600'
  },
  {
    id: 'playful',
    name: 'Playful Colors',
    description: 'Fun and vibrant theme with playful animations and colors',
    preview: '/themes/playful-preview.jpg',
    tags: ['Fun', 'Vibrant', 'Animated'],
    color: 'from-orange-500 to-red-500'
  },
];

export function ThemesTab({ user, profile, refreshData }: ThemesTabProps) {
  const [selectedTheme, setSelectedTheme] = useState(profile?.theme_selected || 'minimal');
  const [loading, setLoading] = useState(false);

  const handleThemeSelect = async (themeId: string) => {
    setLoading(true);
    try {
      await updateProfile(user.id, { theme_selected: themeId });
      setSelectedTheme(themeId);
      toast.success('Theme updated successfully!');
      refreshData();
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewTheme = (themeId: string) => {
    // Open preview in new tab with theme parameter
    window.open(`/preview?theme=${themeId}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Choose Your Theme</h1>
        <p className="text-white/70">Select a theme that represents your style and personality</p>
      </motion.div>

      {/* Current Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PaletteIcon className="size-5" />
              Current Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTheme ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.color || 'from-gray-400 to-gray-600'}`} />
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {themes.find(t => t.id === selectedTheme)?.name || 'Unknown Theme'}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {themes.find(t => t.id === selectedTheme)?.description || 'No description available'}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => previewTheme(selectedTheme)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <EyeIcon className="size-4 mr-2" />
                  Preview Live
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/70">No theme selected yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className={`bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden transition-all duration-200 hover:bg-white/15 hover:scale-105 ${
              selectedTheme === theme.id ? 'ring-2 ring-blue-500' : ''
            }`}>
              {/* Theme Preview */}
              <div className="relative">
                <div className={`aspect-video bg-gradient-to-br ${theme.color} flex items-center justify-center relative overflow-hidden`}>
                  {/* Mock preview content */}
                  <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 bg-white/20 rounded-full mb-2" />
                      <div className="w-16 h-2 bg-white/20 rounded mb-1" />
                      <div className="w-12 h-1 bg-white/15 rounded" />
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-1 bg-white/15 rounded" />
                      <div className="w-3/4 h-1 bg-white/15 rounded" />
                      <div className="w-1/2 h-1 bg-white/15 rounded" />
                    </div>
                  </div>
                  
                  {/* Selected indicator */}
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="size-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Preview button overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={() => previewTheme(theme.id)}
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                  >
                    <EyeIcon className="size-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              {/* Theme Info */}
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{theme.name}</h3>
                    <p className="text-white/70 text-sm">{theme.description}</p>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {theme.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="bg-white/10 text-white/80 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={() => handleThemeSelect(theme.id)}
                    disabled={loading || selectedTheme === theme.id}
                    className={`w-full ${
                      selectedTheme === theme.id
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {selectedTheme === theme.id ? (
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
      </motion.div>

      {/* Coming Soon Themes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="w-full h-24 bg-gradient-to-br from-teal-600 to-green-600 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white/60 text-sm">Preview</span>
                </div>
                <h4 className="text-white font-medium">Nature Theme</h4>
                <p className="text-white/60 text-xs">Inspired by nature</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="w-full h-24 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white/60 text-sm">Preview</span>
                </div>
                <h4 className="text-white font-medium">Elegant Theme</h4>
                <p className="text-white/60 text-xs">Sophisticated design</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="w-full h-24 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-white/60 text-sm">Preview</span>
                </div>
                <h4 className="text-white font-medium">Retro Theme</h4>
                <p className="text-white/60 text-xs">Vintage aesthetics</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">More themes coming soon! Stay tuned for updates.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}