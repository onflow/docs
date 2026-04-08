import React, { useState, useMemo, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { useColorMode } from '@docusaurus/theme-common';
import { FlowProvider, useFlowQuery, useFlowMutate, useFlowCurrentUser, TransactionDialog, Connect, useFlowTransactionStatus } from '@onflow/react-sdk';
import * as fcl from '@onflow/fcl';
import type { FlowNetwork } from '@onflow/react-sdk';
import { event } from '@site/src/utils/gtags.client';
import clsx from 'clsx';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';
import { Highlight, themes, Prism } from 'prism-react-renderer';
import '@site/src/utils/prism-cadence';

const ITEMS = [
  'Flow token account balance',
  'Account storage limit and usage',
  'Onchain counter current count',
  'Balance of custom token',
  'NBA Top Shot and NFL All Day',
  'Increment Counter Transaction',
  'Deposit FlowToken with TokenSink',
];

// Helper function to create flow clients for different networks
function createFlowClientForNetwork(network: 'mainnet' | 'testnet') {
  const storage = {
    can: fcl.LOCAL_STORAGE.can,
    get: (key: string) => fcl.LOCAL_STORAGE.get(`isolated-CURRENT-USER`),
    put: (key: string, value: string) => fcl.LOCAL_STORAGE.put(`isolated-CURRENT-USER`, value),
    removeItem: (key: string) => fcl.LOCAL_STORAGE.removeItem(`isolated-CURRENT-USER`),
  };

  return fcl.createFlowClient({
    accessNodeUrl: network === 'mainnet' 
      ? 'https://rest-mainnet.onflow.org'
      : 'https://rest-testnet.onflow.org',
    flowNetwork: network as FlowNetwork,
    appDetailTitle: 'Flow Dev Portal',
    appDetailIcon: 'https://avatars.githubusercontent.com/u/62387156?v=4',
    appDetailDescription: 'The developer portal for Flow Blockchain',
    discoveryWallet: `https://fcl-discovery.onflow.org/${network}/authn`,
    storage,
  });
}

// Cadence scripts and transactions
const SCRIPTS = [
  {
    type: 'script' as const,
    network: 'mainnet' as const,
    cadence: `import FungibleToken from 0xf233dcee88fe0abe

// Returns the balance of the stored Vault at
// the given address if exists, otherwise nil

access(all) fun main(address: Address): UFix64? {
    let path = StoragePath(identifier: "flowTokenVault")
    return getAuthAccount<auth(BorrowValue) &Account>(address)
        .storage.borrow<&{FungibleToken.Vault}>(
            from: path!
        )?.balance ?? nil
}`,
    args: (arg: any, t: any, address: string) => [arg(address, t.Address)],
    defaultArgs: { address: "0xfeb88a0fcc175a3d" },
    needsArgs: true,
    argLabels: { address: "Address" },
    editLink: 'https://run.dnz.dev/snippet/469ae98b6e5d1dea',
    formatResult: (data: any) => {
      if (data === null || data === undefined) {
        return { type: 'text', value: 'No balance found (nil)' };
      }
      const balance = typeof data === 'string' ? parseFloat(data) : data;
      return { type: 'text', value: `${balance} FLOW` };
    },
  },
  {
    type: 'script' as const,
    network: 'mainnet' as const,
    cadence: `// On Flow Cadence, account storage is limited
// by the amount of $FLOW held in that account.
// The below account has a low balance,
// so it only has 84 megabytes of storage space

access(all) fun main(address: Address): {String: UFix64} {
    let account = getAccount(address)
    let usedMB = UFix64(account.storage.used) / 1048576.0
    let capacityMB = UFix64(account.storage.capacity) / 1048576.0
    return {
        "usedMB": usedMB,
        "TotalCapacityMB": capacityMB
    }
}`,
    args: (arg: any, t: any, address: string) => [arg(address, t.Address)],
    defaultArgs: { address: "0xfeb88a0fcc175a3d" },
    needsArgs: true,
    argLabels: { address: "Address" },
    editLink: 'https://run.dnz.dev/snippet/71b994bc006b4283',
    formatResult: (data: any) => {
      if (!data || typeof data !== 'object') {
        return { type: 'text', value: 'Unable to retrieve storage information' };
      }
      // Convert to numbers in case they come as strings from the blockchain
      const usedMB = typeof data.usedMB === 'string' ? parseFloat(data.usedMB) : (data.usedMB || data['usedMB'] || 0);
      const capacityMB = typeof data.TotalCapacityMB === 'string' ? parseFloat(data.TotalCapacityMB) : (data.TotalCapacityMB || data['TotalCapacityMB'] || 0);
      const percentage = capacityMB > 0 ? ((usedMB / capacityMB) * 100).toFixed(2) : '0';
      return {
        type: 'storage',
        value: { usedMB, capacityMB, percentage },
      };
    },
  },
  {
    type: 'script' as const,
    network: 'testnet' as const,
    cadence: `import Counter from 0x8a4dce54554b225d

// Open in a new window to increment the counter: 
// https://run.dnz.dev/snippet/d4248ed6adf216f6

access(all)
fun main(): Int {
  return Counter.getCount()
}`,
    args: (arg: any, t: any) => [],
    defaultArgs: {},
    needsArgs: false,
    argLabels: {},
    editLink: 'https://run.dnz.dev/snippet/c15155239735ad60',
    formatResult: (data: any) => {
      const count = typeof data === 'string' ? parseInt(data, 10) : data;
      return { type: 'text', value: `Counter: ${count}` };
    },
  },
  {
    type: 'script' as const,
    network: 'testnet' as const,
    cadence: `import ExampleToken from 0x5f2584aba224bd39

access(all)
fun main(address: Address): String {
    let account = getAccount(address)
    let accountReceiverRef = account.capabilities.get<&{ExampleToken.Balance}>(ExampleToken.VaultPublicPath)
                            .borrow()
            ?? panic(ExampleToken.vaultNotConfiguredError(address: address))

    return("Balance for "
        .concat(address.toString())
        .concat(": ").concat(accountReceiverRef.balance.toString())
        )
}`,
    args: (arg: any, t: any, address: string) => [arg(address, t.Address)],
    defaultArgs: { address: "0x5f2584aba224bd39" },
    needsArgs: true,
    argLabels: { address: "Address" },
    editLink: 'https://run.dnz.dev/snippet/676ab2256fe87c8f',
    formatResult: (data: any) => {
      return { type: 'text', value: data || 'Unable to retrieve balance' };
    },
  },
  {
    type: 'script' as const,
    network: 'mainnet' as const,
    cadence: `import HybridCustody from 0xd8a7e05a7ac670c0
import NonFungibleToken from 0x1d7e57aa55817448
import MetadataViews from 0x1d7e57aa55817448

// This script iterates through a parent's child 
// accounts, identifies private paths with an 
// accessible NonFungibleToken.Provider, and
// returns the corresponding typeIds

access(all) fun main(addr: Address): AnyStruct {
  let manager = getAuthAccount<auth(Storage) &Account>(addr).storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
    ?? panic ("manager does not exist")

  var typeIdsWithProvider: {Address: [String]} = {}
  var nftViews: {Address: {UInt64: MetadataViews.Display}} = {}

  let providerType = Type<auth(NonFungibleToken.Withdraw) &{NonFungibleToken.Provider}>()
  let collectionType: Type = Type<@{NonFungibleToken.CollectionPublic}>()

  for address in manager.getChildAddresses() {
    let acct = getAuthAccount<auth(Storage, Capabilities) &Account>(address)
    let foundTypes: [String] = []
    let views: {UInt64: MetadataViews.Display} = {}
    let childAcct = manager.borrowAccount(addr: address) ?? panic("child account not found")

    // Iterate through storage paths to find NFTs that are controlled by the parent account
    // To just find NFTs, check if thing stored is nft collection and borrow it as NFT collection and get IDs
    for s in acct.storage.storagePaths {
      // Iterate through capabilities
      for c in acct.capabilities.storage.getControllers(forPath: s) {
        if !c.borrowType.isSubtype(of: providerType){
          // If this doen't have providerType, it's not an NFT collection
          continue
        }

        // We're dealing with a Collection but we need to check if accessible from the parent account
        if let cap: Capability = childAcct.getCapability(controllerID: c.capabilityID, type: providerType) { // Part 1
          let providerCap = cap as! Capability<&{NonFungibleToken.Provider}>

          if !providerCap.check(){
            // If I don't have access to control the account, skip it.
            // Disable this check to do something else.
            //
            continue
          }

          foundTypes.append(cap.borrow<&AnyResource>()!.getType().identifier)
          typeIdsWithProvider[address] = foundTypes
          // Don't need to keep looking at capabilities, we can control NFT from parent account
          break
        }
      }
    }

    // Iterate storage, check if typeIdsWithProvider contains the typeId, if so, add to views
    acct.storage.forEachStored(fun (path: StoragePath, type: Type): Bool {

      if typeIdsWithProvider[address] == nil {
        return true
      }

      for key in typeIdsWithProvider.keys {
        for idx, value in typeIdsWithProvider[key]! {
          let value = typeIdsWithProvider[key]!

          if value[idx] != type.identifier {
              continue
          } else {
            if type.isInstance(collectionType) {
              continue
            }
            if let collection = acct.storage.borrow<&{NonFungibleToken.CollectionPublic}>(from: path) {
              // Iterate over IDs & resolve the Display view
              for id in collection.getIDs() {
                let nft = collection.borrowNFT(id)!
                if let display = nft.resolveView(Type<MetadataViews.Display>())! as? MetadataViews.Display {
                  views.insert(key: id, display)
                }
              }
            }
            continue
          }
        }
      }
      return true
    })
    nftViews[address] = views
  }
  return nftViews
}`,
    args: (arg: any, t: any, address: string) => [arg(address, t.Address)],
    defaultArgs: { address: "0xfeb88a0fcc175a3d" },
    needsArgs: true,
    argLabels: { address: "Address" },
    editLink: 'https://run.dnz.dev/snippet/3797f91e245b787b',
    formatResult: (data: any) => {
      if (!data || typeof data !== 'object') {
        return { type: 'text', value: 'No NFTs found' };
      }
      return { type: 'nft', value: data };
    },
  },
  {
    type: 'transaction' as const,
    network: 'testnet' as const,
    cadence: `import Counter from 0x8a4dce54554b225d

transaction {
    prepare(acct: &Account) {
        // Authorizes the transaction
    }
    execute {
        // Increment the counter
        Counter.increment()
        // Retrieve the new count and log it
        let newCount = Counter.getCount()
        log("New count after incrementing: ".concat(newCount.toString()))
    }
}`,
    args: (arg: any, t: any) => [],
    defaultArgs: {},
    needsArgs: false,
    argLabels: {},
    editLink: 'https://run.dnz.dev/snippet/654cd61ea5bf4867',
    formatResult: (data: any) => {
      return { type: 'text', value: data || 'Transaction executed' };
    },
  },
  {
    type: 'transaction' as const,
    network: 'testnet' as const,
    cadence: `import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import DeFiActions from 0x4c2ff9dd03ab442f
import ExampleConnectors from 0xba129c479fefce07

/// Deposit FlowToken into a recipient's vault using ExampleConnectors.TokenSink
///
/// This transaction demonstrates:
/// - Creating a TokenSink pointing to a recipient's vault capability
/// - Withdrawing tokens from the signer's vault
/// - Depositing via the sink's depositCapacity method
///
/// @param recipient: Address of the account to receive tokens
/// @param amount: Amount of FlowToken to send

transaction(recipient: Address, amount: UFix64) {
    let senderVault: auth(FungibleToken.Withdraw) &FlowToken.Vault
    let sink: ExampleConnectors.TokenSink

    prepare(signer: auth(BorrowValue) &Account) {
        // Borrow the signer's FlowToken vault
        self.senderVault = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow FlowToken vault from signer")

        // Get a capability to the recipient's FlowToken receiver
        let recipientCap = getAccount(recipient)
            .capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)

        // Create a TokenSink that will deposit into the recipient's vault
        self.sink = ExampleConnectors.TokenSink(
            vault: recipientCap,
            uniqueID: nil
        )
    }

    execute {
        // Withdraw tokens from signer
        let tokens <- self.senderVault.withdraw(amount: amount)

        // Deposit via the sink
        self.sink.depositCapacity(
          from: &tokens as auth(FungibleToken.Withdraw) &{FungibleToken.Vault}
        )

        // Ensure everything was deposited
        assert(tokens.balance == 0.0, message: "Tokens remaining after deposit")

        destroy tokens
    }
}`,
    args: (arg: any, t: any, recipient: string, amount: string) => [
      arg(recipient, t.Address),
      arg(amount, t.UFix64),
    ],
    defaultArgs: { recipient: '0xa4c6ce4d423caef9', amount: '1.0' },
    needsArgs: true,
    argLabels: { recipient: 'Recipient', amount: 'Amount' },
    editLink: 'https://run.dnz.dev/snippet/1277a9654df00b56',
    formatResult: (data: any) => {
      return { type: 'text', value: data || 'Tokens deposited successfully' };
    },
  },
];

// Component that uses the hooks (must be inside FlowProvider)
function QuickStartShowcaseContent() {
  const [selected, setSelected] = useState(0);
  const { colorMode } = useColorMode();
  const isBrowser = useIsBrowser();
  
  // Initialize input values with defaults for each script
  const [inputValues, setInputValues] = useState<Record<number, Record<string, string>>>(() => {
    const initial: Record<number, Record<string, string>> = {};
    SCRIPTS.forEach((script, idx) => {
      const defaults = script.defaultArgs || {};
      initial[idx] = Object.keys(defaults).reduce((acc, key) => {
        acc[key] = defaults[key] || '';
        return acc;
      }, {} as Record<string, string>);
    });
    return initial;
  });

  const currentScript = SCRIPTS[selected];
  const currentInputs = inputValues[selected] || {};
  const { user, authenticate } = useFlowCurrentUser();

  // Create flow client for the current script's network
  const flowClientForScript = useMemo(() => {
    return createFlowClientForNetwork(currentScript.network);
  }, [currentScript.network]);

  // Use useFlowQuery for scripts
  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: currentScript.cadence,
    args: (arg: any, t: any) => {
      // Pass the input values to the args function
      if (currentScript.needsArgs) {
        // Handle multiple arguments based on what's available in currentInputs
        if (currentInputs.recipient && currentInputs.amount) {
          // Transactions with recipient and amount
          return (currentScript.args as (arg: any, t: any, recipient: string, amount: string) => any[])(arg, t, currentInputs.recipient, currentInputs.amount);
        } else if (currentInputs.address) {
          // Scripts that need args take address as third parameter
          return (currentScript.args as (arg: any, t: any, address: string) => any[])(arg, t, currentInputs.address);
        }
      }
      // Scripts that don't need args
      return (currentScript.args as (arg: any, t: any) => any[])(arg, t);
    },
    flowClient: flowClientForScript,
    query: {
      enabled: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0,
    },
  });

  // Use useFlowMutate for transactions
  const { mutate: executeTransaction, isPending: txPending, data: txId, error: txError } = useFlowMutate({
    flowClient: flowClientForScript,
    mutation: {
      onSuccess: (txId) => {
        event({
          action: GA_EVENTS.ACTION_CARD_CLICK,
          category: GA_CATEGORIES.ACTION_CARD,
          label: `Transaction executed: ${txId}`,
          location: true,
        });
      },
    },
  });

  // Fetch transaction status and result
  const { transactionStatus, error: txStatusError } = useFlowTransactionStatus({
    id: txId || undefined,
    flowClient: flowClientForScript,
  });

  const [showTxDialog, setShowTxDialog] = useState(false);
  const [lastShownTxId, setLastShownTxId] = useState<string | null>(null);

  const handleExecuteTransaction = async () => {
    // If not logged in, authentication will be handled by Connect component
    if (!user?.loggedIn) {
      return;
    }
    
    executeTransaction({
      cadence: currentScript.cadence,
      args: (arg: any, t: any) => {
        if (currentScript.needsArgs) {
          // Handle multiple arguments based on what's available in currentInputs
          if (currentInputs.recipient && currentInputs.amount) {
            // Transactions with recipient and amount
            return (currentScript.args as (arg: any, t: any, recipient: string, amount: string) => any[])(arg, t, currentInputs.recipient, currentInputs.amount);
          } else if (currentInputs.address) {
            // Scripts that need args take address as third parameter
            return (currentScript.args as (arg: any, t: any, address: string) => any[])(arg, t, currentInputs.address);
          }
        }
        return (currentScript.args as (arg: any, t: any) => any[])(arg, t);
      },
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser], // Need authorization for prepare(acct: &Account) block
      limit: 1000,
    });
  };

  // Show dialog only when we get a NEW transaction ID
  useEffect(() => {
    if (txId && txId !== lastShownTxId && currentScript.type === 'transaction') {
      setShowTxDialog(true);
      setLastShownTxId(txId);
    }
  }, [txId, currentScript, lastShownTxId]);

  const handleTabClick = (idx: number, item: string) => {
    setSelected(idx);
    
    // Initialize input values for this script if not already set
    if (!inputValues[idx]) {
      const defaults = SCRIPTS[idx].defaultArgs || {};
      setInputValues(prev => ({
        ...prev,
        [idx]: Object.keys(defaults).reduce((acc, key) => {
          acc[key] = defaults[key] || '';
          return acc;
        }, {} as Record<string, string>),
      }));
    }
    
    // Track analytics
    event({
      action: GA_EVENTS.ACTION_CARD_CLICK,
      category: GA_CATEGORIES.ACTION_CARD,
      label: item,
      location: true,
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues(prev => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        [key]: value,
      },
    }));
  };

  const formattedResult = data !== undefined ? currentScript.formatResult(data) : null;

  return (
    <section 
      className="container mx-auto pb-12 hidden lg:block"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Try Cadence live
        </h2>
      </div>
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch bg-white dark:bg-[#0d1117] rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-black/50"
      >
        {/* Left: Selector */}
        <div className="flex flex-col w-full items-center justify-center bg-gray-100 dark:bg-[#161b22] border-r-2 border-gray-200 dark:border-gray-700">
          <div className="w-full p-4 flex flex-col gap-1 h-[500px] justify-center overflow-y-auto" style={{ maxWidth: 320 }}>
            {ITEMS.map((item, idx) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTabClick(idx, item)}
                className={clsx(
                  "w-full text-left px-4 py-3 transition text-sm cursor-pointer rounded-lg border-none",
                  selected === idx
                    ? "bg-white dark:bg-[#00EF8B]/10 text-gray-900 dark:text-[#00EF8B] font-medium shadow-sm dark:shadow-none border-l-2 border-l-[#00EF8B]"
                    : "text-gray-600 dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
                )}
                style={{ outline: 'none' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Code + Results (spans 2 columns) */}
        <div className="lg:col-span-2 flex flex-col w-full h-[500px]">
          {/* Code Display */}
          <div className="flex-1 bg-gray-50 dark:bg-[#0d1117] overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Code Header */}
              <div className="px-4 py-2 bg-white dark:bg-[#161b22] border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {currentScript.type === 'transaction' ? 'Cadence Transaction' : 'Cadence Script'}
                  </span>
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded font-semibold",
                    currentScript.network === 'mainnet'
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  )}>
                    {currentScript.network === 'mainnet' ? 'Mainnet' : 'Testnet'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentScript.needsArgs && Object.keys(currentScript.argLabels).map((key) => (
                    <div key={key} className="flex items-center gap-1">
                      <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {currentScript.argLabels[key as keyof typeof currentScript.argLabels]}
                      </label>
                      <input
                        type="text"
                        value={currentInputs[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={currentScript.defaultArgs[key] || ''}
                        className={clsx(
                          "text-xs px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00EF8B] font-mono",
                          key === 'amount' ? 'w-16' : 'w-[140px]'
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    {currentScript.type === 'script' ? (
                      <button
                        onClick={async () => {
                          await refetch();
                        }}
                        disabled={isLoading}
                        className="text-xs px-4 py-1.5 bg-[#00EF8B] hover:bg-[#00D67D] text-black rounded-md font-medium border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                      >
                        {isLoading ? 'Running...' : 'Run Script'}
                      </button>
                    ) : (
                      // For transactions: show Sign In UI if not logged in, otherwise show Execute Transaction button
                      user?.loggedIn === true ? (
                        <button
                          onClick={handleExecuteTransaction}
                          disabled={txPending}
                          className="text-xs px-4 py-1.5 bg-[#00EF8B] hover:bg-[#00D67D] text-black rounded-md font-medium border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                        >
                          {txPending ? 'Executing...' : 'Execute'}
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await authenticate();
                          }}
                          className="text-xs px-4 py-1.5 bg-[#00EF8B] hover:bg-[#00D67D] text-black rounded-md font-medium border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                        >
                          Sign In
                        </button>
                      )
                    )}
                    {(currentScript as any).editLink && (
                      <button
                        onClick={() => window.open((currentScript as any).editLink, '_blank', 'noopener,noreferrer')}
                        className="text-xs px-4 py-1.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer border-none"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Code Content */}
              <div className="flex-1 overflow-auto p-4 bg-[#fafbfc] dark:bg-[#0d1117]">
                {isBrowser ? (
                  <Highlight
                    Prism={Prism}
                    theme={colorMode === 'dark' ? themes.vsDark : themes.vsLight}
                    code={currentScript.cadence}
                    language="cadence"
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={clsx(className, "text-xs font-mono")} style={{ ...style, background: 'transparent' }}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </pre>
                    )}
                  </Highlight>
                ) : (
                  <pre className="text-xs font-mono">
                    <code>{currentScript.cadence}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className={clsx(
            "h-48 border-t-2 border-gray-200 dark:border-gray-700",
            // Success state (has result)
            (formattedResult || (currentScript.type === 'transaction' && txId && !txError)) 
              ? "bg-[#f0fdf4] dark:bg-[#00EF8B]/5"
              // Error state
              : ((currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error))
                ? "bg-red-50 dark:bg-red-900/10"
                // Loading state
                : (isLoading || txPending)
                  ? "bg-blue-50 dark:bg-blue-900/10"
                  // Default/idle state
                  : "bg-gray-50 dark:bg-gray-800/30"
          )}>
            <div className="h-full flex flex-col">
              {/* Results Header */}
              <div className={clsx(
                "px-4 py-2 border-b flex items-center gap-2",
                // Success state
                (formattedResult || (currentScript.type === 'transaction' && txId && !txError))
                  ? "bg-[#dcfce7] dark:bg-[#00EF8B]/10 border-[#bbf7d0] dark:border-[#00EF8B]/20"
                  // Error state
                  : ((currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error))
                    ? "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    // Loading state
                    : (isLoading || txPending)
                      ? "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      // Default/idle state
                      : "bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
              )}>
                {/* Dynamic icon based on state */}
                {(formattedResult || (currentScript.type === 'transaction' && txId && !txError)) ? (
                  // Success checkmark
                  <svg className="w-4 h-4 text-green-600 dark:text-[#00EF8B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : ((currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error)) ? (
                  // Error icon
                  <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (isLoading || txPending) ? (
                  // Loading spinner
                  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  // Default terminal/console icon
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <span className={clsx(
                  "text-xs font-semibold",
                  (formattedResult || (currentScript.type === 'transaction' && txId && !txError))
                    ? "text-green-700 dark:text-[#00EF8B]"
                    : ((currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error))
                      ? "text-red-700 dark:text-red-400"
                      : (isLoading || txPending)
                        ? "text-blue-700 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400"
                )}>
                  {(formattedResult || (currentScript.type === 'transaction' && txId && !txError))
                    ? "Result"
                    : ((currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error))
                      ? "Error"
                      : (isLoading || txPending)
                        ? "Running..."
                        : "Output"
                  }
                </span>
              </div>
              
              {/* Results Content */}
              <div className="flex-1 overflow-auto p-4 bg-white/50 dark:bg-transparent">
                {(currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error) ? (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    <p className="font-semibold mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {currentScript.type === 'transaction' ? 'Transaction Error' : 'Error'}
                    </p>
                    <p className="font-mono text-xs whitespace-pre-wrap break-words">
                      {(() => {
                        const err = currentScript.type === 'transaction' ? txError : error;
                        // Try to extract error message from various error formats
                        if (err?.message) return err.message;
                        if (typeof err === 'string') return err;
                        if (err?.toString) return err.toString();
                        return currentScript.type === 'transaction' ? 'Failed to execute transaction' : 'Failed to execute script';
                      })()}
                    </p>
                    {(() => {
                      const err = currentScript.type === 'transaction' ? txError : error;
                      const errAny = err as any;
                      return err?.stack || errAny?.cause?.message || (errAny?.cause && String(errAny.cause)) ? (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">Show details</summary>
                          <pre className="text-xs mt-1 p-2 bg-red-100 dark:bg-red-900/30 rounded overflow-auto whitespace-pre-wrap break-words">
                            {err?.stack || errAny?.cause?.message || (errAny?.cause && String(errAny.cause)) || JSON.stringify(err, null, 2)}
                          </pre>
                        </details>
                      ) : null;
                    })()}
                  </div>
                ) : isLoading || txPending ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00EF8B] mx-auto mb-3"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentScript.type === 'transaction' ? 'Executing transaction...' : 'Executing script...'}
                      </p>
                    </div>
                  </div>
                ) : currentScript.type === 'transaction' ? (
                  <div className="text-sm">
                    {!user?.loggedIn ? (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Connect your wallet to execute this transaction</span>
                      </div>
                    ) : txId ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">TX ID</span>
                          <span className="font-mono text-xs text-gray-800 dark:text-gray-200 break-all bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{txId}</span>
                        </div>
                        {transactionStatus && (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Status</span>
                              <span className={clsx(
                                "font-mono text-xs px-2 py-1 rounded-full",
                                transactionStatus.status === 4 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                transactionStatus.status === 5 ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                                transactionStatus.status === 3 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                                transactionStatus.status === 2 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                                "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                              )}>
                                {transactionStatus.status === 4 ? "Sealed" :
                                 transactionStatus.status === 5 ? "Expired" :
                                 transactionStatus.status === 3 ? "Executed" :
                                 transactionStatus.status === 2 ? "Finalized" :
                                 transactionStatus.status === 1 ? "Pending" : "Unknown"}
                              </span>
                            </div>
                            {(transactionStatus.status === 2 || transactionStatus.status === 3 || transactionStatus.status === 4 || transactionStatus.status === 5) && transactionStatus.statusCode !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Execution</span>
                                <span className={clsx(
                                  "font-mono text-xs px-2 py-1 rounded-full",
                                  transactionStatus.statusCode === 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                )}>
                                  {transactionStatus.statusCode === 0 ? "Success" : "Failed"}
                                </span>
                              </div>
                            )}
                            {(transactionStatus.status === 2 || transactionStatus.status === 3 || transactionStatus.status === 4 || transactionStatus.status === 5) && transactionStatus.events && transactionStatus.events.length > 0 && (
                              <div className="space-y-2 mt-2">
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Events ({transactionStatus.events.length})</div>
                                <div className="font-mono text-xs space-y-1 max-h-32 overflow-auto">
                                  {transactionStatus.events.map((event: any, idx: number) => (
                                    <div key={idx} className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                                      <div className="text-blue-800 dark:text-blue-300 break-all">{event.type}</div>
                                      {event.payload && (
                                        <div className="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap break-words">
                                          {typeof event.payload === 'string' ? event.payload : JSON.stringify(event.payload, null, 2)}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {transactionStatus.errorMessage && (
                              <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-2 border border-red-200 dark:border-red-800 mt-2">
                                <p className="font-semibold mb-1 text-xs">Error:</p>
                                <p className="font-mono text-xs whitespace-pre-wrap break-words">{transactionStatus.errorMessage}</p>
                              </div>
                            )}
                          </>
                        )}
                        {txStatusError && (
                          <div className="text-red-600 dark:text-red-400 text-xs bg-red-50 dark:bg-red-900/20 rounded p-2">
                            Error fetching transaction status: {txStatusError.message}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <svg className="w-5 h-5 text-[#00EF8B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>Click "Execute" to run this transaction</span>
                      </div>
                    )}
                  </div>
                ) : formattedResult ? (
                  <div className="text-sm">
                    {formattedResult.type === 'text' && (
                      <p className="font-mono text-gray-800 dark:text-[#00EF8B] bg-gray-100 dark:bg-[#00EF8B]/10 px-3 py-2 rounded-lg inline-block">{formattedResult.value}</p>
                    )}
                    {formattedResult.type === 'storage' && (
                      <div className="space-y-3 max-w-xs">
                        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Used</span>
                          <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                            {(typeof formattedResult.value.usedMB === 'number' 
                              ? formattedResult.value.usedMB 
                              : parseFloat(formattedResult.value.usedMB) || 0
                            ).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-lg">
                          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">Capacity</span>
                          <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                            {(typeof formattedResult.value.capacityMB === 'number' 
                              ? formattedResult.value.capacityMB 
                              : parseFloat(formattedResult.value.capacityMB) || 0
                            ).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                    )}
                    {formattedResult.type === 'nft' && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">NFT Collections by Address</p>
                        <div className="font-mono text-xs max-h-32 overflow-auto">
                          {Object.keys(formattedResult.value).length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No NFTs found</p>
                          ) : (
                            Object.entries(formattedResult.value).map(([address, nfts]: [string, any]) => (
                              <div key={address} className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">{address}</p>
                                {nfts && typeof nfts === 'object' && Object.keys(nfts).length > 0 ? (
                                  <div className="space-y-1">
                                    {Object.entries(nfts).map(([id, display]: [string, any]) => (
                                      <div key={id} className="text-xs pl-2 border-l-2 border-blue-300 dark:border-blue-600">
                                        <span className="text-gray-600 dark:text-gray-400">ID: {id}</span>
                                        {display && typeof display === 'object' && display.name && (
                                          <span className="ml-2 text-gray-800 dark:text-gray-200">
                                            - {display.name}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">No NFTs in this collection</p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5 text-[#00EF8B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Click "Run Script" to see result</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Made with React SDK attribution */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Made with{' '}
          <a
            href="/build/tools/react-sdk"
            className="text-[#00EF8B] hover:text-[#00D67D] font-medium no-underline hover:underline"
          >
            React SDK
          </a>
        </span>
      </div>
      
      {/* Transaction Dialog */}
      <TransactionDialog
        open={showTxDialog}
        onOpenChange={setShowTxDialog}
        txId={txId || undefined}
        pendingTitle="Executing Transaction..."
        pendingDescription="Please wait while your transaction is being processed"
        successTitle="Transaction Successful!"
        successDescription="Your transaction has been successfully executed on the blockchain"
        closeOnSuccess
      />
    </section>
  );
}

// Main component with FlowProvider wrapper
// Note: We use a default flowClient for the provider, but individual queries use their own clients
const QuickStartShowcase: React.FC = () => {
  const isBrowser = useIsBrowser();
  const { colorMode } = useColorMode();

  // Create a default flow client (testnet) for the provider
  // Only create on browser to avoid SSR issues
  const defaultFlowClient = useMemo(() => {
    if (!isBrowser) return null;
    return createFlowClientForNetwork('testnet');
  }, [isBrowser]);

  if (!isBrowser || !defaultFlowClient) return null;

  return (
    <FlowProvider flowClient={defaultFlowClient} colorMode={colorMode}>
      <QuickStartShowcaseContent />
    </FlowProvider>
  );
};

export default QuickStartShowcase;
