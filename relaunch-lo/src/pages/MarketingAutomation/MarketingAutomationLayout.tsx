import { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import MarketingAutomationPage from './index';

// Lazy load modal component
const AutomationModal = lazy(() => import('../../components/modals/AutomationModal'));

const MarketingAutomationLayout = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <Helmet>
        <title>Marketing Automation | LeadGen Pro</title>
        <meta
          name="description"
          content="Automatisieren Sie Ihre Marketingprozesse und steigern Sie Ihre Effizienz mit intelligenter Marketing Automation."
        />
      </Helmet>      <MarketingAutomationPage onOpenModal={handleOpenModal} />

      {/* Lazy-loaded modal */}
      {activeModal === 'automation' && (
        <Suspense fallback={<div />}>
          <AutomationModal
            open={true}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}
    </>
  );
};

export default MarketingAutomationLayout;
