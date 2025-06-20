import { TrendingUp, Zap, ShieldCheck, Globe } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Nachhaltige Effizienzsteigerung',
    description: 'Automatisierte Prozesse sparen Zeit und senken Betriebskosten signifikant.',
  },
  {
    icon: Zap,
    title: 'Agile Skalierbarkeit',
    description: 'Flexibel anpassbare Lösungen wachsen mit Ihrem Unternehmen.',
  },
  {
    icon: ShieldCheck,
    title: 'Erhöhte Sicherheit',
    description: 'Ganzheitliche Sicherheitsstrategien schützen Ihre Daten und Systeme.',
  },
  {
    icon: Globe,
    title: 'Zukunftsfähige Innovation',
    description: 'Modernste Technologien und Tools sorgen für langfristige Wettbewerbsfähigkeit.',
  },
];

const BenefitsSection = () => {
  const headingRef = useScrollReveal();
  const benefitsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="benefits" className="py-24 md:py-32 bg-gradient-to-b from-white to-neutral-50">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-20 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Ihr Nutzen auf einen Blick
          </h2>
          <p className="text-slate-600 text-lg md:text-xl">
            Entdecken Sie die Vorteile einer umfassenden Digitalisierung.
          </p>
        </div>

        <div ref={benefitsRef} className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto reveal">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white border border-gray-100 rounded-3xl p-10 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-xl bg-secondary-600/10 mb-6 group-hover:scale-105 transition">
                <benefit.icon className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="relative z-10 font-bold text-2xl text-neutral-900 mb-3">{benefit.title}</h3>
              <p className="relative z-10 text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
