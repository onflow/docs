# Architecture for Concurrent Vote Processing

**Context**
This document only covers the logic for processing the votes. It does *not* discuss the details of how this logic is integrated into the EventHandler. 

# Protocol Level

## Primitives

**Flow nodes** have a 'staking key' (conventional BLS key) 

**The Consensus Committee** $\mathcal{C}$ is the subset of Flow nodes that run HotStuff 

- express their agreement with block proposals through 'HotStuff vote'
- each node has a weight (non-negative integer) assigned to it
- HotStuff a supermajority (strictly more than 2/3 of the total weight) to agree with a block proposal

*Notation:*

- Let $w_i$ be the weight of consensus node $i$. We denote the total weight of the consensus committee as $W := \sum_{i \in \mathcal{C}} w_i$.
- We denote a set of consensus nodes that agree with a block as $c \sube \mathcal{C}$.
- We define the weight of set $c$ as $\texttt{weight}(c) := \sum_{i\in c} w_i$

**The RandomBeacon Committee**  $\mathcal{R}$ is the subset of Flow nodes that run the Random Beacon

- members have a 'threshold-signature' key share, which they use to sign blocks
- the threshold signature scheme has a threshold value $t$, (currently set to 50%)
- the Random Beacon requires honest signatures shares of strictly more that $t$ of Random Beacon Committee members.

*Notation:*

- We denote a set of random beacon contributors as $r \sube \mathcal{R}$.
- We define $\texttt{number}(\mathcal{r}) := |r|$ as the cardinality of set $r$, i.e. the number of Random Beacon members that contributed a threshold signature share.

## Relevant Fundamental Conventions of the Flow Protocol

1. The Random Beacon is run by consensus nodes: $\mathcal{R} \sube \mathcal{C}$
(currently, we have  $\mathcal{R} \equiv \mathcal{C}$)
2. For normal operations, we require live and responsive Consensus and Random Beacon. We couple block-production with the Random Beacon.
    
    ⇒ QC should contain a proof that a supermajority of consensus nodes agreed with the block proposal and a valid Random Beacon group signature.
    
3. Flow incentives performance and participation: slower or lazy (offline) nodes should receive reduced rewards.
    
    ⇒ Participating in the DKG is extra work for consensus nodes. Participation in the Random Beacon should be rewarded. Hence, the QC must contain a proof, which nodes contributed to the random beacon.
    
    ⇒  Participation in Consensus should be rewarded. Hence, the QC must contain a proof, which nodes approved the block proposal 
    

## Further Requirements

1. We want to support case where $\mathcal{R}$ has strictly smaller cardinality than $\mathcal{C}$.
    
    Safety restriction: we can only allow weight distributions for consensus nodes that guarantee  $\forall r \sub \mathcal{R} \textrm{ with } \texttt{weight}(r) < \frac{1}{3}W: \texttt{number}(r) < t$
    
- Conventional BLS signatures can be aggregated. The Identities of the parties whose signatures were included in the aggregate (as well as their multiplicity) need to be stored and transmitted alongside the raw aggregate.
- Threshold signatures have all features of conventional BLS signatures. In addition, they allow the reconstruction of a 'group signature', that is agnostic of the signer set (given more than `t` number of signature shares).

## Validity Requirement for QCs

Per protocol convention, the QC should contain all information for HotStuff as well as the Random Beacon to advance. 

> 👉 A QC must unambiguously prove contributions of a subset $c \sube \mathcal{C}$ (including the specific node identities) of the consensus committee such that
> • $\texttt{weight}(c) > \frac{2}{3}W$ and
> • $\texttt{number}(\mathcal{r}) > t$,  for $r := c ~\cap~ \mathcal{R}$

In our proof of stake extension of HotStuff, node $i$ has an assigned weight $w_i$. The consensus committie’s total weight is $W := \sum_{i \in \mathcal{C}} w_i$. 

As the QC is constructed from votes, the votes must contain all necessary information to construct a valid QC. It is the primary's (aka the leader's) responsibility to collect vote-messages until $c$ satisfies both of these conditions. 

## Desired behavior

Each consensus nodes (including random beacon node) is supposed to contribute by sending vote-messages to the next primary (aka leader or block proposer).  

### Contributions by an individual consensus replica

Members of the consensus committee that are *not* part of the Random Beacon committee:

- can only contribute to HotStuff.

Members of the Random Beacon committee:

