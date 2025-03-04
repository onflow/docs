import React, { useState } from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/ProgressChecklist';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useProgress } from '../hooks/use-progress';
import ChallengeModal from './ChallengeModal';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';

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
  const { user } = useCurrentUser();
  const { profile, isLoading: isProfileLoading } = useProfile(user.addr);
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete the steps below to unlock rewards and challenges. Keep
            track of your progress and stay on track with your goals!
          </p>

          {/* Profile Section */}
          <div className="space-y-4">
            <Checklist title="Profile" items={profileItems} />
            <div className="flex justify-center">
              <Button
                size="sm"
                variant="primary"
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
                variant="primary"
                className="w-full max-w-md"
                onClick={openChallengeModal}
                disabled={!profile}
              >
                {profile || isProfileLoading
                  ? 'View First Challenge to Complete'
                  : 'Create Profile to View Challenge'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ChallengeModal
        isOpen={challengeModalOpen}
        onClose={closeChallengeModal}
      />
    </>
  );
};

export default ProgressModal;
