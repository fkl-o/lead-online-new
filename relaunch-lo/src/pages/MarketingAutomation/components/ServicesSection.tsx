import { Mail, Repeat, Settings, Users, Activity, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const services = [
  {
    icon: Mail,
    badge: 'E-Mail',
    badgeColor: 'service-pill-brand',
    title: 'E-Mail Automatisierung',
    description: 'Automatisierte E-Mail-Kampagnen zur Pflege und Aktivierung Ihrer Leads.',
    points: ['Segmentierung & Targeting', 'Personalisierte Inhalte', 'Trigger-basierte Auslöser'],
  },
  {
    icon: Repeat,
    badge: 'Drip-Kampagnen',
    badgeColor: 'service-pill-green',
    title: 'Drip-Kampagnen',
    description: 'Kontinuierliche, automatisierte E-Mail-Sequenzen für gezielte Kundenansprache.',
    points: ['Zeitgesteuerte E-Mails', 'Nachhaltiges Engagement', 'Workflow-Optimierung'],
  },
  {
    icon: Settings,
    badge: 'Workflows',
    badgeColor: 'service-pill-blue',
    title: 'Marketing-Workflows',
    description: 'Komplexe Multi-Channel-Workflows für höhere Conversion-Raten.',
    points: ['Multi-Channel-Integration', 'Bedingte Logik', 'Lead Scoring'],
  },
  {
    icon: Users,
    badge: 'Lead Management',
    badgeColor: 'service-pill-brand',
    title: 'Lead Management',
    description: 'Automatisiertes Lead-Nurturing und -Scoring für effektivere Vertriebspipelines.',
    points: ['Lead Scoring', 'CRM-Integration', 'Automatische Zuweisung'],
  },
  {
    icon: Activity,
    badge: 'Analytics',
    badgeColor: 'service-pill-green',
    title: 'Daten & Analytics',
    description: 'Auswertung und Optimierung Ihrer Marketing Automation anhand von Echtzeit-Daten.',
    points: ['Dashboards & Reports', 'A/B-Tests', 'ROI-Tracking'],
  },
  {
    icon: Zap,
    badge: 'Integrationen',
    badgeColor: 'service-pill-blue',
    title: 'Integrationen',
    description: 'Nahtlose Anbindung an Ihre bestehende Infrastruktur und Tools.',
    points: ['API & Webhooks', 'CRM & CMS Integration', 'Zapier Automation'],
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
            Unsere Marketing Automation Leistungen
          </h2>
          <p className="text-slate-600 text-lg md:text-xl">
            Automatisieren Sie Ihre Marketingprozesse für mehr Effizienz und bessere Ergebnisse.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto reveal">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group bg-white p-10 rounded-3xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl flex flex-col"
            >
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
