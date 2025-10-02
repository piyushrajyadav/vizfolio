'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { GridPattern } from '@/components/ui/grid-pattern';
import { cn } from '@/lib/utils';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  
  // All pages should have navbar/footer
  const shouldShowNavFooter = true;
  
  // Pages that should have GridPattern background (not landing page)
  const pagesWithGridBackground = ['/dashboard', '/pricing', '/preview', '/auth'];
  const shouldShowGrid = pagesWithGridBackground.some(page => pathname.startsWith(page));

  return (
    <>
      {shouldShowNavFooter && <Navbar />}
      <div className={`min-h-[calc(100vh-140px)] ${shouldShowGrid ? 'relative overflow-hidden' : ''}`}>
        {shouldShowGrid && (
          <>
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 -z-10" />
            
            {/* GridPattern overlay */}
            <GridPattern
              width={40}
              height={40}
              x={-1}
              y={-1}
              strokeDasharray="4 2"
              className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
                "absolute inset-0 h-full w-full fill-white/10 stroke-white/10"
              )}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {children}
            </div>
          </>
        )}
        {!shouldShowGrid && children}
      </div>
      {shouldShowNavFooter && <Footer />}
    </>
  );
}