import React, { useState } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';
import {
  FlowProvider,
  Connect,
  TransactionButton,
  TransactionLink,
  TransactionDialog,
  useFlowBlock,
  useFlowAccount,
  useFlowCurrentUser,
  useFlowChainId,
  useFlowRevertibleRandom,
} from '@onflow/react-sdk';
import { flowClient } from '@site/src/config/fcl';

function MasonryGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        columnCount: 3,
        columnGap: '1.25rem',
      }}
    >
      {children}
    </div>
  );
}

// Enhanced Card Wrapper
function EnhancedCard({
  title,
  description,
  darkMode,
  children,
  accent = '#00ef8b',
}: {
  title: string;
  description: string;
  darkMode: boolean;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      style={
        {
          background: darkMode
            ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 1) 100%)',
          border: darkMode
            ? `1px solid rgba(255, 255, 255, 0.08)`
            : `1px solid rgba(0, 0, 0, 0.06)`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.25rem',
          display: 'inline-block',
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: darkMode
            ? '0 2px 4px rgba(0, 0, 0, 0.2)'
            : '0 1px 3px rgba(0, 0, 0, 0.05)',
        } as React.CSSProperties
      }
    >
      <div style={{ marginBottom: '1rem' }}>
        <h3
          style={{
            fontSize: '0.938rem',
            fontWeight: '700',
            fontFamily: 'monospace',
            color: darkMode ? '#ffffff' : '#111827',
            margin: 0,
            marginBottom: '0.5rem',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: '0.813rem',
            color: darkMode
              ? 'rgba(209, 213, 219, 0.75)'
              : 'rgba(75, 85, 99, 0.85)',
            margin: 0,
            lineHeight: '1.4',
          }}
        >
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

// Component Cards
function ConnectCardMini({ darkMode }: { darkMode: boolean }) {
  return (
    <EnhancedCard
      title="<Connect />"
      description="Wallet authentication with built-in styling"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <Connect />
      </div>
    </EnhancedCard>
  );
}

