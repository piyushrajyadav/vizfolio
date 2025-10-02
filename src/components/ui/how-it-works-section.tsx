'use client';

import { motion } from "framer-motion";
import { UserPlusIcon, PlusIcon, RocketIcon } from "lucide-react";

const steps = [
  {
    icon: UserPlusIcon,
    title: "Sign Up",
    description: "Create your account in seconds with email or OAuth providers like Google and GitHub.",
    step: "01",
  },
  {
    icon: PlusIcon,
    title: "Add Projects",
    description: "Upload your best work with images, descriptions, tech stacks, and live demo links.",
    step: "02",
  },
  {
    icon: RocketIcon,
    title: "Publish & Share",
    description: "Choose a theme, customize your profile, and publish your portfolio to a custom URL.",
    step: "03",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Works
            </span>
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Get your professional portfolio online in just three simple steps. No coding required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative text-center group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-px bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-700 transform translate-x-6" />
              )}
              
              {/* Step Number */}
              <div className="relative mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                  <step.icon className="size-10 text-neutral-600 dark:text-neutral-400 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}