import { useState, Suspense, lazy } from 'react';
import { SEOHead, createServiceSchema } from '../../components/SEOHead';
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

  const webDevelopmentSchema = createServiceSchema(
    "Webentwicklung",
    "Professionelle Webentwicklung und digitale Lösungen für moderne, responsive Websites und Webanwendungen"
  );

  return (
    <>
      <SEOHead
        title="Webentwicklung | Lead Online"
        description="Professionelle Webentwicklung und digitale Lösungen für Ihr Unternehmen. Moderne, responsive Websites und Webanwendungen."
        keywords={['Webentwicklung', 'Website erstellen', 'React', 'Frontend', 'Backend', 'Deutschland']}
        structuredData={webDevelopmentSchema}
      />
      
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
