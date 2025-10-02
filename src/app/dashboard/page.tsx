'use client';

import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, FolderIcon, UserIcon, PaletteIcon, SettingsIcon, ExternalLinkIcon } from "lucide-react";
import { motion } from "framer-motion";

// Mock data - in real app this would come from Supabase
const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack React application with payment integration",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    tech: ["Vue.js", "Firebase", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    createdAt: "2024-02-10"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "Personal portfolio built with Next.js and modern animations",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=200&fit=crop",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
    createdAt: "2024-03-05"
  }
];

export default function Dashboard() {
  return (
    <div className="relative flex w-full flex-col items-center justify-start overflow-hidden min-h-screen">
      <WebGLShader />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto p-6">
        {/* Dashboard Header */}
        <div className="relative border border-[#27272a] p-6 mb-8 rounded-lg backdrop-blur-sm bg-black/20">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 text-white text-center text-5xl md:text-7xl font-extrabold tracking-tighter"
            >
              Welcome to Your Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 px-6 text-center text-sm md:text-lg"
            >
              Manage your projects, customize your portfolio, and share your work with the world.
            </motion.p>
            
            <div className="my-8 flex items-center justify-center gap-1">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p className="text-xs text-green-500">Portfolio Status: Published</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <LiquidButton className="text-white border rounded-full" size="lg">
                View Live Portfolio
              </LiquidButton>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Share Portfolio
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-black/20 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">{mockProjects.length}</CardTitle>
              <CardDescription className="text-white/60">Total Projects</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-white/10 bg-black/20 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">1,247</CardTitle>
              <CardDescription className="text-white/60">Portfolio Views</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-white/10 bg-black/20 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">Minimalist</CardTitle>
              <CardDescription className="text-white/60">Active Theme</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-white/10 bg-black/20 text-white backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">87%</CardTitle>
              <CardDescription className="text-white/60">Profile Complete</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">Your Projects</CardTitle>
                  <Button size="sm" className="gap-2">
                    <PlusIcon className="size-4" />
                    Add Project
                  </Button>
                </div>
                <CardDescription className="text-white/60">
                  Manage and showcase your best work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors group"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-white/60 hover:text-white">
                              <ExternalLinkIcon className="size-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10">
                  <FolderIcon className="size-4" />
                  Add New Project
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10">
                  <UserIcon className="size-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10">
                  <PaletteIcon className="size-4" />
                  Change Theme
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 border-white/20 text-white hover:bg-white/10">
                  <SettingsIcon className="size-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                        <div className="text-sm">
                          <p className="text-white/60">Today</p>
                          <p className="text-white">Updated project &ldquo;E-commerce Platform&rdquo;</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-white/60">Yesterday</p>
                          <p className="text-white">Changed theme to &ldquo;Minimalist&rdquo;</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-white/60">2 days ago</p>
                          <p className="text-white">Added new project &ldquo;Task Management App&rdquo;</p>
                        </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}