import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { LogIn, Mail } from 'lucide-react';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
    } else {
      document.body.style.overflow = 'auto';
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-40 bg-white pt-20 hero-pattern transition-all duration-300 ease-in-out transform ${
        isOpen 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto px-6 flex flex-col h-full">
        <nav className="flex flex-col items-center justify-center flex-1 space-y-6 text-center">
          <div 
            className={`transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: isOpen ? '100ms' : '0ms' }}
          >
            <Link
              to="/webentwicklung"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
            >
              Webentwicklung
            </Link>
          </div>
          
          <div 
            className={`transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: isOpen ? '150ms' : '0ms' }}
          >
            <Link
              to="/marketing-automation"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
            >
              Marketing Automation
            </Link>
          </div>
          
          <div 
            className={`transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 ${
              isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionDelay: isOpen ? '200ms' : '0ms' }}
          >
            <Link
              to="/digitalization"
              onClick={onClose}
              className="text-3xl font-bold text-slate-800 hover:text-brand-600 transition-colors duration-300"
            >
              Digitalisierung
            </Link>
          </div>
        </nav>

        <hr 
          className={`border-slate-200 my-6 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: isOpen ? '250ms' : '0ms' }}
        />

        <div
          className={`pb-8 flex flex-col space-y-4 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: isOpen ? '300ms' : '0ms' }}
        >
          <Button asChild size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg py-6 transition-all duration-200 hover:scale-105 active:scale-95">
            <Link to="/contact" onClick={onClose}>
              <Mail className="mr-2 h-5 w-5" />
              <span>Kontakt aufnehmen</span>
            </Link>
          </Button>
          <Button asChild size="lg" className="w-full bg-black hover:bg-gray-800 text-white font-semibold text-lg py-6 transition-all duration-200 hover:scale-105 active:scale-95">
            <Link to="/login" onClick={onClose}>
              <LogIn className="mr-2 h-5 w-5" />
              <span>Kunden-Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
