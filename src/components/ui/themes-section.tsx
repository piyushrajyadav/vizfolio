'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const themes = [
  {
    name: "Minimal White",
    description: "Clean and minimalist design with focus on content",
    preview: "bg-white border-2 border-neutral-200",
    accent: "bg-neutral-800",
    features: ["Clean", "Professional", "Minimal"],
    bestFor: "Writers, Consultants",
    selected: true
  },
  {
    name: "Professional Dark",
    description: "Dark theme perfect for developers and tech professionals",
    preview: "bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700",
    accent: "bg-purple-500",
    features: ["Dark", "Professional", "Tech"],
    bestFor: "Developers, Coders",
    selected: false
  },
  {
    name: "Creative Neon",
    description: "Bold and creative with vibrant colors and gradients",
    preview: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 border-2 border-purple-400",
    accent: "bg-pink-500",
    features: ["Creative", "Colorful", "Bold"],
    bestFor: "Artists, Designers",
    selected: false
  },
  {
    name: "Grid Portfolio",
    description: "Grid-based layout showcasing projects in an organized manner",
    preview: "bg-gradient-to-br from-blue-50 to-slate-100 border-2 border-blue-200",
    accent: "bg-blue-600",
    features: ["Grid", "Organized", "Portfolio"],
    bestFor: "Business, Corporate",
    selected: false
  },
  {
    name: "Glassmorphism",
    description: "Modern glassmorphism design with blur effects and transparency",
    preview: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 border-2 border-white/20",
    accent: "bg-white/30",
    features: ["Modern", "Glass", "Blur"],
    bestFor: "Designers, Creative",
    selected: false
  },
  {
    name: "Playful Colors",
    description: "Fun and vibrant theme with playful animations and colors",
    preview: "bg-gradient-to-br from-orange-400 to-pink-500 border-2 border-orange-300",
    accent: "bg-yellow-400",
    features: ["Fun", "Vibrant", "Animated"],
    bestFor: "Creative, Fun",
    selected: false
  },
];

export function ThemesSection() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { user } = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewTheme = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  };

  return (
    <section id="themes" className="py-20 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Beautiful{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Themes
            </span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Choose from professionally designed themes that match your style and industry. Each theme is fully responsive and supports dark/light modes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme, index) => (
            <motion.div
              key={theme.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                {/* Theme Preview */}
                <div className={`h-40 ${theme.preview} relative overflow-hidden`}>
                  <div className="absolute inset-4 space-y-2">
                    <div className={`h-2 w-20 ${theme.accent} rounded-full opacity-80`} />
                    <div className="space-y-1">
                      <div className={`h-1 w-16 ${theme.accent} rounded-full opacity-60`} />
                      <div className={`h-1 w-12 ${theme.accent} rounded-full opacity-40`} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className={`h-8 ${theme.accent} rounded opacity-30`} />
                      <div className={`h-8 ${theme.accent} rounded opacity-20`} />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{theme.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {theme.bestFor}
                    </Badge>
                  </div>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                    {theme.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {theme.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <CheckIcon className="size-4 text-green-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    onClick={handlePreviewTheme}
                    disabled={loading}
                  >
                    {theme.selected ? 'Selected' : loading ? 'Loading...' : user ? 'Select Theme' : 'Preview Theme'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/auth">
            <Button size="lg" className="px-8">
              Start Building Your Portfolio
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}