'use client';

import { motion } from "framer-motion";
import { PaletteIcon, FolderIcon, MoonIcon, ShieldIcon, GlobeIcon, SparklesIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: PaletteIcon,
    title: "Multiple Themes",
    description: "Choose from 6 carefully crafted themes that match your style and industry.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FolderIcon,
    title: "Easy Project Showcase",
    description: "Add projects with images, descriptions, tech stacks, and live links effortlessly.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: MoonIcon,
    title: "Dark/Light Mode",
    description: "All themes support both dark and light modes for the perfect viewing experience.",
    gradient: "from-gray-600 to-gray-400",
  },
  {
    icon: ShieldIcon,
    title: "Supabase Auth",
    description: "Secure authentication with email/password and OAuth providers like Google and GitHub.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: GlobeIcon,
    title: "One-Click Publishing",
    description: "Publish your portfolio instantly and get a custom URL: vizfolio.me/yourname",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: SparklesIcon,
    title: "Modern UI/UX",
    description: "Built with the latest design trends, smooth animations, and mobile-first approach.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Showcase Your Work
            </span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Vizfolio provides all the tools and features you need to create a professional portfolio that stands out from the crowd.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}