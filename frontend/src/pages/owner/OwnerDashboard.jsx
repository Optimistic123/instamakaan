import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Building2,
  TrendingUp,
  Wallet,
  Calendar,
  MapPin,
  Loader2,
  Eye,
  IndianRupee,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewPropertyId, setPreviewPropertyId] = useState(null);

  useEffect(() => {
    if (user?.linked_id) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owners/${user.linked_id}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user?.linked_id) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Account Not Linked</h2>
        <p className="text-muted-foreground">
          Your account is not linked to an owner profile. Please contact admin.
        </p>
      </div>
    );
  }

  const {
    owner,
    total_properties = 0,
    active_properties = 0,
    total_earnings = 0,
    this_month_earnings = 0,
    properties = [],
    earnings_history = [],
  } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your properties and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <p className="text-3xl font-bold text-foreground mt-1">{total_properties}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-3xl font-bold text-foreground mt-1">{active_properties}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ₹{total_earnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-0 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ₹{this_month_earnings.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Section */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">My Properties</CardTitle>
            <span className="text-sm text-muted-foreground">{properties.length} properties</span>
          </div>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No properties assigned yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-20 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setPreviewPropertyId(property.id)}
                      className="font-medium text-primary hover:underline truncate text-left block w-full"
                    >
                      {property.title}
                    </button>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {property.location}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground capitalize">{property.property_type}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className={cn(
                        'capitalize',
                        property.status === 'active' ? 'text-success' : 'text-muted-foreground'
                      )}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-primary">₹{property.price}</p>
                    <p className="text-xs text-muted-foreground">{property.price_label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings History */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Earnings History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {earnings_history.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No earnings recorded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your rental earnings will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings_history.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{earning.property_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(earning.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-success font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    {earning.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
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

export default OwnerDashboard;
