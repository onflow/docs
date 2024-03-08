---
title: Migrating Emulator state to Cadence 1.0
description: How to locally test storage migration and staged contract upgrades on Emulator
sidebar_position: 6
---

Flow CLI provides a command `flow migrate state` to migrate your local emulator
state to Cadence 1.0, and to deploy upgraded contracts to the emulator.
This is useful for locally testing the staged contract upgrades, and to see how the
new network and the upgraded contracts would behave with the migrated data.

## Migration Guide

To test the migration, first you would need an emulator state, created with an emulator/CLI release
that uses a pre-1.0 Cadence version.

### Getting the old state

For example, to get an emulator state with Flow CLI `1.14.0`:

- Start the emulator with the `--persist` flag.
  ```shell
    flow emulator --persist
  ```
- Deploy the pre-1.0 project/contracts to the emulator
- Run transactions if there are any.
- Close the emulator. It is important to make sure the emulator is closed/shutdown before taking the snapshot,
  so that any pending in-memory data would be written to the persisted state properly.
- Locate the persisted state `./flowdb/emulator.sqlite` file, from the project root.

### Migrating the state

Download and install the latest CLI, that runs Cadence 1.0.

- Run `migrate` command against the previously created state.
- The state file (`emulator.sqlite`) can be provided using the `-db-path` flag.
- If there are any contracts that also need to be upgraded, those can be specified using the `--contracts` flag.
  Note that, the paths to these updated contracts must be specified in the `flow.json` file:
  ```json
  {
    "contracts": {
      "Test": "./updated_test_contract.cdc"
    }
  }
  ```
- The migration will produce a report consisting of the migration status.
  This can be enabled by setting the `--save-report` flag.

A sample `migrate` command would look like:

```shell
flow migrate state --db-path=/path/to/emulator.sqlite --save-report=./reports --contracts="Test"
```

### Testing the migrated state

Once the migration completes successfully, the emulator can be started with the migrated state.
For that, ensure the emulator is started again using the new CLI version (that runs Cadence 1.0),
with the `--persist` flag.
Now the emulator should be up and running using the migrated state and the updated contracts.
Run any transactions to verify the correctness of the existing data.