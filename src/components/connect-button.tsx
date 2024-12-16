import React from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import Dropdown from '@site/src/components/dropdown';
import { useIsMobile } from '@site/src/hooks/use-is-mobile';

const shortenAddress = (address: string, isMobile: boolean) => {
  if (!address) return '';
  return isMobile ? `${address.slice(0, 4)}...${address.slice(-3)}` : address;
};

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();
  const isMobile = useIsMobile();

  if (!user.loggedIn) {
    return (
      <Button size="sm" className="mr-2" onClick={logIn}>
        Connect
      </Button>
    );
  }

  const dropdownItems = [
    { label: 'Disconnect', onClick: logOut },
  ];

  const fullAddress = user.addr ?? 'Unknown';
  const displayAddress = shortenAddress(fullAddress, isMobile);

  return <Dropdown buttonLabel={displayAddress} items={dropdownItems} />;
};

export default ConnectButton;
