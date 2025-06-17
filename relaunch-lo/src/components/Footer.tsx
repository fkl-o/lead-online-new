const Footer = () => {
  return (
    <footer id="contact" className="bg-neutral-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-5">
                    <a href="#" className="flex items-center space-x-2 mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-600"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        <span className="font-bold text-xl text-white">LeadGen Pro</span>
                    </a>
                    <p className="text-slate-400 mb-6 max-w-sm">Ihr Partner für Conversion-optimiertes Marketing und Webentwicklung.</p>
                </div>
                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                    <div>
                        <h4 className="font-semibold text-white mb-4">Leistungen</h4>
                        <ul className="space-y-2">
                            <li><a href="#services" className="text-slate-400 hover:text-white">Webentwicklung</a></li>
                            <li><a href="#services" className="text-slate-400 hover:text-white">Marketing Automation</a></li>
                            <li><a href="#services" className="text-slate-400 hover:text-white">Digitalisierung</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Unternehmen</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-400 hover:text-white">Über uns</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white">Karriere</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white">Kontakt</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-white mb-4">Rechtliches</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-slate-400 hover:text-white">Impressum</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white">Datenschutz</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} LeadGen Pro. Alle Rechte vorbehalten.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;