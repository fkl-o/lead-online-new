import { useState } from 'react';

export const useModal = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    activeModal,
    openModal,
    closeModal,
  };
};