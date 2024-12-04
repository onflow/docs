import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';

interface FlowUser {
  addr: string | null;
  loggedIn: boolean;
}

interface UseCurrentUserReturn {
  user: FlowUser;
  logIn: () => Promise<void>;
  logOut: () => void;
}

export function useCurrentUser(): UseCurrentUserReturn {
  const [user, setUser] = useState<FlowUser>({ addr: null, loggedIn: false });

  useEffect(() => {
    const unsubscribe = fcl.currentUser.subscribe(setUser);
    return () => unsubscribe();
  }, []);

  const logIn = async (): Promise<void> => {
    try {
      await fcl.authenticate();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logOut = (): void => {
    fcl.unauthenticate();
  };

  return {
    user,
    logIn,
    logOut,
  };
};