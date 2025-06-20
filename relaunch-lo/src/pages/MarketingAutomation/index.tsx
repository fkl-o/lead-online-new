import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import BenefitsSection from "./components/BenefitsSection";
import CtaSection from "./components/CtaSection";

type MarketingAutomationPageProps = {
  onOpenModal: (modalName: string) => void;
};

const MarketingAutomationPage = ({ onOpenModal }: MarketingAutomationPageProps) => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default MarketingAutomationPage;