- Replicas should contribute to the Random Beacon *and* HotStuff.
- Random Beacon members might voluntarily reduce their utility and contribute only to HotStuff but not the random beacon. This is useful in case a Random beacon member has failed the DKG (or lost its private key share).
- The protocol does *not* allow to only contribute to the Random Beacon but not to HotStuff's progress.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/48abdea3-6ab5-4a9c-9548-eefef9da7c09/Committe_Ven_Diagram.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/48abdea3-6ab5-4a9c-9548-eefef9da7c09/Committe_Ven_Diagram.png)

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/99afe861-d823-4581-83b3-2ad143d65a20/table.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/99afe861-d823-4581-83b3-2ad143d65a20/table.png)

              Table 1: contributions of replicas

- It should be (economically) beneficial for replicas to contribute to the Random Beacon *and* HotStuff. Contributing to HotStuff alone is intended as a fall-back and therefore rewards are reduced in this case.

### Constructing the Quorum Certificate

Consider the case where the primary has collected votes from a subset $c \sube \mathcal{C}$ of the consensus committee. We assume that $c$ is *preconditioned* to contain only *valid votes* and only one vote per replica.

When a new vote arrives, the set $c$ (*before* adding the vote) can be in 4 different states: 

---

(i)

(ii)

(iii)

(iv)

$\texttt{weight}(\mathcal{c})$

---

$\texttt{weight}(c) \leq \frac{2}{3}W$

$\texttt{weight}(c) \leq \frac{2}{3}W$

$\texttt{weight}(c) > \frac{2}{3}W$

$\texttt{weight}(c) > \frac{2}{3}W$

$**\texttt{number}(\mathcal{c})**$

---

$\texttt{number}(\mathcal{c}) \leq t$

$\texttt{number}(\mathcal{c}) > t$

$\texttt{number}(\mathcal{c})\leq t$

$\texttt{number}(\mathcal{c}) > t$

**handling of vote**

---

add vote to $c$

add vote to $c$

add vote to $c$

drop vote

                                                   Table 2: handing of votes by the primary 

Condition (iv) is required to incentivise speed. Votes from nodes that are too slow are not included in the QC and such nodes do not receive rewards. 

<aside>
💡 **Condition (iv) is the lower limit:**
The main purpose of condition (iv) is to induce a stochastic reward reduction for slower (or lazy) nodes. Though, our implementation does not need to *strictly* enforce this condition (the primary has the freedom to collect a few more votes than minimally required). 
Nevertheless, the primary has an incentive to not take too much time collecting votes. Otherwise, it risks that other replicas will time out and not accept its proposal anymore, which also leads to a reduction in rewards.

</aside>

# Architecture

We have two signature types at our disposal: 

- threshold signature, supporting
• group-signature reconstruction (agnostic of signer set)
• aggregation (sensitive to signer set)
- staking-key signature, supporting BLS aggregation (sensitive to signer set)

We have some degree of freedom on how the protocol prescribes to use these signature schemes to implement the node contributions (Table 1). 

For the following node contributions, the apparent definitions are

- **Plain Consensus Node**: submits a vote message containing *only* a staking-key signature
- **Reduced Random Beacon Node**: submits a vote message containing *only* a staking-key signature
- **Offline Consensus Node**: submits no vote

Some degree of freedom exists for the

- **Random Beacon Node**:
    - Option (a): must submit a vote message with a valid staking signature *and* a valid threshold signature share. (We will *not* select this option for reasons explained later)
    - Option (b): submits a vote message containing *only* a threshold signature share. The signature can be used to
    • contribute to the random beacon
    • contribute to HotStuff as the signature proves agreement with the signed block
       proposal

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/285c709b-2d5f-4d08-8492-5bf5920c047e/Concurrent_Vote_Processing.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/285c709b-2d5f-4d08-8492-5bf5920c047e/Concurrent_Vote_Processing.png)

