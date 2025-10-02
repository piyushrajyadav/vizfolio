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
import { Project, createProject, updateProject, deleteProject, uploadFile, getPublicUrl } from '@/lib/supabase';
import { generateProjectDescription } from '@/lib/ai';
import { toast } from 'sonner';
import {
  FolderIcon,
  PlusIcon,
  UploadIcon,
  SparklesIcon,
  LoaderIcon,
  EditIcon,
  TrashIcon,
  ExternalLinkIcon,
  GithubIcon,
  EyeIcon,
} from 'lucide-react';
import NextImage from 'next/image';

interface ProjectsTabProps {
  user: User;
  projects: Project[];
  onProjectsUpdate: () => void;
}

export function ProjectsTab({ user, projects, onProjectsUpdate }: ProjectsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    repo_url: '',
    live_url: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tags: '',
      repo_url: '',
      live_url: '',
      image_url: '',
    });
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/projects/${Date.now()}.${fileExt}`;
      
      const { error } = await uploadFile(file, 'project-images', fileName);
      if (error) throw error;

      const publicUrl = getPublicUrl('project-images', fileName);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const generateAIDescription = async () => {
    if (!formData.title) {
      toast.error('Please enter a project title first');
      return;
    }

    try {
      setGeneratingDescription(true);
      const description = await generateProjectDescription({
        title: formData.title,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setFormData(prev => ({ ...prev, description }));
      toast.success('Description generated successfully!');
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      
      const projectData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        repo_url: formData.repo_url || undefined,
        live_url: formData.live_url || undefined,
        image_url: formData.image_url || '',
      };

      let result;
      if (editingProject) {
        result = await updateProject(editingProject.id, projectData);
      } else {
        result = await createProject(projectData);
      }

      if (result.error) throw result.error;

      toast.success(editingProject ? 'Project updated successfully!' : 'Project created successfully!');
      resetForm();
      onProjectsUpdate();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      tags: project.tags.join(', '),
      repo_url: project.repo_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || '',
    });
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      setLoading(true);
      const { error } = await deleteProject(projectId);
      if (error) throw error;

      toast.success('Project deleted successfully!');
      onProjectsUpdate();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderIcon className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Projects ({projects.length})</h2>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <PlusIcon className="size-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Project Image Upload */}
              <div>
                <Label className="text-white">Project Image</Label>
                <div className="mt-2">
                  {formData.image_url ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white/10 border border-white/20">
                      <NextImage
                        src={formData.image_url}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white border-0"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition-colors"
                    >
                      <UploadIcon className="size-8 text-white/60 mb-2" />
                      <p className="text-white/60">Click to upload project image</p>
                      <p className="text-white/40 text-sm">JPG, PNG or GIF (max 10MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-white">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="My Awesome Project"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="repo_url" className="text-white">GitHub URL</Label>
                  <div className="relative">
                    <GithubIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="repo_url"
                      value={formData.repo_url}
                      onChange={(e) => handleInputChange('repo_url', e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="live_url" className="text-white">Live Demo URL</Label>
                  <div className="relative">
                    <ExternalLinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
                    <Input
                      id="live_url"
                      value={formData.live_url}
                      onChange={(e) => handleInputChange('live_url', e.target.value)}
                      placeholder="https://yourproject.com"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="text-white">Technologies</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
                <p className="text-white/60 text-sm mt-1">
                  Separate technologies with commas
                </p>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description" className="text-white">Description *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateAIDescription}
                    disabled={generatingDescription || !formData.title}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {generatingDescription ? (
                      <LoaderIcon className="size-4 mr-2 animate-spin" />
                    ) : (
                      <SparklesIcon className="size-4 mr-2" />
                    )}
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project, its features, and what problems it solves..."
                  rows={4}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="size-4 mr-2 animate-spin" />
                      {editingProject ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingProject ? 'Update Project' : 'Create Project'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length === 0 && !showAddForm ? (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <FolderIcon className="size-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-white/60 mb-4">
              Add your first project to showcase your work
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="size-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all h-full">
                <CardContent className="p-0">
                  {/* Project Image */}
                  {project.image_url && (
                    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                      <NextImage
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    {/* Project Title */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                      {project.title}
                    </h3>
                    
                    {/* Project Description */}
                    <p className="text-white/70 text-sm mb-3 line-clamp-3">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-white/10 text-white/80 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="bg-white/10 text-white/80 text-xs"
                          >
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Project Links */}
                    <div className="flex items-center gap-2 mb-4">
                      {project.repo_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(project.repo_url!, '_blank')}
                          className="border-white/20 text-white hover:bg-white/10 flex-1"
                        >
                          <GithubIcon className="size-4 mr-1" />
                          Code
                        </Button>
                      )}
                      {project.live_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(project.live_url!, '_blank')}
                          className="border-white/20 text-white hover:bg-white/10 flex-1"
                        >
                          <EyeIcon className="size-4 mr-1" />
                          Live
                        </Button>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(project)}
                        className="border-white/20 text-white hover:bg-white/10 flex-1"
                      >
                        <EditIcon className="size-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(project.id)}
                        className="border-red-400/50 text-red-400 hover:bg-red-500/20"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}