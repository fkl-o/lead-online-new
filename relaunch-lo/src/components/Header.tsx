import { Menu } from 'lucide-react';

const Header = () => {
  // Hinweis: Die Logik für das mobile Menü (useState) wird später hinzugefügt.
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" className="flex items-center space-x-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-600"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                <span className="font-bold text-xl text-neutral-900">LeadGen Pro</span>
            </a>
            <nav className="hidden md:flex items-center space-x-6">
                <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Webentwicklung</a>
                <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Marketing Automation</a>
                <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Digitalisierung</a>
            </nav>
            <div className="hidden md:block">
                <a href="#contact" className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md">Kontakt</a>
            </div>
            <div className="md:hidden">
                <button id="mobile-menu-button" className="text-slate-800"><Menu className="w-6 h-6" /></button>
            </div>
        </div>
        {/* Hier kommt später das mobile Menü-Panel */}
    </header>
  );
};

export default Header;