figure [source](https://drive.google.com/file/d/1NuPHWo_M0012XyQuvP5n_ozK-GiG3ZEW/view?usp=sharing)

## State Machine for QC-generation

The following proposal is very high-level. The Go interfaces are for illustrative purposes only.

As building blocks, we use the following components:

- The `Aggregator` is a stateful component for aggregating the HotStuff votes for one specific block. The instance has knowledge about the message that is supposed to be signed.
    
    ```go
    type Aggregator interface {
    
    	// Verify returns true if and only if the signature is valid.
    	Verify(signerID flow.Identifier) (bool, error)
    
    	// TrustedAdd adds the signature to HotStuff votes. Validity of
    	// signature is not checked. 
    	TrustedAdd(signerID flow.Identifier, sig crypto.Signature) error
    
    	// Aggregate the votes. Errors if the weight of the collected votes
    	// is insufficient or some of the added signatures were invalid.
    	Aggregate() (crypto.Signature, error)
    }
    ```
    
    Note that we will need two different `Aggregator` implementation, one for aggregating staking signatures and another for aggregating threshold sig shares.
    
- The `RandomBeaconReconstructor` is a stateful component for reconstructing the Random Beacon's group signature from individual signature shares for one specific block. The  instance has knowledge about the message that is signed by all participants and the required threshold.
    
    ```go
    type RandomBeaconReconstructor interface {
    
    	// Verify returns true if and only if the signature is valid.
    	Verify(signerID flow.Identifier, sig crypto.Signature) (bool, error)
    
    	// TrustedAdd adds the signature share to the reconstructors internal
    	// state. Validity of signature is not checked. It is up to the 
      // implementation, wheter it still adds a signature or not, when the 
    	// minimal number of required sig shares has already been reached, 
    	// because the reconstructed group signature is the same.
    	// Returns: true if and only if enough signature shares were collected
    	TrustedAdd(signerIndex uint, sigShare crypto.Signature) (bool, error)
    
    	// HasSufficientShares returns true if and only if reconstructor
    	// has collected a sufficient number of signature shares.
    	HasSufficientShares() bool
    	
    	// Reconstruct reconstructs the group signature from the provided
    	// signature shares. Errors if the the number of shares is insufficient
      // or some of the added signatures shares were invalid.
    	Reconstruct() (crypto.Signature, error)
    } 
    ```
    

The state machine depicted below uses the following components, which are shared by the go routines (grey boxes). Their method calls behave like atomic operations and are concurrency safe:

- `RandomBeaconReconstructor`
- `StakingAggregator` and `ThresholdSigAggregator` are instances of `Aggregator`
- `Done` is an atomic boolean initialized with `false`
- `AtomicUint64` is an atomic `uint64` initially initialized to `0`

For atomic variables, we use the Golang convention where CAS returns true if and only if the update was applied. 

The white boxes in the sate machine are executed locally by each go routine independently.  

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9ac02e5a-1d15-460d-aecc-38001f45dc61/Concurrent_Vote_Processing_(2).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9ac02e5a-1d15-460d-aecc-38001f45dc61/Concurrent_Vote_Processing_(2).png)

