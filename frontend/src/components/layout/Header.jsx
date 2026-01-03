import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Users, Building2, Phone, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Partner with us', path: '/partner', icon: Users },
  { name: 'Explore Property', path: '/properties', icon: Building2 },
  { name: 'Contact Us', path: '/contact', icon: Phone },
];

const moreLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Refer & Earn', path: '/refer' },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg md:text-xl">IM</span>
              </div>
              <div className="ml-2 hidden sm:block">
                <span className="text-lg md:text-xl font-bold text-primary">Insta</span>
                <span className="text-lg md:text-xl font-bold text-accent">Makaan</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onBlur={() => setTimeout(() => setIsMoreOpen(false), 200)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1',
                  'text-foreground hover:text-primary hover:bg-primary/5'
                )}
              >
                More
                <ChevronDown className={cn('w-4 h-4 transition-transform', isMoreOpen && 'rotate-180')} />
              </button>
              {isMoreOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border py-2 animate-scale-in">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="yellow" size="default" asChild>
              <Link to="/partner">Get Owners</Link>
            </Button>
            <Button variant="teal" size="default" asChild>
              <Link to="/properties">Find a Verified Home</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-lg">IM</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-primary">Insta</span>
                      <span className="text-lg font-bold text-accent">Makaan</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors',
                          isActive(link.path)
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:text-primary hover:bg-primary/5'
                        )}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="my-4 border-t border-border" />
                  
                  <div className="space-y-1">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                          isActive(link.path)
                            ? 'text-primary bg-primary/10'
                            : 'text-foreground hover:text-primary hover:bg-primary/5'
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Mobile CTAs */}
                <div className="p-4 border-t border-border space-y-3">
                  <Button variant="yellow" size="lg" className="w-full" asChild>
                    <Link to="/partner" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Owners
                    </Link>
                  </Button>
                  <Button variant="teal" size="lg" className="w-full" asChild>
                    <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)}>
                      Find a Verified Home
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
