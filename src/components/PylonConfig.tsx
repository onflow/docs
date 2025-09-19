import React, { useEffect } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Your Pylon APP_ID
const PYLON_APP_ID = 'cc6b067b-cddb-4fd4-8043-030f95e703e4';

declare global {
  interface Window {
    pylon?: {
      chat_settings: {
        app_id: string;
        email?: string;
        name?: string;
        account_external_id?: string;
      };
    };
    Pylon?: (action: string, ...args: any[]) => void;
  }
}

const PylonConfigInner: React.FC = () => {
  const { user, addr } = useCurrentUser();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔧 Setting Pylon configuration with user context...');
      console.log('👤 User logged in:', user.loggedIn, 'Address:', addr);

      window.pylon = {
        chat_settings: {
          app_id: PYLON_APP_ID,
          // Add user context when available
          ...(user.loggedIn &&
            addr && {
              email: `${addr}@flow.blockchain`,
              name: `Flow User ${addr.slice(0, 8)}...`,
              account_external_id: addr,
            }),
        },
      };

      console.log('✅ Pylon config set:', window.pylon);
    }
  }, [user.loggedIn, addr]);

  return null;
};

const PylonConfig: React.FC = () => {
  return <BrowserOnly>{() => <PylonConfigInner />}</BrowserOnly>;
};

export default PylonConfig;
