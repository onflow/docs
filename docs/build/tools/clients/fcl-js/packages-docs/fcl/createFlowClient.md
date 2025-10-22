---
title: "createFlowClient"
description: "createFlowClient function documentation."
---

<!-- THIS DOCUMENT IS AUTO-GENERATED FROM [onflow/fcl/src/client.ts](https://github.com/onflow/fcl-js/tree/master/packages/fcl/src/client.ts). DO NOT EDIT MANUALLY -->

# createFlowClient

Creates a Flow client instance with authentication, transaction, and query capabilities.

## Import

You can import the entire package and access the function:

```typescript
import * as fcl from "@onflow/fcl"

fcl.createFlowClient(params)
```

Or import directly the specific function:

```typescript
import { createFlowClient } from "@onflow/fcl"

createFlowClient(params)
```


## Parameters

### `params` 


- Type: 
```typescript
export interface FlowClientConfig {
  accessNodeUrl: string 
  flowNetwork?: string
  flowJson?: any
  discoveryWallet?: string
  discoveryWalletMethod?: string
  discoveryAuthnEndpoint?: string
  discoveryAuthnInclude?: string[]
  walletconnectProjectId?: string
  walletconnectDisableNotifications?: boolean
  storage?: StorageProvider
  appDetailTitle?: string
  appDetailIcon?: string
  appDetailDescription?: string
  appDetailUrl?: string
  serviceOpenIdScopes?: string[]
  transport?: SdkTransport
  computeLimit?: number
  customResolver?: any
  customDecoders?: any
}
```
- Description: Configuration object for the Flow client


## Returns

```typescript
{
  send: (args?: false | InteractionBuilderFn | (false | InteractionBuilderFn)[], opts?: any) => Promise<any>;
  subscribe: <T extends SubscriptionTopic>({
  topic, args, onData, onError
}: SubscribeParams<T>, opts?: {
  node?: string;
  transport?: SdkTransport;
}) => Subscription;
  subscribeRaw: <T extends SubscriptionTopic>({
  topic, args, onData, onError
}: SubscribeRawParams<T>, opts?: {
  node?: string;
  transport?: SdkTransport;
}) => {
  unsubscribe: () => void;
};
  account: (address: string, {
  height, id, isSealed
}?: AccountQueryOptions, opts?: object) => Promise<Account>;
  block: ({
  sealed, id, height
}?: BlockQueryOptions, opts?: object) => Promise<Block>;
  resolve: (ix: Interaction) => Promise<Interaction>;
  decode: (response: any) => Promise<any>;
  currentUser: CurrentUserServiceApi;
  mutate: (opts?: MutateOptions) => Promise<string>;
  query: (opts?: QueryOptions) => Promise<any>;
  queryRaw: (opts?: QueryOptions) => Promise<any>;
  verifyUserSignatures: (message: string, compSigs: CompositeSignature[], opts?: VerifySignaturesScriptOptions) => Promise<boolean>;
  getChainId: (opts?: GetChainIdOptions) => Promise<string>;
  tx: {
  (transactionId: string, opts?: {
  pollRate?: number;
  txNotFoundTimeout?: number;
}): {
  snapshot: () => Promise<TransactionStatus>;
  subscribe: (onData: (txStatus: TransactionStatus) => void, onError?: (err: Error) => void) => () => void;
  onceFinalized: () => Promise<TransactionStatus>;
  onceExecuted: () => Promise<TransactionStatus>;
  onceSealed: () => Promise<TransactionStatus>;
};
  isUnknown: (ix: Interaction) => boolean;
  isPending: (tx: TransactionStatus) => boolean;
  isFinalized: (tx: TransactionStatus) => boolean;
  isExecuted: (tx: TransactionStatus) => boolean;
  isSealed: (tx: TransactionStatus) => boolean;
  isExpired: (tx: TransactionStatus) => boolean;
};
  events: (filterOrType?: string | EventFilter) => {
  subscribe: (onData: (event: Event) => void, onError?: (error: Error) => void) => () => void;
};
  authenticate: (opts?: AuthenticationOptions) => Promise<CurrentUser>;
  unauthenticate: () => void;
  signUserMessage: (msg: string) => Promise<CompositeSignature[]>;
  serialize: (args: (false | InteractionBuilderFn)[] | Interaction, opts?: SerializeOptions) => Promise<string>;
}
```


A Flow client object with many methods for interacting with the Flow blockchain

---