import React from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: boolean;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Progress"
    >
      Content Here
    </Modal>
  );
};

export default ProgressModal;