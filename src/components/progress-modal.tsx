import React from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/progress-checklist';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: boolean;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  const profileItems = [
    { label: "Create handle", completed: true },
    { label: "Add Github Profile", completed: true },
    { label: "Add how you found Flow", completed: false },
    { label: "Add contract addresses", completed: true },
  ];

  const challengeItems = [
    { label: "Complete first challenge", completed: true },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Progress"
    >
      <Checklist title="Profile" items={profileItems} />
      <Checklist title="Challenges" items={challengeItems} />
    </Modal>
  );
};

export default ProgressModal;