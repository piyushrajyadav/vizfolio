'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { updateProfile, addProject, addSkill } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  SparklesIcon,
  LoaderIcon,
  UserIcon,
  BrainIcon,
  FolderIcon,
  SaveIcon
} from 'lucide-react';

interface AIAssistantTabProps {
  user: User;
  refreshData: () => void;
}

interface GeneratedContent {
  bio: string;
  skills: Array<{
    name: string;
    level: 'beginner' | 'intermediate' | 'expert';
  }>;
  projects: Array<{
    title: string;
    description: string;
    tags: string[];
  }>;
}

export function AIAssistantTab({ user, refreshData }: AIAssistantTabProps) {
  const [formData, setFormData] = useState({
    name: '',
    role: ''
  });
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim()) {
      toast.error('Please enter both name and role');
      return;
    }

    setGenerating(true);
    try {
      // Simulate AI generation with realistic content
      const roleBasedContent = getRoleBasedContent(formData.role);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generated: GeneratedContent = {
        bio: `Passionate ${formData.role} with expertise in creating innovative solutions. I love turning complex problems into simple, beautiful designs and have experience working with modern technologies. Always eager to learn new technologies and collaborate with amazing teams to build impactful products that make a difference.`,
        skills: roleBasedContent.skills,
        projects: roleBasedContent.projects.map(project => ({
          ...project,
          title: project.title.replace('{name}', formData.name)
        }))
      };

      setGeneratedContent(generated);
      setEditingContent(JSON.parse(JSON.stringify(generated))); // Deep copy for editing
      toast.success('Portfolio content generated successfully!');
    } catch (error) {
      console.error('Error generating portfolio:', error);
      toast.error('Failed to generate portfolio. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const getRoleBasedContent = (role: string) => {
    const roleKey = role.toLowerCase();
    
    if (roleKey.includes('frontend') || roleKey.includes('react') || roleKey.includes('ui')) {
      return {
        skills: [
          { name: 'React', level: 'expert' as const },
          { name: 'JavaScript', level: 'expert' as const },
          { name: 'TypeScript', level: 'intermediate' as const },
          { name: 'HTML5', level: 'expert' as const },
          { name: 'CSS3', level: 'expert' as const },
          { name: 'Tailwind CSS', level: 'intermediate' as const },
          { name: 'Next.js', level: 'intermediate' as const },
          { name: 'Git', level: 'intermediate' as const },
          { name: 'Figma', level: 'beginner' as const },
          { name: 'Responsive Design', level: 'expert' as const }
        ],
        projects: [
          {
            title: 'E-commerce Dashboard',
            description: 'A modern, responsive e-commerce dashboard built with React and TypeScript. Features real-time analytics, product management, and order tracking with a clean, intuitive interface.',
            tags: ['React', 'TypeScript', 'Dashboard', 'E-commerce']
          },
          {
            title: 'Task Management App',
            description: 'A collaborative task management application with drag-and-drop functionality, real-time updates, and team collaboration features. Built with modern web technologies.',
            tags: ['React', 'JavaScript', 'Collaboration', 'Productivity']
          },
          {
            title: 'Portfolio Website',
            description: 'A responsive portfolio website showcasing creative projects and skills. Features smooth animations, optimized performance, and modern design principles.',
            tags: ['Next.js', 'Tailwind CSS', 'Portfolio', 'Animation']
          }
        ]
      };
    } else if (roleKey.includes('backend') || roleKey.includes('server') || roleKey.includes('api')) {
      return {
        skills: [
          { name: 'Node.js', level: 'expert' as const },
          { name: 'Python', level: 'intermediate' as const },
          { name: 'Express.js', level: 'expert' as const },
          { name: 'PostgreSQL', level: 'intermediate' as const },
          { name: 'MongoDB', level: 'intermediate' as const },
          { name: 'REST APIs', level: 'expert' as const },
          { name: 'GraphQL', level: 'beginner' as const },
          { name: 'Docker', level: 'intermediate' as const },
          { name: 'AWS', level: 'beginner' as const },
          { name: 'Git', level: 'intermediate' as const }
        ],
        projects: [
          {
            title: 'RESTful API Service',
            description: 'A scalable RESTful API service built with Node.js and Express. Features authentication, data validation, rate limiting, and comprehensive documentation.',
            tags: ['Node.js', 'Express.js', 'API', 'Authentication']
          },
          {
            title: 'Microservices Architecture',
            description: 'A microservices-based application with multiple services communicating through APIs. Includes service discovery, load balancing, and monitoring.',
            tags: ['Microservices', 'Docker', 'API Gateway', 'Scalability']
          },
          {
            title: 'Database Management System',
            description: 'A comprehensive database management system with CRUD operations, advanced querying, and data analytics capabilities.',
            tags: ['PostgreSQL', 'Database Design', 'Analytics', 'Performance']
          }
        ]
      };
    } else if (roleKey.includes('full') || roleKey.includes('fullstack')) {
      return {
        skills: [
          { name: 'React', level: 'expert' as const },
          { name: 'Node.js', level: 'expert' as const },
          { name: 'JavaScript', level: 'expert' as const },
          { name: 'TypeScript', level: 'intermediate' as const },
          { name: 'PostgreSQL', level: 'intermediate' as const },
          { name: 'MongoDB', level: 'intermediate' as const },
          { name: 'Express.js', level: 'expert' as const },
          { name: 'Docker', level: 'beginner' as const },
          { name: 'AWS', level: 'beginner' as const },
          { name: 'Git', level: 'intermediate' as const }
        ],
        projects: [
          {
            title: 'Social Media Platform',
            description: 'A full-stack social media platform with real-time messaging, file uploads, user authentication, and responsive design. Built with modern web technologies.',
            tags: ['React', 'Node.js', 'Real-time', 'Social Media']
          },
          {
            title: 'E-learning Platform',
            description: 'A comprehensive e-learning platform with course management, video streaming, progress tracking, and payment integration.',
            tags: ['Full-stack', 'Education', 'Video Streaming', 'Payments']
          },
          {
            title: 'Project Management Tool',
            description: 'A collaborative project management tool with task assignment, time tracking, file sharing, and team communication features.',
            tags: ['Collaboration', 'Project Management', 'Real-time', 'Productivity']
          }
        ]
      };
    } else {
      // Default content for other roles
      return {
        skills: [
          { name: 'JavaScript', level: 'intermediate' as const },
          { name: 'Python', level: 'intermediate' as const },
          { name: 'HTML5', level: 'intermediate' as const },
          { name: 'CSS3', level: 'intermediate' as const },
          { name: 'Git', level: 'beginner' as const },
          { name: 'Problem Solving', level: 'expert' as const },
          { name: 'Communication', level: 'expert' as const },
          { name: 'Teamwork', level: 'expert' as const },
          { name: 'Project Management', level: 'intermediate' as const },
          { name: 'Research', level: 'intermediate' as const }
        ],
        projects: [
          {
            title: 'Professional Portfolio',
            description: 'A modern, responsive portfolio website showcasing skills, projects, and professional experience with clean design and smooth user experience.',
            tags: ['Portfolio', 'Responsive', 'Professional']
          },
          {
            title: 'Data Analysis Project',
            description: 'A comprehensive data analysis project exploring trends and insights from real-world datasets using modern analytical tools and techniques.',
            tags: ['Data Analysis', 'Research', 'Insights']
          },
          {
            title: 'Automation Tool',
            description: 'An automation tool designed to streamline workflow processes and improve productivity through intelligent task management and optimization.',
            tags: ['Automation', 'Productivity', 'Tools']
          }
        ]
      };
    }
  };

  const updateEditingContent = (section: keyof GeneratedContent, index: number, field: string, value: string | string[]) => {
    if (!editingContent) return;
    
    const updated = { ...editingContent };
    if (section === 'bio') {
      updated.bio = value as string;
    } else if (section === 'skills') {
      const skill = updated.skills[index] as Record<string, string | string[]>;
      skill[field] = value;
    } else if (section === 'projects') {
      const project = updated.projects[index] as Record<string, string | string[]>;
      project[field] = value;
    }
    setEditingContent(updated);
  };

  const saveGeneratedContent = async () => {
    if (!editingContent) return;

    setSaving(true);
    try {
      // Save profile with bio
      await updateProfile(user.id, {
        name: formData.name,
        role: formData.role,
        bio: editingContent.bio
      });

      // Add skills
      for (const skill of editingContent.skills) {
        await addSkill({
          user_id: user.id,
          skill_name: skill.name,
          name: skill.name,
          level: skill.level as 'beginner' | 'intermediate' | 'expert'
        });
      }

      // Add projects
      for (const project of editingContent.projects) {
        await addProject({
          user_id: user.id,
          title: project.title,
          description: project.description,
          tags: project.tags,
          image_url: '',
          live_url: '',
          repo_url: ''
        });
      }

      toast.success('Portfolio content saved successfully!');
      refreshData();
      setGeneratedContent(null);
      setEditingContent(null);
      setFormData({ name: '', role: '' });
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <SparklesIcon className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">✨ AI Portfolio Assistant</h1>
        <p className="text-white/70">Let AI create your complete portfolio in seconds</p>
      </motion.div>

      {!generatedContent ? (
        /* Input Form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Tell us about yourself</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={generatePortfolio} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Your Name *</Label>
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
                  <Label htmlFor="role" className="text-white">Your Professional Role *</Label>
                  <Input
                    id="role"
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Full Stack Developer"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <p className="text-white/60 text-sm mt-1">
                    e.g., Frontend Developer, Data Scientist, UI/UX Designer
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={generating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {generating ? (
                    <>
                      <LoaderIcon className="size-4 mr-2 animate-spin" />
                      Generating your portfolio...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-4 mr-2" />
                      ✨ Generate My Portfolio
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Generated Content Preview */
        <div className="space-y-6">
          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserIcon className="size-5" />
                  Generated Bio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={editingContent?.bio || ''}
                  onChange={(e) => updateEditingContent('bio', 0, 'bio', e.target.value)}
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BrainIcon className="size-5" />
                  Generated Skills ({editingContent?.skills.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {editingContent?.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <span className="text-white font-medium">{skill.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          skill.level === 'expert' ? 'bg-green-500/20 text-green-100' :
                          skill.level === 'intermediate' ? 'bg-blue-500/20 text-blue-100' :
                          'bg-yellow-500/20 text-yellow-100'
                        }`}
                      >
                        {skill.level}
                      </Badge>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderIcon className="size-5" />
                  Generated Projects ({editingContent?.projects.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingContent?.projects.map((project, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <Input
                      value={project.title}
                      onChange={(e) => updateEditingContent('projects', index, 'title', e.target.value)}
                      className="bg-white/10 border-white/20 text-white font-semibold mb-2"
                    />
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateEditingContent('projects', index, 'description', e.target.value)}
                      rows={2}
                      className="bg-white/10 border-white/20 text-white mb-2"
                    />
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )) || []}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <Button
              onClick={() => {
                setGeneratedContent(null);
                setEditingContent(null);
              }}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Generate Again
            </Button>
            <Button
              onClick={saveGeneratedContent}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {saving ? (
                <>
                  <LoaderIcon className="size-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="size-4 mr-2" />
                  Save to Portfolio
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}

      {/* AI Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">✨ AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UserIcon className="size-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Smart Bio Generation</h3>
                <p className="text-white/60 text-sm">AI crafts professional bios tailored to your role</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BrainIcon className="size-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Relevant Skills</h3>
                <p className="text-white/60 text-sm">Suggests industry-relevant skills with appropriate levels</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FolderIcon className="size-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Project Ideas</h3>
                <p className="text-white/60 text-sm">Generates realistic project examples for your portfolio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}