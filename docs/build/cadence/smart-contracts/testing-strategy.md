---
title: Testing Smart Contracts
sidebar_label: Testing Smart Contracts
sidebar_position: 3
description: A layered testing strategy for Flow—unit tests, forked integration, and a forked emulator sandbox. Guidance for reproducibility and simple CI setup.
keywords:
  - testing strategy
  - unit testing
  - integration testing
  - fork testing
  - flow test --fork
  - flow emulator --fork
  - emulator
  - testnet
  - CI pipeline
  - continuous integration
  - reproducibility
  - fork-height
  - block height pinning
  - test selection
  - smoke tests
  - E2E testing
  - account impersonation
  - test troubleshooting
  - golden files
  - test automation
  - Flow CLI
  - Cadence tests
  - spork boundaries
---

# Testing Smart Contracts

A single, pragmatic strategy for testing on Flow. Use layers that are deterministic and isolated by default, add realism with forks when needed, and keep a minimal set of live network checks before release.

## At a glance

- **Unit & Property — Test Framework**: Hermetic correctness and invariants
- **Integration — Fork Testing**: Real contracts and data; mutations stay local
- **Local integration sandbox (interactive, `flow emulator --fork`)**: Drive apps/E2E against production-like state
- **Staging (testnet)**: Final plumbing and config checks
- **Post-deploy (read-only)**: Invariant dashboards and alerts

## Layers

### Unit & Property — Test Framework

- Use `flow test`
- **Use when**: Validating Cadence logic, invariants, access control, error paths, footprint
- **Why**: Fully deterministic and isolated; highest-regression signal
- **Run**: Every commit/PR; wide parallelism
- **Notes**: Write clear success/failure tests, add simple “this should always hold” rules when helpful, and avoid external services

See also: [Running Cadence Tests].

### Integration — Fork Testing

- **Use when**: Interacting with real on-chain contracts/data (FT/NFT standards, AMMs, wallets, oracles, bridges), upgrade checks, historical repro
- **Why**: Real addresses, capability paths, and resource schemas; catches drift early
- **Run**: On PRs, run the full forked suite if practical (pinned), or a small quick set; run more cases nightly or on main
- **How**: Configure with `#test_fork(network: "mainnet", height: nil)` in your test file, or use `flow test --fork` CLI flags
- **Notes**:
  - Pin with `height: 85432100` in the pragma (or `--fork-height` CLI flag) where reproducibility matters
  - Prefer local deployment + impersonation over real mainnet accounts
  - Mutations are local to the forked runtime; the live network is never changed
  - Be mindful of access-node availability and rate limits
  - External oracles/protocols: forked tests do not call off-chain services or other chains; mock these or run a local stub

See also: [Fork Testing with Cadence], [Fork Testing Flags].

### Local Integration Sandbox — `flow emulator --fork`

- **Use when**: Driving dapps, wallets, bots, indexers, or exploratory debugging outside the test framework
- **Why**: Production-like state with local, disposable control; great for E2E and migrations
- **Run**: Dev machines and focused E2E CI jobs
- **Notes**:
  - Pin height; run on dedicated ports; impersonation is built-in; mutations are local; off-chain/oracle calls are not live—mock or run local stubs
  - What to run: Manual exploration and debugging of flows against a forked state; frontend connected to the emulator (e.g., `npm run dev` pointed at `http://localhost:8888`); automated E2E/FE suites (e.g., Cypress/Playwright) against the local fork; headless clients, wallets/bots/indexers, and migration scripts
  - Not for the canonical Cadence test suite—prefer fork testing with `flow test` for scripted Cadence tests (see [Fork Testing Flags] and [Running Cadence Tests])

  Quick start example:

  ```bash
  # Start a fork (pinning height recommended for reproducibility)
  flow emulator --fork mainnet --fork-height <BLOCK>
  ```

  ```javascript
  // In your root component (e.g., App.tsx)
  import { FlowProvider } from '@onflow/react-sdk';

  function App() {
    return (
      <FlowProvider config={{ accessNodeUrl: 'http://localhost:8888' }}>
        {/* Your app components */}
      </FlowProvider>
    );
  }
  ```

  ```bash
  # Run app
  npm run dev

  # Run E2E tests
  npx cypress run
  ```

See also: [Flow Emulator].

### Staging — Testnet

