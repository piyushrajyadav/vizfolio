'use client';

import { useState } from "react";
import { MinimalistTheme } from "@/components/themes/minimalist-theme";
import { DarkTheme } from "@/components/themes/dark-theme";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for preview
const mockProfile = {
  name: "Alex Johnson",
  role: "Full Stack Developer",
  bio: "Passionate developer with 5+ years of experience building modern web applications. I love creating user-friendly interfaces and robust backend systems that solve real-world problems.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  email: "alex@example.com",
  social: {
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexjohnson",
    website: "https://alexjohnson.dev"
  },
  skills: ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "AWS", "Docker", "GraphQL"]
};

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with React and Node.js, featuring payment integration, inventory management, and real-time analytics.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    tech: ["React", "Node.js", "MongoDB", "Stripe", "Docker"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative project management tool with real-time updates, team collaboration features, and advanced reporting capabilities.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    tech: ["Vue.js", "Firebase", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  },
  {
    id: 3,
    title: "AI-Powered Analytics Dashboard",
    description: "Modern analytics dashboard with machine learning insights, real-time data visualization, and predictive analytics for business intelligence.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    tech: ["React", "Python", "TensorFlow", "D3.js", "PostgreSQL"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example"
  }
];

const themes = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, elegant design with lots of whitespace",
    component: MinimalistTheme
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Sleek dark theme with neon accents",
    component: DarkTheme
  }
];

export default function PreviewPage() {
  const [activeTheme, setActiveTheme] = useState("minimalist");
  const ActiveThemeComponent = themes.find(theme => theme.id === activeTheme)?.component || MinimalistTheme;

  return (
    <div className="min-h-screen">
        {/* Theme Selector */}
        <div className="fixed top-4 left-4 right-4 z-50">
          <Card className="shadow-lg bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Theme Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={activeTheme === theme.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTheme(theme.id)}
                    className={`gap-2 ${
                      activeTheme === theme.id 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    {theme.name}
                    {activeTheme === theme.id && <Badge variant="secondary">Active</Badge>}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-white/70 mt-2">
                {themes.find(theme => theme.id === activeTheme)?.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Theme Preview */}
        <div className="pt-32">
          <ActiveThemeComponent profile={mockProfile} projects={mockProjects} />
        </div>
    </div>
  );
}