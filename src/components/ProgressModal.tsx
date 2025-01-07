import React, { useState } from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/ProgressChecklist';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useProgress } from '../hooks/use-progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain } from '@fortawesome/free-solid-svg-icons';

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
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  const openChallengeModal = () => {
    onClose();
    setChallengeModalOpen(true);
  };

  const closeChallengeModal = () => {
    setChallengeModalOpen(false);
  };

  return (
    <>
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
                onClick={openChallengeModal}
              >
                View First Challenge to Complete
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Challenge Modal */}
      {challengeModalOpen && (
        <Modal
          isOpen={challengeModalOpen}
          onClose={closeChallengeModal}
          title='Challenge Details'
        >
          <div className="space-y-4 text-center">
            <FontAwesomeIcon icon={faBrain} size="3x" className="text-blue-500" />
            <p className="text-lg text-gray-700 mt-4">
              By completing this challenge, you are declaring your intent to learn Flow and explore its capabilities.
            </p>
            <div className="flex justify-end mt-6">
              <Button size="sm" onClick={closeChallengeModal}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProgressModal;
