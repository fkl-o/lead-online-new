import { useScrollReveal } from '../../../hooks/use-scroll-reveal';

const ProcessSection = () => {
  const headingRef = useScrollReveal();
  const stepsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="process" className="py-20 md:py-28 bg-neutral-50">
        <div className="container mx-auto px-6">
            <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Unser Weg zum gemeinsamen Erfolg</h2>
                <p className="text-slate-600 text-lg">Unser Prozess ist transparent, effizient und vollständig auf Ihre Ziele ausgerichtet.</p>
            </div>
            <div ref={stepsRef} className="relative max-w-5xl mx-auto reveal">
                <div className="hidden md:block absolute top-8 left-0 w-full h-px bg-slate-200"></div>
                <div className="grid md:grid-cols-4 gap-y-12 md:gap-x-12 relative">
                    <div className="text-center">
                        <div className="relative mb-4 bg-neutral-50 z-10">
                           <div className="w-16 h-16 bg-white text-secondary-600 text-2xl font-bold border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-md">1</div>
                        </div>
                        <h3 className="font-bold text-xl text-neutral-900 mb-2">Analyse</h3>
                        <p className="text-slate-600">Wir starten mit einem tiefen Verständnis für Ihr Geschäft, Ihre Ziele und Ihren Markt.</p>
                    </div>
                    <div className="text-center">
                        <div className="relative mb-4 bg-neutral-50 z-10">
                            <div className="w-16 h-16 bg-white text-secondary-600 text-2xl font-bold border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-md">2</div>
                        </div>
                        <h3 className="font-bold text-xl text-neutral-900 mb-2">Strategie</h3>
                        <p className="text-slate-600">Basierend auf den Daten entwickeln wir einen maßgeschneiderten Fahrplan.</p>
                    </div>
                    <div className="text-center">
                        <div className="relative mb-4 bg-neutral-50 z-10">
                            <div className="w-16 h-16 bg-white text-secondary-600 text-2xl font-bold border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-md">3</div>
                        </div>
                        <h3 className="font-bold text-xl text-neutral-900 mb-2">Umsetzung</h3>
                        <p className="text-slate-600">Unsere Experten setzen die Strategie mit modernster Technologie um.</p>
                    </div>
                    <div className="text-center">
                        <div className="relative mb-4 bg-neutral-50 z-10">
                           <div className="w-16 h-16 bg-white text-secondary-600 text-2xl font-bold border-2 border-slate-200 rounded-full flex items-center justify-center mx-auto shadow-md">4</div>
                        </div>
                        <h3 className="font-bold text-xl text-neutral-900 mb-2">Optimierung</h3>
                        <p className="text-slate-600">Wir messen den Erfolg und optimieren kontinuierlich für maximale Performance.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ProcessSection;