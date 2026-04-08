---
title: Cadence Linter
description: A static-analysis tool for finding potential issues in Cadence code
sidebar_position: 14
---

The Cadence Linter is a static-analysis tool you can use to find potential issues in Cadence code. It is available in the Flow CLI and is designed to help developers write better code by identifying common mistakes and potential issues before they become problems.

The linter will also check your code for any syntax or semantic errors, and provide suggestions for how to fix them.

```shell
flow cadence lint [files]
```

## Example use

```shell
flow cadence lint **/*.cdc
```

## Example output

```shell
test.cdc:27:6: semantic-error: cannot find variable in this scope: `abc`

test.cdc:35:6: removal-hint: unnecessary force operator

2 problems (1 error, 1 warning)
```

:::info

The Cadence Linter is also available in the [Cadence VSCode extension], which provides real-time feedback as you write your code.

:::

<!-- Reference-style links, will not render on page. -->

[Cadence VSCode extension]: ../vscode-extension/index.md