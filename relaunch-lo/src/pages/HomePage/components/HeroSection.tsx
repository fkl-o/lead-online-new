import { ArrowDown } from 'lucide-react';
import { useScrollReveal } from '../../../hooks/use-scroll-reveal';

const HeroSection = () => {
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const descRef = useScrollReveal<HTMLParagraphElement>({ delay: 150 });
  const btnRef = useScrollReveal<HTMLDivElement>({ delay: 300 });

  return (
    <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 hero-pattern"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h1
          ref={titleRef}
          className="reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 leading-tight tracking-tighter mb-6 max-w-5xl mx-auto"
        >
          Wir gestalten{' '}
          <span className="text-brand-600">digitales Wachstum</span>
        </h1>
        <p
          ref={descRef}
          className="reveal max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10"
        >
          Als Ihr Partner für Webentwicklung, Marketing Automation und
          Digitalisierung schaffen wir nachhaltige Wettbewerbsvorteile und
          messbare Erfolge.
        </p>
        <div ref={btnRef} className="reveal">
          <button
            onClick={() =>
              document.getElementById('services')?.scrollIntoView({
                behavior: 'smooth',
              })
            }
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-brand-600/20 w-full sm:w-auto"
          >
            Unsere Leistungen entdecken
            <ArrowDown className="inline-block ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
