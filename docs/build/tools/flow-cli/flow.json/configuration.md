---
title: Configuration
description: Understanding and configuring your Flow project with flow.json
sidebar_position: 2
---

The `flow.json` file is the central configuration file for your Flow project. It tells the Flow CLI how to interact with networks, manage accounts, deploy contracts, and organize your project structure.

## Quick Start

When you run `flow init`, a basic `flow.json` file is created for you:

```json
{
  "networks": {
    "emulator": "127.0.0.1:3569",
    "mainnet": "access.mainnet.nodes.onflow.org:9000",
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "accounts": {
    "emulator-account": {
      "address": "f8d6e0586b0a20c7",
      "key": "ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee"
    }
  },
  "deployments": {},
  "contracts": {}
}
```

This gives you everything you need to get started with local development. As your project grows, you'll add more configuration to support different networks and deployment targets.

## Configuration Sections

### Networks

The `networks` section defines which Flow networks your project can connect to.

```json
"networks": {
  "emulator": "127.0.0.1:3569",
  "mainnet": "access.mainnet.nodes.onflow.org:9000",
  "testnet": "access.devnet.nodes.onflow.org:9000"
}
```

**Common Networks:**
- `emulator`: Your local development environment
- `testnet`: Flow's test network for development and testing
- `mainnet`: Flow's production network

**Secure Connections:**
For enhanced security, you can specify network keys:

```json
"networks": {
  "testnetSecure": {
    "host": "access-001.devnet30.nodes.onflow.org:9001",
    "key": "ba69f7d2e82b9edf25b103c195cd371cf0cc047ef8884a9bbe331e62982d46daeebf836f7445a2ac16741013b192959d8ad26998aff12f2adc67a99e1eb2988d"
  }
}
```

### Accounts

The `accounts` section defines the accounts you can use for transactions and deployments.

#### Simple Account Format

```json
"accounts": {
  "my-account": {
    "address": "f8d6e0586b0a20c7",
    "key": "ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee"
  }
}
```

#### Advanced Account Format

For more control over key management:

```json
"accounts": {
  "my-account": {
    "address": "f8d6e0586b0a20c7",
    "key": {
      "type": "hex",
      "index": 0,
      "signatureAlgorithm": "ECDSA_P256",
      "hashAlgorithm": "SHA3_256",
      "privateKey": "ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee"
    }
  }
}
```

**Key Types:**
- `hex`: Standard hex-encoded private key
- `file`: Read key from a separate file
- `bip44`: Derive from mnemonic phrase
- `google-kms`: Use Google Cloud KMS

**File-Based Keys:**
For better security, you can store private keys in separate files:

```json
"accounts": {
  "admin-account": {
    "address": "f8d6e0586b0a20c7",
    "key": {
      "type": "file",
      "location": "./keys/admin.key"
    }
  }
}
```

The key file should contain only the hex-encoded private key (e.g., `ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee`).

**Special Address Values:**
- `"service"`: Use the default service account (emulator only)

### Contracts

The `contracts` section maps contract names to their source files.

#### Simple Contract Format

```json
"contracts": {
  "MyContract": "./cadence/contracts/MyContract.cdc",
  "AnotherContract": "./cadence/contracts/AnotherContract.cdc"
}
```

#### Advanced Contract Format with Aliases

Use aliases when contracts are already deployed on specific networks:

```json
"contracts": {
  "FungibleToken": {
    "source": "./cadence/contracts/FungibleToken.cdc",
    "aliases": {
      "testnet": "9a0766d93b6608b7",
      "mainnet": "f233dcee88fe0abe"
    }
  }
}
```

**When to Use Aliases:**
- For core contracts already deployed on mainnet/testnet
- To avoid redeploying dependencies
- To use the official versions of common contracts

#### Cadence Import Aliasing

When deploying the same contract to multiple addresses with different names, use the `canonical` field to reference the original contract. This allows you to import multiple instances of the same contract with different identifiers.

```json
"contracts": {
  "FUSD": {
    "source": "./contracts/FUSD.cdc",
    "aliases": {
      "testnet": "0x9a0766d93b6608b7"
    }
  },
  "FUSD1": {
    "source": "./contracts/FUSD.cdc",
    "aliases": {
      "testnet": "0xe223d8a629e49c68"
    },
    "canonical": "FUSD"
  }
}
```

Flow CLI automatically transforms imports for aliased contracts:

```cadence
import "FUSD"
import "FUSD1"
```

Becomes:

```cadence
import FUSD from 0x9a0766d93b6608b7
import FUSD as FUSD1 from 0xe223d8a629e49c68
```

### Deployments

The `deployments` section defines which contracts get deployed to which accounts on which networks.

```json
"deployments": {
  "emulator": {
    "emulator-account": ["MyContract", "AnotherContract"]
  },
  "testnet": {
    "my-testnet-account": ["MyContract"]
  }
}
```

**Format:** `"NETWORK": { "ACCOUNT": ["CONTRACT1", "CONTRACT2"] }`

**Important Notes:**
- Don't deploy contracts that have aliases defined for that network
- Contracts are deployed in dependency order automatically
- You can deploy the same contract to multiple accounts (but not in the same deploy command)

### Emulators

Customize emulator settings (optional):

```json
"emulators": {
  "custom-emulator": {
    "port": 3600,
    "serviceAccount": "emulator-account"
  }
}
```

## Complete Example

Here's a complete `flow.json` for a project with multiple contracts and networks:

```json
{
  "networks": {
    "emulator": "127.0.0.1:3569",
    "testnet": "access.devnet.nodes.onflow.org:9000",
    "mainnet": "access.mainnet.nodes.onflow.org:9000"
  },

  "accounts": {
    "emulator-account": {
      "address": "f8d6e0586b0a20c7",
      "key": "ae1b44c0f5e8f6992ef2348898a35e50a8b0b9684000da8b1dade1b3bcd6ebee"
    },
    "testnet-account": {
      "address": "3ae53cb6e3f42a79",
      "key": "12332967fd2bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111"
    }
  },

  "contracts": {
    "FungibleToken": {
      "source": "./cadence/contracts/FungibleToken.cdc",
      "aliases": {
        "testnet": "9a0766d93b6608b7",
        "mainnet": "f233dcee88fe0abe"
      }
    },
    "MyToken": "./cadence/contracts/MyToken.cdc",
    "MyNFT": "./cadence/contracts/MyNFT.cdc"
  },

  "deployments": {
    "emulator": {
      "emulator-account": ["FungibleToken", "MyToken", "MyNFT"]
    },
    "testnet": {
      "testnet-account": ["MyToken", "MyNFT"]
    }
  }
}
```

## Managing Configuration

Instead of editing `flow.json` manually, use the CLI commands:

```bash
# Add an account
flow config add account

# Add a contract
flow config add contract

# Add a deployment
flow config add deployment

# Remove configuration
flow config remove account my-account
```

## Best Practices

1. **Use CLI commands** when possible instead of manual editing
2. **Keep private keys secure** - consider using file-based keys for production
3. **Use aliases** for core contracts to avoid redeployment
4. **Test on emulator first** before deploying to testnet
5. **Use different accounts** for different networks
6. **Backup your configuration** before making major changes

## Related Commands

- [`flow init`](./initialize-configuration.md) - Initialize a new project
- [`flow config add`](./manage-configuration.md) - Add configuration items
- [`flow project deploy`](../deployment/deploy-project-contracts.md) - Deploy contracts
- [`flow accounts create`](../accounts/create-accounts.md) - Create new accounts
