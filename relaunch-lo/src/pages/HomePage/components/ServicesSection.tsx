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
                    <CardHeader className="p-0">
                        <div className="flex justify-between items-start mb-4">
                            <Code2 className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-brand">Kostenlos & unverbindlich</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">Homepage-Design</CardTitle>
                        <CardDescription className="font-semibold text-brand-600 text-lg mb-4">
                            Ihr individuelles, interaktives Website-Design – kostenlos in 72 Stunden
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-2">So funktioniert's:</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>✓ Ziele & Stil-Präferenzen festlegen</li>
                                <li>✓ Vollständiges, klickbares Design</li>
                                <li>✓ Mobile & Desktop optimiert</li>
                                <li>✓ Fertig für die Umsetzung</li>
                            </ul>
                        </div>
                        <p className="text-xs text-gray-500 italic">Echtes Design, nicht nur Mockup. Sofort testbar und nutzbar.</p>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button onClick={() => onOpenModal('website')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">
                            Design-Anfrage starten
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 2: Marketing Automation */}
                <Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <CardHeader className="p-0">
                        <div className="flex justify-between items-start mb-4">
                            <Bot className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-green">Interaktiv & kostenlos</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">ROI-Kalkulator</CardTitle>
                        <CardDescription className="font-semibold text-brand-600 text-lg mb-4">
                            Berechnen Sie Ihr Marketing-ROI live mit unserem Kalkulator
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <div className="bg-green-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-green-700 mb-2">Sofort verfügbar:</p>
                            <ul className="space-y-2 text-sm text-green-600">
                                <li>🧮 Live-Rechner mit Schiebereglern</li>
                                <li>📊 5-Monats-Prognose inkl. Tabelle</li>
                                <li>💰 Detaillierte Gewinn-Aufschlüsselung</li>
                                <li>📞 Optionales Strategiegespräch</li>
                            </ul>
                        </div>
                        <p className="text-xs text-gray-500 italic">Keine Anmeldung nötig. Bei Interesse Gespräch vereinbaren.</p>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button onClick={() => onOpenModal('automation')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">
                            ROI jetzt berechnen
                        </Button>
                    </CardFooter>
                </Card>

                {/* Card 3: Digitalisierung */}
                <Card className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <CardHeader className="p-0">
                        <div className="flex justify-between items-start mb-4">
                            <Briefcase className="w-10 h-10 text-secondary-600" />
                            <span className="service-pill service-pill-blue">15 Min. kostenlos</span>
                        </div>
                        <CardTitle className="font-bold text-2xl text-gray-900 mb-2">Digitalisierungs-Check</CardTitle>
                        <CardDescription className="font-semibold text-brand-600 text-lg mb-4">
                            15-minütiges Strategiegespräch mit konkreten Handlungsempfehlungen
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0">
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-700 mb-2">Ablauf des Gesprächs:</p>
                            <ul className="space-y-2 text-sm text-blue-600">
                                <li>🏢 Ihre Bereiche & Dringlichkeit erfassen</li>
                                <li>🔍 Ist-Analyse & Effizienz-Blocker finden</li>
                                <li>🎯 3 konkrete Sofort-Maßnahmen</li>
                                <li>🚀 90-Tage-Roadmap entwickeln</li>
                            </ul>
                        </div>
                        <p className="text-xs text-gray-500 italic">Terminbuchung direkt nach Formular. Ohne Verkaufsdruck.</p>
                    </CardContent>
                    <CardFooter className="p-0">
                        <Button onClick={() => onOpenModal('digitalization')} className="mt-auto w-full bg-secondary-600 hover:bg-secondary-700 text-white font-semibold py-3 px-4 rounded-lg">
                            Gespräch vereinbaren
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </section>
  );
};

export default ServicesSection;