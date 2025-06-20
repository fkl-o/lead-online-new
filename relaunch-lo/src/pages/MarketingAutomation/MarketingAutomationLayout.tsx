import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import MarketingAutomationPage from './index';
import AutomationModal from '../../components/modals/AutomationModal';

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
      </Helmet>

      <MarketingAutomationPage onOpenModal={handleOpenModal} />

      <AutomationModal
        open={activeModal === 'automation'}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default MarketingAutomationLayout;
