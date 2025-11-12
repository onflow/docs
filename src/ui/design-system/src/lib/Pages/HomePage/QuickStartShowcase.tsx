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
  const { user } = useFlowCurrentUser();

  // Create flow client for the current script's network
  const flowClientForScript = useMemo(() => {
    return createFlowClientForNetwork(currentScript.network);
  }, [currentScript.network]);

  // Use useFlowQuery for scripts
  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: currentScript.cadence,
    args: (arg: any, t: any) => {
      // Pass the input values to the args function
      if (currentScript.needsArgs && currentInputs.address) {
        // Scripts that need args take address as third parameter
        return (currentScript.args as (arg: any, t: any, address: string) => any[])(arg, t, currentInputs.address);
      }
      // Scripts that don't need args
      return (currentScript.args as (arg: any, t: any) => any[])(arg, t);
    },
    flowClient: flowClientForScript,
    query: {
      enabled: currentScript.type === 'script',
      refetchOnWindowFocus: false,
      retry: 1,
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

  const handleExecuteTransaction = async () => {
    // If not logged in, authentication will be handled by Connect component
    if (!user?.loggedIn) {
      return;
    }
    
    executeTransaction({
      cadence: currentScript.cadence,
      args: (arg: any, t: any) => {
        if (currentScript.needsArgs && currentInputs.address) {
          return (currentScript.args as (arg: any, t: any, address: string) => any[])(arg, t, currentInputs.address);
        }
        return (currentScript.args as (arg: any, t: any) => any[])(arg, t);
      },
      proposer: fcl.currentUser,
      payer: fcl.currentUser,
      authorizations: [fcl.currentUser], // Need authorization for prepare(acct: &Account) block
      limit: 1000,
    });
  };

  // Show dialog when transaction ID is available
  useEffect(() => {
    if (txId && currentScript.type === 'transaction') {
      setShowTxDialog(true);
    }
  }, [txId, currentScript]);

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
      className="container mx-auto pt-1 pb-8 hidden lg:block"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Try Cadence Live
        </h2>
      </div>
      <div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-stretch bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Left: Selector */}
        <div className="flex flex-col w-full items-center justify-center bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
          <div className="w-full p-4 flex flex-col gap-3 h-[500px] justify-center overflow-y-auto" style={{ maxWidth: 320 }}>
            {ITEMS.map((item, idx) => (
              <button
                key={item}
                type="button"
                onClick={() => handleTabClick(idx, item)}
                className={clsx(
                  "w-full text-left px-4 py-3 transition font-medium text-base cursor-pointer hover:bg-white/50 dark:hover:bg-gray-900/50 rounded-lg",
                  selected === idx
                    ? "bg-white dark:bg-gray-900 rounded-xl shadow-sm text-green-600 dark:text-green-400 font-bold"
                    : "text-gray-900 dark:text-gray-100 bg-transparent"
                )}
                style={{ outline: 'none', border: 'none' }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Code + Results (spans 2 columns) */}
        <div className="lg:col-span-2 flex flex-col w-full h-[500px]">
          {/* Code Display */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Code Header */}
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
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
                <div className="flex items-center gap-2">
                  {currentScript.needsArgs && Object.keys(currentScript.argLabels).map((key) => (
                    <div key={key} className="flex items-center gap-1">
                      <label className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {currentScript.argLabels[key as keyof typeof currentScript.argLabels]}:
                      </label>
                      <input
                        type="text"
                        value={currentInputs[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={currentScript.defaultArgs[key] || ''}
                        className="text-xs px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 font-mono"
                      />
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    {currentScript.type === 'script' ? (
                      <button
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="text-xs px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md font-medium border-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                      >
                        {isLoading ? 'Running...' : 'Run Script'}
                      </button>
                    ) : (
                      // For transactions: show Sign In UI if not logged in, otherwise show Execute Transaction button
                      user?.loggedIn === true ? (
                        <button
                          onClick={handleExecuteTransaction}
                          disabled={txPending}
                          className="text-xs px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md font-medium border-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
                        >
                          {txPending ? 'Executing...' : 'Execute Transaction'}
                        </button>
                      ) : (
                        <Connect 
                          variant="primary"
                          onConnect={() => {
                            // After connection, the user state will update and we can execute
                          }}
                        />
                      )
                    )}
                    {(currentScript as any).editLink && (
                      <button
                        onClick={() => window.open((currentScript as any).editLink, '_blank', 'noopener,noreferrer')}
                        className="text-xs px-4 py-2 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full border border-purple-500 dark:border-purple-400 font-medium whitespace-nowrap transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Code Content */}
              <div className="flex-1 overflow-auto p-4">
                {isBrowser ? (
                  <Highlight
                    Prism={Prism}
                    theme={colorMode === 'dark' ? themes.vsDark : themes.vsLight}
                    code={currentScript.cadence}
                    language="cadence"
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre className={clsx(className, "text-xs font-mono")} style={style}>
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
          <div className="h-48 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="h-full flex flex-col">
              {/* Results Header */}
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Result</span>
              </div>
              
              {/* Results Content */}
              <div className="flex-1 overflow-auto p-4">
                {(currentScript.type === 'transaction' && txError) || (currentScript.type === 'script' && error) ? (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    <p className="font-semibold mb-1">
                      {currentScript.type === 'transaction' ? 'Transaction Error:' : 'Error:'}
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
                          <summary className="text-xs cursor-pointer text-red-500 dark:text-red-400">Show details</summary>
                          <pre className="text-xs mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded overflow-auto whitespace-pre-wrap break-words">
                            {err?.stack || errAny?.cause?.message || (errAny?.cause && String(errAny.cause)) || JSON.stringify(err, null, 2)}
                          </pre>
                        </details>
                      ) : null;
                    })()}
                  </div>
                ) : isLoading || txPending ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentScript.type === 'transaction' ? 'Executing transaction...' : 'Executing script...'}
                      </p>
                    </div>
                  </div>
                ) : currentScript.type === 'transaction' ? (
                  <div className="text-sm">
                    {!user?.loggedIn ? (
                      <p className="text-gray-500 dark:text-gray-400">Connect your wallet to execute this transaction</p>
                    ) : txId ? (
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Transaction ID: </span>
                          <span className="font-mono text-gray-800 dark:text-gray-200 break-all">{txId}</span>
                        </div>
                        {transactionStatus && (
                          <>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Status: </span>
                              <span className={clsx(
                                "font-mono",
                                transactionStatus.status === 4 ? "text-green-600 dark:text-green-400" :
                                transactionStatus.status === 5 ? "text-red-600 dark:text-red-400" :
                                transactionStatus.status === 3 ? "text-green-600 dark:text-green-400" :
                                transactionStatus.status === 2 ? "text-blue-600 dark:text-blue-400" :
                                "text-yellow-600 dark:text-yellow-400"
                              )}>
                                {transactionStatus.status === 4 ? "Sealed" :
                                 transactionStatus.status === 5 ? "Expired" :
                                 transactionStatus.status === 3 ? "Executed" :
                                 transactionStatus.status === 2 ? "Finalized" :
                                 transactionStatus.status === 1 ? "Pending" : "Unknown"}
                              </span>
                            </div>
                            {(transactionStatus.status === 2 || transactionStatus.status === 3 || transactionStatus.status === 4 || transactionStatus.status === 5) && transactionStatus.statusCode !== undefined && (
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">Execution: </span>
                                <span className={clsx(
                                  "font-mono",
                                  transactionStatus.statusCode === 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {transactionStatus.statusCode === 0 ? "Success" : "Failed"}
                                </span>
                              </div>
                            )}
                            {(transactionStatus.status === 2 || transactionStatus.status === 3 || transactionStatus.status === 4 || transactionStatus.status === 5) && transactionStatus.events && transactionStatus.events.length > 0 && (
                              <div className="space-y-2">
                                <div className="text-gray-600 dark:text-gray-400">Events ({transactionStatus.events.length}):</div>
                                <div className="font-mono text-xs space-y-1 max-h-32 overflow-auto">
                                  {transactionStatus.events.map((event: any, idx: number) => (
                                    <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                      <div className="text-gray-800 dark:text-gray-200 break-all">{event.type}</div>
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
                              <div className="text-red-600 dark:text-red-400">
                                <p className="font-semibold mb-1">Error:</p>
                                <p className="font-mono text-xs whitespace-pre-wrap break-words">{transactionStatus.errorMessage}</p>
                              </div>
                            )}
                          </>
                        )}
                        {txStatusError && (
                          <div className="text-red-600 dark:text-red-400 text-xs">
                            Error fetching transaction status: {txStatusError.message}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">Click "Execute Transaction" to run this transaction</p>
                    )}
                  </div>
                ) : formattedResult ? (
                  <div className="text-sm">
                    {formattedResult.type === 'text' && (
                      <p className="font-mono text-gray-800 dark:text-gray-200">{formattedResult.value}</p>
                    )}
                    {formattedResult.type === 'storage' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Used:</span>
                          <span className="font-mono font-semibold">
                            {(typeof formattedResult.value.usedMB === 'number' 
                              ? formattedResult.value.usedMB 
                              : parseFloat(formattedResult.value.usedMB) || 0
                            ).toFixed(2)} MB
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                          <span className="font-mono font-semibold">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">NFT Collections by Address:</p>
                        <div className="font-mono text-xs max-h-32 overflow-auto">
                          {Object.keys(formattedResult.value).length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No NFTs found</p>
                          ) : (
                            Object.entries(formattedResult.value).map(([address, nfts]: [string, any]) => (
                              <div key={address} className="mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">{address}</p>
                                {nfts && typeof nfts === 'object' && Object.keys(nfts).length > 0 ? (
                                  <div className="space-y-1">
                                    {Object.entries(nfts).map(([id, display]: [string, any]) => (
                                      <div key={id} className="text-xs pl-2 border-l-2 border-gray-300 dark:border-gray-600">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">No result yet. Click "Run Script" to execute.</p>
                )}
              </div>
            </div>
          </div>
        </div>
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
