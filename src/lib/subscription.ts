import { supabase } from './supabase';

export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'pro' | 'enterprise';
  price: number;
  currency: string;
  portfolioLimit: number;
  features: string[];
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'free',
    price: 0,
    currency: 'INR',
    portfolioLimit: 2,
    features: [
      '2 Portfolio Projects',
      'Basic Themes (3)',
      'Public Portfolio URL',
      'Basic Analytics',
      'Community Support',
      'AI Bio Generation'
    ]
  },
  pro: {
    id: 'pro',
    name: 'pro',
    price: 500,
    currency: 'INR',
    portfolioLimit: 6,
    features: [
      '6 Portfolio Projects',
      'All Premium Themes (15+)',
      'Custom Portfolio URL',
      'Advanced Analytics & Views',
      'AI Content Generation',
      'Project Source Tracking',
      'Email Support',
      'SEO Optimization',
      'Social Media Integration'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'enterprise',
    price: 2000,
    currency: 'INR',
    portfolioLimit: -1, // unlimited
    features: [
      'Unlimited Portfolio Projects',
      'All Themes + Custom Themes', 
      'Multiple Custom Domains (5)',
      'Advanced Analytics Dashboard',
      'AI-Powered Content Suite',
      'Portfolio Performance Insights',
      'Priority 24/7 Support',
      'Technical Support & Customization',
      'White-label Branding',
      'API Access',
      'Team Collaboration Tools',
      'Custom Integrations'
    ]
  }
};

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('subscription_plan, subscription_status, subscription_ends_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return { subscription: null, error };
  }

  return { 
    subscription: {
      plan: data.subscription_plan || 'free',
      status: data.subscription_status || 'active',
      endsAt: data.subscription_ends_at
    }, 
    error: null 
  };
}

export async function updateUserSubscription(
  userId: string, 
  plan: 'free' | 'pro' | 'enterprise',
  status: 'active' | 'cancelled' | 'expired' = 'active',
  endsAt?: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      subscription_plan: plan,
      subscription_status: status,
      subscription_ends_at: endsAt
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

export function canCreatePortfolio(userPlan: string, currentProjectCount: number): boolean {
  const plan = SUBSCRIPTION_PLANS[userPlan];
  if (!plan) return false;
  
  // Unlimited for enterprise
  if (plan.portfolioLimit === -1) return true;
  
  return currentProjectCount < plan.portfolioLimit;
}

export function getPortfolioLimit(userPlan: string): number {
  const plan = SUBSCRIPTION_PLANS[userPlan];
  return plan?.portfolioLimit || 0;
}

export function hasFeature(userPlan: string, feature: string): boolean {
  const plan = SUBSCRIPTION_PLANS[userPlan];
  if (!plan) return false;
  
  return plan.features.includes(feature);
}

// Mock payment processing - in a real app, integrate with Razorpay, Stripe, etc.
export async function processPayment(
  userId: string,
  planId: string,
  paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Mock payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would integrate with actual payment processor
    const success = Math.random() > 0.1; // 90% success rate for demo
    
    if (success) {
      const endsAt = new Date();
      endsAt.setMonth(endsAt.getMonth() + 1); // 1 month subscription
      
      await updateUserSubscription(
        userId,
        planId as 'free' | 'pro' | 'enterprise',
        'active',
        endsAt.toISOString()
      );
      
      return { success: true };
    } else {
      return { success: false, error: 'Payment failed. Please try again.' };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false, error: 'Payment processing failed' };
  }
}