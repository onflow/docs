import React from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import { useIsMobile } from '@site/src/hooks/use-is-mobile';
import Dropdown from '@site/src/ui/design-system/src/lib/Components/Dropdown';

const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 8)}...${address.slice(-3)}`;
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
  const displayAddress = shortenAddress(fullAddress);

  return (
    <div className="hide-connect-on-mobile">
      <Dropdown buttonLabel={displayAddress} items={dropdownItems} />
    </div>
  );
};

export default ConnectButton;
