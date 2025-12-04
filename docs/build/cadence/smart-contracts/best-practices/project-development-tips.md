---
title: Flow Smart Contract Project Development Standards
sidebar_label: Development Standards
sidebar_position: 5
description: Learn best practices for organizing and managing Cadence smart contract projects. Understand key aspects of design, development, testing, deployment, and community engagement.
keywords:
  - development standards
  - smart contracts
  - project management
  - best practices
  - Cadence development
  - testing standards
  - documentation
  - deployment process
  - project organization
  - code review
  - security practices
  - community engagement
  - open source
  - technical leadership
  - Flow development
---

# Smart Contract Project Development Standards

## Context

Smart Contracts are the bedrock piece of security for many important parts of the Flow blockchain, as well as for any project that is deployed to a blockchain.

They are also the most visible technical parts of any project, since users will query them for data, build other smart contracts that interact with them, and use them as materials to learn and templates for future projects. Furthermore, when deployed they are publicly available code on the blockchain and often also in public Github repos.

Therefore, the process to design, build, test, document, and manage these projects needs to reflect the critical importance they hold in the ecosystem.

Every software project strikes a balance between effort spent on product or feature delivery versus the many other demands of the software development lifecycle, whether testing, technical debt, automation, refactoring, or documentation. Since we build in Web3, we face the same trade-offs, but in a higher risk and consequence environment than what is typical for most software. A mismanaged or untested smart contract may result in **significant** financial losses because of overlooked and exploited vulnerabilities. We highly recommend builders adopt these best practices to help mitigate these risks.

If they do so, they can build better smart contracts, avoid potential bugs, support user and third-party adoption of their projects, and increase their chances of success as a model for good software design. Additionally, the more projects that adopt good software design and management standards normalizes this behavior, and encourages other projects in the ecosystem to do the same, which creates a healthier and more vibrant community.

