'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from '@supabase/supabase-js';
import { Skill, createSkill, deleteSkill } from '@/lib/supabase';
import { suggestSkills } from '@/lib/ai';
import { toast } from 'sonner';
import {
  TrophyIcon,
  PlusIcon,
  SparklesIcon,
  LoaderIcon,
  TrashIcon,
  StarIcon,
} from 'lucide-react';

interface SkillsTabProps {
  user: User;
  skills: Skill[];
  onSkillsUpdate: () => void;
}

export function SkillsTab({ user, skills, onSkillsUpdate }: SkillsTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    skill_name: '',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'expert',
  });
  const [loading, setLoading] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const resetForm = () => {
    setFormData({
      skill_name: '',
      level: 'intermediate',
    });
    setShowAddForm(false);
    setSuggestedSkills([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.skill_name.trim()) {
      toast.error('Skill name is required');
      return;
    }

    // Check if skill already exists
    if (skills.some(skill => skill.skill_name.toLowerCase() === formData.skill_name.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    try {
      setLoading(true);
      
      const skillData = {
        user_id: user.id,
        skill_name: formData.skill_name.trim(),
        level: formData.level,
      };

      const { error } = await createSkill(skillData);
      if (error) throw error;

      toast.success('Skill added successfully!');
      resetForm();
      onSkillsUpdate();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      setLoading(true);
      const { error } = await deleteSkill(skillId);
      if (error) throw error;

      toast.success('Skill deleted successfully!');
      onSkillsUpdate();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setLoading(false);
    }
  };

  const generateSkillSuggestions = async () => {
    if (skills.length === 0) {
      toast.error('Add a few skills first to get personalized suggestions');
      return;
    }

    try {
      setGeneratingSuggestions(true);
      const existingSkills = skills.map(skill => skill.skill_name);
      const suggestions = await suggestSkills({ skills: existingSkills });
      setSuggestedSkills(suggestions);
      toast.success('Skill suggestions generated!');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const addSuggestedSkill = async (skillName: string, level: 'beginner' | 'intermediate' | 'expert' = 'intermediate') => {
    // Check if skill already exists
    if (skills.some(skill => skill.skill_name.toLowerCase() === skillName.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    try {
      setLoading(true);
      
      const skillData = {
        user_id: user.id,
        skill_name: skillName,
        level,
      };

      const { error } = await createSkill(skillData);
      if (error) throw error;

      toast.success(`${skillName} added successfully!`);
      setSuggestedSkills(prev => prev.filter(s => s !== skillName));
      onSkillsUpdate();
    } catch (error) {
      console.error('Error adding suggested skill:', error);
      toast.error('Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'expert':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLevelStars = (level: string) => {
    const stars = level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;
    return Array.from({ length: 3 }, (_, i) => (
      <StarIcon
        key={i}
        className={`size-3 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`}
      />
    ));
  };

  // Group skills by level
  const skillsByLevel = skills.reduce((acc, skill) => {
    if (!acc[skill.level]) acc[skill.level] = [];
    acc[skill.level].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <TrophyIcon className="size-5 text-white" />
          <h2 className="text-xl font-semibold text-white">Skills ({skills.length})</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateSkillSuggestions}
            disabled={generatingSuggestions || skills.length === 0}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {generatingSuggestions ? (
              <LoaderIcon className="size-4 mr-2 animate-spin" />
            ) : (
              <SparklesIcon className="size-4 mr-2" />
            )}
            Get AI Suggestions
          </Button>
          {!showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="size-4 mr-2" />
              Add Skill
            </Button>
          )}
        </div>
      </div>

      {/* AI Suggestions */}
      {suggestedSkills.length > 0 && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-lg">AI Skill Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    <PlusIcon className="size-3 mr-1" />
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="skill_name" className="text-white">Skill Name *</Label>
                  <Input
                    id="skill_name"
                    value={formData.skill_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, skill_name: e.target.value }))}
                    placeholder="e.g. React, Python, Figma"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="level" className="text-white">Proficiency Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value as any }))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Learning)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Comfortable)</SelectItem>
                      <SelectItem value="expert">Expert (Advanced)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

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
                      Adding...
                    </>
                  ) : (
                    'Add Skill'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Skills Display */}
      {skills.length === 0 && !showAddForm ? (
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <TrophyIcon className="size-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No skills yet</h3>
            <p className="text-white/60 mb-4">
              Add your skills to showcase your expertise
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="size-4 mr-2" />
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Skills by Level */}
          {['expert', 'intermediate', 'beginner'].map((level) => {
            const levelSkills = skillsByLevel[level] || [];
            if (levelSkills.length === 0) return null;

            return (
              <Card key={level} className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white capitalize flex items-center gap-2">
                    <div className="flex">{getLevelStars(level)}</div>
                    {level} ({levelSkills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {levelSkills.map((skill) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <div className={`p-3 rounded-lg border flex items-center justify-between ${getLevelColor(skill.level)}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{skill.skill_name}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(skill.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                          >
                            <TrashIcon className="size-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* All Skills Grid - Alternative View */}
          {Object.keys(skillsByLevel).length === 0 && skills.length > 0 && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">All Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {skills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <div className={`p-3 rounded-lg border flex items-center justify-between ${getLevelColor(skill.level)}`}>
                        <div>
                          <div className="font-medium">{skill.skill_name}</div>
                          <div className="flex mt-1">{getLevelStars(skill.level)}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(skill.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
                        >
                          <TrashIcon className="size-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </motion.div>
  );
}