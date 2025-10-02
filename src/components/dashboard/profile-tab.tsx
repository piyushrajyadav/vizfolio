'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { Profile, updateProfile, createProfile, uploadFile, getPublicUrl } from '@/lib/supabase';
import { generateBio } from '@/lib/ai';
import { toast } from 'sonner';
import {
  UserIcon,
  UploadIcon,
  SparklesIcon,
  LoaderIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  GlobeIcon,
  YoutubeIcon,
} from 'lucide-react';
import NextImage from 'next/image';

interface ProfileTabProps {
  user: User;
  profile: Profile | null;
  onProfileUpdate: () => void;
}

export function ProfileTab({ user, profile, onProfileUpdate }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    role: profile?.role || '',
    bio: profile?.bio || '',
    username: profile?.username || '',
    social_links: {
      github: profile?.social_links?.github || '',
      linkedin: profile?.social_links?.linkedin || '',
      instagram: profile?.social_links?.instagram || '',
      behance: profile?.social_links?.behance || '',
      youtube: profile?.social_links?.youtube || '',
      website: profile?.social_links?.website || '',
    }
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      const { error } = await uploadFile(file, 'avatars', fileName);
      if (error) throw error;

      const publicUrl = getPublicUrl('avatars', fileName);
      setAvatarUrl(publicUrl);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const generateAIBio = async () => {
    if (!formData.name || !formData.role) {
      toast.error('Please enter your name and role first');
      return;
    }

    try {
      setGeneratingBio(true);
      const bio = await generateBio({
        name: formData.name,
        role: formData.role,
      });
      setFormData(prev => ({ ...prev, bio }));
      toast.success('Bio generated successfully!');
    } catch (error) {
      console.error('Error generating bio:', error);
      toast.error('Failed to generate bio');
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role) {
      toast.error('Name and role are required');
      return;
    }

    // Generate username if not provided
    const username = formData.username || formData.name.toLowerCase().replace(/\s+/g, '-');

    try {
      setLoading(true);
      
      const profileData = {
        id: user.id,
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        username,
        avatar_url: avatarUrl,
        social_links: formData.social_links,
        theme_selected: profile?.theme_selected || 'minimal',
      };

      let result;
      if (profile) {
        result = await updateProfile(user.id, profileData);
      } else {
        result = await createProfile(profileData);
      }

      if (result.error) throw result.error;

      toast.success('Profile saved successfully!');
      onProfileUpdate();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserIcon className="size-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <NextImage
                      src={avatarUrl}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="size-8 text-white/60" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <UploadIcon className="size-4 mr-2" />
                  {loading ? 'Uploading...' : 'Upload Avatar'}
                </Button>
                <p className="text-white/60 text-sm mt-2">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-white">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g. Frontend Developer"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="your-unique-username"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
              <p className="text-white/60 text-sm mt-1">
                Your portfolio will be available at vizfolio.com/u/{formData.username || 'your-username'}
              </p>
            </div>

            {/* Bio Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="bio" className="text-white">Bio</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAIBio}
                  disabled={generatingBio || !formData.name || !formData.role}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {generatingBio ? (
                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                  ) : (
                    <SparklesIcon className="size-4 mr-2" />
                  )}
                  Generate with AI
                </Button>
              </div>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell visitors about yourself, your skills, and what you do..."
                rows={4}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Social Links */}
            <div>
              <Label className="text-white mb-4 block">Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github" className="text-white/80 text-sm">GitHub</Label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="github"
                      value={formData.social_links.github}
                      onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                      placeholder="https://github.com/yourusername"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="linkedin" className="text-white/80 text-sm">LinkedIn</Label>
                  <div className="relative">
                    <LinkedinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="linkedin"
                      value={formData.social_links.linkedin}
                      onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-white/80 text-sm">Instagram</Label>
                  <div className="relative">
                    <InstagramIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="instagram"
                      value={formData.social_links.instagram}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      placeholder="https://instagram.com/yourusername"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="text-white/80 text-sm">Website</Label>
                  <div className="relative">
                    <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="website"
                      value={formData.social_links.website}
                      onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="behance" className="text-white/80 text-sm">Behance</Label>
                  <div className="relative">
                    <GlobeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="behance"
                      value={formData.social_links.behance}
                      onChange={(e) => handleSocialLinkChange('behance', e.target.value)}
                      placeholder="https://behance.net/yourusername"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="youtube" className="text-white/80 text-sm">YouTube</Label>
                  <div className="relative">
                    <YoutubeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="youtube"
                      value={formData.social_links.youtube}
                      onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                      placeholder="https://youtube.com/c/yourchannel"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}