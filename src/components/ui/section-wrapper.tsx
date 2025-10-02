"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  withPaths?: boolean;
}

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${200 - i * 3 * position} -${100 + i * 4}C-${
      200 - i * 3 * position
    } -${100 + i * 4} -${150 - i * 3 * position} ${120 - i * 4} ${
      80 - i * 3 * position
    } ${180 - i * 4}C${300 - i * 3 * position} ${240 - i * 4} ${
      350 - i * 3 * position
    } ${300 - i * 4} ${350 - i * 3 * position} ${300 - i * 4}`,
    width: 0.3 + i * 0.02,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none opacity-30">
      <svg
        className="w-full h-full text-slate-950/20 dark:text-white/20"
        viewBox="0 0 500 200"
        fill="none"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.2, opacity: 0.3 }}
            animate={{
              pathLength: 0.8,
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 15 + Math.random() * 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function SectionWrapper({ children, className = "", withPaths = true }: SectionWrapperProps) {
  return (
    <section className={`relative bg-white dark:bg-neutral-950 ${className}`}>
      {withPaths && (
        <div className="absolute inset-0 overflow-hidden">
          <FloatingPaths position={1} />
          <FloatingPaths position={-0.5} />
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}