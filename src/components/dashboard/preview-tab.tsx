'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Profile, Project, Skill } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  EyeIcon,
  ExternalLinkIcon,
  CopyIcon,
  ShareIcon,
  CheckIcon,
  GlobeIcon,
  LinkIcon,
  DownloadIcon,
  RefreshCwIcon
} from 'lucide-react';

interface PreviewTabProps {
  user: User;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
}

export function PreviewTab({ user, profile, projects, skills }: PreviewTabProps) {
  const [isPublished, setIsPublished] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const username = profile?.name?.toLowerCase().replace(/\s+/g, '') || user.email?.split('@')[0] || 'user';
  const portfolioUrl = `https://vizfolio.com/u/${customUrl || username}`;

  useEffect(() => {
    // Check if portfolio is already published (simulate with localStorage)
    const published = localStorage.getItem(`portfolio_published_${user.id}`);
    setIsPublished(!!published);
    
    // Load custom URL if exists
    const savedUrl = localStorage.getItem(`custom_url_${user.id}`);
    if (savedUrl) {
      setCustomUrl(savedUrl);
    }
  }, [user.id]);

  const publishPortfolio = async () => {
    if (!profile) {
      toast.error('Please complete your profile first');
      return;
    }
    
    if (projects.length === 0) {
      toast.error('Please add at least one project');
      return;
    }

    try {
      // Simulate publishing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save publish status and custom URL
      localStorage.setItem(`portfolio_published_${user.id}`, 'true');
      if (customUrl) {
        localStorage.setItem(`custom_url_${user.id}`, customUrl);
      }
      
      setIsPublished(true);
      toast.success('Portfolio published successfully! 🎉');
    } catch (error) {
      console.error('Error publishing portfolio:', error);
      toast.error('Failed to publish portfolio. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const sharePortfolio = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Portfolio`,
          text: `Check out ${profile?.name}'s portfolio`,
          url: portfolioUrl,
        });
      } catch (error) {
        // User cancelled sharing or sharing failed
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const openPreview = () => {
    window.open('/preview', '_blank');
  };

  const downloadPortfolio = () => {
    toast.info('Download feature coming soon!');
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 5;

    if (profile?.name) completed++;
    if (profile?.bio) completed++;
    if (projects.length > 0) completed++;
    if (skills.length > 0) completed++;
    if (profile?.theme_selected) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();
  const isReadyToPublish = completionPercentage >= 60;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Preview & Publish</h1>
        <p className="text-white/70">Preview your portfolio and share it with the world</p>
      </motion.div>

      {/* Portfolio Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <GlobeIcon className="size-5" />
              Portfolio Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Completion Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Portfolio Completion</span>
                  <span className="text-white/70">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-2 rounded-full ${
                      completionPercentage >= 80 ? 'bg-green-500' :
                      completionPercentage >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <Badge 
                  variant="secondary" 
                  className={`${
                    isPublished ? 'bg-green-500/20 text-green-100' :
                    isReadyToPublish ? 'bg-yellow-500/20 text-yellow-100' :
                    'bg-red-500/20 text-red-100'
                  }`}
                >
                  {isPublished ? 'Published' : isReadyToPublish ? 'Ready to Publish' : 'Incomplete'}
                </Badge>
                
                {isPublished && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckIcon className="size-4" />
                    <span className="text-sm">Live at {portfolioUrl}</span>
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className={`flex items-center gap-2 ${profile?.name ? 'text-green-400' : 'text-white/60'}`}>
                  <CheckIcon className={`size-4 ${profile?.name ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-sm">Profile Information</span>
                </div>
                <div className={`flex items-center gap-2 ${profile?.bio ? 'text-green-400' : 'text-white/60'}`}>
                  <CheckIcon className={`size-4 ${profile?.bio ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-sm">Bio & Description</span>
                </div>
                <div className={`flex items-center gap-2 ${projects.length > 0 ? 'text-green-400' : 'text-white/60'}`}>
                  <CheckIcon className={`size-4 ${projects.length > 0 ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-sm">Projects ({projects.length})</span>
                </div>
                <div className={`flex items-center gap-2 ${skills.length > 0 ? 'text-green-400' : 'text-white/60'}`}>
                  <CheckIcon className={`size-4 ${skills.length > 0 ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-sm">Skills ({skills.length})</span>
                </div>
                <div className={`flex items-center gap-2 ${profile?.theme_selected ? 'text-green-400' : 'text-white/60'}`}>
                  <CheckIcon className={`size-4 ${profile?.theme_selected ? 'text-green-400' : 'text-white/40'}`} />
                  <span className="text-sm">Theme Selected</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom URL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LinkIcon className="size-5" />
              Portfolio URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customUrl" className="text-white">Custom URL (optional)</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex-1 flex">
                  <span className="bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-white/70 text-sm border-r-0">
                    vizfolio.com/u/
                  </span>
                  <Input
                    id="customUrl"
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder={username}
                    className="bg-white/10 border-white/20 text-white rounded-l-none"
                  />
                </div>
              </div>
              <p className="text-white/60 text-sm mt-1">
                Leave empty to use: vizfolio.com/u/{username}
              </p>
            </div>

            {/* URL Preview */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Your portfolio will be available at:</p>
                  <p className="text-white font-mono text-sm">{portfolioUrl}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
                  </Button>
                  {isPublished && (
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preview Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Preview & Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={openPreview}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col gap-2"
              >
                <EyeIcon className="size-6" />
                <span>Preview</span>
              </Button>

              <Button
                onClick={publishPortfolio}
                disabled={!isReadyToPublish}
                className={`${
                  isReadyToPublish ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                } text-white h-auto py-4 flex flex-col gap-2`}
              >
                <GlobeIcon className="size-6" />
                <span>{isPublished ? 'Update' : 'Publish'}</span>
              </Button>

              <Button
                onClick={sharePortfolio}
                disabled={!isPublished}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col gap-2 disabled:opacity-50"
              >
                <ShareIcon className="size-6" />
                <span>Share</span>
              </Button>

              <Button
                onClick={downloadPortfolio}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-auto py-4 flex flex-col gap-2"
              >
                <DownloadIcon className="size-6" />
                <span>Download</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      {isPublished && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Portfolio Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">142</div>
                  <div className="text-white/60 text-sm">Page Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">28</div>
                  <div className="text-white/60 text-sm">Unique Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">5</div>
                  <div className="text-white/60 text-sm">Project Clicks</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-white/70 text-sm">
              <p>• Make sure to complete at least 60% of your profile before publishing</p>
              <p>• Add multiple projects to showcase your skills effectively</p>
              <p>• Choose a theme that represents your personal brand</p>
              <p>• Use a custom URL to make your portfolio more memorable</p>
              <p>• Share your portfolio on social media and professional networks</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}