import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { LogIn, Mail, LayoutDashboard, LogOut } from 'lucide-react';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
};

const MobileMenu = ({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-500 ease-out ${
        isOpen 
          ? 'backdrop-blur-sm bg-white/95 pointer-events-auto' 
          : 'backdrop-blur-0 bg-white/0 pointer-events-none'
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 hero-pattern transition-all duration-500 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`} />
      
      <div className={`relative container mx-auto px-6 flex flex-col h-full pt-20 transition-all duration-700 ease-out ${
        isOpen ? 'translate-y-0' : '-translate-y-8'
      }`}>
        <nav className="flex flex-col items-center justify-center flex-1 space-y-8 text-center">
          <div 
            className={`group transition-all duration-500 ease-out transform ${
              isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
          >
            <Link
              to="/webentwicklung"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Webentwicklung</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          <div 
            className={`group transition-all duration-500 ease-out transform ${
              isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}
          >
            <Link
              to="/marketing-automation"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Marketing Automation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
            </Link>
          </div>
          
          <div 
            className={`group transition-all duration-500 ease-out transform ${
              isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: isOpen ? '250ms' : '0ms' }}
          >
            <Link
              to="/digitalization"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-all duration-300 hover:scale-110 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Digitalisierung</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </nav>

        <div 
          className={`w-24 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto my-8 transition-all duration-500 ease-out ${
            isOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}
        />        <div
          className={`pb-8 flex flex-col space-y-4 transition-all duration-500 ease-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isOpen ? '350ms' : '0ms' }}
        >
          <Button asChild size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg py-6 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-brand-600/25 group overflow-hidden relative">
            <Link to="/contact" onClick={onClose}>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-500 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <Mail className="mr-2 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative z-10">Kontakt aufnehmen</span>
            </Link>
          </Button>
          
          {isAuthenticated ? (
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-6 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-gray-800/25 group overflow-hidden relative">
                <Link to="/dashboard" onClick={onClose}>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                  <LayoutDashboard className="mr-2 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Dashboard</span>
                </Link>
              </Button>
              <Button 
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                size="lg" 
                variant="outline"
                className="w-full font-semibold text-lg py-6 transition-all duration-300 hover:scale-105 active:scale-95 border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 group"
              >
                <LogOut className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Abmelden</span>
              </Button>
            </div>
          ) : (
            <Button asChild size="lg" className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-6 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-gray-800/25 group overflow-hidden relative">
              <Link to="/login" onClick={onClose}>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                <LogIn className="mr-2 h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Kunden-Login</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
