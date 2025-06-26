import { useState, Suspense, lazy } from 'react';
import { SEOHead, createOrganizationSchema, createWebPageSchema } from '../../components/SEOHead';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import TrustSection from './components/TrustSection';
import ProcessSection from './components/ProcessSection';
import CallToActionSection from './components/CallToActionSection';

// Lazy load modal components
const WebsiteModal = lazy(() => import('../../components/modals/WebsiteModal'));
const AutomationModal = lazy(() => import('../../components/modals/AutomationModal'));
const DigitalizationModal = lazy(() => import('../../components/modals/DigitalizationModal'));

const HomePage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // SEO Structured Data
  const organizationSchema = createOrganizationSchema();
  const webPageSchema = createWebPageSchema(
    "LeadGen Pro - Ihre Digitalagentur für Wachstum",
    "Als Ihr Partner für Webentwicklung, Marketing Automation und Digitalisierung schaffen wir nachhaltige Wettbewerbsvorteile und messbare Erfolge."
  );

  return (
    <>
      <SEOHead
        title="LeadGen Pro | Digitalagentur für Webentwicklung, Marketing & Digitalisierung"
        description="Ihre Digitalagentur für nachhaltiges Wachstum: Professionelle Webentwicklung, Marketing Automation und Digitalisierung. Kostenlose Beratung & schnelle Umsetzung!"
        keywords={['Digitalagentur', 'Webentwicklung', 'Marketing Automation', 'Digitalisierung', 'Lead Generation', 'Deutschland', 'Wachstum']}
        structuredData={[organizationSchema, webPageSchema]}
      />
      
      <HeroSection />
      <ServicesSection onOpenModal={setActiveModal} /> 
      <TrustSection />
      <ProcessSection />
      <CallToActionSection />

      {/* Lazy-loaded modals with Suspense */}
      {activeModal === 'website' && (
        <Suspense fallback={<div />}>
          <WebsiteModal 
            open={true} 
            onClose={() => setActiveModal(null)} 
          />
        </Suspense>
      )}
      {activeModal === 'automation' && (
        <Suspense fallback={<div />}>
          <AutomationModal 
            open={true} 
            onClose={() => setActiveModal(null)} 
          />
        </Suspense>
      )}
      {activeModal === 'digitalization' && (
        <Suspense fallback={<div />}>
          <DigitalizationModal 
            open={true} 
            onClose={() => setActiveModal(null)} 
          />
        </Suspense>
      )}
    </>
  );
};

export default HomePage;
