import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { 
  Menu, X, LayoutDashboard, PlusCircle, Sparkles, 
  BarChart3, LogOut, User, ChevronDown, GraduationCap 
} from 'lucide-react';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/create-interview', label: 'New Interview', icon: PlusCircle },
  { path: '/feedback', label: 'Feedback', icon: BarChart3 },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-300" />
            <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            MockAI
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <SignedIn>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </SignedIn>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button variant="gradient" size="sm">Get Started</Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl border bg-popover p-1 shadow-lg animate-in slide-in-from-top-2">
                    <div className="px-2 py-1.5 mb-1">
                      <p className="text-sm font-medium truncate">{user?.fullName || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </p>
                    </div>
                    <Separator />
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-lg hover:bg-accent transition-colors text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </SignedIn>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2">
          <div className="container py-4 space-y-1">
            <SignedIn>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}

function Separator() {
  return <div className="h-px bg-border my-1" />;
}

