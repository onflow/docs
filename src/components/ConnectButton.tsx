import React, { useState } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import Dropdown from '@site/src/ui/design-system/src/lib/Components/Dropdown';
import ProgressModal from '@site/src/components/ProgressModal';
import ProfileModal from '@site/src/components/ProfileModal';
import { useProgress } from '../hooks/use-progress';

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 8)}...${address.slice(-3)}`;
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

  const dropdownItems = [
    {
      label: `Progress (${Math.floor(getProgress() * 100)}%)`,
      onClick: handleOpenProgress,
    },
    { label: 'Profile', onClick: handleOpenProfileModal },
    { label: 'Disconnect', onClick: logOut },
  ];

  const fullAddress = user.addr ?? 'Unknown';
  const displayAddress = shortenAddress(fullAddress);

  return (
    <div className="hide-connect-on-mobile">
      <Dropdown buttonLabel={displayAddress} items={dropdownItems} />
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
