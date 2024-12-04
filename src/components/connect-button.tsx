import React from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';

const ConnectButton: React.FC = () => {
  const { user, logIn, logOut } = useCurrentUser();

  return (
    <button onClick={user.loggedIn ? logOut : logIn}>
      {user.loggedIn ? 'Disconnect' : 'Connect'}
    </button>
  );
};

export default ConnectButton;
