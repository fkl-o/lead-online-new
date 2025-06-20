import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import BenefitsSection from "./components/BenefitsSection";
import CtaSection from "./components/CtaSection";

type DigitalizationPageProps = {
  onOpenModal: (modalName: string) => void;
};

const DigitalizationPage = ({ onOpenModal }: DigitalizationPageProps) => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default DigitalizationPage;
