import {
  Globe,
  ShoppingCart,
  LayoutDashboard,
  DatabaseZap,
  Rocket,
  Wrench,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const services = [
  {
    icon: Globe,
    badge: "Online Präsenz",
    badgeColor: "service-pill-brand",
    title: "Corporate Websites & Landing Pages",
    description: "Professionelle Darstellung Ihres Unternehmens im Web. Wir erstellen repräsentative Websites, die Ihre Marke stärken.",
    points: ["Responsives Design", "SEO-optimiert", "Einfache Pflege"],
  },
  {
    icon: ShoppingCart,
    badge: "Umsatz-Boost",
    badgeColor: "service-pill-green",
    title: "E-Commerce & Online Shops",
    description: "Verkaufen Sie Ihre Produkte online mit einem leistungsstarken und benutzerfreundlichen Shop.",
    points: ["Conversion-Optimierung", "Sichere Zahlungsabwicklung", "Skalierbar & performant"],
  },
  {
    icon: LayoutDashboard,
    badge: "Individuell",
    badgeColor: "service-pill-blue",
    title: "Individuelle Webanwendungen",
    description: "Maßgeschneiderte Applikationen, die interne Prozesse optimieren oder Kunden echten Mehrwert bieten.",
    points: ["Effizienzsteigerung", "Prozessdigitalisierung", "Intuitive UX"],
  },
  {
    icon: DatabaseZap,
    badge: "Modern & Schnell",
    badgeColor: "service-pill-brand",
    title: "Headless CMS & Jamstack",
    description: "Flexible & performante Websites durch Entkopplung von Frontend & Backend.",
    points: ["Maximale Ladegeschwindigkeit", "Flexibilität in der Contentpflege", "Zukunftssicher"],
  },
  {
    icon: Rocket,
    badge: "Performance",
    badgeColor: "service-pill-green",
    title: "Performance-Optimierung",
    description: "Wir holen das Maximum aus Ihrer Website heraus und sorgen für Top-Performance.",
    points: ["Schnellere Ladezeiten", "Bessere Rankings", "Höhere Conversion-Rate"],
  },
  {
    icon: Wrench,
    badge: "Support",
    badgeColor: "service-pill-blue",
    title: "Wartung & Technischer Support",
    description: "Verlassen Sie sich auf regelmäßige Updates, Sicherheitsprüfungen & schnellen Support.",
    points: ["Sicherheits-Checks", "Fehlerbehebung", "Planbare Wartung"],
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
            Unsere Webentwicklungs-Leistungen
          </h2>
          <p className="text-slate-600 text-lg md:text-xl">
            Alles, was Sie für nachhaltigen Online-Erfolg brauchen — aus einer Hand.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto reveal"
        >
          {services.map((service, index) => (
            <Card
              key={index}
              className="group bg-white p-10 rounded-3xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl flex flex-col"
            >
              <CardHeader className="p-0">
                <div className="flex justify-between items-start mb-6">
                  <service.icon className="w-10 h-10 text-secondary-600" />
                  <span className={`service-pill ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                </div>
                <CardTitle className="font-bold text-2xl text-gray-900 mb-3">
                  {service.title}
                </CardTitle>
                <CardDescription className="font-semibold text-gray-700 mb-5">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-0">
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  {service.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
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
