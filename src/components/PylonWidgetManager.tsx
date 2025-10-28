import React, { useEffect, useRef, useCallback } from 'react';
import { useCurrentUser } from '@site/src/hooks/use-current-user';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Pylon configuration
const PYLON_APP_ID = 'cc6b067b-cddb-4fd4-8043-030f95e703e4';

// Global state to track loading
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

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
    Pylon?: any;
    __pylonWidgetManager?: {
      loadWidget: () => Promise<void>;
      showChat: () => Promise<void>;
    };
  }
}

const PylonWidgetManagerInner: React.FC = () => {
  const { user, addr } = useCurrentUser();
  const configSetRef = useRef(false);
  const initRef = useRef(false);

  // Set up Pylon configuration immediately
  useEffect(() => {
    if (typeof window === 'undefined' || configSetRef.current) return;

    // Set up Pylon configuration

    // Generate random user info so Pylon always has user context
    const randomId = Math.random().toString(36).substring(2, 15);
    const randomEmail =
      user.loggedIn && addr !== ''
        ? `${addr}@flow.blockchain`
        : `user_${randomId}@flow.docs`;
    const randomName =
      user.loggedIn && addr !== ''
        ? `Flow User ${addr.slice(0, 8)}...`
        : `Flow User ${randomId.substring(0, 6)}`;
    const externalId =
      user.loggedIn && addr !== '' ? addr : `anonymous_${randomId}`;

    // Set up configuration
    window.pylon = {
      chat_settings: {
        app_id: PYLON_APP_ID,
        email: randomEmail,
        name: randomName,
        account_external_id: externalId,
      },
    };

    // Configuration set successfully
    configSetRef.current = true;
  }, [user.loggedIn, addr]);

  // Initialize widget manager once
  useEffect(() => {
    if (typeof window === 'undefined' || initRef.current) return;

    // Initialize widget manager (one-time setup)
    initRef.current = true;
  }, []);

  // Load widget function - executes the original Pylon loader on demand
  const loadWidget = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    // Return existing promise if already loading
    if (isLoading && loadPromise !== null) {
      await loadPromise;
      return;
    }

    // Return immediately if already loaded
    if (isLoaded) {
      return;
    }
    isLoading = true;

    loadPromise = new Promise<void>((resolve, reject) => {
      try {
        // Execute the exact same code as the original plugin
        (function () {
          const e = window;
          const t = document;
          const n = function (...args: any[]) {
            n.e(args);
          };
          n.q = [];
          n.e = function (args: any) {
            n.q.push(args);
          };
          e.Pylon = n;

          const r = function () {
            const script = t.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('async', 'true');
            script.setAttribute(
              'src',
              `https://widget.usepylon.com/widget/${PYLON_APP_ID}`,
            );

            script.onload = function () {
              isLoaded = true;
              isLoading = false;
              resolve();
            };

            script.onerror = function () {
              isLoading = false;
              loadPromise = null;
              reject(new Error('Failed to load Pylon widget'));
            };

            const firstScript = t.getElementsByTagName('script')[0];
            if (firstScript?.parentNode) {
              firstScript.parentNode.insertBefore(script, firstScript);
            } else {
              t.head.appendChild(script);
            }
          };

          if (t.readyState === 'complete') {
            r();
          } else if (e.addEventListener) {
            e.addEventListener('load', r, false);
          }
        })();
      } catch (error) {
        isLoading = false;
        loadPromise = null;
        reject(error);
      }
    });

    await loadPromise;
  }, []);

  // Show chat function that loads widget if needed
  const showChat = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;

    try {
      // Load widget if not already loaded
      if (!isLoaded) {
        await loadWidget();
      }

      // Show the chat
      if (window.Pylon && typeof window.Pylon === 'function') {
        window.Pylon('show');
      }
    } catch (error) {
      // Fallback: try to show anyway in case it's a loading race condition
      if (window.Pylon && typeof window.Pylon === 'function') {
        window.Pylon('show');
      }
    }
  }, [loadWidget]);

  // Expose global API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Expose global widget manager API
      window.__pylonWidgetManager = {
        loadWidget,
        showChat,
      };

      // Global API is now available
    }
  }, [loadWidget, showChat]);

  return null;
};

const PylonWidgetManager: React.FC = () => {
  return <BrowserOnly>{() => <PylonWidgetManagerInner />}</BrowserOnly>;
};

export default PylonWidgetManager;
