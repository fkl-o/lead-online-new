import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import ServicesSection from "./components/ServicesSection";
import CtaSection from "./components/CtaSection";

type WebentwicklungPageProps = {
  onOpenModal: (modalName: string) => void;
};

const WebentwicklungPage = ({ onOpenModal }: WebentwicklungPageProps) => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <CtaSection onOpenModal={onOpenModal} />
    </>
  );
};

export default WebentwicklungPage;