figure [source](https://drive.google.com/file/d/1NuPHWo_M0012XyQuvP5n_ozK-GiG3ZEW/view?usp=sharing)

Comments:

(*) The computation of $\textrm{totalWeight} > \frac{2}{3}W$ needs to be implemented carefully to prevent overflow (or rounding errors). Please re-use the existing safe implementation [here](https://github.com/onflow/flow-go/blob/2b9772a5316b23b248eb59c6cb249a5fa96afe31/consensus/hotstuff/committee.go#L58-L71). 

## Correctness under concurrent execution

For correctness, we need to proof that the state machine successfully collects a set of votes that satisfies the [Validity Requirement for QCs](https://www.notion.so/Architecture-for-Concurrent-Vote-Processing-07c8a782e95c48cea67fa8caa1ea0e18).

**Correctness Proof (sketch)**

- Step II enforces that only valid signatures are considered.
- Step IX guarantees that only a single thread constructs a QC.
- Let $c$  be the set of consensus nodes (including Random Beacon nodes) whose signatures are stored in `StakingAggregator` and `ThresholdSigAggregator`, when a thread passes step IX with return value `true`. This is only possible, if the thread *previously* passed
    - step VII where it found that $\texttt{weight}(c) > \frac{2}{3}W$ and
    - step VIII where `RandomBeaconReconstructor.HasSufficientShares()` returned `true`, which implies that the subset  $r := c ~\cap~ \mathcal{R}$ satisfies $\texttt{number}(\mathcal{r}) > t$. This is the case, because the threshold signature is added to the `ThresholdSigAggregator`, *before* it is added `RandomBeaconReconstructor`. Hence, any signature that the `RandomBeaconReconstructor` knows about is an element of $c$.

We conclude that any QC constructed by the algorithm satisfies the validity requirements. Hence, the algorithm is correct. 

Q.E.D.

## Liveness under concurrent execution

We also need to prove that the state machine generates a QC in *any* situation where the minimal thresholds are satisfied (without requiring additional, unnecessary votes). 

**Without loss of generality, we consider the following situation:**

- Votes from some subset  $c \sube \mathcal{C}$ of the consensus committee have arrived at the primary, such that  $\texttt{weight}(c) > \frac{2}{3}W$ and $\texttt{number}(\mathcal{r}) > t$,  for $r := c ~\cap~ \mathcal{R}$.
- The votes are processed by some threads that are concurrently running through the state machine.
- The threads might be at any arbitrary steps in the state machine.

**Liveness Proof (sketch)**

As $\texttt{weight}(c) > \frac{2}{3}W$, one of the threads will eventually pass step VII with return value `true`. We refer to this thread as "thread A". There are two possible cases for the subsequent method call `RandomBeaconReconstructor.HasSufficientWeight()` (step VIII): 

1. The `RandomBeaconReconstructor` has already collected a sufficient number of threshold signature shares, i.e. `HasSufficientWeight()` returns `true`. 
    
    Therefore, thread A proceeds to constructing a QC (if no other thread has done so already).
    
2. The other option is that the `RandomBeaconReconstructor` only collected an *insufficient* number of signature shares. As we assume that sufficient votes have arrived, there must be some other thread(s) that have *not* reached step V. 
    - At some point in time, these threads will call `RandomBeaconReconstructor.TrustedAdd( .. )` and for at least one of them must, the `RandomBeaconReconstructor` must reach an internal state where `RandomBeaconReconstructor.HasSufficientWeight()` would return `true`. We refer to this thread as "thread B".
    - Per preposition, thread A already found  $\texttt{weight}(c) > \frac{2}{3}W$.  As the return value of `AtomicUint64` is monotonously increasing, thread B will also pass step VII with return value `true`.
    - In summary, thread B passes step VII and VIII with return values `true`. Therefore, it proceeds to constructing a QC (if no other thread has done so already).

We conclude that in all cases where sufficient votes have been collected by the primary, a QC is constructed. Hence, the algorithm is live. 

Q.E.D.

## Appendix: Combined Aggregator for threshold and staking sig

Tracking (and proving) agreement of consensus replicas with sufficient weight is required for HotStuff's progress. In the architecture previously described, the respective logic is implemented across 3 different structures:  

- `StakingAggregator`
- `ThresholdSigAggregator`
- `AtomicUint64`

The following section describes, how we can encapsulate these 3 structures into a higher level `CombinedAggregator`, which has a notion of the minimal weight of signatures it has to collect. Its API is analogous to the `RandomBeaconReconstructor`. This unifies the software design.

**Modifications**

First, we exchange step V and VI, which results in the following state machine. This moves the logic together for adding a signature and updating the total weight (green highlighted). We encapsulate this logic (including concurrency) as `CombinedAggregator.TrustedAdd(..)`. 

Step VII in the previous state machine (i.e. logic for determining whether  $\texttt{weight}(c) > \frac{2}{3}W$ is satisfied), we encapsulate as `CombinedAggregator.HasSufficientWeight()`.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/39e39d7c-d409-4c0c-aac4-d2307b464009/Concurrent_Vote_Processing_(5).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/39e39d7c-d409-4c0c-aac4-d2307b464009/Concurrent_Vote_Processing_(5).png)

**Result**

```go
type SigType int
const (
	RandomBeaconSig SigType = iota
	StakingSig
)

type CombinedAggregator interface {

	// Verify returns true if and only if the signature is valid.
	Verify(signerID flow.Identifier, sig crypto.Signature) (bool, error)

	// TrustedAdd adds the signature to HotStuff votes. Validity of signature
	// is not checked. The signature is always added, no matter whether the
	// minimally required weight ras been reached or not.
	// Returns: true if and only if enough signature shares were collected
	TrustedAdd(signerID flow.Identifier, sig crypto.Signature, sigType SigType) (bool, error)

	// HasSufficientWeight returns true if and only if the aggregator 
	// has collected signatures with sufficient weight.
	HasSufficientWeight() bool

	// Aggregate the votes. Errors if the weight of the collected votes is
	// insufficient or some of the added signatures were invalid.
	Aggregate() (crypto.Signature, crypto.Signature, error)
}
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/759dfc32-a442-4610-b3fd-dda67ae14267/Concurrent_Vote_Processing_(6).png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/759dfc32-a442-4610-b3fd-dda67ae14267/Concurrent_Vote_Processing_(6).png)

Algorithmically, the state machines are equivalent, they just differ in their modularization. Which one we implement is a matter of preference and aesthetics.