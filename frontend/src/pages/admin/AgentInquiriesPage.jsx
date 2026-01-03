import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  UserCheck,
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

const AgentInquiriesPage = () => {
  const { agentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const updateInquiryStatus = async (inquiryId, status, message = '') => {
    setSubmitting(true);
    try {
      const logMessage = message || `Status updated to ${status.replace('_', ' ')}`;
      const params = new URLSearchParams({
        agent_id: agentId,
        message: logMessage,
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
            Agent Dashboard
          </h1>
          <p className="text-muted-foreground">Manage assigned inquiries and track progress</p>
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

      {/* Status Summary - Workflow Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statusWorkflow.map((status) => {
          const StatusIcon = status.icon;
          const count = status_counts[status.value] || 0;
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

      {/* Inquiries List with Actions */}
      <Card className="bg-card border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No inquiries assigned yet</p>
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
        agentId={agentId}
        isOpen={!!selectedInquiryId}
        onClose={() => setSelectedInquiryId(null)}
        onUpdate={fetchAgentInquiries}
      />
    </div>
  );
};

export default AgentInquiriesPage;
