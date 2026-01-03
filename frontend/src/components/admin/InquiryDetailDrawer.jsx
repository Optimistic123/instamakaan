import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  Calendar,
  UserCheck,
  PhoneCall,
  CalendarCheck,
  CheckCheck,
  Send,
  Loader2,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Inquiry status workflow
const statusWorkflow = [
  { value: 'new', label: 'New', icon: Clock, color: 'bg-warning/10 text-warning' },
  { value: 'assigned', label: 'Assigned', icon: UserCheck, color: 'bg-primary/10 text-primary' },
  { value: 'talked', label: 'Talked', icon: PhoneCall, color: 'bg-accent/10 text-accent-foreground' },
  { value: 'visit_scheduled', label: 'Visit Scheduled', icon: Calendar, color: 'bg-warning/10 text-warning' },
  { value: 'visit_confirmed', label: 'Visit Confirmed', icon: CalendarCheck, color: 'bg-success/10 text-success' },
  { value: 'closed', label: 'Closed', icon: CheckCheck, color: 'bg-muted text-muted-foreground' },
];

const InquiryDetailDrawer = ({ inquiryId, agentId, isOpen, onClose, onUpdate }) => {
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && inquiryId) {
      fetchInquiry();
    }
  }, [isOpen, inquiryId]);

  const fetchInquiry = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/inquiries/${inquiryId}`);
      if (response.ok) {
        const data = await response.json();
        setInquiry(data);
      }
    } catch (error) {
      console.error('Error fetching inquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return statusWorkflow.find(s => s.value === status) || statusWorkflow[0];
  };

  const updateStatus = async (status) => {
    if (!agentId) {
      toast.error('No agent ID provided');
      return;
    }
    
    setSubmitting(true);
    try {
      const params = new URLSearchParams({
        agent_id: agentId,
        message: `Status updated to ${status.replace('_', ' ')}`,
        new_status: status,
      });

      const response = await fetch(`${BACKEND_URL}/api/inquiries/${inquiryId}/log?${params}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success(`Status updated to ${status.replace('_', ' ')}`);
        fetchInquiry();
        if (onUpdate) onUpdate();
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

  const addConversationLog = async () => {
    if (!newMessage.trim() || !agentId) return;
    
    setSubmitting(true);
    try {
      const params = new URLSearchParams({
        agent_id: agentId,
        message: newMessage,
      });
      if (newStatus) {
        params.append('new_status', newStatus);
      }

      const response = await fetch(`${BACKEND_URL}/api/inquiries/${inquiryId}/log?${params}`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Log added successfully');
        setNewMessage('');
        setNewStatus('');
        fetchInquiry();
        if (onUpdate) onUpdate();
      } else {
        throw new Error('Failed to add log');
      }
    } catch (error) {
      console.error('Error adding log:', error);
      toast.error('Failed to add conversation log');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Inquiry Details</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : inquiry ? (
          <div className="space-y-6 mt-6">
            {/* Contact Info */}
            <div className="p-4 bg-secondary/50 rounded-xl">
              <h3 className="font-semibold text-lg text-foreground mb-3">{inquiry.name}</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${inquiry.phone}`}
                  className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  {inquiry.phone}
                </a>
                {inquiry.email && (
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    {inquiry.email}
                  </a>
                )}
              </div>
            </div>

            {/* Inquiry Type & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium text-sm mt-1 capitalize flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {inquiry.inquiry_type?.replace('_', ' ')}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="font-medium text-sm mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            {/* Message */}
            {inquiry.message && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Message</h4>
                <p className="text-sm text-foreground p-3 bg-muted/30 rounded-lg">
                  {inquiry.message}
                </p>
              </div>
            )}

            {/* Status Update */}
            <div className="p-4 bg-primary/5 rounded-xl">
              <Label className="text-sm font-medium mb-3 block">Current Status</Label>
              <div className="flex flex-wrap gap-2">
                {statusWorkflow.map((status) => {
                  const StatusIcon = status.icon;
                  const isActive = inquiry.status === status.value;
                  return (
                    <Button
                      key={status.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => !isActive && updateStatus(status.value)}
                      disabled={submitting || isActive}
                      className={cn(
                        'text-xs',
                        isActive && status.color
                      )}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Agent */}
            {inquiry.assigned_agent_name && (
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assigned Agent</p>
                  <p className="font-medium text-sm">{inquiry.assigned_agent_name}</p>
                </div>
              </div>
            )}

            {/* Activity / Conversation Logs */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Activity Log ({inquiry.conversation_logs?.length || 0})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {inquiry.conversation_logs?.length > 0 ? (
                  inquiry.conversation_logs.slice().reverse().map((log, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg border-l-2 border-primary">
                      <p className="text-sm text-foreground">{log.message}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          {log.agent_name}
                        </span>
                        <span>{format(new Date(log.timestamp), 'MMM d, h:mm a')}</span>
                      </div>
                      {log.status_change && (
                        <span className="inline-block text-xs text-primary mt-2 px-2 py-0.5 bg-primary/10 rounded">
                          Status → {log.status_change.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No activity logs yet
                  </p>
                )}
              </div>
            </div>

            {/* Add Log Form */}
            {agentId && (
              <div className="space-y-3 pt-4 border-t border-border">
                <Label className="text-sm font-medium">Add Note / Update</Label>
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter conversation notes..."
                  rows={3}
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Update status (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusWorkflow.map((status) => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="teal"
                    onClick={addConversationLog}
                    disabled={!newMessage.trim() || submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Inquiry not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InquiryDetailDrawer;
