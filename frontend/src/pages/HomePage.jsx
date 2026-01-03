import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { ImpactSection } from '@/components/home/ImpactSection';
import { PropertyOwnerSection } from '@/components/home/PropertyOwnerSection';
import { CommunitySection } from '@/components/home/CommunitySection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { InstagramSection } from '@/components/home/InstagramSection';
import { CompanyTieUpsSection } from '@/components/home/CompanyTieUpsSection';

const HomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <ImpactSection />
      <PropertyOwnerSection />
      <CommunitySection />
      <TestimonialsSection />
      <InstagramSection />
      <CompanyTieUpsSection />
    </Layout>
  );
};

export default HomePage;
