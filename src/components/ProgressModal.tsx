import React from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/ProgressChecklist';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useProgress } from '../hooks/use-progress';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileModal: () => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  onOpenProfileModal,
}) => {
  const { profileItems, challengeItems } = useProgress();

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
            <Button
              size="sm"
              className="w-full max-w-md"
              onClick={onOpenProfileModal}
            >
              Update Profile to Complete Items
            </Button>
          </div>
        </div>

        {/* Challenges Section */}
        <div className="space-y-4">
          <Checklist title="Challenges" items={challengeItems} />
          <div className="flex justify-center">
            <Button
              size="sm"
              className="w-full max-w-md"
              onClick={onChallengeAction}
            >
              View First Challenge to Complete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProgressModal;
