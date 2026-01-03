import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  Loader2,
  PhoneCall,
  CalendarCheck,
  CheckCheck,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import InquiryDetailDrawer from '@/components/admin/InquiryDetailDrawer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Inquiry status workflow
const statusWorkflow = [
  { value: 'assigned', label: 'Assigned', icon: UserCheck, color: 'bg-primary/10 text-primary' },
  { value: 'talked', label: 'Talked', icon: PhoneCall, color: 'bg-accent/10 text-accent-foreground' },
  { value: 'visit_scheduled', label: 'Visit Scheduled', icon: Calendar, color: 'bg-warning/10 text-warning' },
  { value: 'visit_confirmed', label: 'Visit Confirmed', icon: CalendarCheck, color: 'bg-success/10 text-success' },
  { value: 'closed', label: 'Closed', icon: CheckCheck, color: 'bg-muted text-muted-foreground' },
];

const AgentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.linked_id) {
      fetchAgentInquiries();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAgentInquiries = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/${user.linked_id}/inquiries`);
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

  const getStatusInfo = (status) => {
    return statusWorkflow.find(s => s.value === status) || statusWorkflow[0];
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = statusWorkflow.findIndex(s => s.value === currentStatus);
    if (currentIndex < statusWorkflow.length - 1) {
      return statusWorkflow[currentIndex + 1];
    }
    return null;
  };

  const updateInquiryStatus = async (inquiryId, status) => {
    setSubmitting(true);
    try {
      const params = new URLSearchParams({
        agent_id: user.linked_id,
        message: `Status updated to ${status.replace('_', ' ')}`,
        new_status: status,
      });

      const response = await fetch(`${BACKEND_URL}/api/inquiries/${inquiryId}/log?${params}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(`Status updated to ${status.replace('_', ' ')}`);
        fetchAgentInquiries();
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
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
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Account Not Linked</h2>
        <p className="text-muted-foreground">
          Your account is not linked to an agent profile. Please contact admin.
        </p>
      </div>
    );
  }

  const { agent, total_inquiries, status_counts, inquiries } = data || { inquiries: [], status_counts: {}, total_inquiries: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Inquiries</h1>
        <p className="text-muted-foreground">Manage your assigned inquiries and track progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusWorkflow.map((status) => {
          const StatusIcon = status.icon;
          const count = status_counts?.[status.value] || 0;
          return (
            <Card key={status.value} className={cn('bg-card border-0 shadow-sm transition-all', count > 0 && 'ring-1 ring-primary/20')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', status.color)}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground">{status.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Total Inquiries */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Assigned Inquiries</p>
              <p className="text-4xl font-bold text-foreground">{total_inquiries || 0}</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries List */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {!inquiries || inquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No inquiries assigned yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                New inquiries will appear here when assigned by admin
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => {
                const statusInfo = getStatusInfo(inquiry.status);
                const nextStatus = getNextStatus(inquiry.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={inquiry.id} className="p-4 bg-secondary/50 rounded-xl">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            onClick={() => setSelectedInquiryId(inquiry.id)}
                            className="font-semibold text-primary hover:underline text-left"
                          >
                            {inquiry.name}
                          </button>
                          <span className={cn(
                            'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium',
                            statusInfo.color
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone className="w-3 h-3" /> {inquiry.phone}
                          </a>
                          {inquiry.email && (
                            <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-primary">
                              <Mail className="w-3 h-3" /> {inquiry.email}
                            </a>
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
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {nextStatus && inquiry.status !== 'closed' && (
                          <Button
                            variant="teal"
                            size="sm"
                            onClick={() => updateInquiryStatus(inquiry.id, nextStatus.value)}
                            disabled={submitting}
                          >
                            {submitting ? (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            ) : (
                              <nextStatus.icon className="w-4 h-4 mr-1" />
                            )}
                            Mark as {nextStatus.label}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInquiryId(inquiry.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Details
                        </Button>
                      </div>
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Drawer */}
      <InquiryDetailDrawer
        inquiryId={selectedInquiryId}
        agentId={user?.linked_id}
        isOpen={!!selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
        onUpdate={fetchAgentInquiries}
      />
    </div>
  );
};

export default AgentDashboard;
