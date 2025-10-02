'use client';

import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EnhancedHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ethereal Shadow Background */}
      <div className="absolute inset-0 w-full h-full">
        <EtheralShadow
          title="Vizfolio"
          color="rgba(99, 102, 241, 0.8)"
          animation={{ scale: 80, speed: 60 }}
          noise={{ opacity: 0.3, scale: 1.5 }}
          sizing="fill"
          className="w-full h-full"
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 text-center px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Build stunning portfolios with multiple themes. Perfect for freelancers, students, and professionals. 
            Showcase your work and build your brand.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth">
              <Button size="lg" className="px-8 py-3 text-lg">
                Start Building 🚀
              </Button>
            </Link>
            <Link href="#themes">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                View Themes
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="pt-8"
          >
            <p className="text-sm text-muted-foreground">
              ✨ Pull down the theme switcher to toggle dark/light mode
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/50 z-10" />
    </section>
  );
}