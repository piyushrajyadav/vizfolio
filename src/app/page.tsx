import { EnhancedHeroSection } from "@/components/ui/enhanced-hero-section";
import { SectionWrapper } from "@/components/ui/section-wrapper";
import { FeaturesSection } from "@/components/ui/features-section";
import { ThemesSection } from "@/components/ui/themes-section";
import { HowItWorksSection } from "@/components/ui/how-it-works-section";
import { Testimonials } from "@/components/ui/testimonials";
import { GridPattern } from "@/components/ui/grid-pattern";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Add top padding to account for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section with Background Paths */}
        <EnhancedHeroSection />
        
        {/* Rest of page with GridPattern background */}
        <div className="relative">
          {/* GridPattern Background */}
          <div className="absolute inset-0 z-0">
            <GridPattern
              width={40}
              height={40}
              strokeDasharray="4 2"
              squares={[
                [0, 1],
                [1, 3],
                [2, 0],
                [3, 2],
                [4, 4],
                [5, 1],
                [6, 3],
                [7, 0],
                [8, 2],
                [9, 4],
                [10, 1],
                [11, 3],
                [12, 0],
                [13, 2],
                [14, 4],
              ]}
              className="[mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)] opacity-40"
            />
          </div>
          
          {/* Content sections */}
          <div className="relative z-10">
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
          </div>
        </div>
      </div>
    </main>
  );
}
