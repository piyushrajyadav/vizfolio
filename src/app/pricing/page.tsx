'use client';

import { motion } from 'framer-motion';
import { PricingCard } from '@/components/ui/dark-gradient-pricing';
import { Check, Star, Zap, Shield, Headphones, Globe } from 'lucide-react';


export default function PricingPage() {
  const plans = [
    {
      tier: 'Free',
      price: '₹0',
      period: '/forever',
      bestFor: 'Perfect for getting started',
      CTA: 'Get Started Free',
      popular: false,
      benefits: [
        { text: '2 Portfolio Projects', checked: true },
        { text: 'Basic Themes (3)', checked: true },
        { text: 'Public Portfolio URL', checked: true },
        { text: 'Basic Analytics', checked: true },
        { text: 'Community Support', checked: true },
        { text: 'AI Bio Generation', checked: true },
        { text: 'Custom Domain', checked: false },
        { text: 'Advanced Analytics', checked: false },
        { text: 'Priority Support', checked: false },
        { text: 'Custom Branding', checked: false },
      ],
    },
    {
      tier: 'Pro',
      price: '₹500',
      period: '/month',
      bestFor: 'Best for professionals & freelancers',
      CTA: 'Start Free Trial',
      popular: true,
      benefits: [
        { text: '6 Portfolio Projects', checked: true },
        { text: 'All Premium Themes (15+)', checked: true },
        { text: 'Custom Portfolio URL', checked: true },
        { text: 'Advanced Analytics & Views', checked: true },
        { text: 'AI Content Generation', checked: true },
        { text: 'Project Source Tracking', checked: true },
        { text: 'Email Support', checked: true },
        { text: 'SEO Optimization', checked: true },
        { text: 'Social Media Integration', checked: true },
        { text: '24/7 Support', checked: false },
        { text: 'Custom Domain (2)', checked: false },
        { text: 'White-label Branding', checked: false },
      ],
    },
    {
      tier: 'Enterprise',
      price: '₹2000',
      period: '/month',
      bestFor: 'Best for agencies & teams',
      CTA: 'Contact Sales',
      popular: false,
      benefits: [
        { text: 'Unlimited Portfolio Projects', checked: true },
        { text: 'All Themes + Custom Themes', checked: true },
        { text: 'Multiple Custom Domains (5)', checked: true },
        { text: 'Advanced Analytics Dashboard', checked: true },
        { text: 'AI-Powered Content Suite', checked: true },
        { text: 'Portfolio Performance Insights', checked: true },
        { text: 'Priority 24/7 Support', checked: true },
        { text: 'Technical Support & Customization', checked: true },
        { text: 'White-label Branding', checked: true },
        { text: 'API Access', checked: true },
        { text: 'Team Collaboration Tools', checked: true },
        { text: 'Custom Integrations', checked: true },
      ],
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance across all devices',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Fast loading times worldwide with our global network',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our support team',
    },
  ];

  return (
    <div className="min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Create stunning portfolios that showcase your work. Start free and upgrade 
              when you need more power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                <PricingCard
                  tier={plan.tier}
                  price={`${plan.price}${plan.period}`}
                  bestFor={plan.bestFor}
                  CTA={plan.CTA}
                  benefits={plan.benefits}
                  className={plan.popular ? 'border-blue-500 dark:border-blue-400' : ''}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black/10 backdrop-blur-sm relative z-10 mt-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Why Choose Vizfolio?</h2>
            <p className="text-lg text-white/70">
              Built for creators, by creators. Everything you need to showcase your work professionally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Can I upgrade or downgrade my plan anytime?",
                a: "Yes, you can change your plan at any time. Changes take effect immediately and you'll be billed prorated."
              },
              {
                q: "What happens to my portfolios if I downgrade?",
                a: "Your portfolios remain live, but you'll be limited by your new plan's restrictions. Excess portfolios will be archived."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee for all paid plans. No questions asked."
              },
              {
                q: "Can I use my own domain?",
                a: "Yes! Pro and Enterprise plans include custom domain support. You can connect your own domain or subdomain."
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border border-white/20 bg-white/5 backdrop-blur-sm rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-2 text-white">{faq.q}</h3>
                <p className="text-white/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}