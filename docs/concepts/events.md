# Events

Flow events are special values that can be emitted during the execution of a Cadence program. 

Events are defined as Cadence code and you should [read Cadence documentation](https://developers.flow.com/cadence/language/events) to understand how to define them. 

Since transactions don’t have return values you can leverage events to broadcast certain changes the transaction caused. Clients listening on Flow networks (dApps) can listen to these events being emitted and react. 

![Screenshot 2023-08-18 at 14.09.33.png](Events%201266591639544dbdb4056c8e30c58dc1/Screenshot_2023-08-18_at_14.09.33.png)

There are two types of events emitted on the Flow network:

- Core events
- User-defined events

Events consist of the **event name** and an optional **payload**.

![Screenshot 2023-08-18 at 13.59.01.png](Events%201266591639544dbdb4056c8e30c58dc1/Screenshot_2023-08-18_at_13.59.01.png)

## Core Events

Core events are events emitted directly from the FVM (Flow Virtual Machine). The events have the same name on all networks and do not follow the same naming as user-defined events (they have no address).

A list of events that are emitted by the Flow network is:

| Event Name | Description |
| --- | --- |
| flow.AccountCreated | Event that is emitted when a new account gets created. |
| flow.AccountKeyAdded  | Event that is emitted when a key gets added to an account. |
| flow.AccountKeyRemoved  | Event that is emitted when a key gets removed from an account. |
| flow.AccountContractAdded  | Event that is emitted when a contract gets deployed to an account. |
| flow.AccountContractUpdated | Event that is emitted when a contract gets updated on an account. |
| flow.AccountContractRemoved  | Event that is emitted when a contract gets removed from an account. |
| flow.InboxValuePublished | Event that is emitted when a Capability is published from an account. |
| flow.InboxValueUnpublished | Event that is emitted when a Capability is unpublished from an account. |
| flow.InboxValueClaimed1 | Event that is emitted when a Capability is claimed by an account. |

For more details [on the core events, you can read Cadence reference documentation](https://developers.flow.com/cadence/language/core-events).

## User-defined events

Events that are defined inside contracts and when emitted follow a common naming schema. The schema consists of 4 parts: 

```json
A.{contract address}.{contract name}.{event type}
```

An example event would look like:

![Screenshot 2023-08-18 at 14.30.36.png](Events%201266591639544dbdb4056c8e30c58dc1/Screenshot_2023-08-18_at_14.30.36.png)

The first `A` means the event is originating from a contract, which will always be the case for user-defined events. The contract address as the name implies is the location of a contract deployed on the Flow network. Next is the name of the contracted event originates from, and last is the event type defined in the contract.

There are an unlimited amount of events that can be defined on Flow, but you should know about the most common ones. 

### Flow Token Events

The Flow Token contract is the contract that issues a core Flow token. As with any contract, it can emit events when interacted with. When we transfer the Flow token, events are emitted. You can find a lot of details on the events emitted in the [Flow Token documentation](https://developers.flow.com/concepts/core-contracts/flow-token). 

The most popular events are when tokens are transferred which is accomplished with two actions: withdrawing tokens from the payer and depositing tokens in the receiver. Each of those action has a corresponding event:

**Withdraw Tokens**

Event name: `TokensWithdrawn`

Mainnet event: `A.1654653399040a61.FlowToken.TokensWithdrawn`

Testnet event: `A.7e60df042a9c0868.FlowToken.TokensWithdrawn`

****************************Deposit Tokens****************************

Event name: `TokensDeposited`

Mainnet event: `A.1654653399040a61.FlowToken.TokensDeposited`

Testnet event: `A.7e60df042a9c0868.FlowToken.TokensDeposited`

### ********************Fee Events********************

Since fees are governed by a contract deployed on the Flow network, that contract also emits events when fees are deducted. 

Charging fees consists of a couple of steps:

- Calculate and deduct fees
- Withdraw Flow tokens from the payer account
- Deposit Flow tokens to the fees contract

These events are very common since they accommodate all transactions on Flow. Each fee deduction will be reflected in 3 events, two withdraw and deposit Flow token events and one fee deduction event. 

An example of fee events:

```json
Events:		
    Index	0
    Type	A.1654653399040a61.FlowToken.TokensWithdrawn
    Tx ID	1ec90051e3bc74fc36cbd16fc83df08e463dda8f92e8e2193e061f9d41b2ad92
    Values
		- amount (UFix64): 0.00000100
		- from (Address?): 0xb30eb2755dca4572

    Index	1
    Type	A.1654653399040a61.FlowToken.TokensDeposited
    Tx ID	1ec90051e3bc74fc36cbd16fc83df08e463dda8f92e8e2193e061f9d41b2ad92
    Values
		- amount (UFix64): 0.00000100
		- to (Address?): 0xf919ee77447b7497

    Index	2
    Type	A.f919ee77447b7497.FlowFees.FeesDeducted
    Tx ID	1ec90051e3bc74fc36cbd16fc83df08e463dda8f92e8e2193e061f9d41b2ad92
    Values
		- amount (UFix64): 0.00000100
		- inclusionEffort (UFix64): 1.00000000
		- executionEffort (UFix64): 0.00000000
```