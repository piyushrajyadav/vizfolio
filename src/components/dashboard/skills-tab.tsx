'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Skill, addSkill, updateSkill, deleteSkill } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  PlusIcon, 
  SparklesIcon, 
  TrashIcon,
  LoaderIcon,
  BrainIcon
} from 'lucide-react';

interface SkillsTabProps {
  user: User;
  skills: Skill[];
  refreshData: () => void;
}

const skillLevels = [
  { value: 'beginner', label: 'Beginner', color: 'bg-yellow-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-blue-500' },
  { value: 'expert', label: 'Expert', color: 'bg-green-500' },
];

const suggestedSkills = {
  'Frontend Developer': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular'],
  'Backend Developer': ['Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Spring Boot', 'PostgreSQL', 'MongoDB', 'Redis'],
  'Full Stack Developer': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS'],
  'Mobile Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development', 'Android Development', 'Firebase'],
  'Data Scientist': ['Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'Jupyter'],
  'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Jenkins', 'Terraform', 'Linux', 'Git', 'CI/CD'],
  'UI/UX Designer': ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'User Research', 'Prototyping', 'Wireframing'],
  'default': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'HTML', 'CSS', 'SQL', 'Docker', 'AWS']
};

export function SkillsTab({ user, skills, refreshData }: SkillsTabProps) {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'intermediate' });
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    // Check if skill already exists
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.name.toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    setLoading(true);
    try {
      await addSkill({
        user_id: user.id,
        skill_name: newSkill.name.trim(),
        name: newSkill.name.trim(),
        level: newSkill.level as 'beginner' | 'intermediate' | 'expert'
      });
      setNewSkill({ name: '', level: 'intermediate' });
      toast.success('Skill added successfully!');
      refreshData();
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkillLevel = async (skillId: string, newLevel: string) => {
    try {
      await updateSkill(skillId, { level: newLevel as 'beginner' | 'intermediate' | 'expert' });
      toast.success('Skill level updated!');
      refreshData();
    } catch (error) {
      console.error('Error updating skill:', error);
      toast.error('Failed to update skill level.');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await deleteSkill(skillId);
      toast.success('Skill deleted successfully!');
      refreshData();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill. Please try again.');
    }
  };

  const suggestSkillsWithAI = async () => {
    setSuggesting(true);
    try {
      // Get suggested skills based on existing skills or default
      let suggestedList: string[] = [];
      
      // Try to determine role from existing skills or use default
      const existingSkills = skills.map(s => s.name.toLowerCase());
      
      if (existingSkills.some(s => ['react', 'vue', 'angular', 'frontend'].includes(s))) {
        suggestedList = suggestedSkills['Frontend Developer'];
      } else if (existingSkills.some(s => ['node', 'express', 'django', 'backend'].includes(s))) {
        suggestedList = suggestedSkills['Backend Developer'];
      } else if (existingSkills.some(s => ['python', 'machine learning', 'tensorflow'].includes(s))) {
        suggestedList = suggestedSkills['Data Scientist'];
      } else if (existingSkills.some(s => ['docker', 'kubernetes', 'aws', 'devops'].includes(s))) {
        suggestedList = suggestedSkills['DevOps Engineer'];
      } else {
        suggestedList = suggestedSkills['default'];
      }

      // Filter out skills that already exist
      const newSuggestions = suggestedList.filter(skill => 
        !skills.some(existingSkill => 
          existingSkill.name.toLowerCase() === skill.toLowerCase()
        )
      ).slice(0, 5); // Limit to 5 suggestions

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add suggested skills
      for (const skillName of newSuggestions) {
        await addSkill({
          user_id: user.id,
          skill_name: skillName,
          name: skillName,
          level: 'intermediate'
        });
      }

      if (newSuggestions.length > 0) {
        toast.success(`Added ${newSuggestions.length} suggested skills!`);
        refreshData();
      } else {
        toast.info('No new skills to suggest based on your current skills');
      }
    } catch (error) {
      console.error('Error suggesting skills:', error);
      toast.error('Failed to suggest skills. Please try again.');
    } finally {
      setSuggesting(false);
    }
  };

  const getLevelColor = (level: string) => {
    return skillLevels.find(l => l.value === level)?.color || 'bg-gray-500';
  };

  const groupedSkills = {
    expert: skills.filter(skill => skill.level === 'expert'),
    intermediate: skills.filter(skill => skill.level === 'intermediate'),
    beginner: skills.filter(skill => skill.level === 'beginner'),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-white/70">Showcase your expertise and knowledge</p>
        </div>
        <Button
          onClick={suggestSkillsWithAI}
          disabled={suggesting}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {suggesting ? (
            <LoaderIcon className="size-4 mr-2 animate-spin" />
          ) : (
            <SparklesIcon className="size-4 mr-2" />
          )}
          ✨ Suggest Skills with AI
        </Button>
      </motion.div>

      {/* Add New Skill */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white">Add New Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSkill} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter skill name (e.g., React, Python, Figma)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="w-40">
                <Select
                  value={newSkill.level}
                  onValueChange={(value) => setNewSkill(prev => ({ ...prev, level: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${level.color}`} />
                          {level.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <LoaderIcon className="size-4 mr-2 animate-spin" />
                ) : (
                  <PlusIcon className="size-4 mr-2" />
                )}
                Add
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Display */}
      {skills.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainIcon className="size-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No skills added yet</h3>
          <p className="text-white/70 mb-6">Start building your skills profile to showcase your expertise</p>
          <Button
            onClick={suggestSkillsWithAI}
            disabled={suggesting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {suggesting ? (
              <LoaderIcon className="size-4 mr-2 animate-spin" />
            ) : (
              <SparklesIcon className="size-4 mr-2" />
            )}
            ✨ Get AI Suggestions
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Expert Skills */}
          {groupedSkills.expert.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    Expert Level ({groupedSkills.expert.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {groupedSkills.expert.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-green-500/20 text-green-100 text-sm py-2 px-4 cursor-pointer hover:bg-green-500/30 transition-colors"
                        >
                          {skill.name}
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                          >
                            <TrashIcon className="size-3" />
                          </button>
                        </Badge>
                        <div className="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                            Click to change level
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Intermediate Skills */}
          {groupedSkills.intermediate.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    Intermediate Level ({groupedSkills.intermediate.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {groupedSkills.intermediate.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-500/20 text-blue-100 text-sm py-2 px-4 cursor-pointer hover:bg-blue-500/30 transition-colors"
                        >
                          {skill.name}
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                          >
                            <TrashIcon className="size-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Beginner Skills */}
          {groupedSkills.beginner.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    Beginner Level ({groupedSkills.beginner.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {groupedSkills.beginner.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-yellow-500/20 text-yellow-100 text-sm py-2 px-4 cursor-pointer hover:bg-yellow-500/30 transition-colors"
                        >
                          {skill.name}
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                          >
                            <TrashIcon className="size-3" />
                          </button>
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Skills Summary */}
      {skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {groupedSkills.expert.length}
                  </div>
                  <div className="text-white/60 text-sm">Expert Skills</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {groupedSkills.intermediate.length}
                  </div>
                  <div className="text-white/60 text-sm">Intermediate Skills</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {groupedSkills.beginner.length}
                  </div>
                  <div className="text-white/60 text-sm">Learning Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}