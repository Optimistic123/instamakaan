import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Settings,
  Menu,
  LogOut,
  ChevronDown,
  Plus,
  Home,
  Users,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Properties',
    path: '/admin/properties',
    icon: Building2,
  },
  {
    name: 'Owners',
    path: '/admin/owners',
    icon: Users,
  },
  {
    name: 'Agents',
    path: '/admin/agents',
    icon: UserCheck,
  },
  {
    name: 'Inquiries',
    path: '/admin/inquiries',
    icon: MessageSquare,
  },
];

const Sidebar = ({ className }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn('flex flex-col h-full bg-foreground text-background', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-muted/20">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">IM</span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary">Insta</span>
            <span className="text-lg font-bold text-accent">Makaan</span>
          </div>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/20 hover:text-background'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t border-muted/20">
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-muted/20">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/20 hover:text-background transition-colors"
        >
          <Home className="w-5 h-5" />
          Back to Website
        </Link>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center px-4">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <Link to="/admin" className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">IM</span>
          </div>
          <span className="font-semibold">Admin</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
