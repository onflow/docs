import React from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/progress-checklist';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: boolean;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  const profileItems = [
    { label: 'Create handle', completed: true },
    { label: 'Add Github Profile', completed: true },
    { label: 'Add how you found Flow', completed: false },
    { label: 'Add contract addresses', completed: false },
  ];

  const challengeItems = [
    { label: 'Complete first challenge', completed: true },
  ];

  const onProfileAction = () => {
    console.log('TODO: Profile action');
  };

  const onChallengeAction = () => {
    console.log('TODO: Challenge action');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Progress">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <Checklist title="Profile" items={profileItems} />
          <div className="flex justify-center">
            <Button size="sm" className="w-full max-w-md" onClick={onProfileAction}>
              Update Profile to Complete Items
            </Button>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="space-y-4">
          <Checklist title="Challenges" items={challengeItems} />
          <div className="flex justify-center">
            <Button size="sm" className="w-full max-w-md" onClick={onChallengeAction}>
              View First Challenge to Complete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressModal;
