import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">        <a href="#" className="flex items-center space-x-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-600">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="font-bold text-xl text-gray-900">LeadGen Pro</span>
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Webentwicklung</a>
          <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Marketing Automation</a>
          <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Digitalisierung</a>
        </nav>        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-semibold">
            <a href="#contact">Kontakt</a>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-800">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="flex flex-col items-center space-y-4 p-6">
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Webentwicklung
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Marketing Automation
                </a>
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Digitalisierung
                </a>                <Button asChild className="mt-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold w-full">
                  <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
