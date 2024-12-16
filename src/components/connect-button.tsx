import React from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';
import Dropdown from '@site/src/components/dropdown';

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();

  if (!user.loggedIn) {
    return (
      <Button onClick={logIn}>
        Connect
      </Button>
    );
  }

  const dropdownItems = [
    { label: 'View Account', onClick: () => console.log('View Account') },
    { label: 'Disconnect', onClick: logOut },
  ];

  return <Dropdown buttonLabel={user.addr ?? 'Unknown'} items={dropdownItems} />;
};

export default ConnectButton;
