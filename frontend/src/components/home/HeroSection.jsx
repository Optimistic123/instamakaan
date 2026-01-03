import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building2, Home, Key, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabContent = {
  rent: {
    headline: 'Find Your Rental Sukoon.',
    subheadline: 'Professionally managed, verified homes for a hassle-free experience.',
    placeholder: 'Search by location or society in Noida & Gr. Noida',
    icon: Key,
  },
  'pre-occupied': {
    headline: 'The Managed Home Experience.',
    subheadline: 'Our premium, full-service rental. We handle everything.',
    placeholder: 'Search managed homes in Noida & Gr. Noida',
    icon: Home,
  },
  buy: {
    headline: 'Discover Your Future Property.',
    subheadline: 'Verified listings and expert guidance for buyers and investors.',
    placeholder: 'Search properties to buy in Noida & Gr. Noida',
    icon: Building2,
  },
};

export const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const content = tabContent[activeTab];
  const IconComponent = content.icon;

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 md:w-80 md:h-80 rounded-full bg-accent/5 blur-3xl" />

      {/* Background Illustration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-2/3 opacity-10 hidden lg:block">
        <div className="relative w-full h-full">
          <IconComponent className="w-full h-full text-primary" strokeWidth={0.5} />
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Tabs */}
          <div className="mb-8 md:mb-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="inline-flex">
              <TabsList className="h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
                <TabsTrigger
                  value="buy"
                  className={cn(
                    'px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
                  )}
                >
                  BUY
                </TabsTrigger>
                <TabsTrigger
                  value="pre-occupied"
                  className={cn(
                    'px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
                  )}
                >
                  PRE-OCCUPIED
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className={cn(
                    'px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all',
                    'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md'
                  )}
                >
                  RENT
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Dynamic Headlines */}
          <div className="mb-6 md:mb-8 animate-fade-in" key={activeTab}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 leading-tight">
              {content.headline}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              {content.subheadline}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-card rounded-2xl shadow-elevated p-2 md:p-3">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={content.placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 md:h-14 text-base border-0 bg-secondary/50 rounded-xl focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <Button variant="teal" size="lg" className="h-12 md:h-14 px-6 md:px-8 rounded-xl">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <span className="text-foreground/70">Last Search / Recommended</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
