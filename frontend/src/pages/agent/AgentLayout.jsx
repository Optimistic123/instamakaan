import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  MessageSquare,
  Menu,
  LogOut,
  Home,
  User,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const sidebarItems = [
  {
    name: 'My Inquiries',
    path: '/agent',
    icon: MessageSquare,
  },
];

const Sidebar = ({ className, agentName }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/agent') {
      return location.pathname === '/agent';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn('flex flex-col h-full bg-foreground text-background', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-muted/20">
        <Link to="/agent" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
            <span className="text-accent-foreground font-bold text-lg">IM</span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary">Insta</span>
            <span className="text-lg font-bold text-accent">Makaan</span>
          </div>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">Agent Portal</p>
      </div>

      {/* Agent Info */}
      <div className="p-4 border-b border-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-background">{agentName}</p>
            <p className="text-xs text-muted-foreground">Field Agent</p>
          </div>
        </div>
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
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-muted/20 hover:text-background'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
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

const AgentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);

  useEffect(() => {
    if (user?.linked_id) {
      fetchAgentData();
    }
  }, [user]);

  const fetchAgentData = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/agents/${user.linked_id}`);
      if (response.ok) {
        const data = await response.json();
        setAgentData(data);
      }
    } catch (error) {
      console.error('Error fetching agent data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/login');
  };

  const agentName = agentData?.name || user?.name || 'Agent';

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <Sidebar agentName={agentName} />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
        <div className="flex items-center">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar agentName={agentName} />
            </SheetContent>
          </Sheet>

          <Link to="/agent" className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold">IM</span>
            </div>
            <span className="font-semibold">Agent Portal</span>
          </Link>
        </div>

        {/* Mobile User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{agentName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Desktop Top Bar */}
      <div className="hidden lg:block fixed top-0 left-64 right-0 z-40 bg-card border-b border-border h-16">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{agentName}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{agentName}</p>
                  <p className="text-xs text-muted-foreground">Agent</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{agentName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-accent capitalize">Agent</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer">
                  <Home className="w-4 h-4 mr-2" />
                  View Website
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AgentLayout;
