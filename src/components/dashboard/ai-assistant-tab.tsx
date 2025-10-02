'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { User } from '@supabase/supabase-js';
import { Profile, Project, Skill, createProfile, createProject, createSkill, updateProfile } from '@/lib/supabase';
import { generateFullPortfolio } from '@/lib/ai';
import { toast } from 'sonner';
import {
  SparklesIcon,
  LoaderIcon,
  UserIcon,
  FolderIcon,
  TrophyIcon,
  CheckIcon,
  WandIcon,
} from 'lucide-react';

interface AIAssistantTabProps {
  user: User;
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  onDataUpdate: () => void;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

export function AIAssistantTab({ user, profile, projects, skills, onDataUpdate }: AIAssistantTabProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    role: profile?.role || '',
    experience: '',
    interests: '',
    goals: '',
  });
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState<GenerationStep[]>([
    {
      id: 'profile',
      title: 'Generate Profile & Bio',
      description: 'Creating your professional bio and profile information',
      completed: false,
      loading: false,
    },
    {
      id: 'skills',
      title: 'Suggest Skills',
      description: 'Analyzing your background to suggest relevant skills',
      completed: false,
      loading: false,
    },
    {
      id: 'projects',
      title: 'Create Sample Projects',
      description: 'Generating sample projects based on your expertise',
      completed: false,
      loading: false,
    },
    {
      id: 'complete',
      title: 'Portfolio Ready',
      description: 'Your AI-generated portfolio is complete!',
      completed: false,
      loading: false,
    },
  ]);

  const updateStep = (stepId: string, updates: Partial<GenerationStep>) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePortfolio = async () => {
    if (!formData.name || !formData.role) {
      toast.error('Please provide at least your name and role');
      return;
    }

    setGenerating(true);
    
    try {
      // Step 1: Generate complete portfolio data
      updateStep('profile', { loading: true });
      
      const portfolioData = await generateFullPortfolio({
        name: formData.name,
        role: formData.role,
      });

      updateStep('profile', { loading: false, completed: true });

      // Step 2: Create/Update Profile
      updateStep('skills', { loading: true });
      
      const profileData = {
        id: user.id,
        name: formData.name,
        role: formData.role,
        bio: portfolioData.bio,
        username: profile?.username || formData.name.toLowerCase().replace(/\s+/g, '-'),
        avatar_url: profile?.avatar_url || '',
        social_links: profile?.social_links || {},
        theme_selected: profile?.theme_selected || 'minimal',
      };

      if (profile) {
        await updateProfile(user.id, profileData);
      } else {
        await createProfile(profileData);
      }

      updateStep('skills', { loading: false, completed: true });

      // Step 3: Create Skills
      updateStep('projects', { loading: true });
      
      // Only add skills that don't already exist
      const existingSkillNames = skills.map(s => s.skill_name.toLowerCase());
      const newSkills = portfolioData.skills.filter(
        skill => !existingSkillNames.includes(skill.toLowerCase())
      );

      for (const skillName of newSkills) {
        try {
          await createSkill({
            user_id: user.id,
            skill_name: skillName,
            level: 'intermediate' as const,
          });
        } catch (error) {
          console.error(`Error creating skill ${skillName}:`, error);
        }
      }

      updateStep('projects', { loading: false, completed: true });

      // Step 4: Create Projects
      updateStep('complete', { loading: true });
      
      // Only create projects if user has few or none
      if (projects.length < 3) {
        for (const projectData of portfolioData.projects) {
          try {
            await createProject({
              user_id: user.id,
              title: projectData.title,
              description: projectData.description,
              tags: projectData.tags,
              image_url: '',
              live_url: undefined,
              repo_url: undefined,
            });
          } catch (error) {
            console.error(`Error creating project ${projectData.title}:`, error);
          }
        }
      }

      updateStep('complete', { loading: false, completed: true });

      toast.success('AI portfolio generation completed!');
      onDataUpdate();
      
    } catch (error) {
      console.error('Error generating portfolio:', error);
      toast.error('Failed to generate portfolio');
      
      // Reset loading states
      setSteps(prev => prev.map(step => ({ ...step, loading: false })));
    } finally {
      setGenerating(false);
    }
  };

  const resetGeneration = () => {
    setSteps(prev => prev.map(step => ({ 
      ...step, 
      completed: false, 
      loading: false 
    })));
  };

  const isFormValid = formData.name && formData.role;
  const hasContent = profile && projects.length > 0 && skills.length > 0;
  const generationComplete = steps.every(step => step.completed);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-5 text-white" />
        <h2 className="text-xl font-semibold text-white">AI Portfolio Assistant</h2>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <UserIcon className="size-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile ? '1' : '0'}</div>
            <div className="text-white/60 text-sm">Profile</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <FolderIcon className="size-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <div className="text-white/60 text-sm">Projects</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <TrophyIcon className="size-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{skills.length}</div>
            <div className="text-white/60 text-sm">Skills</div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Form */}
      {!hasContent && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <WandIcon className="size-5" />
              Generate Your Portfolio with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-white">Professional Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g. Frontend Developer, Designer"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="experience" className="text-white">Experience & Background</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Tell us about your work experience, education, or relevant background..."
                rows={3}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="interests" className="text-white">Interests & Technologies</Label>
              <Textarea
                id="interests"
                value={formData.interests}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                placeholder="What technologies, frameworks, or areas are you interested in?"
                rows={2}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div>
              <Label htmlFor="goals" className="text-white">Career Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                placeholder="What are your career aspirations or what kind of opportunities are you seeking?"
                rows={2}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={generatePortfolio}
                disabled={!isFormValid || generating}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {generating ? (
                  <>
                    <LoaderIcon className="size-4 mr-2 animate-spin" />
                    Generating Portfolio...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="size-4 mr-2" />
                    Generate Complete Portfolio
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {generating && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Generating Your Portfolio...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-600' 
                    : step.loading 
                      ? 'bg-blue-600' 
                      : 'bg-white/20'
                }`}>
                  {step.completed ? (
                    <CheckIcon className="size-4 text-white" />
                  ) : step.loading ? (
                    <LoaderIcon className="size-4 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-sm">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="text-white font-medium">{step.title}</div>
                  <div className="text-white/60 text-sm">{step.description}</div>
                </div>
              </div>
            ))}
            
            <div className="pt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {generationComplete && (
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30 backdrop-blur-sm">
          <CardContent className="py-8 text-center">
            <CheckIcon className="size-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Portfolio Generated Successfully!</h3>
            <p className="text-white/70 mb-6">
              Your AI-generated portfolio is ready. You can now customize it further or start sharing it!
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={resetGeneration}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Generate Again
              </Button>
              <Button
                onClick={() => window.open(`${window.location.origin}/u/${profile?.username}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Tips */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white text-lg">AI Assistant Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <SparklesIcon className="size-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Be Specific</div>
              <div className="text-white/60 text-sm">
                The more detailed information you provide, the better your AI-generated content will be.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <WandIcon className="size-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Customize After</div>
              <div className="text-white/60 text-sm">
                AI generates a great starting point. You can always edit and customize everything afterwards.
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckIcon className="size-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-white font-medium">Review Content</div>
              <div className="text-white/60 text-sm">
                Always review the generated content to ensure it accurately represents you and your work.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}