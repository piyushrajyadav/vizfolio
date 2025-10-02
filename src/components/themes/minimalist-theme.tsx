'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, GithubIcon, LinkedinIcon, TwitterIcon, MailIcon } from "lucide-react";
import Image from "next/image";

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

interface MinimalistThemeProps {
  profile: Profile;
  projects: Project[];
}

export function MinimalistTheme({ profile, projects }: MinimalistThemeProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-neutral-100"
              />
            </motion.div>
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-2"
              >
                {profile.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-neutral-600 mb-4"
              >
                {profile.role}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-neutral-700 leading-relaxed mb-6 max-w-2xl"
              >
                {profile.bio}
              </motion.p>
              
              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex gap-4"
              >
                {profile.social.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="size-4" />
                    </a>
                  </Button>
                )}
                {profile.social.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <LinkedinIcon className="size-4" />
                    </a>
                  </Button>
                )}
                {profile.social.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                      <TwitterIcon className="size-4" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${profile.email}`}>
                    <MailIcon className="size-4" />
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Skills */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-bold text-neutral-900 mb-8 text-center"
          >
            Skills & Expertise
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-sm px-4 py-2">
                {skill}
              </Badge>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-bold text-neutral-900 mb-12 text-center"
          >
            Featured Projects
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-neutral-200">
                  <div className="aspect-video overflow-hidden rounded-t-lg relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {project.title}
                    </h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLinkIcon className="size-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-12 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-serif font-bold text-neutral-900 mb-4"
          >
            Let&apos;s Work Together
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-600 mb-6"
          >
            I&apos;m always interested in new opportunities and collaborations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" asChild>
              <a href={`mailto:${profile.email}`}>
                Get In Touch
              </a>
            </Button>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}