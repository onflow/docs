import React from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import { Button } from '@site/src/ui/design-system/src/lib/Components/Button';

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();

  return (
    <Button size="sm" className="mr-2" onClick={user.loggedIn ? logOut : logIn}>
      {user.loggedIn ? 'Disconnect' : 'Connect'}
    </Button>
  );
};

export default ConnectButton;
