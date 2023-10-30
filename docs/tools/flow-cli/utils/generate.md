---
title: Generate Templates
description: Generate quick templates for contracts, scripts, and transactions.
---

## Generate Quick Templates

The `generate` commands in the Flow CLI offer a practical solution for developers by providing quick templates for contracts, scripts, and transactions. These commands help in setting up the basic structure to save developers time.

### Generate Command
- **Usage**: `generate`
- **Short Description**: Generate new boilerplate files.
- **Group**: `super`
- **Aliases**: `g`

### Generate Contract Template
- **Usage**: `flow generate contract <name>`
- **Short Description**: Generate a new contract.
- **Example**: `flow generate contract HelloWorld`
- **Required Arguments**: 
  - `name`: Name of the contract.
- **Flags**: 
  - **Directory**: Specifies the directory in which the contract files will be generated. If not provided, a default directory is used.
    - Usage: `--dir=<directory_name>`

### Generate Transaction Template
- **Usage**: `flow generate transaction <name>`
- **Short Description**: Generate a new transaction.
- **Example**: `flow generate transaction SomeTransaction`
- **Required Arguments**: 
  - `name`: Name of the transaction.
- **Flags**: 
  - **Directory**: Specifies the directory in which the transaction files will be generated. If not provided, a default directory is used.
    - Usage: `--dir=<directory_name>`

### Generate Script Template
- **Usage**: `flow generate script <name>`
- **Short Description**: Generate a new script.
- **Example**: `flow generate script SomeScript`
- **Required Arguments**: 
  - `name`: Name of the script.
- **Flags**: 
  - **Directory**: Specifies the directory in which the script files will be generated. If not provided, a default directory is used.
    - Usage: `--dir=<directory_name>`
