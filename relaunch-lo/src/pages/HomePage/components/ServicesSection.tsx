import { Code2, Bot, Briefcase } from 'lucide-react';

const ServicesSection = ({ onOpenModal }) => {
  return (
    <section id="services" className="py-20 md:py-28 bg-neutral-50">
        <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Finden Sie die passende Lösung</h2>
                <p className="text-slate-600 text-lg">Jedes Projekt ist einzigartig. Wählen Sie den passenden Startpunkt für Ihr Vorhaben.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Card 1: Webentwicklung */}
                <div className="group bg-white p-8 rounded-2xl border border-neutral-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <Code2 className="w-10 h-10 text-secondary-600" />
                            <span className="inline-block bg-brand-600/10 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">Neueste Technologie</span>
                        </div>
                        <h3 className="font-bold text-2xl text-neutral-900 mb-2">Webentwicklung</h3>
                        <p className="font-semibold text-neutral-700 mb-4">Ihr interaktives Homepage-Design – kostenlos in 72 Stunden</p>
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Blitzschnelle Performance</li>
                            <li>SEO-Ready & On-Page-Optimierung</li>
                            <li>Conversion-optimiertes UX-Design</li>
                        </ul>
                    </div>
                    <button onClick={() => onOpenModal('website')} className="mt-auto w-full bg-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-700 transition-all">Design anfordern</button>
                </div>
                {/* Card 2: Marketing Automation */}
                <div className="group bg-white p-8 rounded-2xl border border-neutral-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                     <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <Bot className="w-10 h-10 text-secondary-600" />
                            <span className="inline-block bg-brand-600/10 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">ROI-Fokus</span>
                        </div>
                        <h3 className="font-bold text-2xl text-neutral-900 mb-2">Marketing Automation</h3>
                        <p className="font-semibold text-neutral-700 mb-4">Kostenlose Potenzial-Analyse – ROI-Prognose per E-Mail</p>
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Lead-Qualität steigern</li>
                            <li>Zeit sparen durch Routinetasks</li>
                            <li>Prozesse, die mitwachsen</li>
                        </ul>
                    </div>
                    <button onClick={() => onOpenModal('automation')} className="mt-auto w-full bg-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-700 transition-all">ROI-Analyse anfordern</button>
                </div>
                {/* Card 3: Digitalisierung */}
                <div className="group bg-white p-8 rounded-2xl border border-neutral-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                     <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <Briefcase className="w-10 h-10 text-secondary-600" />
                            <span className="inline-block bg-brand-600/10 text-brand-700 text-xs font-bold px-3 py-1 rounded-full">Zukunftssicher</span>
                        </div>
                        <h3 className="font-bold text-2xl text-neutral-900 mb-2">Digitalisierung</h3>
                        <p className="font-semibold text-neutral-700 mb-4">Ihr 15-minütiges Digitalisierungs-Strategiegespräch</p>
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Effizienz steigern & Engpässe finden</li>
                            <li>Fehler reduzieren & Medienbrüche stopfen</li>
                            <li>Zukunftssichere IT-Architektur</li>
                        </ul>
                    </div>
                    <button onClick={() => onOpenModal('digitalization')} className="mt-auto w-full bg-secondary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-700 transition-all">Gespräch anfordern</button>
                </div>
            </div>
        </div>
    </section>
  );
};

export default ServicesSection;