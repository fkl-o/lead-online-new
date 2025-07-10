import { SEOHead, createServiceSchema } from "../../components/SEOHead";
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import ServicesSection from "./components/ServicesSection";
import CtaSection from "./components/CtaSection";

type WebentwicklungPageProps = {
  onOpenModal: (modalName: string) => void;
};

const WebentwicklungPage = ({ onOpenModal }: WebentwicklungPageProps) => {
  const webDevelopmentSchema = createServiceSchema(
    "Professionelle Webentwicklung",
    "Moderne, responsive Websites und Webanwendungen für Ihr Unternehmen"
  );

  return (
    <>
      <SEOHead
        title="Webentwicklung | Moderne Websites & Webanwendungen | Lead Online"
        description="Professionelle Webentwicklung für Ihr Unternehmen. Responsive Design, schnelle Ladezeiten und SEO-optimiert. Kostenloses Design in 72h!"
        keywords={['Webentwicklung', 'Website erstellen', 'Responsive Design', 'React', 'WordPress', 'E-Commerce', 'Deutschland']}
        structuredData={webDevelopmentSchema}
      />
      <HeroSection onOpenModal={onOpenModal} />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default WebentwicklungPage;
