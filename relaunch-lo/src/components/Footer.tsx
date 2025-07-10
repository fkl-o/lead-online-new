import { useScrollReveal } from '../hooks/use-scroll-reveal';
import { Link } from 'react-router-dom';

const Footer = () => {
  const mainRef = useScrollReveal();
  const linksRef = useScrollReveal({ delay: 150 });

  return (
    <footer id="contact" className="bg-gray-100 text-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-8">
                <div ref={mainRef} className="md:col-span-5 reveal">
                    <a href="#" className="flex items-center space-x-2 mb-4">
                        <img 
                          src="/images/lead-online-logo.svg" 
                          alt="lead.online Logo" 
                          className="h-6 w-auto"
                        />
                    </a>
                    <p className="text-gray-600 mb-6 max-w-sm">Ihr Partner für Conversion-optimiertes Marketing und Webentwicklung.</p>
                </div>
                <div ref={linksRef} className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 reveal">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Leistungen</h4>
                        <ul className="space-y-2">
                            <li><a href="#services" className="text-gray-600 hover:text-gray-800">Webentwicklung</a></li>
                            <li><a href="#services" className="text-gray-600 hover:text-gray-800">Marketing Automation</a></li>
                            <li><a href="#services" className="text-gray-600 hover:text-gray-800">Digitalisierung</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Unternehmen</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-gray-800">Über uns</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-800">Karriere</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-800">Kontakt</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Rechtliches</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/impressum" className="text-gray-600 hover:text-gray-800">
                                    Impressum
                                </Link>
                            </li>
                            <li>
                                <Link to="/datenschutz" className="text-gray-600 hover:text-gray-800">
                                    Datenschutz
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center">
                <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} lead.online GmbH. Alle Rechte vorbehalten.</p>
            </div>
        </div>
    </footer>
  );
};

export default Footer;