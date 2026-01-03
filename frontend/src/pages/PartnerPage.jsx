import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CreditCard,
  Users,
  TrendingUp,
  Smartphone,
  Shield,
  Clock,
  FileText,
  UserCheck,
  Search,
  Wallet,
  Home,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const heroSlides = [
  {
    headline: 'End the Renting Headaches. Discover True Rental Sukoon.',
    description: 'Transform your property management experience with InstaMakaan.',
  },
  {
    headline: 'Predictable Income, Guaranteed Peace of Mind.',
    description: 'Never worry about missed rent payments or difficult tenants again.',
  },
  {
    headline: 'We Handle It All, You Enjoy the Returns.',
    description: 'From tenant screening to maintenance, we manage everything.',
  },
  {
    headline: 'Unlock Your Property\'s Full Potential.',
    description: 'Maximize your rental income with professional management.',
  },
];

const services = [
  {
    id: 'payment',
    headline: 'Never Chase Rent Again.',
    icon: CreditCard,
    features: [
      { icon: Clock, text: 'Automated Reminders: Timely alerts to tenants.' },
      { icon: UserCheck, text: 'Proactive Follow-ups: We ensure prompt deposits.' },
      { icon: Wallet, text: 'Guaranteed Payouts: Your income, always on time.' },
      { icon: FileText, text: 'Transparent Statements: Clear financial reporting.' },
    ],
    cta: 'Learn More About Rent Collection',
    visual: 'payment',
  },
  {
    id: 'tenant',
    headline: 'The Right Tenant, Every Time.',
    icon: Users,
    features: [
      { icon: Shield, text: 'Rigorous KYC & Checks: Trustworthy, reliable tenants.' },
      { icon: UserCheck, text: 'Behavioral Screening: Matching the right fit.' },
      { icon: Clock, text: 'Fast Placement: Minimize vacancy periods.' },
      { icon: Search, text: 'Wide Network Reach: Access to quality renters.' },
    ],
    cta: 'Contact Us for Tenant Screening',
    visual: 'tenant',
  },
  {
    id: 'income',
    headline: 'Maximize Your Earning Potential.',
    icon: TrendingUp,
    features: [
      { icon: Home, text: 'Full Occupancy Promise: Maximize rental days.' },
      { icon: TrendingUp, text: 'Optimized Rental Yields: Best market pricing.' },
      { icon: Shield, text: 'Proactive Maintenance: Protect your asset value.' },
      { icon: FileText, text: 'Full Transparency: Clear reports, total control.' },
    ],
    cta: 'Get Your Personalized Plan',
    visual: 'income',
  },
];

const PartnerPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / Partner with us
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 section-light">
        <div className="container-custom">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
            Are You a Property Owner?
          </h1>

          <Card className="bg-card border-0 shadow-elevated overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="relative p-8 md:p-12 min-h-[300px] flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                {/* Carousel Content */}
                <div className="text-center max-w-2xl animate-fade-in" key={currentSlide}>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4">
                    {heroSlides[currentSlide].headline}
                  </h2>
                  <p className="text-muted-foreground">
                    {heroSlides[currentSlide].description}
                  </p>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card shadow-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Indicators */}
              <div className="flex items-center justify-center gap-2 py-4 bg-card">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentSlide ? 'w-8 bg-accent' : 'bg-muted-foreground/30'
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Service Sections */}
      {services.map((service, index) => (
        <section
          key={service.id}
          className={cn('py-16 md:py-24', index % 2 === 0 ? 'section-white' : 'section-light')}
        >
          <div className="container-custom">
            <Card className="bg-card border-0 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className={cn(
                  'grid md:grid-cols-2 gap-0',
                  index % 2 === 1 && 'md:[&>*:first-child]:order-2'
                )}>
                  {/* Content */}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                      {service.headline}
                    </h3>
                    <ul className="space-y-4 mb-8">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="teal" size="lg" className="w-fit" asChild>
                      <Link to="/contact">
                        {service.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  {/* Visual */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 flex items-center justify-center min-h-[300px]">
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-primary/10 flex items-center justify-center">
                        <service.icon className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-accent/20" />
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Experience Rental Sukoon?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join hundreds of property owners who trust InstaMakaan with their properties.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="yellow" size="lg" asChild>
              <Link to="/contact">Get Started Today</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PartnerPage;
