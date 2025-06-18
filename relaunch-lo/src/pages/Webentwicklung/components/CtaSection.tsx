import { ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-brand-600 text-white">
      <div ref={revealRef} className="container mx-auto px-6 text-center reveal">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Haben Sie ein Projekt im Kopf?</h2>
        <p className="text-brand-100 text-lg max-w-2xl mx-auto mb-8">Lassen Sie uns darüber sprechen, wie wir Ihre Vision in die Realität umsetzen können. Wir freuen uns auf Ihre Anfrage.</p>
        <Button variant="secondary" size="lg" className="bg-white text-brand-600 hover:bg-brand-50 font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
          Jetzt Kontakt aufnehmen
          <ArrowRight className="inline-block ml-2 w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
