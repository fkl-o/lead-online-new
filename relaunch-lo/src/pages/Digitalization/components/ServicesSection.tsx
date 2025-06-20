import { Settings, Globe, ShieldCheck, DatabaseZap, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const services = [
  {
    icon: Settings,
    badge: 'Prozessoptimierung',
    badgeColor: 'service-pill-brand',
    title: 'Prozessoptimierung',
    description: 'Automatisierte Abläufe für mehr Effizienz und weniger Fehlerquellen.',
    points: ['Workflow-Analyse', 'Fehlerreduktion', 'Zeitersparnis'],
  },
  {
    icon: Globe,
    badge: 'Cloud-Integration',
    badgeColor: 'service-pill-green',
    title: 'Cloud-Integration',
    description: 'Nahtlose Anbindung an Cloud-Dienste für maximale Skalierbarkeit.',
    points: ['AWS & Azure', 'Serverlose Architekturen', 'Hohe Verfügbarkeit'],
  },
  {
    icon: ShieldCheck,
    badge: 'IT-Sicherheit',
    badgeColor: 'service-pill-blue',
    title: 'IT-Sicherheit',
    description: 'Ganzheitliche Sicherheitslösungen zum Schutz Ihrer Daten und Systeme.',
    points: ['Penetration-Tests', 'Verschlüsselung', 'Notfall-Management'],
  },
  {
    icon: DatabaseZap,
    badge: 'Data Analytics',
    badgeColor: 'service-pill-brand',
    title: 'Data Analytics',
    description: 'Datengestützte Einblicke für fundierte Entscheidungen.',
    points: ['Dashboards & Reports', 'Echtzeit-Analyse', 'Predictive Modeling'],
  },
  {
    icon: Users,
    badge: 'Schulungen',
    badgeColor: 'service-pill-green',
    title: 'Schulungen & Support',
    description: 'Workshops und Support für Ihren digitalen Erfolg.',
    points: ['Mitarbeiter-Training', 'Dokumentation', '24/7 Support'],
  },
];

const ServicesSection = () => {
  const headingRef = useScrollReveal();
  const cardsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="services" className="py-24 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-20 reveal">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Unsere Digitalisierungs-Leistungen
          </h2>
          <p className="text-slate-600 text-lg md:text-xl">
            Von Prozessoptimierung bis IT-Sicherheit – wir digitalisieren Ihr Unternehmen umfassend.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto reveal">
          {services.map((service, index) => (
            <Card key={index} className="group bg-white p-10 rounded-3xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl flex flex-col">
              <CardHeader className="p-0 mb-6 flex justify-between items-start">
                <service.icon className="w-10 h-10 text-secondary-600" />
                <span className={`service-pill ${service.badgeColor}`}>{service.badge}</span>
              </CardHeader>
              <CardTitle className="font-bold text-2xl text-gray-900 mb-3">{service.title}</CardTitle>
              <CardDescription className="font-semibold text-gray-700 mb-5">{service.description}</CardDescription>
              <CardContent className="flex-grow p-0">
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  {service.points.map((point, i) => <li key={i}>{point}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
