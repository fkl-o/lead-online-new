import { Globe, ShoppingCart, LayoutDashboard, DatabaseZap, Rocket, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const services = [
  {
    icon: Globe,
    title: "Corporate Websites & Landing Pages",
    description: "Professionelle Darstellung Ihres Unternehmens im Web. Wir erstellen repräsentative Websites, die Ihre Marke stärken und Besucher überzeugen."
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce & Online Shops",
    description: "Verkaufen Sie Ihre Produkte online mit einem leistungsstarken und benutzerfreundlichen Online-Shop, der auf Wachstum ausgelegt ist."
  },
  {
    icon: LayoutDashboard,
    title: "Individuelle Webanwendungen",
    description: "Maßgeschneiderte Applikationen, die Ihre internen Prozesse optimieren oder Ihren Kunden innovative digitale Werkzeuge an die Hand geben."
  },
  {
    icon: DatabaseZap,
    title: "Headless CMS & Jamstack",
    description: "Moderne, flexible und extrem schnelle Websites durch die Entkopplung von Frontend und Backend. Ideal für zukunftssichere Projekte."
  },
  {
    icon: Rocket,
    title: "Performance-Optimierung",
    description: "Wir machen Ihre Website blitzschnell. Kürzere Ladezeiten führen zu besseren Rankings, höheren Conversion-Rates und zufriedeneren Nutzern."
  },
  {
    icon: Wrench,
    title: "Wartung & Technischer Support",
    description: "Verlassen Sie sich auf unseren zuverlässigen Support für regelmäßige Updates, Sicherheits-Checks und schnelle Hilfe bei technischen Problemen."
  }
];

const ServicesSection = () => {
  const headingRef = useScrollReveal();
  const cardsRef = useScrollReveal({ delay: 150 });

  return (
    <section id="services" className="py-20 md:py-28 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Unsere Webentwicklungs-Leistungen</h2>
          <p className="text-slate-600 text-lg">Ein umfassendes Angebot für Ihren digitalen Erfolg. Wir decken den gesamten Lebenszyklus Ihrer Web-Projekte ab.</p>
        </div>
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto reveal">
          {services.map((service, index) => (
            <Card key={index} className="group bg-white p-8 rounded-2xl border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col text-center items-center">
              <CardHeader className="p-0">
                <div className="flex justify-center items-center mb-4">
                  <service.icon className="w-12 h-12 text-brand-600" />
                </div>
                <CardTitle className="font-bold text-xl text-gray-900 mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-0">
                <p className="text-slate-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
