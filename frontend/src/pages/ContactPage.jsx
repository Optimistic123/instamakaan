import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '+91 99999 00000',
    link: 'tel:+919999900000',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@instamakaan.com',
    link: 'mailto:contact@instamakaan.com',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'Sector 62, Noida, UP',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: 'Mon-Sat: 9AM - 7PM',
    link: null,
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          inquiry_type: 'general',
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Message sent successfully! We will get back to you soon.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / Contact Us
          </p>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 md:py-16 section-light">
        <div className="container-custom text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions? We're here to help. Reach out to our team for any inquiries.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 md:py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <Card key={info.title} className="bg-card border-0 shadow-card">
                    <CardContent className="p-4">
                      {info.link ? (
                        <a
                          href={info.link}
                          className="flex items-center gap-4 group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <info.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.title}</p>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {info.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <info.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">{info.title}</p>
                            <p className="font-medium text-foreground">{info.value}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <Card className="bg-card border-0 shadow-card mt-6 overflow-hidden">
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Map View</p>
                    <p className="text-xs text-muted-foreground">Sector 62, Noida</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-0 shadow-elevated">
                <CardContent className="p-6 md:p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-semibold text-foreground mb-6">
                        Send us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Name *
                            </label>
                            <Input
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Email *
                            </label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Phone
                            </label>
                            <Input
                              type="tel"
                              placeholder="+91 XXXXX XXXXX"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-2 block">
                              Subject *
                            </label>
                            <Select
                              value={formData.subject}
                              onValueChange={(value) => handleChange('subject', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="property">Property Inquiry</SelectItem>
                                <SelectItem value="owner">For Property Owners</SelectItem>
                                <SelectItem value="tenant">For Tenants</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            Message *
                          </label>
                          <Textarea
                            placeholder="Tell us how we can help you..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            required
                          />
                        </div>

                        <Button type="submit" variant="teal" size="lg" className="w-full sm:w-auto" disabled={submitting}>
                          {submitting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Send Message
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
