
## Interacting with COAs

COAs expose two interfaces for interaction: one on the Flow EVM side and one on the Cadence resource side.  Let's take a closer look at each of these interfaces...


## Creating a COA

To create a COA, you can use the `COA.create` function in Cadence. This function takes a single argument, the address of the EVM account that the COA will control. The COA will be created with the Cadence resource that calls the `COA.create` function as the owner.

```cadence
import COA from 0xCOA

pub fun createCOA(evmAddress: Address): @COA {
    return COA.create(evmAddress: evmAddress)
}
```

## Interacting with a COA

Once you have created a COA, you can interact with it using the `COA` interface. The `COA` interface provides functions for transferring assets, querying the balance, and more.

```cadence
import COA from 0xCOA

pub fun transferToCOA(coa: @COA, amount: UFix64) {
    coa.withdraw(amount: amount)
}
```