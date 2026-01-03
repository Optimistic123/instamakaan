import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Home,
  Key,
  MessageSquare,
  TrendingUp,
  Plus,
  Eye,
  Clock,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.total_properties || 0,
      icon: Building2,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Active Listings',
      value: stats?.active_properties || 0,
      icon: TrendingUp,
      color: 'bg-success/10 text-success',
    },
    {
      title: 'Total Owners',
      value: stats?.total_owners || 0,
      icon: Users,
      color: 'bg-chart-3/10 text-chart-3',
    },
    {
      title: 'Active Agents',
      value: stats?.total_agents || 0,
      icon: Users,
      color: 'bg-chart-4/10 text-chart-4',
    },
    {
      title: 'Total Inquiries',
      value: stats?.total_inquiries || 0,
      icon: MessageSquare,
      color: 'bg-accent/10 text-accent-foreground',
    },
    {
      title: 'New Inquiries',
      value: stats?.new_inquiries || 0,
      icon: Clock,
      color: 'bg-warning/10 text-warning',
    },
  ];

  const propertyTypeIcons = {
    'pre-occupied': Home,
    'rent': Key,
    'buy': Building2,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to InstaMakaan Admin Panel</p>
        </div>
        <Button variant="teal" asChild>
          <Link to="/admin/properties/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-0 shadow-card">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {loading ? '-' : stat.value}
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
        {/* Properties by Type */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Properties by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(stats?.properties_by_type || {}).map(([type, count]) => {
                  const Icon = propertyTypeIcons[type] || Building2;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium capitalize">{type.replace('-', ' ')}</span>
                      </div>
                      <span className="text-lg font-semibold">{count}</span>
                    </div>
                  );
                })}
                {Object.keys(stats?.properties_by_type || {}).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No properties yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="bg-card border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/inquiries">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-4">
                {(stats?.recent_inquiries || []).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="text-sm text-muted-foreground">{inquiry.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {inquiry.inquiry_type?.replace('_', ' ')}
                      </p>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-1 rounded-full font-medium',
                      inquiry.status === 'new' && 'bg-warning/10 text-warning',
                      inquiry.status === 'contacted' && 'bg-primary/10 text-primary',
                      inquiry.status === 'closed' && 'bg-muted text-muted-foreground'
                    )}>
                      {inquiry.status}
                    </span>
                  </div>
                ))}
                {(stats?.recent_inquiries || []).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No inquiries yet</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/admin/properties/new">
                <Plus className="w-6 h-6" />
                <span>Add Property</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/admin/properties">
                <Building2 className="w-6 h-6" />
                <span>View Properties</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/admin/inquiries">
                <MessageSquare className="w-6 h-6" />
                <span>View Inquiries</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link to="/" target="_blank">
                <Eye className="w-6 h-6" />
                <span>View Website</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
