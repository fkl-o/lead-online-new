import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import WebentwicklungPage from './index';
import WebsiteModal from '../../components/modals/WebsiteModal';

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

      {/* Modal-Komponenten */}
      <WebsiteModal 
        open={activeModal === 'website'} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default WebentwicklungLayout;
