import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Flower2, ShoppingBag, Sparkles, Lock } from 'lucide-react';

const ClientNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/categories', label: 'Categories' },
    { path: '/customize', label: 'Customize', icon: Sparkles },
    { path: '/gallery', label: 'Gallery' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-card transition-all duration-300 group-hover:scale-105">
              <Flower2 className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-foreground hidden sm:block">
              Petal Dreams
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                  isActive(link.path)
                    ? 'text-foreground bg-primary/20'
                    : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </span>
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/cart" className="relative p-2 md:p-3 rounded-full hover:bg-primary/10 transition-colors group">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold animate-scale-in">
                  {totalItems}
                </Badge>
              )}
            </Link>
            
            <Link to="/login" className="hidden md:flex">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Lock className="w-4 h-4 mr-1.5" />
                Admin
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-primary/20 text-foreground'
                      : 'text-foreground/70 hover:bg-primary/10 hover:text-foreground'
                  }`}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-border/50">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:bg-primary/10 hover:text-foreground transition-all"
                >
                  <Lock className="w-5 h-5" />
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ClientNavbar;
