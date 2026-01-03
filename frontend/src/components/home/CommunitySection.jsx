import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Bell, Gift, Users, Zap } from 'lucide-react';

export const CommunitySection = () => {
  const benefits = [
    { icon: TrendingUp, label: 'Market Trends' },
    { icon: Bell, label: 'New Listings' },
    { icon: Gift, label: 'Exclusive Offers' },
    { icon: Users, label: 'Connections' },
  ];

  return (
    <section className="py-16 md:py-24 section-light">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12">
              {/* Central Logo with Radiating Benefits */}
              <div className="relative max-w-sm mx-auto aspect-square flex items-center justify-center">
                {/* Radiating Lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  {benefits.map((_, index) => {
                    const angle = (index * 90 - 45) * (Math.PI / 180);
                    const x2 = 200 + 150 * Math.cos(angle);
                    const y2 = 200 + 150 * Math.sin(angle);
                    return (
                      <line
                        key={index}
                        x1="200"
                        y1="200"
                        x2={x2}
                        y2={y2}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.3"
                      />
                    );
                  })}
                </svg>

                {/* Central Logo */}
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-primary flex items-center justify-center shadow-elevated">
                  <span className="text-primary-foreground font-bold text-2xl md:text-3xl">IM</span>
                </div>

                {/* Benefit Icons */}
                {benefits.map((benefit, index) => {
                  const angle = (index * 90 - 45) * (Math.PI / 180);
                  const x = 50 + 35 * Math.cos(angle);
                  const y = 50 + 35 * Math.sin(angle);
                  return (
                    <div
                      key={benefit.label}
                      className="absolute w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-card shadow-card flex flex-col items-center justify-center"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      <span className="text-[10px] md:text-xs text-muted-foreground mt-1 text-center">
                        {benefit.label.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get the Insider Advantage
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Be the first to know. Get early alerts on properties, deals, and market shifts.
            </p>

            <div className="space-y-4">
              <div>
                <Button variant="teal" size="lg" className="w-full sm:w-auto">
                  <Users className="w-5 h-5 mr-2" />
                  Click to Join Buying Community
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Get market insights & investment deals.
                </p>
              </div>

              <div>
                <Button variant="yellow" size="lg" className="w-full sm:w-auto">
                  <Zap className="w-5 h-5 mr-2" />
                  Click to Join Tenant Community
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Get new rental alerts & local offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
