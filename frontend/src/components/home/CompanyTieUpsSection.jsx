import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const companies = [
  { name: 'TechCorp', logo: 'TC' },
  { name: 'GlobalTech', logo: 'GT' },
  { name: 'InnovateCo', logo: 'IC' },
  { name: 'FutureSoft', logo: 'FS' },
  { name: 'DataDrive', logo: 'DD' },
  { name: 'CloudNine', logo: 'CN' },
  { name: 'SmartSys', logo: 'SS' },
  { name: 'NextGen', logo: 'NG' },
];

export const CompanyTieUpsSection = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 md:py-24 section-light overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted By Leading Companies
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            We are a preferred rental partner for corporations in Noida & Greater Noida, helping their employees find verified homes, hassle-free.
          </p>
        </div>
      </div>

      {/* Logo Marquee */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex overflow-hidden">
          <div
            className={cn(
              'flex items-center gap-8 md:gap-16 animate-marquee',
              isPaused && '[animation-play-state:paused]'
            )}
          >
            {/* Double the logos for seamless loop */}
            {[...companies, ...companies].map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex items-center justify-center w-32 h-20 md:w-40 md:h-24 bg-card rounded-xl shadow-sm border border-border px-6 shrink-0"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-muted-foreground/50">
                    {company.logo}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-secondary to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-secondary to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
