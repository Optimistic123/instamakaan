import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  Wallet,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PropertyPreviewDrawer from '@/components/admin/PropertyPreviewDrawer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerDashboardPage = () => {
  const { ownerId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewPropertyId, setPreviewPropertyId] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, [ownerId]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owners/${ownerId}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
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

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Owner not found</p>
        <Button variant="link" asChild>
          <Link to="/admin/owners">Back to Owners</Link>
        </Button>
      </div>
    );
  }

  const { owner, total_properties, active_properties, total_earnings, current_month_earnings, properties, earnings_history } = dashboardData;

  const statCards = [
    {
      title: 'Total Properties',
      value: total_properties,
      icon: Building2,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Active Listings',
      value: active_properties,
      icon: TrendingUp,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Total Earnings',
      value: `₹${total_earnings.toLocaleString()}`,
      icon: Wallet,
      color: 'bg-accent/10 text-accent-foreground',
    },
    {
      title: 'This Month',
      value: `₹${current_month_earnings.toLocaleString()}`,
      icon: Calendar,
      color: 'bg-warning/10 text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/owners">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground">View owner properties and earnings</p>
        </div>
      </div>

      {/* Owner Info Card */}
      <Card className="bg-card border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{owner.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {owner.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {owner.email}
                </span>
              </div>
            </div>
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium capitalize',
              owner.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
            )}>
              {owner.status}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-0 shadow-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Properties */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Properties ({total_properties})</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No properties assigned yet</p>
            ) : (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
                    <div className="w-16 h-12 rounded-lg bg-muted overflow-hidden">
                      {property.images?.[0] ? (
                        <img
                          src={property.images[0].startsWith('http') ? property.images[0] : `${BACKEND_URL}${property.images[0]}`}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
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
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {property.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{property.price}</p>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full capitalize',
                        property.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      )}>
                        {property.status}
                      </span>
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
            <CardTitle className="text-lg">Earnings History</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings_history.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No earnings recorded yet</p>
            ) : (
              <div className="space-y-3">
                {earnings_history.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">{earning.month}</p>
                      <p className="text-sm text-muted-foreground capitalize">{earning.status}</p>
                    </div>
                    <p className={cn(
                      'text-lg font-semibold',
                      earning.status === 'paid' ? 'text-success' : 'text-warning'
                    )}>
                      ₹{earning.amount?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property Preview Drawer */}
      <PropertyPreviewDrawer
        propertyId={previewPropertyId}
        isOpen={!!previewPropertyId}
        onClose={() => setPreviewPropertyId(null)}
      />
    </div>
  );
};

export default OwnerDashboardPage;
