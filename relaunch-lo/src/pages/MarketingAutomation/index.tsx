import { SEOHead, createServiceSchema } from "../../components/SEOHead";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import BenefitsSection from "./components/BenefitsSection";
import CtaSection from "./components/CtaSection";

type MarketingAutomationPageProps = {
  onOpenModal: (modalName: string) => void;
};

const MarketingAutomationPage = ({ onOpenModal }: MarketingAutomationPageProps) => {
  const marketingAutomationSchema = createServiceSchema(
    "Marketing Automation",
    "Automatisierte Marketing-Prozesse für mehr Leads und höhere Conversion-Raten"
  );

  return (
    <>
      <SEOHead
        title="Marketing Automation | ROI-Kalkulator & Lead-Generierung | Lead Online"
        description="Steigern Sie Ihren Marketing-ROI mit professioneller Marketing Automation. Interaktiver Kalkulator mit 5-Monats-Prognose. Jetzt kostenlos berechnen!"
        keywords={['Marketing Automation', 'Lead Generation', 'ROI Kalkulator', 'Email Marketing', 'CRM', 'Conversion Optimierung', 'Deutschland']}
        structuredData={marketingAutomationSchema}
      />
      <HeroSection onOpenModal={onOpenModal} />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default MarketingAutomationPage;
