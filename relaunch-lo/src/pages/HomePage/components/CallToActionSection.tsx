import { Zap } from 'lucide-react';
import { useScrollReveal } from '../../../hooks/use-scroll-reveal';

const CallToActionSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-white">
         <div ref={revealRef} className="container mx-auto px-6 text-center reveal">
            <Zap className="w-12 h-12 text-brand-600 mb-4 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Bereit, den nächsten Schritt zu gehen?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">Lassen Sie uns gemeinsam herausfinden, wie wir Ihr Unternehmen voranbringen können. Starten Sie jetzt mit einer unserer kostenlosen Analysen.</p>
            <a href="#services" className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-brand-600/20">
                Projekt starten
            </a>
         </div>
    </section>
  );
};

export default CallToActionSection;