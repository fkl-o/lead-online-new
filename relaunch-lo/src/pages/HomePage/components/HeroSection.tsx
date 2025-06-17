import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 hero-pattern"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 leading-tight tracking-tighter mb-6">
            Wir gestalten <span className="text-brand-600">digitales Wachstum</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
            Als Ihr Partner für Webentwicklung, Marketing Automation und Digitalisierung schaffen wir nachhaltige Wettbewerbsvorteile und messbare Erfolge.
        </p>
        <a href="#services" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-600/20">
            Unsere Leistungen entdecken
            <ArrowDown className="inline-block ml-2 w-5 h-5" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;