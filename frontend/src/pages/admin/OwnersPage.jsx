import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  Building2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const OwnersPage = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bank_details: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owners`);
      const data = await response.json();
      setOwners(data);
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingOwner
        ? `${BACKEND_URL}/api/owners/${editingOwner.id}`
        : `${BACKEND_URL}/api/owners`;
      const method = editingOwner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingOwner ? 'Owner updated successfully' : 'Owner created successfully');
        setIsDialogOpen(false);
        resetForm();
        fetchOwners();
      } else {
        throw new Error('Failed to save owner');
      }
    } catch (error) {
      console.error('Error saving owner:', error);
      toast.error('Failed to save owner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/owners/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOwners(owners.filter((o) => o.id !== id));
        toast.success('Owner deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast.error('Failed to delete owner');
    }
  };

  const openEditDialog = (owner) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      address: owner.address || '',
      bank_details: owner.bank_details || '',
      notes: owner.notes || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOwner(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      bank_details: '',
      notes: '',
    });
  };

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Property Owners</h1>
          <p className="text-muted-foreground">Manage property owners and view their dashboards</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button variant="teal">
              <Plus className="w-4 h-4 mr-2" />
              Add Owner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingOwner ? 'Edit Owner' : 'Add New Owner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bank_details">Bank Details</Label>
                <Input
                  id="bank_details"
                  value={formData.bank_details}
                  onChange={(e) => setFormData({ ...formData, bank_details: e.target.value })}
                  placeholder="Account No / IFSC"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="teal" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingOwner ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="bg-card border-0 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search owners by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Owners Table */}
      <Card className="bg-card border-0 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredOwners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No owners found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <Link
                        to={`/admin/owners/${owner.id}/dashboard`}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-primary hover:underline">{owner.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Since {format(new Date(owner.created_at), 'MMM yyyy')}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {owner.phone}
                        </p>
                        <p className="text-sm flex items-center gap-1 text-muted-foreground">
                          <Mail className="w-3 h-3" /> {owner.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-sm font-medium',
                        owner.property_count > 0 ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {owner.property_count || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full font-medium capitalize',
                        owner.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      )}>
                        {owner.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/owners/${owner.id}/dashboard`}>
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(owner)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Owner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{owner.name}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(owner.id)}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default OwnersPage;
