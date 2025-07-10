import { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import DigitalizationPage from './index';

// Lazy load modal component
const DigitalizationModal = lazy(() => import('../../components/modals/DigitalizationModal'));

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
        <title>Digitalisierung | lead.online</title>
        <meta
          name="description"
          content="Ganzheitliche Digitalisierungslösungen für Ihr Unternehmen: Prozessoptimierung, IT-Sicherheit & Cloud-Integration."
        />
      </Helmet>      <DigitalizationPage onOpenModal={handleOpenModal} />

      {/* Lazy-loaded modal */}
      {activeModal === 'digitalization' && (
        <Suspense fallback={<div />}>
          <DigitalizationModal
            open={true}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}
    </>
  );
};

export default DigitalizationLayout;
