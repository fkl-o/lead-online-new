import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

// Import der Sektions-Komponenten aus dem lokalen Ordner
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import ProcessSection from './components/ProcessSection';
import CallToActionSection from './components/CallToActionSection';

// Import der globalen Modal-Komponenten
import WebsiteModal from '../../components/modals/WebsiteModal';
import AutomationModal from '../../components/modals/AutomationModal';
import DigitalizationModal from '../../components/modals/DigitalizationModal';

const HomePage = () => {
  // Dieser State steuert, welches Modal gerade sichtbar ist ('website', 'automation', 'digitalization' oder null)
  const [activeModal, setActiveModal] = useState(null);

  // Funktion zum Schließen des Modals
  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <Helmet>
        <title>LeadGen Pro | Ihre Digitalagentur für Wachstum</title>
        <meta name="description" content="Als Ihr Partner für Webentwicklung, Marketing Automation und Digitalisierung schaffen wir nachhaltige Wettbewerbsvorteile und messbare Erfolge." />
      </Helmet>
      
      <HeroSection />
      {/* Wir übergeben die Funktion zum Öffnen der Modals als Prop */}
      <ServicesSection onOpenModal={setActiveModal} /> 
      <TrustSection />
      <ProcessSection />
      <CallToActionSection />

      {/* Die Modals werden nur gerendert, wenn ihr State aktiv ist */}
      {activeModal === 'website' && <WebsiteModal onClose={handleCloseModal} />}
      {activeModal === 'automation' && <AutomationModal onClose={handleCloseModal} />}
      {activeModal === 'digitalization' && <DigitalizationModal onClose={handleCloseModal} />}
    </>
  );
};

export default HomePage;