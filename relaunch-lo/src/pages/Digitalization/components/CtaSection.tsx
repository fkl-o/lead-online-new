import { Sparkles } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

type CallToActionSectionProps = {
  onOpenModal: (modalName: string) => void;
};

const CallToActionSection = ({ onOpenModal }: CallToActionSectionProps) => {
  const revealRef = useScrollReveal();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div ref={revealRef} className="container mx-auto px-6 text-center reveal">
        <Sparkles className="w-12 h-12 text-brand-600 mb-4 mx-auto" />
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Starten Sie Ihre Digitalisierung noch heute
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
          Kontaktieren Sie uns für maßgeschneiderte Digitalisierungsstrategien und -lösungen.
        </p>
        <button
          onClick={() => onOpenModal('digitalization')}
          className="inline-block bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-8 py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-600/20"
        >
          Jetzt starten
        </button>
      </div>
    </section>
  );
};

export default CallToActionSection;
