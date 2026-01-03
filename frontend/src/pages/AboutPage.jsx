import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const teamMembers = [
  {
    name: 'Vikram Singh',
    role: 'Founder & CEO',
    bio: 'Passionate about transforming the rental experience in India.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop',
  },
  {
    name: 'Priya Kapoor',
    role: 'Head of Operations',
    bio: 'Ensuring seamless property management for all our clients.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop',
  },
  {
    name: 'Rahul Mehta',
    role: 'Tech Lead',
    bio: 'Building the technology that powers InstaMakaan.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
  },
  {
    name: 'Anita Sharma',
    role: 'Customer Success',
    bio: 'Dedicated to making every customer experience exceptional.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
  },
];

const tabContent = {
  who: {
    title: 'We are the Architects of Rental Peace of Mind.',
    description: "InstaMakaan is more than a managed rental company; we are a team of dedicated professionals passionate about bringing transparency, efficiency, and genuine Sukoon to the real estate market. Born from a frustration with traditional complexities, we built a service centered on your needs.",
    icon: Users,
  },
  what: {
    title: 'We Deliver Hassle-Free Rental Experiences.',
    description: "From finding the perfect tenant to handling maintenance requests, from collecting rent on time to ensuring legal compliance—we manage every aspect of property rentals. Our goal is simple: make property ownership profitable and stress-free.",
    icon: Building2,
  },
  how: {
    title: 'Technology Meets Human Touch.',
    description: "We combine cutting-edge technology with personalized service. Our digital platform provides transparency and control, while our dedicated team ensures every interaction is handled with care. This hybrid approach delivers the best of both worlds.",
    icon: UserCheck,
  },
};

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('who');
  const content = tabContent[activeTab];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / About Us
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 section-light">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              About InstaMakaan
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-4">
              Our journey to redefine rentals and deliver Sukoon.
            </p>
            <p className="text-sm text-accent flex items-center justify-center gap-2">
              <span className="text-lg">🏆</span>
              Recognitions & Milestones: Our Journey of Trust
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="max-w-4xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full h-auto p-1 bg-muted/50 rounded-xl grid grid-cols-3 mb-8">
                <TabsTrigger
                  value="who"
                  className="py-3 px-4 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Who We Are
                </TabsTrigger>
                <TabsTrigger
                  value="what"
                  className="py-3 px-4 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  What We Do
                </TabsTrigger>
                <TabsTrigger
                  value="how"
                  className="py-3 px-4 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  How We Do It
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Card className="bg-card border-0 shadow-elevated overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Visual */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 flex items-center justify-center min-h-[300px]">
                    <div className="relative animate-fade-in" key={activeTab}>
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-primary/10 flex items-center justify-center">
                        <content.icon className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-accent/20" />
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/20" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-10 flex flex-col justify-center animate-fade-in" key={`content-${activeTab}`}>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                      {content.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 section-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the InstaMakaan Family
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              The dedicated team bringing you reliability, transparency, and Sukoon.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="bg-card border-0 shadow-card text-center card-elevated">
                <CardContent className="p-6">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
