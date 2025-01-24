import React, { useState } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import Dropdown from '@site/src/ui/design-system/src/lib/Components/Dropdown';
import ProgressModal from '@site/src/components/ProgressModal';
import ProfileModal from '@site/src/components/ProfileModal';
import { useProgress } from '../hooks/use-progress';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-3)}`;
};

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { getProgress } = useProgress();

  const handleOpenProgress = () => {
    setIsProgressModalOpen(true);
  };

  const handleCloseProgressModal = () => {
    setIsProgressModalOpen(false);
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  if (!user.loggedIn) {
    return (
      <Button size="sm" className="mr-2" onClick={logIn}>
        Connect
      </Button>
    );
  }

  const formattedProgressValue = Math.floor(getProgress() * 100);

  const dropdownItems = [
    {
      label: `Progress (${formattedProgressValue}%)`,
      onClick: handleOpenProgress,
    },
    { label: 'Profile', onClick: handleOpenProfileModal },
    { label: 'Disconnect', onClick: logOut },
  ];

  return (
    <div className="hide-connect-on-mobile">
      <Dropdown
        buttonLabel={
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} size="md" className="mx-auto" />
            <span className="text-sm text-gray-500">
              {formattedProgressValue}%
            </span>
          </div>
        }
        items={dropdownItems}
      />
      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={handleCloseProgressModal}
        onOpenProfileModal={() => {
          handleCloseProgressModal();
          handleOpenProfileModal();
        }}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </div>
  );
};

export default ConnectButton;
