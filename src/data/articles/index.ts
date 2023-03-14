import { FeaturedArticleCardProps } from "~/ui/design-system/src/lib/Components/FeaturedArticleCard"
import { TutorialCardProps } from "~/ui/design-system/src/lib/Components/TutorialCard"

export const redSquirrelGetStartedArticle: TutorialCardProps = {
  heading: "Getting started on Flow with a RedSquirrel NFT",
  tags: ["tutorial", "nft", "beginner"],
  description: `
  Deploy a Cadence smart contract to a local emulator and interact with it as soon as possible!
  Learn how to build an NFT project using the Flow Emulator, Golang and Cadence.`,
  link: "https://medium.com/redsquirrel-tech/getting-started-with-the-flow-blockchain-31bfab956a96",
  imageUri: "https://miro.medium.com/max/1400/1*6kiCdTyUpS_gRHD4Z1gs0w.png",
  lastUpdated: "7/4/2022",
}

export const organizingCadenceTutorial: TutorialCardProps = {
  heading: "How to Organize Cadence Projects",
  tags: ["protocol", "network"],
  description: `How you organize the files for your project in your Github repo by Joshua Hannan - a senior smart contract engineer at Flow.`,
  link: "https://joshuahannan.medium.com/how-i-organize-my-cadence-projects-75b811b700d9",
  imageUri: "https://miro.medium.com/max/1400/1*o_J8FQHAIczyhTehcT1ziw.png",
  lastUpdated: "8/04/2021",
}

export const introToFlow: TutorialCardProps & FeaturedArticleCardProps = {
  heading: "Introduction to Flow blockchain",
  tags: ["protocol", "network"],
  description: `An introduction to the Flow blockchain architecture, protocol network, and high-level data flow`,
  link: "https://jan-bernatik.medium.com/introduction-to-flow-blockchain-7532977c8af8",
  ctaText: "View Article",
  imageUri: "https://miro.medium.com/max/1400/1*EZSbQbO8fKxkNgfYx7daYw.png",
  lastUpdated: "14/03/2022",
}

export const getTheFlowDown: TutorialCardProps & FeaturedArticleCardProps = {
  heading: "Get the Flow Down - Learning Resources",
  tags: ["resource-list", "community"],
  description: `Get the Flow Down is a curated collection of the best Flow blockchain tools, tutorials, articles and more!`,
  link: "https://github.com/ph0ph0/Get-The-Flow-Down",
  ctaText: "View List",
  imageUri:
    "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f641ebbdcb3f42296876548_OnFlow_Landing%20Page_OG.png",
}

export const guideToFlowForEthereumUsers: TutorialCardProps = {
  heading: "Guide to Flow for Ethereum Users",
  tags: ["resource-list", "community"],
  description: `A quick introduction to Flow, its use cases, and how it compares to Ethereum.`,
  link: "https://www.flowverse.co/articles/guide-to-flow-blockchain-for-ethereum-users",
  imageUri:
    "https://blog.logrocket.com/wp-content/uploads/2022/01/flow-ethereum-blockchain-nfts.png",
  lastUpdated: "24/02/2022",
}

export const FCLQuickstartNextJs: TutorialCardProps = {
  heading: "FCL Quickstart for Next.js",
  tags: ["quickstart", "beginner"],
  description: `Everything you need to build a web3 project with React, Next.js and the Flow Client Library (FCL).`,
  link: "https://github.com/muttoni/fcl-nextjs-quickstart",
  imageUri:
    "https://user-images.githubusercontent.com/27052451/146340356-e34f3c47-43bc-4c11-926b-b82b99d561c6.png",
}

export const FCLQuickstartNuxtJs: TutorialCardProps = {
  heading: "FCL Quickstart for Nuxt.js",
  tags: ["quickstart", "beginner"],
  description: `Everything you need to build a web3 project with the Vue, NuxtJS, and the Flow Client Library (FCL).`,
  link: "https://github.com/brunogonzales/fcl-nuxt-starter",
  imageType: "code",
}

export const FCLQuickstartSvelteKit: TutorialCardProps = {
  heading: "FCL Quickstart for SvelteKit",
  tags: ["quickstart", "beginner"],
  description: `Everything you need to build a web3 project with Svelte, SvelteKit and the Flow Client Library (FCL).`,
  link: "https://github.com/muttoni/fcl-sveltekit-quickstart",
  imageType: "code",
}

export const flowNFTPetStore: TutorialCardProps = {
  heading: "Building an NFT Pet Store on Flow with IPFS",
  tags: ["tutorial", "intermediate", "nft"],
  description: `This tutorial will teach you to create a simple NFT marketplace on the Flow blockchain from scratch with IPFS/Filecoin storage via nft.storage.`,
  link: "https://nftschool.dev/tutorial/flow-nft-marketplace/#prerequisites",
  imageUri: "https://nftschool.dev/images/social-card.png",
}

export const learnCadenceVideoSeries: TutorialCardProps = {
  heading: "Learn Cadence - Video Series",
  tags: ["video", "beginner", "cadence"],
  description: `A series of YouTube videos on learning Cadence from scratch by Jacob Tucker.`,
  link: "https://www.youtube.com/playlist?list=PLvcQxi9WyGdF32YuZABVTx-t3-FsBNCN2",
  imageUri:
    "https://i.ytimg.com/vi/iVevnipJbHo/hqdefault.jpg?sqp=-oaymwEXCNACELwBSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAJUzBQOerdgQGWn0FfbGT4fGv2vA",
}

