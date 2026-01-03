import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const categories = [
  'All Posts',
  'Real Estate',
  'For Owners',
  'For Tenants',
  'Investment',
  'Community',
  'Noida Living',
  'Corporate',
];

const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Emerging Real Estate Corridors in Greater Noida',
    excerpt: 'Where is the next big boom? We analyze the data on connectivity, infrastructure, and rental yields to show you the hottest investment zones.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
    category: 'Investment',
    date: 'Jan 15, 2025',
  },
  {
    id: 2,
    title: 'Complete Guide to Renting Your First Home in Noida',
    excerpt: 'Moving to Noida? Here\'s everything you need to know about finding, verifying, and securing your perfect rental home.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    category: 'For Tenants',
    date: 'Jan 12, 2025',
  },
  {
    id: 3,
    title: 'Why Property Management is the Future for Noida Owners',
    excerpt: 'Discover how professional property management can transform your rental income and give you true peace of mind.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    category: 'For Owners',
    date: 'Jan 10, 2025',
  },
  {
    id: 4,
    title: 'Noida Metro Expansion: Impact on Property Prices',
    excerpt: 'The upcoming metro lines are set to revolutionize connectivity. Find out which sectors will see the biggest appreciation.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop',
    category: 'Real Estate',
    date: 'Jan 8, 2025',
  },
  {
    id: 5,
    title: 'Building a Strong Community: The InstaMakaan Story',
    excerpt: 'Learn how we\'re creating a thriving community of property owners and tenants who support each other.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&h=400&fit=crop',
    category: 'Community',
    date: 'Jan 5, 2025',
  },
  {
    id: 6,
    title: 'Corporate Housing Solutions for IT Companies',
    excerpt: 'How InstaMakaan helps IT companies provide verified accommodation for their relocating employees.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    category: 'Corporate',
    date: 'Jan 3, 2025',
  },
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All Posts');

  const filteredPosts = activeCategory === 'All Posts'
    ? blogPosts
    : blogPosts.filter((post) => post.category === activeCategory);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / Blog
          </p>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 md:py-16 section-light">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            The InstaMakaan Blog
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Your official guide to smarter renting, owning, and investing in Noida & Greater Noida.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border sticky top-16 md:top-20 bg-background z-40">
        <div className="container-custom">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-10 md:py-16">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-card border-0 shadow-card overflow-hidden card-elevated group flex flex-col">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <Button variant="teal" size="sm" className="w-fit mt-auto">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
