import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  User,
  Share2,
  Wallet,
  Trophy,
  ArrowRight,
  Building2,
  Home,
  Key,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabContent = {
  'pre-occupied': {
    headline: 'Refer a Property Owner. Earn Big!',
    bullets: [
      'Refer: Connect us with property owners looking for hassle-free management.',
      'They Join: When their property gets managed by InstaMakaan.',
      'You Earn: Receive ₹5,000 for every successful referral!',
    ],
    icon: Building2,
  },
  rent: {
    headline: 'Refer a Tenant. Get Rewarded!',
    bullets: [
      'Refer: Share InstaMakaan with friends looking for a home.',
      'They Move In: When they successfully rent through us.',
      'You Earn: Receive ₹2,000 for every successful referral!',
    ],
    icon: Key,
  },
  buy: {
    headline: 'Refer a Buyer. Earn Maximum!',
    bullets: [
      'Refer: Connect us with property buyers or investors.',
      'They Purchase: When they buy a property through InstaMakaan.',
      'You Earn: Receive ₹25,000 for every successful referral!',
    ],
    icon: Home,
  },
};

const steps = [
  {
    icon: User,
    title: 'Get Your Unique Code',
    description: 'Sign up or log in to generate your personalized referral code.',
  },
  {
    icon: Share2,
    title: 'Share with Confidence',
    description: 'Share your code with friends, family, or colleagues who need rental/property solutions.',
  },
  {
    icon: Wallet,
    title: 'Track & Earn',
    description: "We'll notify you when your referral converts, and your reward will be processed!",
  },
];

const leaderboard = [
  { rank: 1, name: 'Riya Sharma', earnings: '₹75,000', referrals: 15 },
  { rank: 2, name: 'Amit Verma', earnings: '₹60,000', referrals: 12 },
  { rank: 3, name: 'Priya Kapoor', earnings: '₹45,000', referrals: 9 },
  { rank: 4, name: 'Rahul Singh', earnings: '₹30,000', referrals: 6 },
  { rank: 5, name: 'Neha Gupta', earnings: '₹25,000', referrals: 5 },
];

const ReferPage = () => {
  const [activeTab, setActiveTab] = useState('pre-occupied');
  const content = tabContent[activeTab];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / Refer & Earn
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 hero-gradient">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Refer & Earn with InstaMakaan
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Share the Sukoon. Get rewarded for spreading reliability and trust.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
                <TabsTrigger
                  value="buy"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  BUY
                </TabsTrigger>
                <TabsTrigger
                  value="pre-occupied"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  PRE-OCCUPIED
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  RENT
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Card */}
          <Card className="bg-card border-0 shadow-elevated overflow-hidden max-w-4xl mx-auto">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Content */}
                <div className="p-6 md:p-10 flex flex-col justify-center animate-fade-in" key={activeTab}>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                    {content.headline}
                  </h2>
                  <ul className="space-y-4 mb-8">
                    {content.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Gift className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="teal" size="lg">
                      How Does It Work?
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="yellow" size="lg">
                      Sign Up / Login to Earn
                    </Button>
                  </div>
                </div>

                {/* Visual */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12 flex items-center justify-center min-h-[300px]">
                  <div className="relative animate-fade-in" key={`visual-${activeTab}`}>
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-primary/10 flex items-center justify-center">
                      <content.icon className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                      <Gift className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-primary/20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 section-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Earn in 3 Simple Steps Using Your Referral Code
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              It&apos;s easy to share the InstaMakaan advantage and get rewarded.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 md:py-24 section-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              InstaMakaan Referral Champions
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              See who&apos;s earning the most and topping our charts! Will you be next?
            </p>
          </div>

          <Card className="bg-card border-0 shadow-card max-w-3xl mx-auto overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Rank</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold text-right">Total Earnings</TableHead>
                  <TableHead className="font-semibold text-right">Referrals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => (
                  <TableRow key={entry.rank}>
                    <TableCell>
                      <div className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                        entry.rank === 1 && 'bg-accent text-accent-foreground',
                        entry.rank === 2 && 'bg-muted-foreground/20 text-foreground',
                        entry.rank === 3 && 'bg-primary/20 text-primary',
                        entry.rank > 3 && 'bg-muted text-muted-foreground'
                      )}>
                        {entry.rank}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell className="text-right font-semibold text-success">{entry.earnings}</TableCell>
                    <TableCell className="text-right">{entry.referrals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ReferPage;
