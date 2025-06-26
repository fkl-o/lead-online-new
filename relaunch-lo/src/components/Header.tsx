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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-600">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span className="font-bold text-xl text-gray-900">LeadGen Pro</span>
          </Link>          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/webentwicklung" className="text-slate-600 hover:text-slate-900 transition-colors">Webentwicklung</Link>
            <Link to="/marketing-automation" className="text-slate-600 hover:text-slate-900 transition-colors">Marketing Automation</Link>
            <Link to="/digitalization" className="text-slate-600 hover:text-slate-900 transition-colors">Digitalisierung</Link>
          </nav>          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
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