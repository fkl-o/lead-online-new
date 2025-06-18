import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import ProcessSection from './components/ProcessSection';
import CallToActionSection from './components/CallToActionSection';
import WebsiteModal from '../../components/modals/WebsiteModal';
import AutomationModal from '../../components/modals/AutomationModal';
import DigitalizationModal from '../../components/modals/DigitalizationModal';

const HomePage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <Helmet>
        <title>LeadGen Pro | Ihre Digitalagentur für Wachstum</title>
        <meta 
          name="description" 
          content="Als Ihr Partner für Webentwicklung, Marketing Automation und Digitalisierung schaffen wir nachhaltige Wettbewerbsvorteile und messbare Erfolge." 
        />
      </Helmet>
      
      <HeroSection />
      <ServicesSection onOpenModal={setActiveModal} /> 
      <TrustSection />
      <ProcessSection />
      <CallToActionSection />

      {/* ✅ Einheitlich: immer gerendert, open steuert Anzeige */}
      <WebsiteModal 
        open={activeModal === 'website'} 
        onClose={() => setActiveModal(null)} 
      />
      <AutomationModal 
        open={activeModal === 'automation'} 
        onClose={() => setActiveModal(null)} 
      />
      <DigitalizationModal 
        open={activeModal === 'digitalization'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
};

export default HomePage;
