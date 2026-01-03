import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Building2,
  Home,
  Key,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertiesListPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewPropertyId, setPreviewPropertyId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
        toast.success('Property deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || property.property_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pre-occupied':
        return Home;
      case 'rent':
        return Key;
      case 'buy':
        return Building2;
      default:
        return Building2;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'rented':
        return 'bg-primary/10 text-primary';
      case 'sold':
        return 'bg-accent/10 text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button variant="teal" asChild>
          <Link to="/admin/properties/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pre-occupied">Pre-Occupied</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card className="bg-card border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading properties...
                  </TableCell>
                </TableRow>
              ) : filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No properties found</p>
                      <Button variant="link" asChild className="mt-2">
                        <Link to="/admin/properties/new">Add your first property</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => {
                  const TypeIcon = getTypeIcon(property.property_type);
                  return (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                            {property.images?.[0] ? (
                              <img
                                src={property.images[0].startsWith('http') ? property.images[0] : `${BACKEND_URL}${property.images[0]}`}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => setPreviewPropertyId(property.id)}
                              className="font-medium line-clamp-1 text-primary hover:underline text-left"
                            >
                              {property.title}
                            </button>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {property.location}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="w-4 h-4 text-primary" />
                          <span className="capitalize">{property.property_type?.replace('-', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">₹{property.price}</p>
                        <p className="text-xs text-muted-foreground">{property.price_label}</p>
                      </TableCell>
                      <TableCell>
                        <span className={cn('text-xs px-2 py-1 rounded-full font-medium capitalize', getStatusColor(property.status))}>
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/property/${property.id}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/properties/${property.id}/edit`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;{property.title}&quot;? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(property.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Property Preview Drawer */}
      <PropertyPreviewDrawer
        propertyId={previewPropertyId}
        isOpen={!!previewPropertyId}
        onClose={() => setPreviewPropertyId(null)}
      />
    </div>
  );
};

export default PropertiesListPage;
