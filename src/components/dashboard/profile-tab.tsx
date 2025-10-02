'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Profile, updateProfile, uploadAvatar } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  UploadIcon, 
  SparklesIcon, 
  SaveIcon, 
  UserIcon,
  LoaderIcon,
  LinkIcon
} from 'lucide-react';

interface ProfileTabProps {
  user: User;
  profile: Profile | null;
  refreshData: () => void;
}

export function ProfileTab({ user, profile, refreshData }: ProfileTabProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    role: profile?.role || '',
    tagline: profile?.tagline || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    website: profile?.website || '',
    github: profile?.github || '',
    linkedin: profile?.linkedin || '',
    twitter: profile?.twitter || '',
    instagram: profile?.instagram || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { data: avatarUrl, error } = await uploadAvatar(file, user.id);
      if (error) {
        throw new Error(error.message || 'Failed to upload avatar');
      }
      setFormData(prev => ({ ...prev, avatar_url: avatarUrl || '' }));
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const generateBioWithAI = async () => {
    if (!formData.name || !formData.role) {
      toast.error('Please enter your name and role first');
      return;
    }

    setGeneratingBio(true);
    try {
      // Simulate AI bio generation for now
      const sampleBios = [
        `Passionate ${formData.role} with expertise in creating innovative solutions. I love turning complex problems into simple, beautiful designs. Always eager to learn new technologies and collaborate with amazing teams.`,
        `Creative ${formData.role} focused on building user-centered experiences. With a strong foundation in modern development practices, I bring ideas to life through clean code and thoughtful design.`,
        `Experienced ${formData.role} dedicated to crafting exceptional digital experiences. I combine technical expertise with creative vision to deliver impactful solutions that make a difference.`
      ];
      
      const randomBio = sampleBios[Math.floor(Math.random() * sampleBios.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormData(prev => ({ ...prev, bio: randomBio }));
      toast.success('Bio generated successfully!');
    } catch (error) {
      console.error('Error generating bio:', error);
      toast.error('Failed to generate bio. Please try again.');
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(user.id, formData);
      toast.success('Profile updated successfully!');
      refreshData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-4">Profile Information</h1>
        <p className="text-white/70">Tell the world about yourself</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Avatar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {formData.avatar_url ? (
                  <img 
                    src={formData.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <UserIcon className={`size-12 text-white ${formData.avatar_url ? 'hidden' : ''}`} />
              </div>
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {uploading ? (
                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                  ) : (
                    <UploadIcon className="size-4 mr-2" />
                  )}
                  {uploading ? 'Uploading...' : 'Upload Avatar'}
                </Button>
                <p className="text-white/60 text-sm">JPG, PNG, or GIF. Max 5MB.</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
            
            {/* Avatar URL fallback */}
            <div>
              <Label htmlFor="avatar_url" className="text-white">Avatar URL (optional)</Label>
              <Input
                id="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-white">Professional Role *</Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="Full Stack Developer"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="tagline" className="text-white">Tagline</Label>
              <Input
                id="tagline"
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Building amazing web experiences"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Bio</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={generateBioWithAI}
                disabled={generatingBio}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {generatingBio ? (
                  <LoaderIcon className="size-4 mr-2 animate-spin" />
                ) : (
                  <SparklesIcon className="size-4 mr-2" />
                )}
                ✨ Generate Bio with AI
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell visitors about yourself, your experience, and what makes you unique..."
              rows={4}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <LinkIcon className="size-5" />
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website" className="text-white">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="github" className="text-white">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  placeholder="https://github.com/username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-white">LinkedIn</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="text-white">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {loading ? (
              <LoaderIcon className="size-4 mr-2 animate-spin" />
            ) : (
              <SaveIcon className="size-4 mr-2" />
            )}
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}