function TransactionButtonCardMini({ darkMode }: { darkMode: boolean }) {
  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: &Account) {
        log(greeting)
      }
    }
  `;

  return (
    <EnhancedCard
      title="<TransactionButton />"
      description="Execute transactions with built-in signing"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <TransactionButton
          label="Sign Transaction"
          transaction={{
            cadence: GREETING_TRANSACTION,
            args: (arg, t) => [arg('Hello!', t.String)],
            limit: 999,
          }}
        />
      </div>
    </EnhancedCard>
  );
}

function TransactionLinkCardMini({ darkMode }: { darkMode: boolean }) {
  const [txId, setTxId] = useState<string | undefined>(undefined);

  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: &Account) {
        log(greeting)
      }
    }
  `;

  return (
    <EnhancedCard
      title="<TransactionLink />"
      description="Generate block explorer links automatically"
      darkMode={darkMode}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        <div>
          <TransactionButton
            label="Sign Transaction"
            transaction={{
              cadence: GREETING_TRANSACTION,
              args: (arg, t) => [arg('Hello!', t.String)],
              limit: 999,
            }}
            mutation={{
              onSuccess: (data) => setTxId(data),
            }}
          />
        </div>
        {txId && (
          <div
            style={{
              padding: '0.75rem',
              background: darkMode
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(16, 185, 129, 0.08)',
              borderRadius: '8px',
              border: `1px solid ${
                darkMode
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(16, 185, 129, 0.15)'
              }`,
            }}
          >
            <TransactionLink txId={txId} />
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function TransactionDialogCardMini({ darkMode }: { darkMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [txId, setTxId] = useState<string | undefined>(undefined);

  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: &Account) {
        log(greeting)
      }
    }
  `;

  return (
    <EnhancedCard
      title="<TransactionDialog />"
      description="Modal with real-time transaction status"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <TransactionButton
          label="Open Dialog"
          transaction={{
            cadence: GREETING_TRANSACTION,
            args: (arg, t) => [arg('Hello!', t.String)],
            limit: 999,
          }}
          mutation={{
            onSuccess: (data) => {
              setTxId(data);
              setOpen(true);
            },
          }}
        />
      </div>
      <TransactionDialog open={open} onOpenChange={setOpen} txId={txId} />
    </EnhancedCard>
  );
}

// Hook Cards
function UseFlowCurrentUserCardMini({ darkMode }: { darkMode: boolean }) {
  const { user } = useFlowCurrentUser();

  return (
    <EnhancedCard
      title="useFlowCurrentUser"
      description="Manage user authentication and wallet info"
      darkMode={darkMode}
    >
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: darkMode
            ? 'rgba(17, 24, 39, 0.6)'
            : 'rgba(249, 250, 251, 1)',
          borderRadius: '8px',
          border: `1px solid ${
            darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
          }`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Status
          </span>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.688rem',
              fontWeight: '600',
              background: user?.loggedIn
                ? 'rgba(16, 185, 129, 0.15)'
                : darkMode
                ? 'rgba(107, 114, 128, 0.2)'
                : 'rgba(229, 231, 235, 1)',
              color: user?.loggedIn
                ? '#10b981'
                : darkMode
                ? '#9ca3af'
                : '#6b7280',
            }}
          >
            {user?.loggedIn ? '● Connected' : '○ Not Connected'}
          </span>
        </div>
        {user?.loggedIn && (
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: darkMode ? '#10b981' : '#059669',
              marginTop: '0.5rem',
              wordBreak: 'break-all',
            }}
          >
            {user.addr}
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function UseFlowChainIdCardMini({ darkMode }: { darkMode: boolean }) {
  const {
    data: chainId,
    refetch,
    isLoading,
  } = useFlowChainId({
    query: { enabled: false },
  });

  return (
    <EnhancedCard
      title="useFlowChainId"
      description="Get current Flow network identifier"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: isLoading ? '#9ca3af' : '#00ef8b',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Loading...' : 'Fetch Chain ID'}
        </button>
        {chainId && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: darkMode
                ? 'rgba(17, 24, 39, 0.6)'
                : 'rgba(249, 250, 251, 1)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              Network
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#00ef8b',
              }}
            >
              {chainId}
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function UseFlowBlockCardMini({ darkMode }: { darkMode: boolean }) {
  const {
    data: block,
    isLoading,
    refetch,
  } = useFlowBlock({
    query: { enabled: true },
  });

  return (
    <EnhancedCard
      title="useFlowBlock"
      description="Get blockchain block information"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: isLoading ? '#9ca3af' : '#00ef8b',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Loading...' : 'Fetch Latest Block'}
        </button>
        {block && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: darkMode
                ? 'rgba(17, 24, 39, 0.6)'
                : 'rgba(249, 250, 251, 1)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginBottom: '0.25rem',
              }}
            >
              Height
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#00ef8b',
              }}
            >
              {block.height}
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function UseFlowAccountCardMini({ darkMode }: { darkMode: boolean }) {
  const [address, setAddress] = useState('0x7e60df042a9c0868');
  const {
    data: account,
    isLoading,
    refetch,
  } = useFlowAccount({
    address,
    query: { enabled: false },
  });

  return (
    <EnhancedCard
      title="useFlowAccount"
      description="Fetch Flow account info and balance"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address..."
          style={{
            width: '100%',
            padding: '0.75rem',
            background: darkMode ? 'rgba(17, 24, 39, 0.6)' : '#ffffff',
            color: darkMode ? '#fff' : '#000',
            border: darkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            outline: 'none',
          }}
        />
        <button
          onClick={() => refetch()}
          disabled={isLoading || !address}
          style={{
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: isLoading || !address ? '#9ca3af' : '#00ef8b',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isLoading || !address ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Fetching...' : 'Fetch Account'}
        </button>
        {account && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: darkMode
                ? 'rgba(17, 24, 39, 0.6)'
                : 'rgba(249, 250, 251, 1)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280',
              }}
            >
              Balance
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#00ef8b',
                marginTop: '0.25rem',
              }}
            >
              {(Number(account.balance) / 1e8).toFixed(4)} FLOW
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

function UseFlowRevertibleRandomCardMini({ darkMode }: { darkMode: boolean }) {
  const {
    data: randomResults,
    isLoading,
    refetch,
  } = useFlowRevertibleRandom({
    max: '1000000000',
    count: 1,
  });

  return (
    <EnhancedCard
      title="useFlowRevertibleRandom"
      description="Generate pseudorandom numbers on-chain"
      darkMode={darkMode}
    >
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: isLoading ? '#9ca3af' : '#00ef8b',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Random'}
        </button>
        {randomResults && randomResults.length > 0 && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: darkMode
                ? 'rgba(17, 24, 39, 0.6)'
                : 'rgba(249, 250, 251, 1)',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              Random Value
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#00ef8b',
              }}
            >
              {randomResults[0].value}
            </div>
          </div>
        )}
      </div>
    </EnhancedCard>
  );
}

// Inner component with all the cards
function ReactSDKOverviewContent({ darkMode }: { darkMode: boolean }) {
  return (
    <div style={{ margin: '0' }}>
      <div
        style={{
          position: 'relative',
          marginBottom: '1.5rem',
          padding: '2.5rem 2rem',
          background: darkMode ? '#ffffff' : '#ffffff',
          border: darkMode
            ? '1px solid rgba(0, 0, 0, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '12px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            width: '16px',
            height: '16px',
            opacity: 0.15,
            color: '#000',
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <svg
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '16px',
            height: '16px',
            opacity: 0.15,
            color: '#000',
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <svg
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            width: '16px',
            height: '16px',
            opacity: 0.15,
            color: '#000',
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <svg
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '16px',
            height: '16px',
            opacity: 0.15,
            color: '#000',
          }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 5V19M5 12H19"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em',
          }}
        >
          Try components and hooks live
        </h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'rgba(107, 114, 128, 1)',
            marginBottom: '1.5rem',
            maxWidth: '500px',
            margin: '0 auto 1.5rem auto',
            lineHeight: '1.6',
          }}
        >
          Explore all React SDK features in our interactive playground with live
          examples and documentation
        </p>
        <a
          href="https://react.flow.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#00ef8b',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            border: 'none',
          }}
        >
          Open Playground →
        </a>
      </div>

      <MasonryGrid>
        <ConnectCardMini darkMode={darkMode} />
        <UseFlowRevertibleRandomCardMini darkMode={darkMode} />
        <TransactionLinkCardMini darkMode={darkMode} />
        <UseFlowCurrentUserCardMini darkMode={darkMode} />
        <TransactionButtonCardMini darkMode={darkMode} />
        <UseFlowChainIdCardMini darkMode={darkMode} />
        <UseFlowBlockCardMini darkMode={darkMode} />
        <UseFlowAccountCardMini darkMode={darkMode} />
        <TransactionDialogCardMini darkMode={darkMode} />
      </MasonryGrid>
    </div>
  );
}

// Main Overview Component wrapped with FlowProvider
export default function ReactSDKOverview(): React.ReactElement | null {
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();
  const darkMode = colorMode === 'dark';

  if (!isBrowser) return null;

  return (
    <FlowProvider flowClient={flowClient} colorMode={colorMode}>
      <ReactSDKOverviewContent darkMode={darkMode} />
    </FlowProvider>
  );
}