- **Use when**: Final network plumbing and configuration checks before release
- **Why**: Validates infra differences you cannot fully simulate
- **Run**: Pre-release and on infra changes
- **Notes**:
  - Keep canaries minimal and time-boxed; protocol/partner support may be limited on testnet (not all third-party contracts are deployed or up to date)
  - What to run: Minimal app smoke tests (login/auth, key flows, mint/transfer, event checks); frontend connected to Testnet with a small Cypress/Playwright smoke set; infra/config checks (endpoints, contract addresses/aliases, env vars, service/test accounts)
  - Not for the canonical Cadence test suite — prefer fork testing with `flow test` for scripted tests (see [Fork Testing Flags] and [Running Cadence Tests])

  Quick start example:

  ```javascript
  // In your root component (e.g., App.tsx)
  import { FlowProvider } from '@onflow/react-sdk';

  function App() {
    return (
      <FlowProvider
        config={{ accessNodeUrl: 'https://rest-testnet.onflow.org' }}
      >
        {/* Your app components */}
      </FlowProvider>
    );
  }
  ```

  ```bash
  # Run app
  npm run dev

  # Run smoke tests
  npx cypress run --spec "cypress/e2e/smoke.*"
  ```

See also: [Flow Networks].

### Post-deploy Monitoring (read-only)

- **Use when**: After releases to confirm invariants and event rates
- **Why**: Detects real-world anomalies quickly
- **Run**: Continuous dashboards/alerts tied to invariants

## Reproducibility and data management

- **Pin where reproducibility matters**: Use `--fork-height <block>` for both `flow test --fork` and `flow emulator --fork`. Pins are per‑spork; historical data beyond spork boundaries is unavailable. For best results, keep a per‑spork stable pin and also run a "latest" freshness job.
- **Named snapshots**: Maintain documented pin heights (e.g., in CI vars or a simple file) with names per dependency/protocol
- **Refresh policy**: Advance pins via a dedicated “freshness” PR; compare old vs. new pins
- **Goldens**: Save a few canonical samples (e.g., event payloads, resource layouts, key script outputs) as JSON in your repo, and compare them in CI to catch accidental schema/shape changes. Update the samples intentionally as part of upgrades.

## CI tips

- PRs: Run emulator unit/property and forked integration (pinned). Full suite is fine if practical; otherwise a small quick set.
- Nightly/Main: Add a latest pin job and expand fork coverage as needed.
- E2E (optional): Use `flow emulator --fork` at a stable pin and run your browser tests.

## Test selection and tagging

- **Optional naming helpers**: Use simple suffixes in test names like `_fork`, `_smoke`, `_e2e` if helpful
- Run the tests you care about by passing files/directories: `flow test FILE1 FILE2 DIR1 ...` (most common)
- Optionally, use `--name <substring>` to match test functions when it’s convenient
- **Defaults**: PRs can run the full fork suite (pinned) or a small quick set; nightly runs broader coverage (+ optional E2E)

## Troubleshooting tips

- Re-run at the same `--fork-height`, then at latest
- Compare contract addresses/aliases in `flow.json`
- Diff event/resource shapes against your stored samples
- Check access-node health and CI parallelism/sharding

## Do / Don’t

- **Do**: Keep a fast, hermetic base; pin forks; tag tests; maintain tiny PR smoke sets; document pins and set a simple refresh schedule (e.g., after each spork or monthly)
- **Don't**: Make "latest" your default in CI; create or rely on real mainnet accounts; conflate fork testing (`flow test`) with the emulator's fork mode (`flow emulator --fork`)

## Related docs

- Guide → Running tests: [Running Cadence Tests]
- Guide → How-to: [Cadence Testing Framework]
- Tutorial → Step-by-step: [Fork Testing with Cadence]
- Tool → Emulator (including fork mode): [Flow Emulator]
- Reference → Fork testing flags: [Fork Testing Flags]

<!-- Reference-style links -->

[Running Cadence Tests]: ../../tools/flow-cli/tests.md
[Cadence Testing Framework]: ./testing.md
[Fork Testing with Cadence]: ../../../blockchain-development-tutorials/cadence/fork-testing/index.md
[Flow Emulator]: ../../tools/emulator/index.md
[Fork Testing Flags]: ../../tools/flow-cli/tests.md#fork-testing-flags
[Flow Networks]: ../../../protocol/flow-networks/index.md
[Network Upgrade (Spork) Process]: ../../../protocol/node-ops/node-operation/network-upgrade.md
[Flow CLI Configuration (flow.json)]: ../../tools/flow-cli/flow.json/initialize-configuration.md
[Dependency Manager]: ../../tools/flow-cli/dependency-manager.md
[Cadence Testing Framework]: https://cadence-lang.org/docs/testing-framework
