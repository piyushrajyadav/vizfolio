import { EnhancedHeroSection } from "@/components/ui/enhanced-hero-section";
import { FloatingNav } from "@/components/ui/floating-nav";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { FeaturesSection } from "@/components/ui/features-section";
import { ThemesSection } from "@/components/ui/themes-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { Testimonials } from "@/components/ui/testimonials";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section with Background Paths */}
        <EnhancedHeroSection />
        
        {/* Features Section */}
        <SectionWrapper>
          <FeaturesSection />
        </SectionWrapper>
        
        {/* How It Works Section */}
        <SectionWrapper>
          <HowItWorksSection />
        </SectionWrapper>
        
        {/* Themes Section */}
        <SectionWrapper>
          <ThemesSection />
        </SectionWrapper>
        
        {/* New Testimonials Section with Carousel */}
        <SectionWrapper>
          <Testimonials />
        </SectionWrapper>
        
        {/* Footer */}
        <SectionWrapper withPaths={false}>
          <Footer />
        </SectionWrapper>
      </div>
    </main>
  );
}
