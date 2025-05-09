---
sidebar_position: 1
title: May the Flow be with You
description: Daily coding rewards for Flow ecosystem contributors
---

import React from "react";
import { useCurrentUser } from "@site/src/hooks/use-current-user";
import { useProgress } from "@site/src/hooks/use-progress";
import ProfileModal from "@site/src/components/ProfileModal";

export const ProfileLink = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const { user } = useCurrentUser();
  
  return (
    <>
      <h3 
        className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400 cursor-pointer hover:underline inline-flex items-center" 
        onClick={() => setIsProfileModalOpen(true)}
      >
        Create Your Profile
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </h3>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

# May the Flow be with You!

Join us for a month-long vibe coding challenge on Flow! Starting May 4th, participate in our four themed weeks featuring randomness, games, DeFi, and killer apps. Submit your AI-enhanced projects to win weekly prizes from the <strong>1750 FLOW weekly prize pool</strong> and compete for the end-of-month jackpot of <strong>2500 FLOW</strong>.


## How to Participate

<div className="grid grid-cols-1 gap-8 my-8">
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 shadow-sm">
    <ProfileLink />
    <div className="space-y-3">
      <p>Sign up for a Flow dev docs profile (top right of navigation bar)</p>
      <p>Fill out your repository and deployer addresses</p>
      <p className="text-sm bg-white/70 dark:bg-gray-800/70 p-3 rounded inline-block">Note: The first listed address will receive FLOW rewards</p>
    </div>
  </div>

  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-400">Create Project in Repo</h3>
    <div className="space-y-3">
      <p>Go to <a href="https://github.com/onflow/May-The-Flow-Be-With-You" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">the campaign repo</a> and fork it</p>
      <p>Create a new folder in the <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">submissions</code> directory with your Flow address as the folder name</p>
      <p>Add a README that describes your project, team, and motivation</p>
    </div>
  </div>

  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-bold mb-4 text-orange-700 dark:text-orange-400">Build & Commit</h3>
    <div className="space-y-3">
      <p>Work on your Flow project based on the weekly themes</p>
      <p>Make weekly submissions by creating project folders within each week's directory (e.g., <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">any-project-name</code>)</p>
      <p>Each submission must include a README with key prompts used and source code</p>
      <p className="text-sm bg-white/70 dark:bg-gray-800/70 p-3 rounded inline-block">Note: You can submit multiple projects within each week's theme</p>
    </div>
  </div>

  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">Win Rewards</h3>
    <div className="space-y-3">
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p><strong>Weekly Rewards:</strong> 1750 FLOW distributed across 7 winners (~250 FLOW each) based on weekly themes</p>
      </div>
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>Each day you participate in a week counts as an additional raffle entry, increasing your winning odds</p>
      </div>
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>All submissions throughout May qualify for the <strong>2500 FLOW</strong> end-of-month jackpot</p>
      </div>
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>Build in public for bonus rewards (see guidelines below)</p>
      </div>
    </div>
  </div>
</div>

## Weekly Schedule

<div className="space-y-6 my-6">
  <div className="border-l-4 border-indigo-500 pl-4 py-2">
    <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400">Week 1: The Randomness Revolution (May 4-10)</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-2">Leverage on-chain randomness to create unpredictable, emergent experiences on Flow. Think: generative art, dynamic NFTs, chance-based mechanics, and randomized gameplay elements.</p>
    <ul className="mt-2 space-y-1">
      <li>May 4: Challenges kickoff</li>
      <li>May 4-10: Build randomness-powered applications</li>
      <li><a href="https://x.com/i/spaces/1BdGYqgDedLGX" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">May 7 (Wed): Twitter Space @ 4:00 PM PST - "Randomness: Building with Unpredictability"</a></li>
      <li>May 12: Week 1 winners announced</li>
    </ul>
    <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
      <h4 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Useful Resources:</h4>
      <ul className="space-y-1 text-sm">
        <li><a href="https://developers.flow.com/tutorials/ai-plus-flow/cursor" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">How to setup cursor with developer docs for optimal vibe coding</a></li>
        <li><a href="https://randoms.wtf/ " target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">"Live app </a> built using Flow random and  <a href="https://github.com/Aliserag/random.wtf " target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline"> GitHub</a></li>
        <li><a href="https://developers.flow.com/evm/guides/vrf " target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Implement Randomness with Solidity in 3 min</a></li>
      </ul>
    </div>
  </div>

  <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2">
    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Week 2: Theme TBD (May 11-17)</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">Next week's theme will be announced soon. Stay tuned!</p>
  </div>

  <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2">
    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Week 3: Theme TBD (May 18-24)</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">Theme to be announced.</p>
  </div>

  <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2">
    <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Week 4: Theme TBD (May 25-31)</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">Theme to be announced.</p>
    <ul className="mt-2 space-y-1 text-gray-500 dark:text-gray-400">
      <li>May 31: Final submission deadline</li>
      <li>June 2: Week 4 winners and jackpot announced</li>
    </ul>
  </div>
</div>

<div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-6">
  <div className="flex items-center mb-2">
    <h3 className="font-bold text-blue-700 dark:text-blue-400">Looking for a Team?</h3>
  </div>
  <p className="text-blue-700 dark:text-blue-300">
    Looking to form a team for one of the weekly challenges or stay on top of the latest? Join our <a href="https://t.me/flow_world_tour" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Telegram chat</a>.
  </p>
</div>

## Process of Committing to the Campaign Repo

<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 my-6 space-y-6">
  <div>
    <h3 className="text-lg font-semibold mb-3">1. Fork the Official Repository</h3>
    <p>Start by forking the <a href="https://github.com/onflow/May-The-Flow-Be-With-You" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">official repository</a> to your GitHub account.</p>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-3">2. Follow the Repository Structure</h3>
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
      <pre className="text-sm">
{`submissions/
  ├── 0x1234...333/           # Your Flow address
  │   ├── README.md           # Project overview
  │   ├── week1/              # Week 1: Randomness Revolution
  │   │   ├── my-random-project/    # Your project for week 1
  │   │   │   ├── README.md   # Documentation with prompts used
  │   │   │   └── src/        # Source code
  │   │
  │   ├── week2/              # Week 2: Theme TBD
  │   ├── week3/              # Week 3: Theme TBD
  │   └── week4/              # Week 4: Theme TBD`}
      </pre>
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-3">3. Create Your Project Directory</h3>
    <ul className="space-y-2 pl-5 list-disc">
      <li>Create a folder named with your Flow address under <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">submissions</code></li>
      <li>All your submissions should be placed under this folder</li>
      <li>Create a folder for each week (<code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">week1</code>, <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">week2</code>, <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">week3</code>, <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">week4</code>)</li>
      <li>Each week will have a specific theme/topic for the raffle</li>
    </ul>
  </div>

  <div>
    <h3 className="text-lg font-semibold mb-3">4. Make Weekly Submissions</h3>
    <ul className="space-y-2 pl-5 list-disc">
          <li>Daily commits lead to higher likelihood of winning!</li>
      <li>Create your project folders with descriptive names inside each week's directory</li>
      <li>Each project must include a README file and source code</li>
      <li>Include any prompts used for development in the README</li>
      <li>Send a pull request for each submission</li>
      <li>Each project submission during a week counts as an entry for that week's raffle</li>
      <li>All entries accumulate for the end-of-month jackpot raffle</li>
    </ul>
  </div>
</div>

:::tip
Your profile and GitHub information are used to verify commits and select winners. Make sure to keep them up to date!
:::

### Submission Guidelines
- Each submission should demonstrate meaningful progress
- Weekly winners receive prizes from the 1750 FLOW pool (7 winners)
- More submissions in a week increase your chances of winning
- All participants are eligible for the 2500 FLOW end-of-month jackpot

## How It Works

### Weekly Rewards
- Build projects aligned with each week's theme:
  - Week 1: The Randomness Revolution
  - Week 2-4: Themes to be announced weekly
- Submit projects in the appropriate weekly folder
- Each submission during a week counts as an entry into that week's raffle
- More projects submitted in a week = higher chances of winning
- Projects that best embody the weekly theme receive additional consideration
- 1750 FLOW distributed to 7 winners each week (~250 FLOW each) 
- Winners are chosen using [randoms.wtf](https://randoms.wtf/)
- Winners are announced from [@aliserag0](https://twitter.com/aliserag0) Twitter account
- FLOW prizes are sent to the top wallet address indicated in your profile

### Weekly Building in Public Bonus
- Share your progress on Twitter with the hashtag #MayTheFlowBeWithYou
- Tag @flow_blockchain in your posts
- Top builders receive additional FLOW rewards
- Join our weekly Twitter Spaces to learn from experts and showcase your work

## Building in Public

Sharing your progress publicly unlocks extra rewards and increases your chances of winning!

In addition to the weekly rewards, we will regularly give bonus FLOW to the top Building in Public posts on X.

1. **Share your progress daily on X (Twitter)**
   - Post screenshots, videos, or code snippets of what you're building
   - Tag [@flow_blockchain](https://twitter.com/flow_blockchain) and include the hashtag **#MayTheFlowBeWithYou**
   - Link to your repository

2. **Engage with other builders**
   - Like, comment, and share other participants' work
   - Collaborate and provide feedback
   - Build the Flow community together

## List of Winners

Check this section daily to see all winners announced so far!

:::note
Winners are announced on [@aliserag0](https://twitter.com/aliserag0) Twitter account and prizes are sent to the top wallet address indicated in your profile.
:::

## FAQ

import { useState } from 'react';

export const FAQ = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <button
        className="flex justify-between w-full px-4 py-3 bg-card rounded-lg text-left font-medium hover:bg-opacity-80 transition-all focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className="transform transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 mt-1 bg-card bg-opacity-50 rounded-lg">{children}</div>
      )}
    </div>
  );
};

<FAQ question="How are winners selected?">
Winners are chosen using [randoms.wtf](https://randoms.wtf/) to ensure fair and transparent selection.
</FAQ>

<FAQ question="What counts as a valid commit?">
Any commit to a participating repository that shows meaningful progress. This includes:
  
- New features
- Bug fixes
- Documentation updates
- Test additions
- Code improvements
</FAQ>

<FAQ question="Does my application have to be 100% Flow-based?">
No, but it should leverage Flow in a significant way. This will be up to the discretion of the reviewers, but you can get in touch if you're unsure about your project's eligibility.
</FAQ>

<FAQ question="Does my application have to be live?">
No, but it should be heading for a launch eventually. We understand things take time and we want to reward you along the way for building. Reviewers have the discretion to eliminate an entry if a path toward being live and available to users is unclear.
</FAQ>

<FAQ question="Does my application have to be brand new for this campaign?">
No, if you are already building something you can continue with that project. Your repository must be public to be eligible for rewards.
</FAQ>

<FAQ question="What if my project has raised funding?">
Your project is still eligible for the May the Flow be with You rewards, regardless of funding status.
</FAQ>

<FAQ question="Can multiple developers work on the same project?">
Yes! Projects can have multiple developers. Each developer should create their own profile and list the same repository. Each developer will be eligible for rewards based on their individual commits.
</FAQ>

<FAQ question="How do I verify my commits?">
Make sure your GitHub account is linked to your Flow dev docs profile. We'll automatically track your commits to participating repositories.
</FAQ>

<FAQ question="When are prizes distributed?">
  - Daily FLOW prizes are distributed within several days of the draw
- Weekly building in public rewards are announced every Monday
</FAQ>

## Stay Connected

- Follow [@flow_blockchain](https://twitter.com/flow_blockchain) for updates
- Join our [Discord](https://discord.gg/flow) for community support

:::warning Disclaimer
Disclaimer: Individuals residing in jurisdictions where gaming or lottery participation is prohibited by law are not eligible to participate.
:::
