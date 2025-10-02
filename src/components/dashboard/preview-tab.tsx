'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';
import { Profile, Project, Skill } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  EyeIcon,
  ExternalLinkIcon,
  ShareIcon,
  QrCodeIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  LoaderIcon,
  CopyIcon,
  CheckIcon,
} from 'lucide-react';
import NextImage from 'next/image';

interface PreviewTabProps {
  user: User;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
}

export function PreviewTab({ user, profile, projects, skills }: PreviewTabProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const portfolioUrl = profile?.username 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/u/${profile.username}`
    : null;

  const copyToClipboard = async () => {
    if (!portfolioUrl) return;
    
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast.success('Portfolio URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const sharePortfolio = async () => {
    if (!portfolioUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Portfolio`,
          text: `Check out ${profile?.name}'s professional portfolio`,
          url: portfolioUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard();
    }
  };

  const openPortfolio = () => {
    if (!portfolioUrl) return;
    window.open(portfolioUrl, '_blank');
  };

  const getDeviceClasses = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-[640px]';
      case 'tablet':
        return 'w-[640px] h-[800px]';
      default:
        return 'w-full h-[800px]';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return SmartphoneIcon;
      case 'tablet':
        return TabletIcon;
      default:
        return MonitorIcon;
    }
  };

  // Mock portfolio preview component
  const PortfolioPreview = () => {
    if (!profile) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
          <div className="text-center text-white/60">
            <EyeIcon className="size-16 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Portfolio to Preview</h3>
            <p>Complete your profile to see the preview</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
        {/* Mock Portfolio Content */}
        <div className="h-full overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 text-center">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              {profile.avatar_url ? (
                <NextImage
                  src={profile.avatar_url}
                  alt={profile.name}
                  width={96}
                  height={96}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-white font-bold">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
            <p className="text-blue-100 text-lg mb-4">{profile.role}</p>
            <p className="text-blue-100 max-w-md mx-auto text-sm">{profile.bio}</p>
          </div>

          {/* Skills Section */}
          {skills.length > 0 && (
            <div className="p-6 bg-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-400 border-blue-600/30"
                  >
                    {skill.skill_name}
                  </Badge>
                ))}
                {skills.length > 8 && (
                  <Badge variant="secondary" className="bg-gray-600/20 text-gray-400">
                    +{skills.length - 8} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => (
                  <div
                    key={project.id}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                  >
                    {project.image_url && (
                      <div className="aspect-video bg-gray-700 relative">
                        <NextImage
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs border-gray-600 text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          <div className="p-6 bg-gray-800 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-gray-400 mb-4">
              Interested in working together? Let's connect!
            </p>
            <div className="flex justify-center gap-4">
              {Object.entries(profile.social_links || {}).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <Badge
                    key={platform}
                    variant="outline"
                    className="border-blue-600/30 text-blue-400 capitalize"
                  >
                    {platform}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
          <EyeIcon className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Portfolio Preview</h2>
        </div>
        
        {portfolioUrl && (
          <div className="flex gap-2">
            <Button
              onClick={sharePortfolio}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ShareIcon className="size-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={openPortfolio}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              <ExternalLinkIcon className="size-4 mr-2" />
              Open Live
            </Button>
          </div>
        )}
      </div>

      {/* Portfolio URL */}
      {portfolioUrl ? (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Your Portfolio URL</p>
                <code className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded">
                  {portfolioUrl}
                </code>
              </div>
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-yellow-500/10 border-yellow-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <p className="text-yellow-400">
              Complete your profile to get your portfolio URL and preview
            </p>
          </CardContent>
        </Card>
      )}

      {/* Device Selection */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">Preview Device</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => {
              const Icon = getDeviceIcon(device);
              return (
                <Button
                  key={device}
                  onClick={() => setPreviewDevice(device)}
                  variant={previewDevice === device ? 'default' : 'outline'}
                  size="sm"
                  className={
                    previewDevice === device
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border-white/20 text-white hover:bg-white/10'
                  }
                >
                  <Icon className="size-4 mr-2" />
                  {device.charAt(0).toUpperCase() + device.slice(1)}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className={`${getDeviceClasses()} border border-white/20 rounded-lg overflow-hidden`}>
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
                  <LoaderIcon className="size-8 text-white animate-spin" />
                </div>
              ) : (
                <PortfolioPreview />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{profile ? '✓' : '✗'}</div>
            <div className="text-white/60 text-sm">Profile Complete</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-white/60 text-sm">Projects Showcased</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{skills.length}</div>
            <div className="text-white/60 text-sm">Skills Listed</div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">Preview Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <EyeIcon className="size-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Real-time Updates</div>
              <div className="text-white/60 text-sm">
                Changes to your profile, projects, and skills are reflected immediately in the preview.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MonitorIcon className="size-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Responsive Design</div>
              <div className="text-white/60 text-sm">
                Your portfolio automatically adapts to different screen sizes and devices.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <ShareIcon className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Easy Sharing</div>
              <div className="text-white/60 text-sm">
                Share your portfolio URL with potential employers, clients, or collaborators.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}