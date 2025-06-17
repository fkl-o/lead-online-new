import { Code2, Bot, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from '../../../hooks/use-scroll-reveal';

type ServicesSectionProps = {
  onOpenModal: (modalName: string) => void;
};

const ServicesSection = ({ onOpenModal }: ServicesSectionProps) => {
  const headingRef = useScrollReveal();
  const cardsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="services" className="py-20 md:py-28 bg-neutral-50">
        <div className="container mx-auto px-6">
            <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Finden Sie die passende Lösung</h2>
                <p className="text-slate-600 text-lg">Jedes Projekt ist einzigartig. Wählen Sie den passenden Startpunkt für Ihr Vorhaben.</p>
            </div>            <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto reveal">
                {/* Card 1: Webentwicklung */}
                <Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <CardHeader className="p-0">                        <div className="flex justify-between items-start mb-4">
                            <Code2 className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-brand">Neueste Technologie</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">Webentwicklung</CardTitle>
                        <CardDescription className="font-semibold text-gray-700 mb-4">Ihr interaktives Homepage-Design – kostenlos in 72 Stunden</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Blitzschnelle Performance</li>
                            <li>SEO-Ready & On-Page-Optimierung</li>
                            <li>Conversion-optimiertes UX-Design</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-0">
                         <Button onClick={() => onOpenModal('website')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">Design anfordern</Button>
                    </CardFooter>
                </Card>                {/* Card 2: Marketing Automation */}
                <Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <CardHeader className="p-0">                        <div className="flex justify-between items-start mb-4">
                            <Bot className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-green">ROI-Fokus</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">Marketing Automation</CardTitle>
                        <CardDescription className="font-semibold text-gray-700 mb-4">Kostenlose Potenzial-Analyse – ROI-Prognose per E-Mail</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Lead-Qualität steigern</li>
                            <li>Zeit sparen durch Routinetasks</li>
                            <li>Prozesse, die mitwachsen</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button onClick={() => onOpenModal('automation')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">ROI-Analyse anfordern</Button>
                    </CardFooter>
                </Card>                {/* Card 3: Digitalisierung */}
                <Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                     <CardHeader className="p-0">                        <div className="flex justify-between items-start mb-4">
                            <Briefcase className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-blue">Zukunftssicher</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">Digitalisierung</CardTitle>
                        <CardDescription className="font-semibold text-gray-700 mb-4">Ihr 15-minütiges Digitalisierungs-Strategiegespräch</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <ul className="space-y-2 text-slate-600 list-disc list-inside mb-6">
                            <li>Effizienz steigern & Engpässe finden</li>
                            <li>Fehler reduzieren & Medienbrüche stopfen</li>
                            <li>Zukunftssichere IT-Architektur</li>
                        </ul>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button onClick={() => onOpenModal('digitalization')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">Gespräch anfordern</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </section>
  );
};

export default ServicesSection;