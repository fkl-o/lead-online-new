import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Mail, LogIn, X, LayoutDashboard, LogOut } from "lucide-react";
import MobileMenu from "./MobileMenu";
import { authApi } from "@/lib/api";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    
    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleContactClick = () => {
    window.scrollTo(0, 0);
  };
  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <>
      <header className="main-header fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center">
          
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="flex items-center space-x-3 w-fit">
              <img 
                src="/images/lead-online-logo.svg" 
                alt="lead.online Logo" 
                style={{ height: '48px', width: 'auto' }}
                className="w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation - Zentriert */}
          <nav className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <Link to="/webentwicklung" className="text-slate-600 hover:text-slate-900 transition-colors">Webentwicklung</Link>
            <Link to="/marketing-automation" className="text-slate-600 hover:text-slate-900 transition-colors">Marketing Automation</Link>
            <Link to="/digitalization" className="text-slate-600 hover:text-slate-900 transition-colors">Digitalisierung</Link>
          </nav>
          
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center space-x-2">
              <Link to="/contact" onClick={handleContactClick}>
                <Mail className="w-4 h-4" />
                <span>Kontakt</span>
              </Link>
            </Button>
              {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold flex items-center space-x-2">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2"
                  title="Abmelden"
                  aria-label="Abmelden"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold flex items-center space-x-2">
                <Link to="/login">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMobileMenu} 
              className="text-slate-800 z-50 relative"
              aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;