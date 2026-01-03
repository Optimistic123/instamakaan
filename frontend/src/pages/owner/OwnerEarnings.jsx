import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wallet,
  TrendingUp,
  Calendar,
  IndianRupee,
  Loader2,
  BarChart3,
  ArrowUpRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OwnerEarnings = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodFilter, setPeriodFilter] = useState('all');

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
        <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Account Not Linked</h2>
        <p className="text-muted-foreground">
          Your account is not linked to an owner profile. Please contact admin.
        </p>
      </div>
    );
  }

  const {
    total_earnings = 0,
    this_month_earnings = 0,
    earnings_history = [],
    properties = [],
  } = dashboardData || {};

  // Calculate earnings by property
  const earningsByProperty = properties.map(property => {
    const propertyEarnings = earnings_history
      .filter(e => e.property_id === property.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...property,
      earnings: propertyEarnings,
    };
  });

  // Filter earnings history by period
  const filteredEarnings = earnings_history.filter(earning => {
    if (periodFilter === 'all') return true;
    const earningDate = new Date(earning.date);
    const now = new Date();
    
    if (periodFilter === 'this_month') {
      return earningDate >= startOfMonth(now) && earningDate <= endOfMonth(now);
    }
    if (periodFilter === 'last_month') {
      const lastMonth = subMonths(now, 1);
      return earningDate >= startOfMonth(lastMonth) && earningDate <= endOfMonth(lastMonth);
    }
    if (periodFilter === 'last_3_months') {
      return earningDate >= subMonths(now, 3);
    }
    return true;
  });

  const filteredTotal = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Earnings</h1>
        <p className="text-muted-foreground">Track your rental income and earnings</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ₹{total_earnings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-2">All time</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  ₹{this_month_earnings.toLocaleString()}
                </p>
                <p className="text-xs text-success flex items-center gap-1 mt-2">
                  <ArrowUpRight className="w-3 h-3" />
                  Current period
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Properties</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {properties.filter(p => p.status === 'active').length}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Generating income</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings by Property */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Earnings by Property
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earningsByProperty.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No properties found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {earningsByProperty.map((property) => (
                <div key={property.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
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
                    <p className="font-medium text-foreground truncate">{property.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{property.property_type} • {property.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">₹{property.earnings.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total earned</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Transaction History
            </CardTitle>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {periodFilter !== 'all' && (
            <p className="text-sm text-muted-foreground mt-2">
              Total: <span className="font-semibold text-success">₹{filteredTotal.toLocaleString()}</span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          {filteredEarnings.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {periodFilter !== 'all' ? 'Try changing the filter' : 'Your rental earnings will appear here'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEarnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{earning.property_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(earning.date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">+₹{earning.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground capitalize">{earning.type || 'Rental'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerEarnings;
