import { ShieldCheck, TrendingUp, Zap, Users } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const benefits = [
  {
    icon: TrendingUp,
    title: "Mehr Umsatz & Wachstum",
    description: "Eine moderne Website ist ein starker Vertriebskanal. Durch optimierte User Experience und gezielte Conversion-Pfade verwandeln wir Besucher in zahlende Kunden."
  },
  {
    icon: Users,
    title: "Höhere Nutzerbindung",
    description: "Wir schaffen intuitive und ansprechende digitale Erlebnisse, die Nutzer begeistern und dazu motivieren, immer wieder zurückzukehren."
  },
  {
    icon: Zap,
    title: "Schnellere Performance",
    description: "Ladezeiten sind ein entscheidender Erfolgsfaktor. Unsere Webanwendungen sind für maximale Geschwindigkeit optimiert, was das Nutzererlebnis und Ihr SEO-Ranking verbessert."
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit & Stabilität",
    description: "Wir bauen auf bewährte Technologien und robuste Architekturen, um die Sicherheit Ihrer Daten zu gewährleisten und einen zuverlässigen Betrieb sicherzustellen."
  }
];

const BenefitsSection = () => {
  const headingRef = useScrollReveal();
  const benefitsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="benefits" className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Ihr Nutzen, unser Antrieb</h2>
          <p className="text-slate-600 text-lg">Wir übersetzen Technologie in messbaren Geschäftserfolg. Das sind die Vorteile, die Sie von einer Zusammenarbeit mit uns erwarten können.</p>
        </div>
        <div ref={benefitsRef} className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto reveal">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-6 p-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-brand-600/10 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-brand-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
