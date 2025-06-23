import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Button } from '@/components/ui/button';

type HeroSectionProps = {
  onOpenModal: (modalName: string) => void;
};

const HeroSection = ({ onOpenModal }: HeroSectionProps) => {
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const descRef = useScrollReveal<HTMLParagraphElement>({ delay: 150 });
  const btnRef = useScrollReveal<HTMLDivElement>({ delay: 300 });

  const handleAutomationModalOpen = () => {
    onOpenModal('automation');
  };
  return (
    <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 hero-pattern"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h1
          ref={titleRef}
          className="reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 leading-tight tracking-tighter mb-6 max-w-5xl mx-auto"
        >
          Berechnen Sie Ihr <span className="text-brand-600">Marketing-ROI</span> in Echtzeit
        </h1>
        <p
          ref={descRef}
          className="reveal max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-8"
        >
          Interaktiver Kalkulator mit 5-Monats-Prognose und detaillierter Gewinn-Aufschlüsselung. Keine Anmeldung erforderlich – sofort verfügbar.
        </p>
        <div className="reveal max-w-2xl mx-auto mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-green-700">
            <span>🧮 Live-Rechner</span>
            <span>📊 5-Monats-Prognose</span>
            <span>💰 Detaillierte Aufschlüsselung</span>
            <span>⚡ Ohne Anmeldung</span>
          </div>
        </div>
        <div ref={btnRef} className="reveal">
          <Button
            onClick={handleAutomationModalOpen}
            size="lg"
            className="text-white bg-brand-600 hover:bg-brand-700 cursor-pointer transform transition-transform hover:scale-105 text-xl px-12 py-6"
          >
            ROI jetzt berechnen
          </Button>
          <p className="text-sm text-gray-500 mt-3">Sofort verfügbar • Bei Interesse kostenloses Strategiegespräch</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
