import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search, Building2, Home, Key } from 'lucide-react';

const faqData = {
  'pre-occupied': [
    {
      question: 'What is an "InstaMakaan Managed Home" (Pre-Occupied)?',
      answer: "This is our premium rental service. A Managed Home is a property 100% managed by InstaMakaan. We handle everything: your move-in, all maintenance requests, rent collection, and support, giving you a professional, hassle-free rental experience, or true Sukoon.",
    },
    {
      question: 'Who do I contact for maintenance (like a leaky tap or AC issue)?',
      answer: "You contact us directly! Every tenant in a Managed Home gets access to our dedicated support system. Just raise a ticket, and our professional team will coordinate and resolve the issue. No more chasing landlords.",
    },
    {
      question: 'Is rent more expensive for a Managed Home?',
      answer: "Not necessarily. The rent is set at the fair market value. The difference is the service you receive—you're paying for a professionally managed experience, reliability, and peace of mind, which is often priceless.",
    },
    {
      question: 'Is there still a brokerage fee for a Managed Home?',
      answer: "Yes. The standard 15-day brokerage fee applies for our service in finding, verifying, and placing you in the home. The ongoing management service is paid for by the property owner.",
    },
    {
      question: 'How is my security deposit handled?',
      answer: "Your security deposit is handled with full transparency. We conduct a detailed, digitally-documented move-in inspection. At move-out, we conduct a fair joint inspection, and the deposit is returned as per the rental agreement, minus any mutually agreed-upon charges for damages.",
    },
  ],
  rent: [
    {
      question: 'Are all the listings on your website verified?',
      answer: 'Yes. This is our core promise. Every "Verified" listing on InstaMakaan has been physically checked by our team. We guarantee: no fake photos, no false promises. What you see is what you get.',
    },
    {
      question: "What is InstaMakaan's brokerage fee for rentals?",
      answer: "We charge the standard market rate of 15 days' rent (plus GST) as our brokerage fee, payable upon signing the agreement. This is a one-time fee for our professional service.",
    },
    {
      question: 'What documents do I need to rent a flat in Noida?',
      answer: 'You will typically need: Identity Proof (Aadhaar Card or Passport), Address Proof, Income Proof (Recent Salary Slips or Bank Statement), Employment Proof (Company ID card or offer letter), and a PAN Card.',
    },
    {
      question: 'Who handles the rental agreement and police verification?',
      answer: 'We facilitate the entire process. We provide a standardized, legally-vetted rental agreement and will guide you through the online police verification process, making your move-in as smooth as possible.',
    },
    {
      question: 'What\'s the difference between a "Rent" property and a "Managed Home"?',
      answer: 'A "Rent" property is a standard rental where we act as the broker to connect you with the owner. After you move in, the owner is your primary point of contact. A "Managed Home" is one where InstaMakaan is your point of contact for everything, offering a full-service experience.',
    },
  ],
  buy: [
    {
      question: 'What is the complete process for buying a property in Noida?',
      answer: 'The general process is: 1. Discover & Visit. 2. Pay Token Money. 3. Sign Agreement to Sell (ATS). 4. Get Home Loan (if needed). 5. Execute Sale Deed & Registration (pay stamp duty). 6. Take Possession.',
    },
    {
      question: 'What are the extra costs besides the property price?',
      answer: 'Be prepared for: Stamp Duty, Registration Fees, Brokerage, GST (applicable on under-construction properties), and Legal Fees.',
    },
    {
      question: 'What is the current stamp duty in Noida & Greater Noida?',
      answer: 'As of late 2025, the stamp duty in Noida (Gautam Budh Nagar) is approximately 7% of the property value. We always advise verifying the exact current rate at the time of purchase, as it can change.',
    },
    {
      question: 'How do you help with legal verification for resale properties?',
      answer: 'This is a critical step. We connect you with verified, independent legal professionals who conduct a thorough "due diligence" check. They will examine the complete chain of property documents, title deed, and encumbrance certificates to ensure the property is legally clear.',
    },
    {
      question: 'Can InstaMakaan help me get a home loan?',
      answer: "Absolutely. While we don't provide loans directly, we have strong partnerships with all major banks and financial institutions. We can connect you with the right loan officers to ensure a fast, smooth, and competitive home loan process.",
    },
  ],
};

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState('pre-occupied');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = faqData[activeTab];
  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / FAQ
          </p>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 md:py-16 section-light">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
                <TabsTrigger
                  value="buy"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  BUY
                </TabsTrigger>
                <TabsTrigger
                  value="pre-occupied"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Home className="w-4 h-4 mr-2" />
                  PRE-OCCUPIED
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className="px-4 py-2.5 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Key className="w-4 h-4 mr-2" />
                  RENT
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder='Ask us anything... (e.g., "What is your brokerage fee?")'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-10 md:py-16">
        <div className="container-custom max-w-3xl">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl shadow-card border-0 overflow-hidden px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No questions found matching your search.</p>
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 section-light">
        <div className="container-custom text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
          </p>
          <Button variant="teal" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