When you ensure appropriate levels of testing, it results in better smart contracts which have pro-actively modeled threats and engineered against them. dApp builders who ensure appropriate levels of standards adoption ([FungibleToken](https://github.com/onflow/flow-ft), [NFT Metadata], [NFT StoreFront], and so on) amplify the network effects for all in the ecosystem. NFTs in one dApp can be readily consumed by other dApps through onchain events with no new integration required. With your help and participation, we can further accelerate healthy and vibrant network effects across the Flow ecosystem!

Some of these suggestions might seem somewhat unnecessary, but it is important to model what a project can do to manage its smart contracts the best so that hopefully all of the other projects follow suit.

This also assumes standard software design best practices also apply. Indeed, many of these suggestions are more general software design best practices, but there may be others that are assumed but not included here.

### Implement These Practices

This document serves as mostly an outline of best practices the projects should follow. As with all best practices, teams will choose which applies to them and their work process. However, we recommend that teams explicitly define a minimum acceptable set of standards for themselves along with the mechanisms to ensure that they are observed.

Some teams may also have their own set of development standards that achieve a similar goal to these. These recommendations are not meant to be the only paths to success, so if a team disagrees with some of these and wants to do things their own way, they are welcome to pursue that. This document just shows some generic suggestions for teams who might not know how they want to manage their project.

## Design Process

Smart contracts usually manage a lot of value, have many users, and are difficult to upgrade for a variety of reasons. Therefore, it is important to have a clearly defined design process for the smart contracts before much code is written so that the team
can set themselves up for success.

Here are some recommendations for how projects can organize the foundations of their projects.

### Projects should ensure that there is strong technical leadership for their smart contracts

To develop a dApp requires a clear vision for the role of the smart contract and how it's integrated. Security vulnerabilities may arise from bugs directly in smart contract code (and elsewhere in the system). Asynchronous interaction vectors may lead to forms of malicious abuse, Denial of Service (DOS), and so on in a contract that trigger explosive compute unit costs for the developer or other problems.

We recommend that engineers who lead a project and deploy to mainnet understand software and security engineering fundamentals and have been thorough in their Cadence skills development. For more in-depth resources to help learn Cadence, see the [Cadence documentation].

The technical leader should be someone who understands Cadence well and has written Cadence smart contracts before. Production-level smart contracts are not the place for beginners to get their start.

It should be this person's responsibility to lead design discussions with product managers and the community, write most of the code and tests, solicit reviews, make requested changes and make sure the project gets completed in a timely manner.

The leader should also understand how to sign transactions with the CLI to deploy and upgrade smart contracts, run admin transactions, troubleshoot problems, and so on. If something goes wrong in relation to the smart contract that needs to be handled with a bespoke transaction, it is important that the owner knows how to build and run transactions and scripts safely to address the issues and upgrade the smart contracts.

The project should also have a clear plan of succession in case the original owner is not available or leaves the project. It is important that there are others who can fill in who clearly understand the code and requirements so they can give good feedback, perform effective reviews, and make changes where needed.

### Projects should maintain a well-organized open source Repo for their smart contracts

As projects like NBA Topshot have shown, when a blockchain product becomes successful others can and do to build on top of what you are doing. Whether that is analytics, tools, or other value adds that could help grow your project ecosystem, composability is key and that depends on open source development. If there isn't already an open source repo, builders should consider creating one.

Builders can start from the [the Flow open source template] and make sure all of their repo is set up with some initial documentation for what the repo is for before any code is written. External developers and users should have an easily accessible home page to go to to understand any given project.

The repo should also have some sort of high-level design document that lays out the intended design and architecture of the smart contract. The project leads should determine what is best for them to include in the document, but some useful things to include are basic user stories, architecture of the smart contracts, and any questions that still need to be answered about it. 

Where applicable, diagrams should be made that describe state machines, user flows, etc. - This document should be shared in an issue in the open source repo where the contracts or features are developed, then later moved to the `.README` or another important docs page.

A high level design is a key opportunity to model threats and understand the risks of the system. When we collaborate and review designs together, it helps ensure that we capture and address more edge-cases. It's also a lot less effort to iterate on a design than on hundreds of lines of Cadence.

## Development process recommendations

### The development process should be iterative, if possible

The project should develop an MVP first, get reviews, and test thoroughly, then add additional features with tests. This ensures that the core features are designed thoughtfully and makes the review process easier because they can focus on each feature one at a time, rather than get overwhelmed by a huge block of code.

### Comments and field or function descriptions are essential!

Our experience writing many Cadence smart contracts has taught us how important documentation is. It especially matters what is documented and for whom, and in that way we are no different from any software language. The "why" is super important, if for example something - an event - that happens in one contract leads to outcomes in a different contract. The "what" helps give context, the reason that the code turned out the way it is. The "how" you don't document - you've written the code. Comments should be directed to those who will change the code after you.

Write comments at the same time (or even before) the code is written. This helps the developer and reviewers understand the work-in-progress code better, as well as the intentions of the design (for test and review). Comment functions with: 

- A description 
- Parameter descriptions 
- Return value descriptions

Top-Level comments and comments for types, fields, events, and functions should use `///` (three slashes) to be recognised by the [Cadence Documentation Generator]. Regular comments within functions should only use two slashes (`//`)

## Test Recommendations

Summarized below is a list of test-related recommendations for a typical smart contract project.

Popular testing frameworks to use for Cadence are listed here:

- Cadence: [Cadence Testing Framework]
- Go: [Overflow]

The same person who writes the code should also write the tests. They have the clearest knowledge of the code paths and edge cases.

Tests should be **mandatory**, not optional, even if the contract is copied from somewhere else. There should be thorough emulator unit tests in the public repo. [See the flow fungible token repo] for an example of unit tests in javascript.

Every time there is a new Cadence version or emulator version, make sure to update the repo dependencies to confirm the tests all still pass.

Tests should avoid being monolithic; you should set up individual test cases for each part of the contract to test them in isolation There are some exceptions, like contracts that have to run through a state machine to test different cases. Positive and negative cases need to be tested.

You should also write integration tests to ensure that your app or backend can interact properly with the smart contracts.

## Manage Project Keys and deployments

Smart contract keys and deployments are very important and need to be treated as such.

### Store Private Keys securely

Do not keep Private Keys for the contract and admin accounts in plain text format anywhere. Projects should determine a secure solution that works best for them to store their private keys. We recommend that you them in a secure key store such as Google KMS or something similar.

### Handle deployments to Testnet or Mainnet

As projects become more successful, communities around them grow. In a trustless ecosystem, that also means more of others building on your contracts. Before you deploy or upgrade a contract, it is important to maintain clear community communications with sufficient notice, since changes will always bring added risk. When you give community members time to review and address issues with upgrades before they happen, it builds trust and confidence in projects.

Here are a few suggestions for how to manage a deployment or upgrade: 

- Communicate to all stake-holders well in advance
  - Share the proposal with the community at least a week in advance (unless it is a critical bug fix).
    - Examples of places to share are your project's chat, forum, blog, email list, and so on.
    - This will allow the community and other stakeholders to have plenty of time to view the upcoming changes and provide feedback if necessary.
  - Share the time of the deployment and the deployment transaction with branch and commit hash information to ensure the transaction itself is correct.
  - Coordinate deployment with stakeholders to make sure it is done correctly and on time.

## Responsibilities to the Community

Web3 brings tremendous possibilities for engineering applications with trustlessness and composability in mind, and Cadence and Flow offer unique features to achieve this. If every project treats their community and the Flow community with respect and care, the things we can all build together will be very powerful.

### Projects should have thorough documentation

Encouraging adoption of project contracts to the broader ecosystem raises the bar around code to provides clear high-level descriptions, with detailed and useful comments within contracts, transactions, and scripts. The more that users can understand a project, that it adheres to standards, and can be built upon with ease, the more likely others will build against it in turn.

Each project should have a detailed README.md with these sections: 

- Explanation of the project itself with links to the app. 
- Addresses on various networks. 
- High-level technical description of the contracts with emphasis on important types and functionality 
- Architecture diagram (if applicable) - Include links to tutorials if they are external - Flow smart contract standards that a project implements

Additionally, each contract, transaction, and script should have high-level descriptions at the top of their files. This way, anyone in the community can easily come in and understand what each one is doing without the need to parse confusing code.

### Projects should engage with and respond to their own Community

After a contract is deployed, the work doesn't stop there. Project communities require continuous nurturing and support. As the developer of a public project on a public blockchain, the owners have an obligation to be helpful and responsive to the community so that they can encourage composability and third party interactions.

- Keep issues open in the repo.
- The owner should turn on email notifications for new issue creation in the repo.
- Respond to issues quickly and clean up unimportant ones.
- Consider blog posts to share more details on technical aspects of the project and upcoming changes.

### Projects should contribute to the greater Flow and Cadence community

Flow has a vibrant and growing community of contributors around the world. Through our mutual collaboration, we've had numerous community Flow Improvement Proposals ([FLIP]s) shipped. If you have an interest in a particular improvement for Flow or Cadence, we host open meetings which you are welcome to join (announced on discord) and can participate anytime on any of the FLIPs [already proposed].

Responsible project maintainers should contribute to discussions about important proposals (new cadence features, standard smart contracts, metadata, and so on),  and generally be aware about current best practices and anti-pattern knowledge. Projects who contribute to these discussions are able to influence them to ensure that the language and protocol changes are favorable to them and the rest of the app developers in the ecosystem. It also helps the owner to promote the project and themselves.

Resources for Best Practices:

- [cadence/design-pattern]
- [cadence/anti-patterns]
- [cadence/security-best-practices]

Composability and extensibility should also be priorities while they design, develop, and document their projects.

If you have any feedback about these guidelines, create an issue in the [onflow/cadence-style-guide] repo or make a PR to update the guidelines so we can start a discussion.

<!-- Relative links, will not render on page -->

[cadence/design-pattern]: https://cadence-lang.org/docs/design-patterns
[cadence/anti-patterns]: https://cadence-lang.org/docs/anti-patterns
[cadence/security-best-practices]: ./security-best-practices.md)
[FLIP]: https://github.com/onflow/flow/tree/master/flips 
[already proposed]: https://github.com/onflow/flow/pulls?q=is%3Aopen+is%3Apr+label%3AFLIP
[onflow/cadence-style-guide]: https://github.com/onflow/cadence-style-guide
[See the flow fungible token repo]: https://github.com/onflow/flow-ft/tree/master/lib/js/test
[Cadence Testing Framework]: ../../smart-contracts/testing.md
[Overflow]: https://github.com/bjartek/overflow
[Cadence Documentation Generator]: https://github.com/onflow/cadence-tools/tree/master/docgen
[the Flow open source template]: https://github.com/onflow/open-source-template
[Cadence documentation]: https://cadence-lang.org/docs/
[FungibleToken]: https://github.com/onflow/flow-ft
[NFT Metadata]: ../../advanced-concepts/metadata-views.md
[NFT StoreFront]: https://github.com/onflow/nft-storefront