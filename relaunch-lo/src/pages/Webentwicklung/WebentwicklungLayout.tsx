import { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import WebentwicklungPage from './index';

// Lazy load modal component
const WebsiteModal = lazy(() => import('../../components/modals/WebsiteModal'));

const WebentwicklungLayout = () => {
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
        <title>Webentwicklung | LeadGen Pro</title>
        <meta 
          name="description" 
          content="Professionelle Webentwicklung und digitale Lösungen für Ihr Unternehmen. Moderne, responsive Websites und Webanwendungen." 
        />
      </Helmet>
        <WebentwicklungPage onOpenModal={handleOpenModal} />

      {/* Lazy-loaded modal */}
      {activeModal === 'website' && (
        <Suspense fallback={<div />}>
          <WebsiteModal 
            open={true} 
            onClose={handleCloseModal} 
          />
        </Suspense>
      )}
    </>
  );
};

export default WebentwicklungLayout;
