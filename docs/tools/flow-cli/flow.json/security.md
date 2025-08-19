---
title: Security
description: How to securely use Flow CLI and protect your private keys
sidebar_position: 4
---

Managing accounts and private keys requires careful attention to security. This guide covers best practices for keeping your Flow accounts and private keys secure when using the Flow CLI.

## Security Overview

⚠️ **Critical Warning**: Never commit private keys to source control. Always use secure methods to store and manage your private keys.

The Flow CLI provides several secure options for managing private account data:

1. **File-based keys** - Store keys in separate files
2. **Environment variables** - Use system environment variables
3. **Private configuration files** - Separate sensitive config from main config
4. **Multiple config files** - Merge secure and public configurations

## File-Based Keys

Store private keys in separate files that are excluded from source control.

### Setup

1. **Create a key file** (e.g., `my-account.key`):
```bash
# Only the hex-encoded private key
334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111
```

2. **Add to `.gitignore`**:
```bash
# Private key files
*.key
*.pkey
private.json
.env
```

3. **Configure in `flow.json`**:
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "3ae53cb6e3f42a79",
      "key": {
        "type": "file",
        "location": "./my-account.key"
      }
    }
  }
}
```

### Benefits
- ✅ Keys are never stored in configuration files
- ✅ Easy to manage multiple keys
- ✅ Clear separation of concerns
- ✅ Works with all Flow CLI commands

## Environment Variables

Use environment variables for sensitive data like private keys and addresses.

### Setup

1. **Set environment variables**:
```bash
export FLOW_PRIVATE_KEY="334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111"
export FLOW_ACCOUNT_ADDRESS="3ae53cb6e3f42a79"
```

2. **Reference in `flow.json`**:
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "$FLOW_ACCOUNT_ADDRESS",
      "key": "$FLOW_PRIVATE_KEY"
    }
  }
}
```

3. **Use with CLI commands**:
```bash
FLOW_PRIVATE_KEY="your-key" flow project deploy
```

### Benefits
- ✅ Keys never stored in files
- ✅ Easy to manage different environments
- ✅ Works with CI/CD systems
- ✅ Can be rotated easily

## Private Configuration Files

Create separate configuration files for sensitive data and merge them when needed.

### Setup

1. **Main configuration** (`flow.json`):
```json
{
  "networks": {
    "testnet": "access.devnet.nodes.onflow.org:9000"
  },
  "contracts": {
    "MyContract": "./cadence/contracts/MyContract.cdc"
  }
}
```

2. **Private configuration** (`private.json`):
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "3ae53cb6e3f42a79",
      "key": "334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111"
    }
  }
}
```

3. **Add to `.gitignore`**:
```bash
private.json
secrets.json
*.private.json
```

4. **Use with CLI commands**:
```bash
flow project deploy -f flow.json -f private.json
```

### Benefits
- ✅ Clear separation of public and private data
- ✅ Easy to manage multiple environments
- ✅ Can be shared safely (without private files)
- ✅ Works with all CLI commands

## Environment Files (.env)

Use `.env` files for local development with automatic loading by the CLI.

### Setup

1. **Create `.env` file**:
```bash
# .env
FLOW_PRIVATE_KEY=334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111
FLOW_ACCOUNT_ADDRESS=3ae53cb6e3f42a79
FLOW_NETWORK=testnet
```

2. **Reference in `flow.json`**:
```json
{
  "accounts": {
    "my-testnet-account": {
      "address": "$FLOW_ACCOUNT_ADDRESS",
      "key": "$FLOW_PRIVATE_KEY"
    }
  },
  "networks": {
    "testnet": "access.devnet.nodes.onflow.org:9000"
  }
}
```

3. **Add to `.gitignore`**:
```bash
.env
.env.local
.env.*.local
```

### Benefits
- ✅ Automatic loading by CLI
- ✅ Easy local development
- ✅ Can have different files for different environments
- ✅ Standard practice for many tools

## Multiple Configuration Files

Merge multiple configuration files for complex setups.

### Priority Order

When using multiple files, they are merged in order:
1. **Left to right** - Files specified first have lowest priority
2. **Later files override** - Properties in later files take precedence
3. **Non-overlapping properties** - Are combined from all files

### Example

```bash
flow project deploy -f flow.json -f private.json -f local.json
```

**Result**: `local.json` overrides `private.json`, which overrides `flow.json`

### Use Cases

- **Development**: `flow.json` + `dev-private.json`
- **Staging**: `flow.json` + `staging-private.json`
- **Production**: `flow.json` + `prod-private.json`

## Security Best Practices

### 1. Never Commit Private Keys

```bash
# Always add these to .gitignore
*.key
*.pkey
private.json
secrets.json
.env
.env.local
*.private.json
```

### 2. Use Different Keys for Different Environments

- **Development**: Use testnet keys
- **Staging**: Use separate testnet keys
- **Production**: Use mainnet keys with highest security

### 3. Rotate Keys Regularly

- Generate new keys periodically
- Update configuration files
- Test with new keys before switching

### 4. Limit Key Permissions

- Use keys with minimal required permissions
- Consider using different keys for different operations
- Monitor key usage

### 5. Secure Key Storage

- Use hardware security modules (HSMs) for production
- Consider cloud key management services
- Encrypt key files when possible

## Common Security Mistakes

### ❌ Don't Do This

```json
// flow.json - NEVER do this
{
  "accounts": {
    "my-account": {
      "address": "3ae53cb6e3f42a79",
      "key": "334232967f52bd75234ae9037dd4694c1f00baad63a10c35172bf65fbb8ad1111"
    }
  }
}
```

### ✅ Do This Instead

```json
// flow.json - Safe to commit
{
  "accounts": {
    "my-account": {
      "address": "3ae53cb6e3f42a79",
      "key": {
        "type": "file",
        "location": "./my-account.key"
      }
    }
  }
}
```

## Troubleshooting

### Environment Variables Not Loading

Check that your environment variables are set:
```bash
echo $FLOW_PRIVATE_KEY
```

### Key File Not Found

Verify the key file path in your configuration:
```bash
ls -la ./my-account.key
```

### Multiple Config Files Not Merging

Check the order of your `-f` flags:
```bash
# Correct order (left to right, later overrides earlier)
flow config add account -f flow.json -f private.json
```

## Related Commands

- [`flow config add`](./manage-configuration.md) - Add configuration items securely
- [`flow project deploy`](../../deployment/deploy-project-contracts.md) - Deploy with secure configuration
- [`flow accounts create`](../../accounts/create-accounts.md) - Create accounts securely
