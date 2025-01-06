import React from 'react';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import Checklist from '@site/src/components/progress-checklist';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useProfile } from '../hooks/use-profile';
import { useCurrentUser } from '../hooks/use-current-user';
import { Profile, SocialType } from '../types/gold-star';
import { createProfile } from '../utils/gold-star';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, onClose }) => {
  const user = useCurrentUser();
  const { profile } = useProfile(user.user.addr);

  const profileItems = [
    {
      label: 'Create handle',
      completed: profile && !!profile.handle,
    },
    {
      label: 'Add Github Profile',
      completed: profile && !!profile.socials[SocialType.GITHUB],
    },
    {
      label: 'Add how you found Flow',
      completed: profile && !!profile.referralSource,
    },
    {
      label: 'Add contract addresses',
      completed: profile && profile.deployedContracts.length > 0,
    },
  ] as { label: string; completed: boolean }[];

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
            <Button
              size="sm"
              className="w-full max-w-md"
              onClick={onProfileAction}
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
