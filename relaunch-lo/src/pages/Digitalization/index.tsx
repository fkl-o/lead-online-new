import { SEOHead, createServiceSchema } from "../../components/SEOHead";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import BenefitsSection from "./components/BenefitsSection";
import CtaSection from "./components/CtaSection";

type DigitalizationPageProps = {
  onOpenModal: (modalName: string) => void;
};

const DigitalizationPage = ({ onOpenModal }: DigitalizationPageProps) => {
  const digitalizationSchema = createServiceSchema(
    "Digitalisierung & Prozessoptimierung",
    "Effiziente Digitalisierung von Geschäftsprozessen für mehr Produktivität"
  );

  return (
    <>
      <SEOHead
        title="Digitalisierung | 15-Min. Check & Sofort-Maßnahmen | LeadGen Pro"
        description="Digitalisieren Sie Ihre Geschäftsprozesse effizient. 15-Minuten Digitalisierungs-Check mit Ist-Analyse und 3 konkreten Sofort-Maßnahmen. Kostenlos!"
        keywords={['Digitalisierung', 'Prozessoptimierung', 'Workflow Automation', 'Business Intelligence', 'Digital Transformation', 'Deutschland']}
        structuredData={digitalizationSchema}
      />
      <HeroSection onOpenModal={onOpenModal} />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default DigitalizationPage;
