"use client";

import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher";
import { Button } from "@/components/ui/button";
import { Grid2x2PlusIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FloatingNav() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <div className="w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Left Side */}
            <div className="flex items-center gap-2 font-bold text-lg">
              <Grid2x2PlusIcon className="size-5" />
              <span>Vizfolio</span>
            </div>
            
            {/* Auth Buttons & Theme Switcher - Right Side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center mr-2">
                <LightPullThemeSwitcher compact={true} />
              </div>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}