import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  UserCheck,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AgentInquiriesPage = () => {
  const { agentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentInquiries();
  }, [agentId]);

  const fetchAgentInquiries = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/${agentId}/inquiries`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching agent inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-warning/10 text-warning';
      case 'assigned': return 'bg-primary/10 text-primary';
      case 'talked': return 'bg-accent/10 text-accent-foreground';
      case 'visit_scheduled': return 'bg-success/10 text-success';
      case 'visit_completed': return 'bg-chart-3/10 text-chart-3';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Agent not found</p>
        <Button variant="link" asChild>
          <Link to="/admin/agents">Back to Agents</Link>
        </Button>
      </div>
    );
  }

  const { agent, total_inquiries, status_counts, inquiries } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/agents">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Agent Inquiries
          </h1>
          <p className="text-muted-foreground">View inquiries assigned to this agent</p>
        </div>
      </div>

      {/* Agent Info */}
      <Card className="bg-card border-0 shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{agent.name}</h2>
              <p className="text-sm text-muted-foreground">{agent.designation}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {agent.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {agent.email}
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{total_inquiries}</p>
              <p className="text-sm text-muted-foreground">Total Inquiries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(status_counts).map(([status, count]) => (
          <Card key={status} className="bg-card border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground capitalize">{status.replace('_', ' ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inquiries List */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No inquiries assigned yet</p>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 bg-secondary/50 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{inquiry.name}</h3>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium capitalize',
                          getStatusColor(inquiry.status)
                        )}>
                          {inquiry.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {inquiry.phone}
                        </span>
                        {inquiry.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {inquiry.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      {inquiry.message && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/inquiries?id=${inquiry.id}`}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Link>
                    </Button>
                  </div>

                  {/* Conversation Logs */}
                  {inquiry.conversation_logs?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</p>
                      <div className="space-y-2">
                        {inquiry.conversation_logs.slice(-3).map((log, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <div>
                              <p className="text-foreground">{log.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.agent_name} • {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentInquiriesPage;
