import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const defaultFormData = {
  title: '',
  property_type: 'rent',
  location: '',
  sector: '',
  price: '',
  price_label: 'Full Flat Rent',
  description: '',
  beds: 1,
  baths: 1,
  area: '',
  features: [],
  amenities: [],
  furnishing: 'semi-furnished',
  preferred_tenant: 'any',
  gender_preference: 'any',
  is_managed: false,
  status: 'active',
  deposit: '',
  brokerage: '15 Days',
  owner_id: '',
  monthly_rent_amount: 0,
};

const featureOptions = [
  'Ready to Move',
  'Fully Furnished',
  'Semi-Furnished',
  'Unfurnished',
  'Park Facing',
  'Pool Facing',
  'Corner Plot',
  'Gated Society',
  'Near Metro',
  'Near Schools',
  'Near Hospital',
  'Balcony',
  'Parking',
  'Power Backup',
  'Lift',
  'Security',
  '24/7 Water',
  'Modular Kitchen',
];

const amenityOptions = [
  'Swimming Pool',
  'Gymnasium',
  'Clubhouse',
  'Kids Play Area',
  'Garden',
  'Jogging Track',
  'Indoor Games',
  'Community Hall',
  'Badminton Court',
  'Tennis Court',
  'High-Speed WiFi',
  'Housekeeping',
  'Smart Lock',
  'Video Door Phone',
  'CCTV Surveillance',
  'Fire Safety',
];

const PropertyFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(defaultFormData);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
    if (isEditing) {
      fetchProperty();
    }
  }, [id]);

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owners?status=active`);
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const fetchProperty = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          ...defaultFormData,
          ...data,
        });
        setImages(data.images || []);
      } else {
        throw new Error('Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to load property');
      navigate('/admin/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      files.forEach((file) => {
        formDataUpload.append('files', file);
      });

      const response = await fetch(`${BACKEND_URL}/api/upload/multiple`, {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setImages((prev) => [...prev, ...data.urls]);
        toast.success(`${files.length} image(s) uploaded`);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const addCustomFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        images,
      };

      const url = isEditing
        ? `${BACKEND_URL}/api/properties/${id}`
        : `${BACKEND_URL}/api/properties`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(isEditing ? 'Property updated successfully' : 'Property created successfully');
        navigate('/admin/properties');
      } else {
        throw new Error('Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/properties">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Update property details' : 'Fill in the property details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., 3 BHK for Rent in ATS Greens"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property_type">Property Type *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => handleChange('property_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-occupied">Pre-Occupied (Managed)</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="buy">Buy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="owner_id">Assign to Owner *</Label>
                <Select
                  value={formData.owner_id}
                  onValueChange={(value) => handleChange('owner_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="monthly_rent_amount">Monthly Rent Amount (for earnings)</Label>
                <Input
                  id="monthly_rent_amount"
                  type="number"
                  value={formData.monthly_rent_amount}
                  onChange={(e) => handleChange('monthly_rent_amount', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 35000"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., Sector 150, Noida"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector / Society</Label>
                <Input
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                  placeholder="e.g., ATS Greens Village"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the property..."
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is_managed"
                checked={formData.is_managed}
                onCheckedChange={(checked) => handleChange('is_managed', checked)}
              />
              <Label htmlFor="is_managed" className="cursor-pointer">
                This is an InstaMakaan Managed Home
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="e.g., 35,000 or 1.25 Cr"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price_label">Price Label</Label>
                <Select
                  value={formData.price_label}
                  onValueChange={(value) => handleChange('price_label', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Per Bed Rent">Per Bed Rent</SelectItem>
                    <SelectItem value="Full Flat Rent">Full Flat Rent</SelectItem>
                    <SelectItem value="Price">Price</SelectItem>
                    <SelectItem value="Total Price">Total Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deposit">Security Deposit</Label>
                <Input
                  id="deposit"
                  value={formData.deposit}
                  onChange={(e) => handleChange('deposit', e.target.value)}
                  placeholder="e.g., 2 Months"
                />
              </div>
              <div>
                <Label htmlFor="brokerage">Brokerage</Label>
                <Input
                  id="brokerage"
                  value={formData.brokerage}
                  onChange={(e) => handleChange('brokerage', e.target.value)}
                  placeholder="e.g., 15 Days"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Details */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="beds">Bedrooms</Label>
                <Input
                  id="beds"
                  type="number"
                  min="0"
                  value={formData.beds}
                  onChange={(e) => handleChange('beds', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="baths">Bathrooms</Label>
                <Input
                  id="baths"
                  type="number"
                  min="0"
                  value={formData.baths}
                  onChange={(e) => handleChange('baths', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="e.g., 1500 sq.ft."
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="furnishing">Furnishing</Label>
                <Select
                  value={formData.furnishing}
                  onValueChange={(value) => handleChange('furnishing', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                    <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="preferred_tenant">Preferred Tenant</Label>
                <Select
                  value={formData.preferred_tenant}
                  onValueChange={(value) => handleChange('preferred_tenant', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="bachelor">Bachelor</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender_preference">Gender Preference</Label>
                <Select
                  value={formData.gender_preference}
                  onValueChange={(value) => handleChange('gender_preference', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="male">Male Only</SelectItem>
                    <SelectItem value="female">Female Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={image.startsWith('http') ? image : `${BACKEND_URL}${image}`}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                  </>
                )}
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload high-quality images of the property. First image will be the main image.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    formData.features.includes(feature)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {feature}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add custom feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
              />
              <Button type="button" variant="outline" onClick={addCustomFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    formData.amenities.includes(amenity)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  )}
                >
                  {amenity}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
              />
              <Button type="button" variant="outline" onClick={addCustomAmenity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="teal" size="lg" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Update Property' : 'Create Property'}
          </Button>
          <Button type="button" variant="outline" size="lg" asChild>
            <Link to="/admin/properties">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyFormPage;