export const flowMetaDataStandard: TutorialCardProps = {
  heading: "Metadata Standard on Flow",
  tags: ["video", "nft", "intermediate"],
  description: `An in-depth video of the Flow Metadata Standard demonstrated through an example on the Flow Playground.`,
  link: "https://youtu.be/rgJRTozG3cw",
  imageUri:
    "https://assets.website-files.com/5f6294c0c7a8cdd643b1c820/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.svg",
  lastUpdated: "05/01/2022",
}

export const NBATopShotExample: TutorialCardProps = {
  heading: "How to Create NFTs Like NBA Top Shot - Pt 1",
  tags: ["tutorial", "nft", "beginner"],
  description: `Learn how to make an NBA Top Shot like NFTs with Flow and IPFS by creating the smart contract, developing an app to view the NFTs and creating a marketplace for transactions`,
  link: "https://medium.com/pinata/how-to-create-nfts-like-nba-top-shot-with-flow-and-ipfs-701296944bf",
  imageUri: "https://miro.medium.com/max/1400/1*SaFqgvNb_6uCxqOmmSqriw.png",
  lastUpdated: "27/02/2022",
}

export const flowMultiNodeArchitecture: TutorialCardProps = {
  heading: "Flow's Multi-Node Architecture",
  tags: ["architecture", "intermediate"],
  description: `A deep dive into how Flow's multi-node architecture scales to millions, increases decentralization, and ensures a great end-user experience`,
  link: "https://www.onflow.org/post/flow-blockchain-multi-node-architecture-advantages",
  imageUri:
    "https://assets.website-files.com/5f6294c0c7a8cdf432b1c827/6143728c4909ca0adba869a4_Flow_Blog-Inside%20Flow.png",
  lastUpdated: "16/09/2021",
}

export const zeroToJacobFlow: TutorialCardProps = {
  heading: "Zero-to-Jacob Flow",
  tags: ["course", "beginner", "cadence"],
  description: `A self-paced course for Cadence, created by Jacob Tucker, containing multiple lessons, videos, and a certificate of completion`,
  link: "https://github.com/jacob-tucker/Flow-Zero-to-Jacob",
  imageUri:
    "https://github.com/emerald-dao/beginner-cadence-course/raw/main/images/course.png",
}

export const revolutionizeSmartContractProgramming: TutorialCardProps = {
  heading: "How Cadence and Flow will revolutionize smart contract programming",
  tags: ["article", "cadence"],
  description: `An article discussing how Flow and Cadence brings new innovations to smart contract development by shifting to a resource-oriented programming paradigm.`,
  link: "https://medium.com/coinmonks/how-cadence-and-flow-will-revolutionize-smart-contract-programming-607bd05b49b",
  imageUri: "https://miro.medium.com/max/1400/0*9aqBPbb70U9fJTQm",
  lastUpdated: "6/04/2022",
}

export const playgroundTutorials: TutorialCardProps = {
  heading: "Flow Playground Tutorials",
  tags: ["tutorial", "beginner", "cadence"],
  description: `Learn to use Cadence using the Flow Playgound Web IDE`,
  link: "https://developers.flow.com/cadence/tutorial/01-first-steps",
  imageUri: "https://miro.medium.com/max/1400/1*WGxn8AZj-gZXd_vipdBxSg.png",
  lastUpdated: "17/10/2022",
}

export const cadenceAtAGlance: TutorialCardProps = {
  heading: "Cadence at a Glance",
  tags: ["article", "cadence"],
  description: `A quick overview of resources, access-control and transactions on Cadence`,
  link: "https://medium.com/@ebner.benjamin/cadence-at-a-glance-4e685c34b544",
  imageUri: "https://miro.medium.com/max/1400/1*WGxn8AZj-gZXd_vipdBxSg.png",
  lastUpdated: "17/09/2021",
}

export const firstStepsWithCadence: TutorialCardProps = {
  heading: "Taking your First Steps with Cadence",
  tags: ["article", "cadence", "tutorial"],
  description: `Learn how to get started developing with Cadence with tutorials on the Flow Playground, standard interfaces, real Cadence contracts and diving into more advanced topics`,
  link: "https://joshuahannan.medium.com/taking-your-first-steps-with-cadence-19dde86bbd0",
  imageUri: "https://miro.medium.com/max/1312/1*GcG84v5U97IebXhyMw65Nw.png",
  lastUpdated: "11/02/2021",
}

export const accessControlCadence: TutorialCardProps = {
  heading: "Basic Access Control in Cadence",
  tags: ["article", "cadence", "tutorial"],
  description: `A deeper dive into Keyword Access Control and Capability-based Access-Control`,
  link: "https://joshuahannan.medium.com/basic-access-control-in-cadence-28c5765c6ec0",
  imageUri: "https://miro.medium.com/max/694/1*M7p33-EGZPFdKcX7oR6mDg.jpeg",
  lastUpdated: "18/02/2021",
}
