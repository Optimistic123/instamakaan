import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Train,
  GraduationCap,
  Hospital,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock property data
const propertyData = {
  id: 1,
  type: 'pre-occupied',
  title: 'Pre-Occupied Flat in Supertech Capetown',
  location: 'Sector 74, Noida',
  images: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&h=800&fit=crop',
  ],
  pricing: {
    rent: '15,000',
    deposit: '2 Months',
    serviceFee: '5,000',
  },
  overview: {
    status: 'Ready to Move',
    furnishing: 'Fully Furnished',
    occupancy: 'Single/Double Sharing',
    gender: 'Female Only',
  },
  amenities: [
    { icon: Wifi, name: 'High-Speed WiFi' },
    { icon: Shield, name: 'Professional Housekeeping' },
    { icon: Phone, name: '24/7 Support' },
    { icon: Car, name: 'Washing Machine' },
    { icon: Waves, name: 'RO Water' },
    { icon: Building2, name: 'Smart Lock' },
  ],
  description: "This isn't just a room; it's a lifestyle. Experience true Sukoon in this fully-managed, all-inclusive home. Forget chasing landlords or splitting bills—we handle it all. Your monthly rent covers WiFi, housekeeping, maintenance, and access to a vibrant community. Just move in, plug in, and start living.",
  rules: [
    'Guests are welcome (9 AM – 9 PM). Overnight guests allowed with prior notice.',
    'Quiet Hours: 11 PM – 7 AM for the comfort of all residents.',
    'No smoking permitted inside rooms or common areas.',
    'Be respectful of all residents.',
    'No pets allowed in shared living spaces.',
  ],
  beds: 1,
  baths: 1,
  area: '450 sq.ft.',
};

const relatedProperties = [
  {
    id: 2,
    title: 'Managed Studio in Gaur City',
    location: 'Greater Noida West',
    price: '12,000',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: '2 BHK in Nirala Aspire',
    location: 'Sector 16, Greater Noida',
    price: '22,000',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=400&h=300&fit=crop',
  },
];

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', whatsapp: false });

  const property = propertyData; // In real app, fetch by id

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + property.images.length) % property.images.length
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Visit scheduled! We will contact you shortly.');
  };

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
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation */}
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
                <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                  Managed Home
                </div>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
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
                      <p className="text-sm text-muted-foreground">Per Bed Rent</p>
                      <p className="text-xl font-bold text-primary">₹{property.pricing.rent}/month</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Security Deposit</p>
                      <p className="text-lg font-semibold text-foreground">{property.pricing.deposit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">One-Time Service Fee</p>
                      <p className="text-lg font-semibold text-foreground">₹{property.pricing.serviceFee}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    *Prices are indicative and subject to change.
                  </p>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.amenities.map((amenity) => (
                      <div key={amenity.name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <amenity.icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Overview */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(property.overview).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </p>
                        <p className="font-medium text-foreground">{value}</p>
                      </div>
                    ))}
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

              {/* Housing Rules */}
              <Card className="bg-card border-0 shadow-card">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Housing Rules</h2>
                  <ul className="space-y-3">
                    {property.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
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
                      <Button type="submit" variant="teal" size="lg" className="w-full">
                        <Calendar className="w-5 h-5 mr-2" />
                        Schedule a Visit
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Related Properties */}
                <Card className="bg-card border-0 shadow-card">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      People also search for...
                    </h3>
                    <div className="space-y-4">
                      {relatedProperties.map((prop) => (
                        <Link
                          key={prop.id}
                          to={`/property/${prop.id}`}
                          className="flex gap-3 group"
                        >
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-20 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {prop.title}
                            </p>
                            <p className="text-xs text-muted-foreground">{prop.location}</p>
                            <p className="text-sm font-semibold text-primary">
                              ₹{prop.price}/mo
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
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
