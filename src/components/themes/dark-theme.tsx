'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, GithubIcon, LinkedinIcon, TwitterIcon, CodeIcon, MailIcon } from 'lucide-react';
import NextImage from 'next/image';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface Profile {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills: string[];
}

interface DarkThemeProps {
  profile: Profile;
  projects: Project[];
}

export function DarkTheme({ profile, projects }: DarkThemeProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-cyan-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="flex flex-col lg:flex-row gap-12 items-center text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-md opacity-50 animate-pulse" />
                <NextImage
                  src={profile.avatar}
                  alt={profile.name}
                  width={160}
                  height={160}
                  className="relative w-40 h-40 rounded-full object-cover border-4 border-gray-700"
                />
              </motion.div>
              
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-4"
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {profile.name}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-xl text-gray-300">
                    <CodeIcon className="size-5" />
                    <span className="font-mono">{profile.role}</span>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-gray-300 leading-relaxed mb-8 max-w-2xl font-mono text-lg"
                >
                  {profile.bio}
                </motion.p>
                
                {/* Social Links with Glow Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="flex gap-4 justify-center lg:justify-start"
                >
                  {profile.social.github && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="size-5" />
                      </a>
                    </Button>
                  )}
                  {profile.social.linkedin && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <LinkedinIcon className="size-5" />
                      </a>
                    </Button>
                  )}
                  {profile.social.twitter && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      asChild
                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                        <TwitterIcon className="size-5" />
                      </a>
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild
                    className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                  >
                    <a href={`mailto:${profile.email}`}>
                      <MailIcon className="size-5" />
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </header>

        {/* Skills */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              &lt; Skills /&gt;
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {profile.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg blur-sm group-hover:blur-none transition-all duration-300" />
                  <Badge 
                    variant="secondary" 
                    className="relative bg-gray-800/80 border border-gray-700 text-gray-200 px-4 py-2 text-sm font-mono hover:bg-gray-700/80 transition-colors duration-300"
                  >
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              function showProjects() {"{"}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="h-full bg-gray-800/50 border-gray-700 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="aspect-video overflow-hidden rounded-t-lg relative">
                      <NextImage
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed font-mono text-sm">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="outline" 
                            className="text-xs border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors duration-300"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        {project.liveUrl && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                          >
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLinkIcon className="size-4 mr-2" />
                              Live
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                          >
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <GithubIcon className="size-4 mr-2" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-12"
            >
              <span className="text-2xl font-bold text-purple-400 font-mono">{"}"}</span>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to collaborate?
              </h3>
              <p className="text-gray-300 font-mono">
                {/* Let's build something amazing together */}
                Let&apos;s build something amazing together
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                <a href={`mailto:${profile.email}`}>
                  <MailIcon className="size-5 mr-2" />
                  Start a Conversation
                </a>
              </Button>
            </motion.div>
          </div>
        </footer>
      </div>
    </div>
  );
}