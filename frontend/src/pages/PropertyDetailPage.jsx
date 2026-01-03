import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Phone,
  Home,
  Building2,
  Wifi,
  Car,
  Dumbbell,
  Shield,
  Waves,
  TreePine,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const amenityIcons = {
  'High-Speed WiFi': Wifi,
  'WiFi': Wifi,
  'Parking': Car,
  'Gymnasium': Dumbbell,
  'Security': Shield,
  'Swimming Pool': Waves,
  'Garden': TreePine,
  'default': CheckCircle2,
};

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', whatsapp: false });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      } else {
        toast.error('Property not found');
        navigate('/properties');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

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
          phone: formData.phone,
          property_id: id,
          inquiry_type: 'schedule_visit',
          whatsapp_updates: formData.whatsapp,
          message: `Visit request for: ${property?.title}`,
        }),
      });

      if (response.ok) {
        toast.success('Visit scheduled! We will contact you shortly.');
        setFormData({ name: '', phone: '', whatsapp: false });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to schedule visit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Property not found</p>
            <Button variant="link" asChild className="mt-2">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const images = property.images?.length > 0
    ? property.images.map(img => img.startsWith('http') ? img : `${BACKEND_URL}${img}`)
    : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-3">
        <div className="container-custom">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            {' / '}
            <Link to="/properties" className="hover:text-primary">Properties</Link>
            {' / '}
            {property.title}
          </p>
        </div>
      </div>

      <section className="py-6 md:py-10">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[16/10]">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-destructive transition-colors"
                  >
                    <Heart className={cn('w-5 h-5', isFavorite && 'fill-destructive text-destructive')} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-primary transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Badge */}
                {property.is_managed && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Managed Home
                  </div>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          index === currentImageIndex ? 'w-8 bg-card' : 'bg-card/50'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Location */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {property.title}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {property.location}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{property.beds} Bed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{property.baths} Bath</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-primary" />
                  <span className="text-foreground">{property.area}</span>
                </div>
              </div>

              {/* Pricing */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Pricing</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{property.price_label}</p>
                      <p className="text-xl font-bold text-primary">₹{property.price}{property.property_type !== 'buy' && '/month'}</p>
                    </div>
                    {property.deposit && (
                      <div>
                        <p className="text-sm text-muted-foreground">Security Deposit</p>
                        <p className="text-lg font-semibold text-foreground">{property.deposit}</p>
                      </div>
                    )}
                    {property.brokerage && (
                      <div>
                        <p className="text-sm text-muted-foreground">Brokerage</p>
                        <p className="text-lg font-semibold text-foreground">{property.brokerage}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <Card className="bg-card border-0 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {property.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || amenityIcons.default;
                        return (
                          <div key={amenity} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm text-foreground">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Overview */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium text-foreground capitalize">{property.status}</p>
                    </div>
                    {property.furnishing && (
                      <div>
                        <p className="text-sm text-muted-foreground">Furnishing</p>
                        <p className="font-medium text-foreground capitalize">{property.furnishing?.replace('-', ' ')}</p>
                      </div>
                    )}
                    {property.preferred_tenant && (
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Tenant</p>
                        <p className="font-medium text-foreground capitalize">{property.preferred_tenant}</p>
                      </div>
                    )}
                    {property.gender_preference && property.gender_preference !== 'any' && (
                      <div>
                        <p className="text-sm text-muted-foreground">Gender Preference</p>
                        <p className="font-medium text-foreground capitalize">{property.gender_preference}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {/* Features */}
              {property.features?.length > 0 && (
                <Card className="bg-card border-0 shadow-card">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Sticky Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Schedule Visit Form */}
                <Card className="bg-card border-0 shadow-elevated">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Schedule Your Visit
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <Input
                        placeholder="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="whatsapp"
                          checked={formData.whatsapp}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, whatsapp: checked })
                          }
                        />
                        <label htmlFor="whatsapp" className="text-sm text-muted-foreground">
                          Get updates over WhatsApp
                        </label>
                      </div>
                      <Button type="submit" variant="teal" size="lg" className="w-full" disabled={submitting}>
                        {submitting ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Calendar className="w-5 h-5 mr-2" />
                        )}
                        Schedule a Visit
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card className="bg-card border-0 shadow-card">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                      Have questions? Call us directly
                    </p>
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <a href="tel:+919999900000">
                        <Phone className="w-5 h-5 mr-2" />
                        +91 99999 00000
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyDetailPage;
