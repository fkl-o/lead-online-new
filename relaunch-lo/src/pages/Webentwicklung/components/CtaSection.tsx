import { Code2 } from 'lucide-react';
import { useScrollReveal } from '../../../hooks/use-scroll-reveal';

type CallToActionSectionProps = {
  onOpenModal: (modalName: string) => void;
};

const CallToActionSection = ({ onOpenModal }: CallToActionSectionProps) => {
  const revealRef = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div ref={revealRef} className="container mx-auto px-6 text-center reveal">
        <Code2 className="w-12 h-12 text-brand-600 mb-4 mx-auto" />
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Ihr nächstes Webprojekt beginnt hier
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
          Sichern Sie sich jetzt Ihr kostenloses Website-Konzept oder starten Sie mit einer individuellen Strategie — wir zeigen Ihnen, was möglich ist.
        </p>
        <button
          onClick={() => onOpenModal('website')}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-600/20"
        >
          Kostenloses Konzept anfordern
        </button>
      </div>
    </section>
  );
};

export default CallToActionSection;
