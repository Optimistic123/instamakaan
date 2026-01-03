import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle2, Smartphone, ArrowRight } from 'lucide-react';

export const PropertyOwnerSection = () => {
  return (
    <section className="py-16 md:py-24 section-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12">
              {/* Phone Mockup */}
              <div className="relative max-w-xs mx-auto">
                <div className="bg-card rounded-3xl shadow-elevated p-4 border border-border">
                  <div className="bg-primary/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-foreground">InstaMakaan</span>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="bg-card rounded-xl p-4 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Rent Received</p>
                      <p className="text-2xl font-bold text-success">₹35,000</p>
                      <p className="text-xs text-muted-foreground">March 2025</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+12% from last month</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-2xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
              Are You a Property Owner?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6">
              InstaMakaan helps you transform your property into a hassle-free, high-earning asset. Get predictable income, guaranteed.
            </p>
            <h3 className="text-lg md:text-xl font-semibold text-foreground mb-6">
              Unlock Your Property&apos;s Full Potential
            </h3>

            <ul className="space-y-3 mb-8">
              {[
                'Guaranteed rental income every month',
                'Professional property management',
                'Verified & reliable tenants',
                'Zero hassle maintenance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="teal" size="lg" asChild>
                <Link to="/contact">
                  Contact Us Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-foreground" asChild>
                <Link to="/partner">
                  Download FREE Owner&apos;s Brochure
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
