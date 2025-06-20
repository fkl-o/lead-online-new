import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, Mail, LogIn } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-600">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="font-bold text-xl text-gray-900">LeadGen Pro</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/webentwicklung" className="text-slate-600 hover:text-slate-900 transition-colors">Webentwicklung</Link>
          <Link to="/marketing-automation" className="text-slate-600 hover:text-slate-900 transition-colors">Marketing Automation</Link>
          <Link to="/digitalization" className="text-slate-600 hover:text-slate-900 transition-colors">Digitalisierung</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex space-x-4">
          <Button asChild className="bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center space-x-2">
            <a href="#contact">
              <Mail className="w-4 h-4" />
              <span>Kontakt</span>
            </a>
          </Button>
          <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold flex items-center space-x-2">
            <Link to="/login">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
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
                <Link
                  to="/webentwicklung"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Webentwicklung
                </Link>
                <Link
                  to="/marketing-automation"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Marketing Automation
                </Link>
                <Link
                  to="/digitalization"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 hover:text-slate-900 transition-colors w-full text-center py-2"
                >
                  Digitalisierung
                </Link>
                <Button 
                  asChild 
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold flex items-center space-x-2 w-full justify-center"
                >
                  <a href="#contact">
                    <Mail className="w-4 h-4" />
                    <span>Kontakt</span>
                  </a>
                </Button>
                <Button asChild className="bg-black hover:bg-gray-800 text-white font-semibold flex items-center space-x-2 w-full justify-center">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
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