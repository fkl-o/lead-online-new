import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DigitalizationPage from './index';
import DigitalizationModal from '../../components/modals/DigitalizationModal';

const DigitalizationLayout = () => {
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
        <title>Digitalisierung | LeadGen Pro</title>
        <meta
          name="description"
          content="Ganzheitliche Digitalisierungslösungen für Ihr Unternehmen: Prozessoptimierung, IT-Sicherheit & Cloud-Integration."
        />
      </Helmet>

      <DigitalizationPage onOpenModal={handleOpenModal} />

      <DigitalizationModal
        open={activeModal === 'digitalization'}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default DigitalizationLayout;
