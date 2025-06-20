---
sidebar_label: FCL Reference
sidebar_position: 2
---

# Flow Client Library (FCL) API Reference

> For release updates, [see the repo](https://github.com/onflow/fcl-js/releases)

## Configuration

FCL has a mechanism that lets you configure various aspects of FCL. When you move from one instance of the Flow Blockchain to another (Local Emulator to Testnet to Mainnet) the only thing you should need to change for your FCL implementation is your configuration.

---

### Setting Configuration Values

Values only need to be set once. We recommend doing this once and as early in the life cycle as possible. To set a configuration value, the `put` method on the `config` instance needs to be called, the `put` method returns the `config` instance so they can be chained.

Alternatively, you can set the config by passing a JSON object directly.

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config() // returns the config instance
  .put('foo', 'bar') // configures "foo" to be "bar"
  .put('baz', 'buz'); // configures "baz" to be "buz"

// OR

fcl.config({
  foo: 'bar',
  baz: 'buz',
});
```

### Getting Configuration Values

The `config` instance has an **asynchronous** `get` method. You can also pass it a fallback value.

```javascript
import * as fcl from '@onflow/fcl';

fcl.config().put('foo', 'bar').put('woot', 5).put('rawr', 7);

const FALLBACK = 1;

async function addStuff() {
  var woot = await fcl.config().get('woot', FALLBACK); // will be 5 -- set in the config before
  var rawr = await fcl.config().get('rawr', FALLBACK); // will be 7 -- set in the config before
  var hmmm = await fcl.config().get('hmmm', FALLBACK); // will be 1 -- uses fallback because this isnt in the config

  return woot + rawr + hmmm;
}

addStuff().then((d) => console.log(d)); // 13 (5 + 7 + 1)
```

### Common Configuration Keys

| Name                                 | Example                                                       | Description                                                                                                                                                             |
| ------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessNode.api` **(required)**      | `https://rest-testnet.onflow.org`                             | API URL for the Flow Blockchain Access Node you want to be communicating with. See all available access node endpoints [here](https://developers.onflow.org/http-api/). |
| `app.detail.title`                   | `Cryptokitties`                                               | Your applications title, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                       |
| `app.detail.icon`                    | `https://fcl-discovery.onflow.org/images/blocto.png`          | Url for your applications icon, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                |
| `app.detail.description`             | `Cryptokitties is a blockchain game`                          | Your applications description, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                 |
| `app.detail.url`                     | `https://cryptokitties.co`                                    | Your applications url, can be requested by wallets and other services. Used by WalletConnect plugin & Wallet Discovery service.                                         |
| `challenge.handshake`                | **DEPRECATED**                                                | Use `discovery.wallet` instead.                                                                                                                                         |
| `discovery.authn.endpoint`           | `https://fcl-discovery.onflow.org/api/testnet/authn`          | Endpoint for alternative configurable Wallet Discovery mechanism. Read more on [discovery](#discovery)                                                                  |
| `discovery.wallet` **(required)**    | `https://fcl-discovery.onflow.org/testnet/authn`              | Points FCL at the Wallet or Wallet Discovery mechanism.                                                                                                                 |
| `discovery.wallet.method`            | `IFRAME/RPC`, `POP/RPC`, `TAB/RPC`, `HTTP/POST`, or `EXT/RPC` | Describes which service strategy a wallet should use.                                                                                                                   |
| `fcl.limit`                          | `100`                                                         | Specifies fallback compute limit if not provided in transaction. Provided as integer.                                                                                   |
| `flow.network` **(recommended)**     | `testnet`                                                     | Used in conjunction with stored interactions and provides FCLCryptoContract address for `testnet` and `mainnet`. Possible values: `local`, `testnet`, `mainnet`.        |
| `walletconnect.projectId`            | `YOUR_PROJECT_ID`                                             | Your app's WalletConnect project ID. See [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in) to obtain a project ID for your application.                    |
| `walletconnect.disableNotifications` | `false`                                                       | Optional flag to disable pending WalletConnect request notifications within the application's UI.                                                                       |

## Using Contracts in Scripts and Transactions

### Address Replacement

Configuration keys that start with `0x` will be replaced in FCL scripts and transactions, this allows you to write your script or transaction Cadence code once and not have to change it when you point your application at a difference instance of the Flow Blockchain.

```javascript
import * as fcl from '@onflow/fcl';

fcl.config().put('0xFungibleToken', '0xf233dcee88fe0abe');

async function myScript() {
  return fcl
    .send([
      fcl.script`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      access(all) fun main() { /* Rest of the script goes here */ }
    `,
    ])
    .then(fcl.decode);
}

async function myTransaction() {
  return fcl
    .send([
      fcl.transaction`
      import FungibleToken from 0xFungibleToken // will be replaced with 0xf233dcee88fe0abe because of the configuration

      transaction { /* Rest of the transaction goes here */ }
    `,
    ])
    .then(fcl.decode);
}
```

#### Example

```javascript
import * as fcl from '@onflow/fcl';

fcl
  .config()
  .put('flow.network', 'testnet')
  .put('walletconnect.projectId', 'YOUR_PROJECT_ID')
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')
  .put('app.detail.title', 'Test Harness')
  .put('app.detail.icon', 'https://i.imgur.com/r23Zhvu.png')
  .put('app.detail.description', 'A test harness for FCL')
  .put('app.detail.url', 'https://myapp.com')
  .put('service.OpenID.scopes', 'email email_verified name zoneinfo')
  .put('0xFlowToken', '0x7e60df042a9c0868');
```

### Using `flow.json` for Contract Imports

A simpler and more flexible way to manage contract imports in scripts and transactions is by using the `config.load` method in FCL. This lets you load contract configurations from a `flow.json` file, keeping your import syntax clean and allowing FCL to pick the correct contract addresses based on the network you're using.

### Setting Up

#### 1. Define Your Contracts in `flow.json`

Here’s an example of a `flow.json` file with aliases for multiple networks:

```json
{
  "contracts": {
    "HelloWorld": {
      "source": "./cadence/contracts/HelloWorld.cdc",
      "aliases": {
        "testnet": "0x1cf0e2f2f715450",
        "mainnet": "0xf8d6e0586b0a20c7"
      }
    }
  }
}
```

- **`source`**: Points to the contract file in your project.
- **`aliases`**: Maps each network to the correct contract address.

#### 2. Configure FCL

Load the `flow.json` file and set up FCL to use it:

```javascript
import { config } from '@onflow/fcl';
import flowJSON from '../flow.json';

config({
  'flow.network': 'testnet', // Choose your network, e.g., testnet or mainnet
  'accessNode.api': 'https://rest-testnet.onflow.org', // Access node for the network
  'discovery.wallet': `https://fcl-discovery.onflow.org/testnet/authn`, // Wallet discovery
}).load({ flowJSON });
```

With this setup, FCL will automatically use the correct contract address based on the selected network (e.g., `testnet` or `mainnet`).

#### 3. Use Contract Names in Scripts and Transactions

After setting up `flow.json`, you can import contracts by name in your Cadence scripts or transactions:

```cadence
import "HelloWorld"

access(all) fun main(): String {
    return HelloWorld.sayHello()
}
```

FCL replaces `"HelloWorld"` with the correct address from the `flow.json` configuration.

> **Note**: Don’t store private keys in your `flow.json`. Instead, use the [key/location syntax](../../../tools/flow-cli/flow.json/security.md) to keep sensitive keys in a separate, `.gitignore`-protected file.

## Wallet Interactions

These methods allows dapps to interact with FCL compatible wallets in order to authenticate the user and authorize transactions on their behalf.

> ⚠️These methods are **async**.

---

### `authenticate`

> ⚠️**This method can only be used in web browsers.**

Calling this method will authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to authenticate with. Once the wallet provider has authenticated the user, FCL will set the values on the [current user](#currentuserobject) object for future use and authorization.

#### Note

⚠️`discovery.wallet` value **must** be set in the configuration before calling this method. See [FCL Configuration](#configuration).

📣 The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
fcl
  .config()
  .put('accessNode.api', 'https://rest-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
// anywhere on the page
fcl.authenticate();
```

#### Note

⚠️ `authenticate` can also take a service returned from [discovery](#discovery) with `fcl.authenticate({ service })`.

---

### `unauthenticate`

> ⚠️**This method can only be used in web browsers.**

Logs out the current user and sets the values on the [current user](#currentuserobject) object to null.

#### Note

⚠️The current user must be authenticated first.

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org');
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.unauthenticate();
// fcl.currentUser.loggedIn === null
```

---

### `reauthenticate`

> ⚠️**This method can only be used in web browsers.**

A **convenience method** that calls [`fcl.unauthenticate()`](#unauthenticate) and then [`fcl.authenticate()`](#authenticate) for the current user.

#### Note

⚠️The current user must be authenticated first.

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
// first authenticate to set current user
fcl.authenticate();
// ... somewhere else & sometime later
fcl.reauthenticate();
// logs out user and opens up login/sign-up flow
```

---

### `signUp`

> ⚠️**This method can only be used in web browsers.**

A **convenience method** that calls and is equivalent to [`fcl.authenticate()`](#authenticate).

---

### `logIn`

> ⚠️**This method can only be used in web browsers.**

A **convenience method** that calls and is equivalent to [`fcl.authenticate()`](#authenticate).

---

### `authz`

A **convenience method** that produces the needed authorization details for the current user to submit transactions to Flow. It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.

> 📣 You can replace this function with your own [authorization function](#authorization-function) if needed.

#### Returns

| Type                                        | Description                                                                                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| [AuthorizationObject](#authorizationobject) | An object containing the necessary details from the current user to authorize a transaction in any role. |

#### Usage

**Note:** The default values for `proposer`, `payer`, and `authorizations` are already `fcl.authz` so there is no need to include these parameters, it is shown only for example purposes. See more on [signing roles](../../../build/basics/transactions.md).

```javascript
import * as fcl from '@onflow/fcl';
// login somewhere before
fcl.authenticate();
// once logged in authz will produce values
console.log(fcl.authz);
// prints {addr, signingFunction, keyId, sequenceNum} from the current authenticated user.

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: auth(BorrowValue) &Account) {
        account.storage.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg('myName', t.String)],
  proposer: fcl.authz, // optional - default is fcl.authz
  payer: fcl.authz, // optional - default is fcl.authz
  authorizations: [fcl.authz], // optional - default is [fcl.authz]
});
```

---

## Current User

Holds the [current user](#currentuserobject), if set, and offers a set of functions to manage the authentication and authorization of the user.

> ⚠️**The following methods can only be used in web browsers.**

---

### `currentUser.subscribe`

The callback passed to subscribe will be called when the user authenticates and un-authenticates, making it easy to update the UI accordingly.

#### Arguments

| Name       | Type     |                                                                                                                                        |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `callback` | function | The callback will be called with the [current user](#currentuserobject) as the first argument when the current user is set or removed. |

#### Usage

```javascript
import React, { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

export function AuthCluster() {
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser.subscribe(setUser), []); // sets the callback for FCL to use

  if (user.loggedIn) {
    return (
      <div>
        <span>{user?.addr ?? 'No Address'}</span>
        <button onClick={fcl.unauthenticate}>Log Out</button> {/* once logged out in setUser(user) will be called */}
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>{' '}
        {/* once logged in setUser(user) will be called */}
        <button onClick={fcl.signUp}>Sign Up</button> {/* once signed up, setUser(user) will be called */}
      </div>
    );
  }
}
```

---

### `currentUser.snapshot`

Returns the [current user](#currentuserobject) object. This is the same object that is set and available on [`fcl.currentUser.subscribe(callback)`](#currentusersubscribe).

#### Usage

```javascript
// returns the current user object
const user = fcl.currentUser.snapshot();

// subscribes to the current user object and logs to console on changes
fcl.currentUser.subscribe(console.log);
```

---

### `currentUser.authenticate`

Equivalent to `fcl.authenticate`.

---

### `currentUser.unauthenticate`

Equivalent to `fcl.unauthenticate`.

---

### `currentUser.authorization`

Equivalent to `fcl.authz`

---

### `currentUser.signUserMessage`

A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services.

> ⚠️ This method requires the current user's wallet to support a signing service endpoint. Currently, only Blocto is compatible with this feature by default.

#### Arguments

| Name      | Type                  | Description                       |
| --------- | --------------------- | --------------------------------- |
| `message` | string **(required)** | A hexadecimal string to be signed |

#### Returns

| Type    | Description                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Array` | An Array of [CompositeSignatures](https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/wallet-provider-spec/draft-v2.md#compositesignature): {`addr`, `keyId`, `signature`} |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

export const signMessage = async () => {
  const MSG = Buffer.from('FOO').toString('hex');
  try {
    return await currentUser.signUserMessage(MSG);
  } catch (error) {
    console.log(error);
  }
};
```

---

## Discovery

### `discovery`

Discovery abstracts away code so that developers don't have to deal with the discovery of Flow compatible wallets, integration, or authentication. Using `discovery` from FCL allows dapps to list and authenticate with wallets while having full control over the UI. Common use cases for this are login or registration pages.

(Alternatively, if you don't need control over your UI you can continue to use the `discovery.wallet` config value documented in the [Quickstart](../../../build/getting-started/fcl-quickstart.md) for the simplest configuration.)

> ⚠️**The following methods can only be used in web browsers.**

#### Note

⚠️`discovery.authn.endpoint` value **must** be set in the configuration before calling this method. See [FCL Configuration](#configuration).

### Suggested Configuration

| Environment | Example                                              |
| ----------- | ---------------------------------------------------- |
| Mainnet     | `https://fcl-discovery.onflow.org/api/authn`         |
| Testnet     | `https://fcl-discovery.onflow.org/api/testnet/authn` |

If the Discovery endpoint is set in config, then you can iterate through authn services and pass the chosen service to [authenticate](#authenticate) to authenticate a user.

#### Usage

```javascript
import './config';
import { useState, useEffect } from 'react';
import * as fcl from '@onflow/fcl';

function Component() {
  const [wallets, setWallets] = useState([]);
  useEffect(
    () => fcl.discovery.authn.subscribe((res) => setWallets(res.results)),
    [],
  );

  return (
    <div>
      {wallets.map((wallet) => (
        <button
          key={wallet.provider.address}
          onClick={() => fcl.authenticate({ service: wallet })}
        >
          Login with {wallet.provider.name}
        </button>
      ))}
    </div>
  );
}
```

### authn

#### More Configuration

By default, limited functionality services or services that require developer registration, like Ledger or Dapper Wallet, require apps to opt-in in order to display to users. To enable opt-in services in an application, use the `discovery.authn.include` property in your configuration with a value of an array of services you'd like your app to opt-in to displaying for users.

Additionally, you can use the `discovery.authn.exclude` property to exclude any services from being displayed to users.

```javascript
import { config } from '@onflow/fcl';

config({
  'discovery.authn.endpoint':
    'https://fcl-discovery.onflow.org/api/testnet/authn', // Endpoint set to Testnet
  'discovery.authn.include': ['0x9d2e44203cb13051'], // Ledger wallet address on Testnet set to be included
  'discovery.authn.exclude': ['0x123456789abcdef01'], // Example of excluding a wallet by address
});
```

**Opt-In Wallet Addresses on Testnet and Mainnet**

| Service         | Testnet            | Mainnet            |
| --------------- | ------------------ | ------------------ |
| `Dapper Wallet` | 0x82ec283f88a62e65 | 0xead892083b3e2c6c |
| `Ledger`        | 0x9d2e44203cb13051 | 0xe5cd26afebe62781 |

For more details on wallets, view the [service list here](https://github.com/onflow/fcl-discovery/blob/87e172db85d185882d9fde007c95f08bc2a1cccb/data/services.json).

---

### `discovery.authn.snapshot()`

Return a list of `authn` services.

### `discovery.authn.subscribe(callback)`

The callback sent to `subscribe` will be called with a list of `authn` services.

---

## On-chain Interactions

> 📣 **These methods can be used in browsers and NodeJS.**

These methods allows dapps to interact directly with the Flow blockchain via a set of functions that currently use the [Access Node API](../../../networks/access-onchain-data/index.md).

---

### Query and Mutate Flow with Cadence

If you want to run arbitrary Cadence scripts on the blockchain, these methods offer a convenient way to do so **without having to build, send, and decode interactions**.

### `query`

Allows you to submit scripts to query the blockchain.

#### Options

_Pass in the following as a single object with the following keys.All keys are optional unless otherwise stated._

| Key       | Type                                  | Description                                                                                                                                                                     |
| --------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cadence` | string **(required)**                 | A valid cadence script.                                                                                                                                                         |
| `args`    | [ArgumentFunction](#argumentfunction) | Any arguments to the script if needed should be supplied via a function that returns an array of arguments.                                                                     |
| `limit`   | number                                | Compute (Gas) limit for query. Read the [documentation about computation cost](../../../build/basics/fees.md) for information about how computation cost is calculated on Flow. |

#### Returns

| Type | Description                            |
| ---- | -------------------------------------- |
| any  | A JSON representation of the response. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const result = await fcl.query({
  cadence: `
    access(all) fun main(a: Int, b: Int, addr: Address): Int {
      log(addr)
      return a + b
    }
  `,
  args: (arg, t) => [
    arg(7, t.Int), // a: Int
    arg(6, t.Int), // b: Int
    arg('0xba1132bc08f82fe2', t.Address), // addr: Address
  ],
});
console.log(result); // 13
```

#### Examples

- [Additional Explanation](https://gist.github.com/orodio/3bf977a0bd45b990d16fdc1459b129a2)

---

### `mutate`

Allows you to submit transactions to the blockchain to potentially mutate the state.

⚠️When being used in the browser, `fcl.mutate` uses the built-in `fcl.authz` function to produce the authorization (signatures) for the current user. When calling this method from Node.js, you will need to supply your own custom authorization function.

#### Options

_Pass in the following as a single object with the following keys. All keys are optional unless otherwise stated._

| Key        | Type                                             | Description                                                                                                                                                                         |
| ---------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cadence`  | string **(required)**                            | A valid cadence transaction.                                                                                                                                                        |
| `args`     | [ArgumentFunction](#argumentfunction)            | Any arguments to the script if needed should be supplied via a function that returns an array of arguments.                                                                         |
| `limit`    | number                                           | Compute (Gas) limit for query. Read the [documentation about computation cost](../flow-go-sdk/index.md#gas-limit) for information about how computation cost is calculated on Flow. |
| `proposer` | [AuthorizationFunction](#authorization-function) | The authorization function that returns a valid [AuthorizationObject](#authorizationobject) for the [proposer role](#transactionrolesobject).                                       |

#### Returns

| Type   | Description         |
| ------ | ------------------- |
| string | The transaction ID. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
// login somewhere before
fcl.authenticate();

const txId = await fcl.mutate({
  cadence: `
    import Profile from 0xba1132bc08f82fe2
    
    transaction(name: String) {
      prepare(account: auth(BorrowValue) &Account) {
        account.storage.borrow<&{Profile.Owner}>(from: Profile.privatePath)!.setName(name)
      }
    }
  `,
  args: (arg, t) => [arg('myName', t.String)],
});
```

#### Examples

- [Additional explanation](https://gist.github.com/orodio/3bf977a0bd45b990d16fdc1459b129a2)
- [Custom authorization function](#authorization-function)

---

### `verifyUserSignatures` (Deprecated)

Use `fcl.AppUtils.verifyUserSignatures`

## AppUtils

### `AppUtils.verifyUserSignatures`

A method allowing applications to cryptographically verify a message was signed by a user's private key/s. This is typically used with the response from `currentUser.signUserMessage`.

#### Note

⚠️ `fcl.config.flow.network` or options override is required to use this api. See [FCL Configuration](#configuration).

#### Arguments

| Name                  | Type                  | Description                                                                                          |
| --------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| `message`             | string **(required)** | A hexadecimal string                                                                                 |
| `compositeSignatures` | Array **(required)**  | An Array of `CompositeSignatures`                                                                    |
| `opts`                | Object **(optional)** | `opts.fclCryptoContract` can be provided to override FCLCryptoContract address for local development |

#### Returns

| Type    | Description                   |
| ------- | ----------------------------- |
| Boolean | `true` if verified or `false` |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const isValid = await fcl.AppUtils.verifyUserSignatures(
  Buffer.from('FOO').toString('hex'),
  [
    {
      f_type: 'CompositeSignature',
      f_vsn: '1.0.0',
      addr: '0x123',
      keyId: 0,
      signature: 'abc123',
    },
  ],
  { fclCryptoContract },
);
```

#### Examples

- [fcl-next-harness](https://github.com/onflow/fcl-next-harness)

---

### `AppUtils.verifyAccountProof`

A method allowing applications to cryptographically prove that a user controls an on-chain account. During user authentication, some FCL compatible wallets will choose to support the FCL `account-proof` service. If a wallet chooses to support this service, and the user approves the signing of message data, they will return `account-proof` data and a signature(s) that can be used to prove a user controls an on-chain account.
See [proving-authentication](https://github.com/onflow/fcl-js/blob/master/docs/reference/proving-authentication.mdx) documentation for more details.

⚠️ `fcl.config.flow.network` or options override is required to use this api. See [FCL Configuration](#configuration).

#### Arguments

| Name               | Type                  | Description                                                                                                                                                                                                                                                               |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `appIdentifier`    | string **(required)** | A hexadecimal string                                                                                                                                                                                                                                                      |
| `accountProofData` | Object **(required)** | Object with properties: <br/>`address`: `string` - A Flow account address. <br/> `nonce`: `string` - A random string in hexadecimal format (minimum 32 bytes in total, i.e 64 hex characters) <br/> `signatures`: `Object[]` - An array of composite signatures to verify |
| `opts`             | Object **(optional)** | `opts.fclCryptoContract` can be provided to overide FCLCryptoContract address for local development                                                                                                                                                                       |

#### Returns

| Type    | Description                   |
| ------- | ----------------------------- |
| Boolean | `true` if verified or `false` |

#### Usage

```javascript
import * as fcl from "@onflow/fcl"

const accountProofData = {
  address: "0x123",
  nonce: "F0123"
  signatures: [{f_type: "CompositeSignature", f_vsn: "1.0.0", addr: "0x123", keyId: 0, signature: "abc123"}],
}

const isValid = await fcl.AppUtils.verifyAccountProof(
  "AwesomeAppId",
  accountProofData,
  {fclCryptoContract}
)

```

#### Examples

- [fcl-next-harness](https://github.com/onflow/fcl-next-harness)

---

### Query and mutate the blockchain with Builders

In some cases, you may want to utilize pre-built interactions or build more complex interactions than what the `fcl.query` and `fcl.mutate` interface offer. To do this, FCL uses a pattern of building up an interaction with a combination of builders, resolving them, and sending them to the chain.

> ⚠️**Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

### `send`

Sends arbitrary scripts, transactions, and requests to Flow.

This method consumes an array of [builders](#builders) that are to be resolved and sent. The builders required to be included in the array depend on the [interaction](#interaction) that is being built.

#### Note

⚠️Must be used in conjuction with [`fcl.decode(response)`](#decode) to get back correct keys and all values in JSON.

#### Arguments

| Name       | Type                    | Description            |
| ---------- | ----------------------- | ---------------------- |
| `builders` | [[Builders](#builders)] | See builder functions. |

#### Returns

| Type                              | Description                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ResponseObject](#responseobject) | An object containing the data returned from the chain. Should always be decoded with `fcl.decode()` to get back appropriate JSON keys and values. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

// a script only needs to resolve the arguments to the script
const response = await fcl.send([fcl.script`${script}`, fcl.args(args)]);
// note: response values are encoded, call await fcl.decode(response) to get JSON

// a transaction requires multiple 'builders' that need to be resolved prior to being sent to the chain - such as setting the authorizations.
const response = await fcl.send([
  fcl.transaction`
    ${transaction}
    `,
  fcl.args(args),
  fcl.proposer(proposer),
  fcl.authorizations(authorizations),
  fcl.payer(payer),
  fcl.limit(9999),
]);
// note: response contains several values (Cad)
```

---

### `decode`

Decodes the response from `fcl.send()` into the appropriate JSON representation of any values returned from Cadence code.

#### Note

📣 To define your own decoder, see [`tutorial`](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/decode).

#### Arguments

| Name       | Type                              | Description                                            |
| ---------- | --------------------------------- | ------------------------------------------------------ |
| `response` | [ResponseObject](#responseobject) | Should be the response returned from `fcl.send([...])` |

#### Returns

| Type | Description                                                                                                                                                                     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| any  | A JSON representation of the raw string response depending on the cadence code executed.<br/> The return value can be a single value and type or an object with multiple types. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

// simple script to add 2 numbers
const response = await fcl.send([
  fcl.script`
        access(all) fun main(int1: Int, int2: Int): Int {
            return int1 + int2
        }
    `,
  fcl.args([fcl.arg(1, fcl.t.Int), fcl.arg(2, fcl.t.Int)]),
]);

const decoded = await fcl.decode(response);

assert(3 === decoded);
assert(typeof decoded === 'number');
```

---

## Builders

These methods fill out various portions of a transaction or script template in order to
build, resolve, and send it to the blockchain. A valid populated template is referred to as an [Interaction](#interaction).

⚠️**These methods must be used with `fcl.send([...builders]).then(fcl.decode)`**

### Query Builders

### `getAccount`

A builder function that returns the interaction to get an account by address.

⚠️Consider using the pre-built interaction [`fcl.account(address)`](#account) if you do not need to pair with any other builders.

#### Arguments

| Name      | Type                | Description                                                                        |
| --------- | ------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](#address) | Address of the user account with or without a prefix (both formats are supported). |

#### Returns after decoding

| Type                      | Description                              |
| ------------------------- | ---------------------------------------- |
| [AccountObject](#account) | A JSON representation of a user account. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

// somewhere in an async function
// fcl.account is the same as this function
const getAccount = async (address) => {
  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
  return account;
};
```

---

### `getBlock`

A builder function that returns the interaction to get the latest block.

📣 Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

⚠️Consider using the pre-built interaction [`fcl.getblock(isSealed)`](#getblock) if you do not need to pair with any other builders.

#### Arguments

| Name       | Type    | Default | Description                                                                    |
| ---------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](#interaction). |

#### Returns after decoding

| Type                        | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| [BlockObject](#blockobject) | The latest block if not used with any other builders. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const latestSealedBlock = await fcl
  .send([
    fcl.getBlock(true), // isSealed = true
  ])
  .then(fcl.decode);
```

---

### `atBlockHeight`

A builder function that returns a partial interaction to a block at a specific height.

⚠️Use with other interactions like [`fcl.getBlock()`](#getblock) to get a full interaction at the specified block height.

#### Arguments

| Name          | Type   | Description                                            |
| ------------- | ------ | ------------------------------------------------------ |
| `blockHeight` | number | The height of the block to execute the interaction at. |

#### Returns

| Type                                | Description                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#interaction) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

await fcl.send([fcl.getBlock(), fcl.atBlockHeight(123)]).then(fcl.decode);
```

---

### `atBlockId`

A builder function that returns a partial interaction to a block at a specific block ID.

⚠️Use with other interactions like [`fcl.getBlock()`](#getblock) to get a full interaction at the specified block ID.

#### Arguments

| Name      | Type   | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `blockId` | string | The ID of the block to execute the interaction at. |

#### Returns

| Type                                | Description                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#interaction) | A partial interaction to be paired with another interaction such as `fcl.getBlock()` or `fcl.getAccount()`. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

await fcl.send([fcl.getBlock(), fcl.atBlockId('23232323232')]).then(fcl.decode);
```

---

### `getBlockHeader`

A builder function that returns the interaction to get a block header.

📣 Use with `fcl.atBlockId()` and `fcl.atBlockHeight()` when building the interaction to get information for older blocks.

#### Returns after decoding

| Type                                    | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| [BlockHeaderObject](#blockheaderobject) | The latest block header if not used with any other builders. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const latestBlockHeader = await fcl
  .send([fcl.getBlockHeader()])
  .then(fcl.decode);
```

### `getEventsAtBlockHeightRange`

A builder function that returns all instances of a particular event (by name) within a height range.

⚠️The block range provided must be from the current spork.

⚠️The block range provided must be 250 blocks or lower per request.

#### Arguments

| Name              | Type                    | Description                                                      |
| ----------------- | ----------------------- | ---------------------------------------------------------------- |
| `eventName`       | [EventName](#eventname) | The name of the event.                                           |
| `fromBlockHeight` | number                  | The height of the block to start looking for events (inclusive). |
| `toBlockHeight`   | number                  | The height of the block to stop looking for events (inclusive).  |

#### Returns after decoding

| Type                           | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| [[EventObject]](#event-object) | An array of events that matched the eventName. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const events = await fcl
  .send([
    fcl.getEventsAtBlockHeightRange(
      'A.7e60df042a9c0868.FlowToken.TokensWithdrawn',
      35580624,
      35580624,
    ),
  ])
  .then(fcl.decode);
```

---

### `getEventsAtBlockIds`

A builder function that returns all instances of a particular event (by name) within a set of blocks, specified by block ids.

⚠️The block range provided must be from the current spork.

#### Arguments

| Name        | Type                    | Description                               |
| ----------- | ----------------------- | ----------------------------------------- |
| `eventName` | [EventName](#eventname) | The name of the event.                    |
| `blockIds`  | number                  | The ids of the blocks to scan for events. |

#### Returns after decoding

| Type                           | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| [[EventObject]](#event-object) | An array of events that matched the eventName. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const events = await fcl
  .send([
    fcl.getEventsAtBlockIds('A.7e60df042a9c0868.FlowToken.TokensWithdrawn', [
      'c4f239d49e96d1e5fbcf1f31027a6e582e8c03fcd9954177b7723fdb03d938c7',
      '5dbaa85922eb194a3dc463c946cc01c866f2ff2b88f3e59e21c0d8d00113273f',
    ]),
  ])
  .then(fcl.decode);
```

---

### `getCollection`

A builder function that returns all a collection containing a list of transaction ids by its collection id.

⚠️The block range provided must be from the current spork. All events emitted during past sporks is current unavailable.

#### Arguments

| Name           | Type   | Description               |
| -------------- | ------ | ------------------------- |
| `collectionID` | string | The id of the collection. |

#### Returns after decoding

| Type                                  | Description                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| [CollectionObject](#collectionobject) | An object with the id and a list of transactions within the requested collection. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const collection = await fcl
  .send([
    fcl.getCollection(
      'cccdb0c67d015dc7f6444e8f62a3244ed650215ed66b90603006c70c5ef1f6e5',
    ),
  ])
  .then(fcl.decode);
```

---

### `getTransactionStatus`

A builder function that returns the status of transaction in the form of a [TransactionStatusObject](#transactionstatusobject).

⚠️The transactionID provided must be from the current spork.

📣 Considering [subscribing to the transaction from `fcl.tx(id)`](#tx) instead of calling this method directly.

#### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

#### Returns after decoding

#### Returns

| Type                                                | Description                                            |
| --------------------------------------------------- | ------------------------------------------------------ |
| [TransactionStatusObject](#transactionstatusobject) | Object representing the result/status of a transaction |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const status = await fcl
  .send([
    fcl.getTransactionStatus(
      '9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3',
    ),
  ])
  .then(fcl.decode);
```

---

### `getTransaction`

A builder function that returns a [transaction object](#transactionobject) once decoded.

⚠️The transactionID provided must be from the current spork.

📣 Considering using [`fcl.tx(id).onceExecuted()`](#tx) instead of calling this method directly.

#### Arguments

| Name            | Type   | Description                                                                                                                           |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `transactionId` | string | The transactionID returned when submitting a transaction. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |

#### Returns after decoding

#### Returns

| Type                                    | Description                                                    |
| --------------------------------------- | -------------------------------------------------------------- |
| [TransactionObject](#transactionobject) | An full transaction object containing a payload and signatures |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const tx = await fcl
  .send([
    fcl.getTransaction(
      '9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3',
    ),
  ])
  .then(fcl.decode);
```

---

### `subscribeEvents`

<Callout type="info">
The subscribeEvents SDK builder is for more advanced use cases where you wish to directly specify a starting block to listen for events. For most use cases, consider using the pre-built interaction [`fcl.events(eventTypes)`](#events).
</Callout>

A build that returns a [event stream connection](#eventstream) once decoded. It will establish a WebSocket connection to the Access Node and subscribe to events with the given parameters.

#### Arguments

| Name          | Type                        | Description                       |
| ------------- | --------------------------- | --------------------------------- |
| `eventFilter` | [EventFilter](#eventfilter) | The event filter to subscribe to. |

#### Returns after decoding

#### Returns

| Type                                  | Description                      |
| ------------------------------------- | -------------------------------- |
| [EventStreamConnection](#eventstream) | A connection to the event stream |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const eventStream = await fcl
  .send([
    fcl.subscribeEvents({
      eventTypes: 'A.7e60df042a9c0868.FlowToken.TokensWithdrawn',
    }),
  ])
  .then(fcl.decode);

eventStream.on('heartbeat', (heartbeat) => {
  console.log(heartbeat);
});

eventStream.on('events', (event) => {
  console.log(event);
});

eventStream.on('error', (error) => {
  console.log(error);
});

eventStream.on('end', () => {
  console.log('Connection closed');
});

eventStream.close();
```

---

### `getEvents` (Deprecated)

Use [`fcl.getEventsAtBlockHeightRange`](#geteventsatblockheightrange) or [`fcl.getEventsAtBlockIds`](#geteventsatblockids).

---

### `getLatestBlock` (Deprecated)

Use [`fcl.getBlock`](#getblock).

---

### `getBlockById` (Deprecated)

Use [`fcl.getBlock`](#getblock) and [`fcl.atBlockId`](#atblockid).

---

### `getBlockByHeight` (Deprecated)

Use [`fcl.getBlock`](#getblock) and [`fcl.atBlockHeight`](#atblockheight).

---

### Utility Builders

These builders are used to compose interactions with other builders such as scripts and transactions.

> ⚠️**Recommendation:** Unless you have a specific use case that require usage of these builders, you should be able to achieve most cases with `fcl.query({...options}` or `fcl.mutate({...options})`

### `arg`

A utility builder to be used with `fcl.args[...]` to create FCL supported arguments for interactions.

#### Arguments

| Name    | Type            | Description                                               |
| ------- | --------------- | --------------------------------------------------------- |
| `value` | any             | Any value that you are looking to pass to other builders. |
| `type`  | [FType](#ftype) | A type supported by Flow.                                 |

#### Returns

| Type                              | Description                         |
| --------------------------------- | ----------------------------------- |
| [ArgumentObject](#argumentobject) | Holds the value and type passed in. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

await fcl
  .send([
    fcl.script`
      access(all) fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, fcl.t.Int), // a
      fcl.arg(4, fcl.t.Int), // b
    ]),
  ])
  .then(fcl.decode);
```

---

### `args`

A utility builder to be used with other builders to pass in arguments with a value and supported type.

#### Arguments

| Name   | Type                                  | Description                                                           |
| ------ | ------------------------------------- | --------------------------------------------------------------------- |
| `args` | [[Argument Objects]](#argumentobject) | An array of arguments that you are looking to pass to other builders. |

#### Returns

| Type                                | Description                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Partial Interaction](#interaction) | An interaction that contains the arguments and types passed in. This alone is a partial and incomplete interaction. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

await fcl
  .send([
    fcl.script`
      access(all) fun main(a: Int, b: Int): Int {
        return a + b
      }
    `,
    fcl.args([
      fcl.arg(5, fcl.t.Int), // a
      fcl.arg(4, fcl.t.Int), // b
    ]),
  ])
  .then(fcl.decode); // 9
```

---

### Template Builders

> ⚠️**_Recommended:_** The following functionality is simplified by [`fcl.query({...options}`](#query) or [`fcl.mutate({...options})`](#mutate) and is reccomended to use over the functions below.

### `script`

A template builder to use a Cadence script for an interaction.

📣 Use with `fcl.args(...)` to pass in arguments dynamically.

#### Arguments

| Name   | Type   | Description                     |
| ------ | ------ | ------------------------------- |
| `CODE` | string | Should be valid Cadence script. |

#### Returns

| Type                        | Description                                   |
| --------------------------- | --------------------------------------------- |
| [Interaction](#interaction) | An interaction containing the code passed in. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const code = `
  access(all) fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

### `transaction`

A template builder to use a Cadence transaction for an interaction.

⚠️Must be used with `fcl.payer`, `fcl.proposer`, `fcl.authorizations` to produce a valid interaction before sending to the chain.

📣 Use with `fcl.args[...]` to pass in arguments dynamically.

#### Arguments

| Name   | Type   | Description                            |
| ------ | ------ | -------------------------------------- |
| `CODE` | string | Should be valid a Cadence transaction. |

#### Returns

| Type                                | Description                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [Partial Interaction](#interaction) | An partial interaction containing the code passed in. Further builders are required to complete the interaction - see warning. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const code = `
  access(all) fun main(): Int {
    return 5 + 4
  }
`;
const answer = await fcl.send([fcl.script(code)]).then(fcl.decode);
console.log(answer); // 9
```

---

## Pre-built Interactions

These functions are abstracted short hand ways to skip the send and decode steps of sending an interaction to the chain. More pre-built interactions are coming soon.

### `account`

A pre-built interaction that returns the details of an account from their public address.

#### Arguments

| Name      | Type                | Description                                                                        |
| --------- | ------------------- | ---------------------------------------------------------------------------------- |
| `address` | [Address](#address) | Address of the user account with or without a prefix (both formats are supported). |

#### Returns

| Type                            | Description                              |
| ------------------------------- | ---------------------------------------- |
| [AccountObject](#accountobject) | A JSON representation of a user account. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
const account = await fcl.account('0x1d007d755706c469');
```

---

### `block`

A pre-built interaction that returns the latest block (optionally sealed or not), by id, or by height.

#### Arguments

| Name     | Type    | Default | Description                                                                    |
| -------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `sealed` | boolean | false   | If the latest block should be sealed or not. See [block states](#interaction). |
| `id`     | string  |         | ID of block to get.                                                            |
| `height` | int     |         | Height of block to get.                                                        |

#### Returns

| Type                        | Description                       |
| --------------------------- | --------------------------------- |
| [BlockObject](#blockobject) | A JSON representation of a block. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
await fcl.block(); // get latest finalized block
await fcl.block({ sealed: true }); // get latest sealed block
await fcl.block({
  id: '0b1bdfa9ddaaf31d53c584f208313557d622d1fedee1586ffc38fb5400979faa',
}); // get block by id
await fcl.block({ height: 56481953 }); // get block by height
```

---

### `latestBlock` (Deprecated)

A pre-built interaction that returns the latest block (optionally sealed or not).

#### Arguments

| Name       | Type    | Default | Description                                                                    |
| ---------- | ------- | ------- | ------------------------------------------------------------------------------ |
| `isSealed` | boolean | false   | If the latest block should be sealed or not. See [block states](#interaction). |

#### Returns

| Type                        | Description                       |
| --------------------------- | --------------------------------- |
| [BlockObject](#blockobject) | A JSON representation of a block. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
const latestBlock = await fcl.latestBlock();
```

---

## Real-Time Data

Streaming data is available through the WebSocket Streaming API provided by the HTTP Access API. It allows developers to subscribe to specific topics and receive real-time updates as they occur on the Flow blockchain.

The following topics can be subscribed to:

- `events`: Subscribe to events emitted by contracts.
- `blocks`: Subscribe to new blocks added to the chain.
- `block_headers`: Subscribe to new block headers added to the chain.
- `block_digests`: Subscribe to block digests added to the chain.
- `transaction_statuses`: Subscribe to transaction statuses.
- `account_statuses`: Subscribe to account statuses.

### `tx`

A utility function that lets you set the transaction to get subsequent status updates and the finalized result once available.

#### Arguments

| Name            | Type   | Description             |
| --------------- | ------ | ----------------------- |
| `transactionId` | string | A valid transaction id. |

#### Returns

| Name              | Type     | Description                                                                                               |
| ----------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `snapshot()`      | function | Returns the current state of the transaction.                                                             |
| `subscribe(cb)`   | function | Calls the `cb` passed in with the new transaction on a status change.                                     |
| `onceFinalized()` | function | Provides the transaction once status `2` is returned. See [Tranasaction Statuses](#transaction-statuses). |
| `onceExecuted()`  | function | Provides the transaction once status `3` is returned. See [Tranasaction Statuses](#transaction-statuses). |
| `onceSealed()`    | function | Provides the transaction once status `4` is returned. See [Tranasaction Statuses](#transaction-statuses). |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';

const [txStatus, setTxStatus] = useState(null);
useEffect(() => fcl.tx(txId).subscribe(setTxStatus));
```

---

### `events`

A utility function that lets you set the transaction to get subsequent status updates and the finalized result once available.

#### Arguments

| Name                | Type                                      | Description                                      |
| ------------------- | ----------------------------------------- | ------------------------------------------------ |
| `eventNameOrFilter` | string &#124; [EventFilter](#eventfilter) | The name of the event or an event filter object. |

#### Returns

| Name            | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `subscribe(cb)` | function | Calls the `cb` passed in with the new event. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
// in some react component
fcl.events(eventName).subscribe((event) => {
  console.log(event);
});
```

---

### `subscribe`

A utility function used for subscribing to real-time data from the WebSocket Streaming API. Data returned will be automatically decoded via the [`decode`](#decode) function.

#### Arguments

| Name     | Type                                        | Description                                                                                        |
| -------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `params` | [`SubscriptionParams`](#subscriptionparams) | An object containing the subscription topic, arguments, and callbacks. See below for more details. |
| `opts`   | object                                      | _(Optional)_ Additional options for the subscription. See below for more details.                  |

`params` (first parameter):

See [`SubscriptionParams`](#subscriptionparams) for more details.

Additional Options (second parameter):

| Name        | Type   | Description                                                               |
| ----------- | ------ | ------------------------------------------------------------------------- |
| `node`      | string | _(Optional)_ Custom node endpoint to be used for the subscription.        |
| `transport` | object | _(Optional)_ Custom transport implementation for handling the connection. |

#### Returns

| Type                      | Description                                                                                    |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| SdkTransport.Subscription | A subscription object that allows you to manage the subscription (e.g., to unsubscribe later). |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
import { SubscriptionTopic } from '@onflow/sdk';

const subscription = fcl.subscribe({
  topic: SubscriptionTopic.EVENTS,
  args: {
    type: 'A.7e60df042a9c0868.FlowToken.TokensWithdrawn',
  },
  onData: (data) => console.log('Received event data:', data),
  onError: (error) => console.error('Subscription error:', error),
});

// Later, to unsubscribe:
subscription.unsubscribe();
```

---

### `subscribeRaw`

A utility function used for subscribing to raw data from the WebSocket Streaming API. Data returned will not be decoded via `fcl.decode` and developers are responsible for handling the raw data returned.

#### Arguments

| Name      | Type                                                               | Description                                                                                                                        |
| --------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `topic`   | `SubscriptionTopic`                                                | The subscription topic. Valid values include: `events`, `blocks`, `transactions`, and `collections`.                               |
| `args`    | `RawSubscriptionArgs<T extends SubscriptionTopic>`                 | An array or object of parameters specific to the topic. For example, when subscribing to events, these might be event identifiers. |
| `onData`  | `(data: RawSubscriptionData<T extends SubscriptionTopic>) => void` | A callback function that is called with the decoded data whenever a new message is received.                                       |
| `onError` | (error: Error) => void                                             | A callback function that is called if an error occurs during the subscription.                                                     |

Additional Options (second parameter):

| Name        | Type   | Description                                                               |
| ----------- | ------ | ------------------------------------------------------------------------- |
| `node`      | string | _(Optional)_ Custom node endpoint to be used for the subscription.        |
| `transport` | object | _(Optional)_ Custom transport implementation for handling the connection. |

#### Returns

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
import { SubscriptionTopic } from '@onflow/sdk';

const subscription = fcl.subscribeRaw({
  topic: SubscriptionTopic.EVENTS,
  args: {
    type: 'A.7e60df042a9c0868.FlowToken.TokensWithdrawn',
  },
  onData: (data) => console.log('Received event data:', data),
  onError: (error) => console.error('Subscription error:', error),
});

// Later, to unsubscribe:
subscription.unsubscribe();
```

---

#### Examples

- [Flow-view-source example](https://github.com/orodio/flow-view-source/blob/master/src/pages/event.comp.js)

---

## Types, Interfaces, and Definitions

---

### `Builders`

Builders are modular functions that can be coupled together with `fcl.send([...builders])` to create an [Interaction](#interaction). The builders needed to create an interaction depend on the script or transaction that is being sent.

---

### `Interaction`

An interaction is an object containing the information to perform an action on chain.This object is populated through builders and converted into the approriate access node API call. See the interaction object [here](https://github.com/onflow/fcl-js/blob/master/packages/sdk/src/interaction/interaction.ts). A 'partial' interaction is an interaction object that does not have sufficient information to the intended on-chain action. Multiple partial interactions (through builders) can be coupled to create a complete interaction.

---

### `CurrentUserObject`

| Key         | Value Type          | Default   | Description                                                                                                                                                                                                                                                                                    |
| ----------- | ------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addr`      | [Address](#address) | `null`    | The public address of the current user                                                                                                                                                                                                                                                         |
| `cid`       | string              | `null`    | Allows wallets to specify a [content identifier](https://docs.ipfs.io/concepts/content-addressing/) for user metadata.                                                                                                                                                                         |
| `expiresAt` | number              | `null`    | Allows wallets to specify a time-frame for a valid session.                                                                                                                                                                                                                                    |
| `f_type`    | string              | `'USER'`  | A type identifier used internally by FCL.                                                                                                                                                                                                                                                      |
| `f_vsn`     | string              | `'1.0.0'` | FCL protocol version.                                                                                                                                                                                                                                                                          |
| `loggedIn`  | boolean             | `null`    | If the user is logged in.                                                                                                                                                                                                                                                                      |
| `services`  | `[ServiceObject]`   | `[]`      | A list of trusted services that express ways of interacting with the current user's identity, including means to further discovery, [authentication, authorization](https://gist.github.com/orodio/a74293f65e83145ec8b968294808cf35#you-know-who-the-user-is), or other kinds of interactions. |

---

### `AuthorizationObject`

This type conforms to the interface required for FCL to authorize transaction on behalf o the current user.

| Key               | Value Type          | Description                                                                                       |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| `addr`            | [Address](#address) | The address of the authorizer                                                                     |
| `signingFunction` | function            | A function that allows FCL to sign using the authorization details and produce a valid signature. |
| `keyId`           | number              | The index of the key to use during authorization. (Multiple keys on an account is possible).      |
| `sequenceNum`     | number              | A number that is incremented per transaction using they keyId.                                    |

---

### `SignableObject`

An object that contains all the information needed for FCL to sign a message with the user's signature.

| Key         | Value Type          | Description                                                                                          |
| ----------- | ------------------- | ---------------------------------------------------------------------------------------------------- |
| `addr`      | [Address](#address) | The address of the authorizer                                                                        |
| `keyId`     | number              | The index of the key to use during authorization. (Multiple keys on an account is possible).         |
| `signature` | function            | A [SigningFunction](#signing-function) that can produce a valid signature for a user from a message. |

---

### `AccountObject`

The JSON representation of an account on the Flow blockchain.

| Key         | Value Type                    | Description                                                                                |
| ----------- | ----------------------------- | ------------------------------------------------------------------------------------------ |
| `address`   | [Address](#address)           | The address of the account                                                                 |
| `balance`   | number                        | The FLOW balance of the account in 10^8.                                                   |
| `code`      | [Code](#code)                 | The code of any Cadence contracts stored in the account.                                   |
| `contracts` | Object: [Contract](#contract) | An object with keys as the contract name deployed and the value as the the cadence string. |
| `keys`      | [[KeyObject]](#keyobject)     | Any contracts deployed to this account.                                                    |

---

### `Address`

| Value Type        | Description                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A valid Flow address should be 16 characters in length. <br/>A `0x` prefix is optional during inputs. <br/>eg. `f8d6e0586b0a20c1` |

---

### `ArgumentObject`

An argument object created by `fcl.arg(value,type)`

| Key     | Value Type      | Description                                       |
| ------- | --------------- | ------------------------------------------------- |
| `value` | any             | Any value to be used as an argument to a builder. |
| `xform` | [FType](#ftype) | Any of the supported types on Flow.               |

---

### `ArgumentFunction`

An function that takes the `fcl.arg` function and fcl types `t` and returns an array of `fcl.arg(value,type)`.

`(arg, t) => Array<Arg>`

| Parameter Name | Value Type       | Description                                                               |
| -------------- | ---------------- | ------------------------------------------------------------------------- |
| `arg`          | function         | A function that returns an [ArgumentObject](#argumentobject) - `fcl.arg`. |
| `t`            | [FTypes](#ftype) | An object with acccess to all of the supported types on Flow.             |

**Returns**

| Value Type   | Description          |
| ------------ | -------------------- |
| `[fcl.args]` | Array of `fcl.args`. |

---

### `Authorization Function`

An authorization function must produce the information of the user that is going to sign and a signing function to use the information to produce a signature.

⚠️This function is always async.

📣 By default FCL exposes `fcl.authz` that produces the authorization object for the current user (given they are signed in and only on the browser). Replace this with your own function that conforms to this interface to use it wherever an authorization object is needed.

| Parameter Name | Value Type                      | Description                                    |
| -------------- | ------------------------------- | ---------------------------------------------- |
| `account`      | [AccountObject](#accountobject) | The account of the user that is going to sign. |

**Returns**

| Value Type                                             | Description                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `Promise<[AuthorizationObject](#authorizationobject)>` | The object that contains all the information needed by FCL to authorize a user's transaction. |

#### Usage

---

```javascript
const authorizationFunction = async (account) => {
    // authorization function need to return an account
    const { address, keys } = account
    const tempId = `${address}-${keys[process.env.minterAccountIndex]}`;
    const keyId = Number(KEY_ID);
    let signingFunction = async signable => {
      return {
        keyId,
        addr: fcl.withPrefix(address),
        signature: sign(process.env.FLOW_MINTER_PRIVATE_KEY, signable.message), // signing function, read below
      }
    }
    return {
    ...account,
    address,
    keyId,
    tempId,
    signingFunction,
  }
```

- [Detailed explanation](https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/wallet-provider-spec/authorization-function.md)

---

### `Signing Function`

Consumes a payload and produces a signature for a transaction.

⚠️This function is always async.

📣 Only write your own signing function if you are writing your own custom authorization function.

#### Payload

Note: These values are destructed from the payload object in the first argument.

| Parameter Name | Value Type | Description                                                                                                                          |
| -------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `message`      | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `addr`         | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `keyId`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `roles`        | string     | The encoded string which needs to be used to produce the signature.                                                                  |
| `voucher`      | object     | The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message. |

**Returns**

| Value Type                                   | Description                                                                                   |
| -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `Promise<[SignableObject](#signableobject)>` | The object that contains all the information needed by FCL to authorize a user's transaction. |

#### Usage

```javascript
import * as fcl from '@onflow/fcl';
import { ec as EC } from 'elliptic';
import { SHA3 } from 'sha3';
const ec: EC = new EC('p256');

const produceSignature = (privateKey, msg) => {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, 'hex'));
  const sig = key.sign(this.hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, 'be', n);
  const s = sig.s.toArrayLike(Buffer, 'be', n);
  return Buffer.concat([r, s]).toString('hex');
};

const signingFunction = ({
  message, // The encoded string which needs to be used to produce the signature.
  addr, // The address of the Flow Account this signature is to be produced for.
  keyId, // The keyId of the key which is to be used to produce the signature.
  roles: {
    proposer, // A Boolean representing if this signature to be produced for a proposer.
    authorizer, // A Boolean representing if this signature to be produced for a authorizer.
    payer, // A Boolean representing if this signature to be produced for a payer.
  },
  voucher, // The raw transactions information, can be used to create the message for additional safety and lack of trust in the supplied message.
}) => {
  return {
    addr, // The address of the Flow Account this signature was produced for.
    keyId, // The keyId for which key was used to produce the signature.
    signature: produceSignature(message), // The hex encoded string representing the signature of the message.
  };
};
```

#### Examples:

- [Detailed explanation](https://github.com/onflow/fcl-js/blob/master/packages/fcl-core/src/wallet-provider-spec/authorization-function.md)

---

### `TransactionObject`

| Key                  | Value Type                            | Description                                                                                                                                                                  |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `args`               | object                                | A list of encoded Cadence values passed into this transaction. These have not been decoded by the JS-SDK.                                                                    |
| `authorizers`        | [\[Address\]](#address)               | A list of the accounts that are authorizing this transaction to mutate to their on-chain account state. [See more here](../../../build/basics/transactions.md#signer-roles). |
| `envelopeSignatures` | [\[SignableObject\]](#signableobject) | A list of signatures generated by the payer role. [See more here](../../../build/basics/transactions.md#signing-a-transaction).                                              |
| `gasLimit`           | number                                | The maximum number of computational units that can be used to execute this transaction. [See more here](../../../build/basics/fees.md).                                      |
| `payer`              | [Address](#address)                   | The account that pays the fee for this transaction. [See more here](../../../build/basics/transactions.md#signer-roles).                                                     |
| `payloadSignatures`  | [\[SignableObject\]](#signableobject) | A list of signatures generated by the proposer and authorizer roles. [See more here](../../../build/basics/transactions.md#signing-a-transaction).                           |
| `proposalKey`        | [\[ProposalKey\]](#proposalkeyobject) | The account key used to propose this transaction                                                                                                                             |
| `referenceBlockId`   | string                                | A reference to the block used to calculate the expiry of this transaction.                                                                                                   |
| `script`             | string                                | The UTF-8 encoded Cadence source code that defines the execution logic for this transaction                                                                                  |

### `TransactionRolesObject`

| Key Name   | Value Type | Description                                                                |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| proposer   | boolean    | A Boolean representing if this signature to be produced for a proposer.    |
| authorizer | boolean    | A Boolean representing if this signature to be produced for an authorizer. |
| payer      | boolean    | A Boolean representing if this signature to be produced for a payer.       |

For more on what each transaction role means, see [singing roles](../../../build/basics/transactions.md#signer-roles).

### `TransactionStatusObject`

| Key            | Value Type                                 | Description                                                                         |
| -------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| `blockId`      | string                                     | ID of the block that contains the transaction.                                      |
| `events`       | [[EventObject]](#event-object)             | An array of events that were emitted during the transaction.                        |
| `status`       | [TransactionStatus](#transaction-statuses) | The status of the transaction on the blockchain.                                    |
| `statusString` | [TransactionStatus](#transaction-statuses) | The `status` as as descriptive text (e.g. "FINALIZED").                             |
| `errorMessage` | string                                     | An error message if it exists. Default is an empty string `''`.                     |
| `statusCode`   | number                                     | The pass/fail status. 0 indicates the transaction succeeded, 1 indicates it failed. |

### `EventName`

| Value Type        | Description                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| string(formatted) | A event name in Flow must follow the format `A.{AccountAddress}.{ContractName}.{EventName}` <br/>eg. `A.ba1132bc08f82fe2.Debug.Log` |

### `Contract`

| Value Type        | Description                                          |
| ----------------- | ---------------------------------------------------- |
| string(formatted) | A formatted string that is a valid cadence contract. |

### `KeyObject`

This is the JSON representation of a key on the Flow blockchain.

| Key              | Value Type | Description                                                                              |
| ---------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `index`          | number     | The address of the account                                                               |
| `publicKey`      | string     | The public portion of a public/private key pair                                          |
| `signAlgo`       | number     | An index referring to one of `ECDSA_P256` or `ECDSA_secp256k1`                           |
| `hashAlgo`       | number     | An index referring to one of `SHA2_256` or `SHA3_256`                                    |
| `weight`         | number     | A number between 1 and 1000 indicating the relative weight to other keys on the account. |
| `sequenceNumber` | number     | This number is incremented for every transaction signed using this key.                  |
| `revoked`        | boolean    | If this key has been disabled for use.                                                   |

### `ProposalKeyObject`

ProposalKey is the account key used to propose this transaction.

A proposal key references a specific key on an account, along with an up-to-date sequence number for that key. This sequence number is used to prevent replay attacks.

You can find more information about sequence numbers [here](../../../build/basics/transactions.md#sequence-numbers)

| Key              | Value Type          | Description                                                               |
| ---------------- | ------------------- | ------------------------------------------------------------------------- |
| `address`        | [Address](#address) | The address of the account                                                |
| `keyIndex`       | number              | The index of the account key being referenced                             |
| `sequenceNumber` | number              | The sequence number associated with this account key for this transaction |

### `BlockObject`

The JSON representation of a key on the Flow blockchain.

| Key                    | Value Type                                                | Description                                                |
| ---------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| `id`                   | string                                                    | The id of the block.                                       |
| `parentId`             | string                                                    | The id of the parent block.                                |
| `height`               | number                                                    | The height of the block.                                   |
| `timestamp`            | object                                                    | Contains time related fields.                              |
| `collectionGuarantees` | [[CollectionGuaranteeObject](#collectionguaranteeobject)] | Contains the ids of collections included in the block.     |
| `blockSeals`           | [SealedBlockObject]                                       | The details of which nodes executed and sealed the blocks. |
| `signatures`           | Uint8Array([numbers])                                     | All signatures.                                            |

### `BlockHeaderObject`

The subset of the [BlockObject](#blockobject) containing only the header values of a block.

| Key         | Value Type | Description                   |
| ----------- | ---------- | ----------------------------- |
| `id`        | string     | The id of the block.          |
| `parentId`  | string     | The id of the parent block.   |
| `height`    | number     | The height of the block.      |
| `timestamp` | object     | Contains time related fields. |

### `BlockDigestObject`

A lightweight subset of the [BlockObject](#blockobject) containing only the id, height, and timestamp of a block.

| Key         | Value Type | Description                 |
| ----------- | ---------- | --------------------------- |
| `id`        | string     | The id of the block.        |
| `height`    | number     | The height of the block.    |
| `timestamp` | string     | The timestamp of the block. |

### `CollectionGuaranteeObject`

A collection that has been included in a block.

| Key            | Value Type                          | Description          |
| -------------- | ----------------------------------- | -------------------- |
| `collectionId` | string                              | The id of the block. |
| `signatures`   | [SignatureObject](#SignatureObject) | All signatures.      |

### `CollectionObject`

A collection is a list of transactions that are contained in the same block.

| Key              | Value Type | Description                                             |
| ---------------- | ---------- | ------------------------------------------------------- |
| `id`             | string     | The id of the collection.                               |
| `transactionIds` | [string]   | The ids of the transactions included in the collection. |

### `ResponseObject`

The format of all responses in FCL returned from `fcl.send(...)`. For full details on the values and descriptions of the keys, view [here](https://github.com/onflow/fcl-js/tree/master/packages/sdk/src/response).

| Key                 |
| ------------------- |
| `tag`               |
| `transaction`       |
| `transactionStatus` |
| `transactionId`     |
| `encodedData`       |
| `events`            |
| `account`           |
| `block`             |
| `blockHeader`       |
| `latestBlock`       |
| `collection`        |

### `Event Object`

| Key                | Value Type              | Description                                                                                           |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `blockId`          | string                  | ID of the block that contains the event.                                                              |
| `blockHeight`      | number                  | Height of the block that contains the event.                                                          |
| `blockTimestamp`   | string                  | The timestamp of when the block was sealed in a `DateString` format. eg. `'2021-06-25T13:42:04.227Z'` |
| `type`             | [EventName](#eventname) | A string containing the event name.                                                                   |
| `transactionId`    | string                  | Can be used to query transaction information, eg. via a Flow block explorer.                          |
| `transactionIndex` | number                  | Used to prevent replay attacks.                                                                       |
| `eventIndex`       | number                  | Used to prevent replay attacks.                                                                       |
| `data`             | any                     | The data emitted from the event.                                                                      |

### `Account Status Event Object`

| Key                | Value Type              | Description                                                                                           |
| ------------------ | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `blockId`          | string                  | ID of the block that contains the event.                                                              |
| `blockHeight`      | number                  | Height of the block that contains the event.                                                          |
| `blockTimestamp`   | string                  | The timestamp of when the block was sealed in a `DateString` format. eg. `'2021-06-25T13:42:04.227Z'` |
| `type`             | [EventName](#eventname) | A string containing the event name.                                                                   |
| `transactionId`    | string                  | Can be used to query transaction information, eg. via a Flow block explorer.                          |
| `transactionIndex` | number                  | Used to prevent replay attacks.                                                                       |
| `eventIndex`       | number                  | Used to prevent replay attacks.                                                                       |
| `data`             | any                     | The data emitted from the event.                                                                      |
| `accountAddress`   | [Address](#address)     | The address of the account where the status change occurred.                                          |

### `Transaction Statuses`

The status of a transaction will depend on the Flow blockchain network and which phase it is in as it completes and is finalized.

| Status Code | Description                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------- |
| `0`         | Unknown                                                                                                               |
| `1`         | Transaction Pending - Awaiting Finalization                                                                           |
| `2`         | Transaction Finalized - Awaiting Execution                                                                            |
| `3`         | Transaction Executed - Awaiting Sealing                                                                               |
| `4`         | Transaction Sealed - Transaction Complete. At this point the transaction result has been committed to the blockchain. |
| `5`         | Transaction Expired                                                                                                   |

### `GRPC Statuses`

The access node GRPC implementation follows the standard GRPC Core status code spec. View [here](https://grpc.github.io/grpc/core/md_doc_statuscodes.html).

### `FType`

FCL arguments must specify one of the following support types for each value passed in.

| Type         | Example                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| `UInt`       | `fcl.arg(1, t.UInt)`                                                                                                 |
| `UInt8`      | `fcl.arg(8, t.UInt8)`                                                                                                |
| `UInt16`     | `fcl.arg(16, t.UInt16)`                                                                                              |
| `UInt32`     | `fcl.arg(32, t.UInt32)`                                                                                              |
| `UInt64`     | `fcl.arg(64, t.UInt64)`                                                                                              |
| `UInt128`    | `fcl.arg(128, t.UInt128)`                                                                                            |
| `UInt256`    | `fcl.arg(256, t.UInt256)`                                                                                            |
| `Int`        | `fcl.arg(1, t.Int)`                                                                                                  |
| `Int8`       | `fcl.arg(8, t.Int8)`                                                                                                 |
| `Int16`      | `fcl.arg(16, t.Int16)`                                                                                               |
| `Int32`      | `fcl.arg(32, t.Int32)`                                                                                               |
| `Int64`      | `fcl.arg(64, t.Int64)`                                                                                               |
| `Int128`     | `fcl.arg(128, t.Int128)`                                                                                             |
| `Int256`     | `fcl.arg(256, t.Int256)`                                                                                             |
| `Word8`      | `fcl.arg(8, t.Word8)`                                                                                                |
| `Word16`     | `fcl.arg(16, t.Word16)`                                                                                              |
| `Word32`     | `fcl.arg(32, t.Word32)`                                                                                              |
| `Word64`     | `fcl.arg(64, t.Word64)`                                                                                              |
| `UFix64`     | `fcl.arg("64.123", t.UFix64)`                                                                                        |
| `Fix64`      | `fcl.arg("64.123", t.Fix64)`                                                                                         |
| `String`     | `fcl.arg("Flow", t.String)`                                                                                          |
| `Character`  | `fcl.arg("c", t.String)`                                                                                             |
| `Bool`       | `fcl.arg(true, t.String)`                                                                                            |
| `Address`    | `fcl.arg("0xABC123DEF456", t.Address)`                                                                               |
| `Optional`   | `fcl.arg("Flow", t.Optional(t.String))`                                                                              |
| `Array`      | `fcl.args([ fcl.arg(["First", "Second"], t.Array(t.String)) ])`                                                      |
| `Dictionary` | `fcl.args([fcl.arg([{key: 1, value: "one"}, {key: 2, value: "two"}], t.Dictionary({key: t.Int, value: t.String}))])` |
| `Path`       | `fcl.arg({ domain: "public", identifier: "flowTokenVault" }, t.Path)`                                                |

---

### `EventFilter`

An object that contains the parameters to filter events, used for event streaming in the [`fcl.events`](#events) function.

| Name                     | Value Type                | Description                                                                                                             |
| ------------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `startBlockId`           | string &#124; undefined   | The block ID to start listening for events. Example: `9dda5f281897389b99f103a1c6b180eec9dac870de846449a302103ce38453f3` |
| `startHeight`            | number &#124; undefined   | The block height to start listening for events. Example: `123`                                                          |
| `eventTypes`             | string[] &#124; undefined | The event types to listen for. Example: `A.7e60df042a9c0868.FlowToken.TokensWithdrawn`                                  |
| `addresses`              | string[] &#124; undefined | The addresses to listen for. Example: `0x7e60df042a9c0868`                                                              |
| `contracts`              | string[] &#124; undefined | The contracts to listen for. Example: `0x7e60df042a9c0868`                                                              |
| `opts.heartbeatInterval` | number &#124; undefined   | The interval in milliseconds to send a heartbeat to the Access Node. Example: `10000`                                   |

### `StreamConnection`

A stream connection is an object for subscribing to generic data from any WebSocket data stream. This is the base type for all stream connections. Two channels, `close` and `error`, are always available, as they are used to signal the end of the stream and any errors that occur.

```ts
interface StreamConnection<ChannelMap extends { [name: string]: any }> {
  // Subscribe to a channel
  on<C extends keyof ChannelMap>(
    channel: C,
    listener: (data: ChannelMap[C]) => void,
  ): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'error', listener: (err: any) => void): this;

  // Unsubscribe from a channel
  off<C extends keyof ChannelMap>(
    event: C,
    listener: (data: ChannelMap[C]) => void,
  ): this;
  off(event: 'close', listener: () => void): this;
  off(event: 'error', listener: (err: any) => void): this;

  // Close the connection
  close(): void;
}
```

#### Usage

```ts
import { StreamConnection } from "@onflow/typedefs"

const stream: StreamConnection = ...

stream.on("close", () => {
  // Handle close
})

stream.on("error", (err) => {
  // Handle error
})

stream.close()
```

### `EventStream`

An event stream is a stream connection that emits events and block heartbeats. Based on the connection parameters, heartbeats will be emitted at least as often as some fixed block height interval. It is a specific variant of a [StreamConnection](#streamconnection).

```ts
type EventStream = StreamConnection<{
  events: Event[];
  heartbeat: BlockHeartbeat;
}>;
```

#### Usage

```ts
import { EventStream } from "@onflow/typedefs"

const stream: EventStream = ...

stream.on("events", (events) => {
  // Handle events
})

stream.on("heartbeat", (heartbeat) => {
  // Handle heartbeat
})

// Close the stream
stream.close()
```

### `BlockHeartbeat`

```ts
export interface BlockHeartbeat {
  blockId: string;
  blockHeight: number;
  timestamp: string;
}
```

#### Usage

```ts
import { BlockHeartbeat } from "@onflow/typedefs"

const heartbeat: BlockHeartbeat = ...
```

### `SignatureObject`

Signature objects are used to represent a signature for a particular message as well as the account and keyId which signed for this message.

| Key         | Value Type          | Description                                                                                  |
| ----------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `addr`      | [Address](#address) | the address of the account which this signature has been generated for                       |
| `keyId`     | number              | The index of the key to use during authorization. (Multiple keys on an account is possible). |
| `signature` | string              | a hexidecimal-encoded string representation of the generated signature                       |

### `SubscriptionParams`

```ts
import { SubscriptionParams } from '@onflow/typedefs';
```

An object containing the subscription topic, arguments, and callbacks. The `SubscriptionParams` type is a generic type that takes a `SubscriptionTopic` as a parameter.

```ts
interface SubscriptionParams<T extends SubscriptionTopic> {
  topic: T;
  args: SubscriptionArgs<T>;
  onData: (data: SubscriptionData<T>) => void;
  onError: (error: Error) => void;
}
```

| Key       | Value Type                                | Description                                                                           |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| `topic`   | [`SubscriptionTopic`](#subscriptiontopic) | The topic to subscribe to. This determines the type of data that will be received.    |
| `args`    | [`SubscriptionArgs`](#subscriptionargs)   | The arguments specific to the topic. This may include filters or other parameters.    |
| `onData`  | function                                  | A callback function that will be called with the data received from the subscription. |
| `onError` | function                                  | A callback function that will be called if an error occurs during the subscription.   |

### `SubscriptionTopic`

Import:

```ts
import { SubscriptionTopic } from '@onflow/typedefs';
```

The `SubscriptionTopic` is an enum that defines the different topics that can be subscribed to. Each topic corresponds to a specific type of data that can be received from the subscription.

The available topics are:

```ts
enum SubscriptionTopic {
  BLOCKS = 'blocks',
  BLOCK_HEADERS = 'block_headers',
  BLOCK_DIGESTS = 'block_digests',
  ACCOUNT_STATUSES = 'account_statuses',
  TRANSACTION_STATUSES = 'transaction_statuses',
  EVENTS = 'events',
}
```

### `SubscriptionArgs`

```ts
import { type SubscriptionArgs } from '@onflow/typedefs';
```

Type definition:

```ts
type SubscriptionArgs<T extends SubscriptionTopic> = {
  [K in T]: K extends 'blocks' | 'block_headers' | 'block_digests'
    ?
        | BlockSubscriptionAtLatestArgs
        | BlockSubscriptionAtIdArgs
        | BlockSubscriptionAtHeightArgs
    : K extends 'account_statuses'
    ? AccountStatusSubscriptionArgs
    : K extends 'transaction_statuses'
    ? TransactionStatusSubscriptionArgs
    : K extends 'events'
    ? EventSubscriptionArgs
    : never;
}[T];
```

An array or object of parameters specific to the topic. For example, when subscribing to events, these might be event identifiers.

Usage:

```ts
const args: SubscriptionArgs<SubscriptionTopic.EVENTS> = {
  eventTypes: ['A.7e60df042a9c0868.FlowToken.TokensWithdrawn'],
  addresses: ['0x7e60df042a9c0868'],
};
```

#### Blocks, Block Headers, Block Digests

_Applies to topics: `SubscriptionTopic.BLOCKS`, `SubscriptionTopic.BLOCK_HEADERS`, `SubscriptionTopic.BLOCK_DIGESTS`_

Start at the latest block:

```ts
// Internal type, not exported
type BlockSubscriptionAtLatestArgs = {
  blockStatus: 'finalized' | 'sealed';
};
```

Start at a specific block ID:

```ts
// Internal type, not exported
type BlockSubscriptionAtIdArgs = {
  blockStatus: 'finalized' | 'sealed';
  startBlockId: string;
};
```

Start at a specific block height:

```ts
// Internal type, not exported
type BlockSubscriptionAtHeightArgs = {
  blockStatus: 'finalized' | 'sealed';
  startBlockHeight: number;
};
```

#### Account Statuses

_Applies to topic: `SubscriptionTopic.ACCOUNT_STATUSES`_

```ts
// Internal type, not exported
type AccountStatusSubscriptionArgs = {
  startBlockId?: string;
  startBlockHeight?: number;
  eventTypes?: string[];
  addresses?: string[];
  accountAddresses?: string[];
};
```

#### Transaction Statuses

_Applies to topic: `SubscriptionTopic.TRANSACTION_STATUSES`_

```ts
// Internal type, not exported
type TransactionStatusSubscriptionArgs = {
  transactionId: string;
};
```

#### Events

_Applies to topic: `SubscriptionTopic.EVENTS`_

Type definition:

```ts
// Internal type, not exported
type EventSubscriptionArgs = {
  startBlockId?: string;
  startBlockHeight?: number;
  eventTypes?: string[];
  addresses?: string[];
  contracts?: string[];
};
```

### `SubscriptionData`

**Import:**

```ts
import { type SubscriptionData } from '@onflow/typedefs';
```

The data returned by the subscription. This will vary depending on the topic.

This is a generic type that takes a `SubscriptionTopic` as a parameter.

```ts
type SubscriptionData<T extends SubscriptionTopic> = {
  [K in T]: K extends 'blocks'
    ? Block
    : K extends 'block_headers'
    ? BlockHeader
    : K extends 'block_digests'
    ? BlockDigest
    : K extends 'account_statuses'
    ? AccountStatus
    : K extends 'transaction_statuses'
    ? TransactionStatus
    : K extends 'events'
    ? Event
    : never;
}[T];
```

#### Blocks

_Applies to topic: `SubscriptionTopic.BLOCKS`_

See [BlockObject](#blockobject).

#### Block Headers

_Applies to topic: `SubscriptionTopic.BLOCK_HEADERS`_

See [BlockHeaderObject](#blockheaderobject).

#### Block Digests

_Applies to topic: `SubscriptionTopic.BLOCK_DIGESTS`_

See BlockDigestObject.

#### Account Statuses

_Applies to topic: `SubscriptionTopic.ACCOUNT_STATUSES`_

See AccountStatusObject.

#### Transaction Statuses

_Applies to topic: `SubscriptionTopic.TRANSACTION_STATUSES`_

See [TransactionStatusObject](#transactionstatusobject).

#### Events

_Applies to topic: `SubscriptionTopic.EVENTS`_

See [EventObject](#event-object).

### `RawSubscriptionData`

```ts
import { type RawSubscriptionData } from '@onflow/typedefs';
```

A raw data returned by the subscription. This will vary depending on the topic.

This is a generic type that takes a `SubscriptionTopic` as a parameter.

```ts
type RawSubscriptionData<T extends SubscriptionTopic> = {
  [K in T]: K extends 'blocks'
    ? RawBlock
    : K extends 'block_headers'
    ? RawBlockHeader
    : K extends 'block_digests'
    ? RawBlockDigest
    : K extends 'account_statuses'
    ? RawAccountStatus
    : K extends 'transaction_statuses'
    ? RawTransactionStatus
    : K extends 'events'
    ? RawEvent
    : never;
}[T];
```

#### Blocks

_Applies to topic: `SubscriptionTopic.BLOCKS`_

Type definition:

```ts
// Internal type, not exported
type RawBlock = {
  block: {
    id: string;
    parentId: string;
    height: number;
    timestamp: string;
    collectionGuarantees: {
      collectionId: string;
      signatures: {
        addr: string;
        keyId: number;
        signature: string;
      }[];
    }[];
    blockSeals: {
      addr: string;
      keyId: number;
      signature: string;
    }[];
    signatures: {
      addr: string;
      keyId: number;
      signature: string;
    }[];
  };
};
```

#### Block Headers

_Applies to topic: `SubscriptionTopic.BLOCK_HEADERS`_

Type definition:

```ts
// Internal type, not exported
type RawBlockHeader = {
  blockHeader: {
    id: string;
    parentId: string;
    height: number;
    timestamp: string;
    parentVoterSignature: string;
  };
};
```

#### Block Digests

_Applies to topic: `SubscriptionTopic.BLOCK_DIGESTS`_

Type definition:

```ts
// Internal type, not exported
type RawBlockDigest = {
  blockDigest: {
    id: string;
    parentId: string;
    height: number;
    timestamp: string;
  };
};
```

#### Account Statuses

_Applies to topic: `SubscriptionTopic.ACCOUNT_STATUSES`_

Type definition:

```ts
// Internal type, not exported
type RawAccountStatus = {
  accountStatus: {
    accountAddress: string;
    blockId: string;
    blockHeight: number;
    type: string;
    transactionId: string;
    transactionIndex: number;
    eventIndex: number;
    payload: {
      type: string;
      value: any;
    };
  };
};
```

#### Transaction Statuses

_Applies to topic: `SubscriptionTopic.TRANSACTION_STATUSES`_

Type definition:

```ts
// Internal type, not exported
type RawTransactionStatus = {
  transactionStatus: {
    blockId: string;
    status: TransactionExecutionStatus;
    statusString: string;
    statusCode: 0 | 1;
    errorMessage: string;
    events: {
      type: string;
      transactionId: string;
      transactionIndex: number;
      eventIndex: number;
      payload: {
        type: string;
        value: any;
      };
    }[];
  };
};
```

#### Events

_Applies to topic: `SubscriptionTopic.EVENTS`_

Type definition:

```ts
// Internal type, not exported
type RawEvent = {
  event: {
    blockId: string;
    blockHeight: number;
    blockTimestamp: string;
    type: string;
    transactionId: string;
    transactionIndex: number;
    eventIndex: number;
    payload: {
      type: string;
      value: any;
    };
  };
};
```
