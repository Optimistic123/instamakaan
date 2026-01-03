import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Square,
  IndianRupee,
  Pencil,
  User,
  Calendar,
  Tag,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertyPreviewDrawer = ({ propertyId, isOpen, onClose }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchProperty();
    }
  }, [isOpen, propertyId]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'inactive': return 'bg-muted text-muted-foreground';
      case 'rented': return 'bg-primary/10 text-primary';
      case 'sold': return 'bg-accent/10 text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPropertyTypeLabel = (type) => {
    switch (type) {
      case 'pre-occupied': return 'Pre-Occupied (Managed)';
      case 'rent': return 'For Rent';
      case 'buy': return 'For Sale';
      default: return type;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-1">
          <SheetTitle className="flex items-center justify-between">
            <span>Property Details</span>
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : property ? (
          <div className="space-y-6 mt-6">
            {/* Main Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              {property.images?.[0] ? (
                <img
                  src={property.images[0].startsWith('http') ? property.images[0] : `${BACKEND_URL}${property.images[0]}`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-foreground">{property.title}</h2>
                <Badge className={cn('shrink-0 capitalize', getStatusColor(property.status))}>
                  {property.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{property.location}</span>
                {property.sector && <span>• {property.sector}</span>}
              </div>
            </div>

            {/* Price */}
            <div className="p-4 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-primary">₹{property.price}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{property.price_label}</p>
            </div>

            {/* Property Type & Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium text-sm mt-1">{getPropertyTypeLabel(property.property_type)}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Furnishing</p>
                <p className="font-medium text-sm mt-1 capitalize">{property.furnishing || 'N/A'}</p>
              </div>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-4 py-3 border-y border-border">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{property.beds}</span>
                <span className="text-sm text-muted-foreground">Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{property.baths}</span>
                <span className="text-sm text-muted-foreground">Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{property.area}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-sm text-foreground">{property.description}</p>
            </div>

            {/* Owner Info */}
            {property.owner_name && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Property Owner</p>
                    <p className="font-medium">{property.owner_name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {property.features?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {property.deposit && (
                <div>
                  <p className="text-muted-foreground">Deposit</p>
                  <p className="font-medium">{property.deposit}</p>
                </div>
              )}
              {property.brokerage && (
                <div>
                  <p className="text-muted-foreground">Brokerage</p>
                  <p className="font-medium">{property.brokerage}</p>
                </div>
              )}
              {property.preferred_tenant && (
                <div>
                  <p className="text-muted-foreground">Preferred Tenant</p>
                  <p className="font-medium capitalize">{property.preferred_tenant}</p>
                </div>
              )}
              {property.created_at && (
                <div>
                  <p className="text-muted-foreground">Listed On</p>
                  <p className="font-medium">{format(new Date(property.created_at), 'MMM d, yyyy')}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="teal" className="flex-1" asChild>
                <Link to={`/admin/properties/${property.id}/edit`}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Property
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/property/${property.id}`} target="_blank">
                  View Public Page
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Property not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PropertyPreviewDrawer;
