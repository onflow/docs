import React, { useState } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useIsMobile } from '@site/src/hooks/use-is-mobile';
import Dropdown from '@site/src/ui/design-system/src/lib/Components/Dropdown';
import Modal from '@site/src/ui/design-system/src/lib/Components/Modal';
import ProgressModal from '@site/src/components/progress-modal';

const shortenAddress = (address: string, isMobile: boolean) => {
  if (!address) return '';
  return isMobile ? `${address.slice(0, 4)}...${address.slice(-3)}` : address;
};

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProgress = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!user.loggedIn) {
    return (
      <Button size="sm" className="mr-2" onClick={logIn}>
        Connect
      </Button>
    );
  }

  const dropdownItems = [
    { label: 'Progress', onClick: handleOpenProgress },
    { label: 'Disconnect', onClick: logOut },
  ];

  const fullAddress = user.addr ?? 'Unknown';
  const displayAddress = shortenAddress(fullAddress, isMobile);

  return (
    <>
      <Dropdown buttonLabel={displayAddress} items={dropdownItems} />
      <ProgressModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
};

export default ConnectButton;
