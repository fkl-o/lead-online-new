import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const HeroSection = () => {
  const titleRef = useScrollReveal<HTMLHeadingElement>();
  const descRef = useScrollReveal<HTMLParagraphElement>({ delay: 150 });

  return (
    <section className="pt-28 pb-20 md:pt-40 md:pb-32 text-center relative overflow-hidden bg-white">
      <div className="absolute inset-0 hero-pattern"></div>
      <div className="container mx-auto px-6 relative z-10">
        <h1 
          ref={titleRef}
          className="reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-900 leading-tight tracking-tighter mb-6"
        >
          Moderne <span className="text-brand-600">Webentwicklung</span> für Ihr Business
        </h1>
        <p 
          ref={descRef}
          className="reveal max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10"
        >
          Wir schaffen hochperformante, skalierbare und benutzerfreundliche Webanwendungen, die Ihre Zielgruppe begeistern und Ihre Unternehmensziele vorantreiben.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
