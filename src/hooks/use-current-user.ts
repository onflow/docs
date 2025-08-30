'use client';

import { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

interface FlowUser {
  addr: string | null;
  loggedIn: boolean;
}

interface UseCurrentUserReturn {
  user: FlowUser;
  addr: string;
  logIn: () => Promise<void>;
  logOut: () => void;
}

async function hashAddress(address: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(address);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
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

      const snapshot = await fcl.currentUser.snapshot();
      const userAddrSnapshot = snapshot?.addr;

      if (userAddrSnapshot) {
        const hashedAddr = await hashAddress(userAddrSnapshot);

        event({
          category: GA_CATEGORIES.AUTH,
          action: GA_EVENTS.AUTH_LOGIN,
          label: `user_${hashedAddr}`,
          value: 1,
        });
      } else {
        event({
          category: GA_CATEGORIES.AUTH,
          action: GA_EVENTS.AUTH_LOGIN,
          label: 'unknown_user',
          value: 1,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logOut = (): void => {
    fcl.unauthenticate();
  };

  return {
    user,
    addr: user.addr || '',
    logIn,
    logOut,
  };
}