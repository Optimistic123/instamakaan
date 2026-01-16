import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';  
import { ChevronLeft, ChevronRight, Play, Building2, User, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    headline: 'Hassle-Free Income & Total Peace of Mind',
    quote: 'InstaMakaan changed everything. My property is professionally managed, the rent is always on time, and I never have to worry about a thing. It\'s been completely stress-free.',
    name: 'Mr. Rajesh Kumar',
    role: 'Property Owner',
    location: 'Sector 137 Noida',
    type: 'owner',
    videoThumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    headline: 'Found My Dream Home in Days',
    quote: 'The verification process gave me so much confidence. No fake listings, no hidden surprises. InstaMakaan made finding a home in Noida incredibly easy.',
    name: 'Priya Sharma',
    role: 'Tenant',
    location: 'Sector 62 Noida',
    type: 'tenant',
    videoThumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    headline: 'Professional Service, Every Time',
    quote: 'As an investor with multiple properties, InstaMakaan has been a game-changer. Their managed rental service means I focus on growing my portfolio, not day-to-day management.',
    name: 'Amit Verma',
    role: 'Property Investor',
    location: 'Greater Noida',
    type: 'owner',
    videoThumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 md:py-24 section-light">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            See how InstaMakaan delivers peace of mind to owners and tenants.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card shadow-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card shadow-card flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Testimonial Card */}
          <Card className="bg-card border-0 shadow-elevated overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Video Thumbnail */}
                <div className="relative aspect-video md:aspect-auto md:min-h-[350px] bg-muted">
                  <img
                    src={currentTestimonial.videoThumbnail}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                    <button className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground hover:bg-primary transition-colors shadow-elevated">
                      <Play className="w-6 h-6 md:w-8 md:h-8 ml-1" fill="currentColor" />
                    </button>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">
                    {currentTestimonial.headline}
                  </h3>
                  <p className="text-muted-foreground italic mb-6 leading-relaxed">
                    &quot;{currentTestimonial.quote}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {currentTestimonial.type === 'owner' ? (
                        <Building2 className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.role}, {currentTestimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
