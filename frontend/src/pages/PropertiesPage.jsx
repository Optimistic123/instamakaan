import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  Home,
  Building2,
  Key,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useSearchParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const tabContent = {
  'pre-occupied': {
    usps: [
      'Welcome to a Managed Home. Renting, redefined.',
      '24/7 Service. 100% Verified. Total Sukoon.',
      'Your Home, Your Vibe, Our Responsibility.',
    ],
    resultText: 'Pre-Occupied',
  },
  rent: {
    usps: [
      'Find Your Verified Home. Fast.',
      'No Fakes. No Scams. Just Real, Quality Flats.',
      'Your Next Home is Just a Click Away.',
    ],
    resultText: 'Rent',
  },
  buy: {
    usps: [
      'Buy Your Dream Home. Move in Today.',
      '100% Verified, Ready-to-Move Properties.',
      'Your Partner in Ownership. Buy with Confidence.',
    ],
    resultText: 'Buy',
  },
};

const properties = [
  {
    id: 1,
    type: 'pre-occupied',
    title: 'Pre-Occupied Flat in Supertech Capetown',
    location: 'Sector 74, Noida',
    price: '20,000',
    priceLabel: 'Single Room Rent',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    features: ['Female Only', 'Fully Furnished', 'Ready to Move', 'Near Metro'],
    beds: 1,
    baths: 1,
    area: '450 sq.ft.',
    isManaged: true,
  },
  {
    id: 2,
    type: 'rent',
    title: '3 BHK for Rent in ATS Greens',
    location: 'Sector 150, Noida',
    price: '35,000',
    priceLabel: 'Full Flat Rent',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    features: ['Semi-Furnished', 'Family Preferred', 'Park Facing', 'Gated Society'],
    beds: 3,
    baths: 2,
    area: '1500 sq.ft.',
    isManaged: false,
  },
  {
    id: 3,
    type: 'buy',
    title: 'Ready-to-Move 3 BHK in Jaypee Greens',
    location: 'Sector 128, Noida',
    price: '1.25 Cr',
    priceLabel: 'Price',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    features: ['Ready to Move', 'Freehold', 'Pool Facing', 'Near Expressway'],
    beds: 3,
    baths: 3,
    area: '1800 sq.ft.',
    isManaged: false,
  },
  {
    id: 4,
    type: 'pre-occupied',
    title: 'Managed Studio in Gaur City',
    location: 'Greater Noida West',
    price: '12,000',
    priceLabel: 'Per Bed Rent',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
    features: ['Co-living', 'Fully Furnished', 'WiFi Included', 'Housekeeping'],
    beds: 1,
    baths: 1,
    area: '350 sq.ft.',
    isManaged: true,
  },
  {
    id: 5,
    type: 'rent',
    title: '2 BHK in Nirala Aspire',
    location: 'Sector 16, Greater Noida',
    price: '22,000',
    priceLabel: 'Full Flat Rent',
    image: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
    features: ['Semi-Furnished', 'Balcony', 'Parking', 'Near Schools'],
    beds: 2,
    baths: 2,
    area: '1100 sq.ft.',
    isManaged: false,
  },
  {
    id: 6,
    type: 'buy',
    title: '4 BHK Villa in Alpha',
    location: 'Alpha 1, Greater Noida',
    price: '2.5 Cr',
    priceLabel: 'Price',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    features: ['Independent Villa', 'Garden', 'Private Parking', 'Corner Plot'],
    beds: 4,
    baths: 4,
    area: '3500 sq.ft.',
    isManaged: false,
  },
];

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'rent';
  const [activeTab, setActiveTab] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [uspIndex, setUspIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [activeTab]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties?property_type=${activeTab}&status=active`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const content = tabContent[activeTab];

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ type: value });
  };

  return (
    <Layout>
      {/* Hero Section with Search */}
      <section className="py-8 md:py-12 hero-gradient">
        <div className="container-custom">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
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

          {/* Dynamic USP */}
          <div className="text-center mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-primary animate-fade-in" key={activeTab}>
              {content.usps[uspIndex]}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-2xl shadow-elevated p-2 md:p-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by location or society..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-0 bg-secondary/50 rounded-xl"
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
                <Button variant="teal" size="lg" className="h-12 px-6 rounded-xl">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span>{' '}
              <span className="font-semibold text-primary">{content.resultText}</span> results in Noida & Gr. Noida
            </p>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Property Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No properties found</p>
              </div>
            ) : (
            filteredProperties.map((property) => (
              <Card key={property.id} className="bg-card border-0 shadow-card overflow-hidden card-elevated group">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.images?.[0] ? (property.images[0].startsWith('http') ? property.images[0] : `${BACKEND_URL}${property.images[0]}`) : 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {property.is_managed && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Managed Home
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:text-destructive transition-colors"
                  >
                    <Heart
                      className={cn('w-5 h-5', favorites.includes(property.id) && 'fill-destructive text-destructive')}
                    />
                  </button>
                </div>

                <CardContent className="p-4">
                  {/* Title & Location */}
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(property.features || []).slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 bg-secondary rounded-md text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.area}
                    </span>
                  </div>

                  {/* Price & CTAs */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">{property.price_label}</p>
                      <p className="text-lg font-bold text-primary">₹{property.price}<span className="text-sm font-normal text-muted-foreground">{property.property_type !== 'buy' && '/mo'}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/property/${property.id}`}>
                          <Calendar className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="teal" size="sm" asChild>
                        <Link to={`/property/${property.id}`}>
                          <Phone className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertiesPage;
