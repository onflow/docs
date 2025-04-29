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

Join us for a month-long celebration of building on Flow! Every day in May, make at least one commit to a participating repository and get a chance to win **250 FLOW** in our nightly draw and the end-of-month jackpot of **5000 FLOW**.

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
    <h3 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-400">Build & Commit</h3>
    <div className="space-y-3">
      <p>Keep working on your Flow project</p>
      <p>Push meaningful commits to your public repository</p>
      <p className="text-sm bg-white/70 dark:bg-gray-800/70 p-3 rounded inline-block">Note: Your project doesn't need to be live yet - we reward progress!</p>
    </div>
  </div>

  <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-6 shadow-sm">
    <h3 className="text-xl font-bold mb-4 text-green-700 dark:text-green-400">Win Rewards</h3>
    <div className="space-y-3">
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>Every valid commit enters you into the daily <strong>250 FLOW</strong> draw</p>
      </div>
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>Build in public for additional weekly rewards</p>
      </div>
      <div className="flex items-baseline">
        <span className="text-green-600 dark:text-green-400 mr-2">•</span>
        <p>All participants eligible for <strong>5000 FLOW</strong> end-of-month jackpot</p>
      </div>
    </div>
  </div>
</div>

:::tip
Your profile information is used to verify commits and select winners. Make sure to keep it up to date!
:::

## How It Works

### Daily Rewards
- Make ≥1 commit to any participating repository
- Each valid commit enters you into that day's draw for **250 FLOW**
- Winners are chosen using [randoms.wtf](https://randoms.wtf/)
- Winners are announced from [@aliserag0](https://twitter.com/aliserag0) Twitter account
- FLOW prizes are sent to the top wallet address indicated in your profile

### Weekly Building in Public Rewards
- Share your daily progress on Twitter
- Must @flow_blockchain and describe your accomplishments
- Include a link back to this page
- Top "building in public" posts each week receive additional prizes

## Daily Schedule

- Commits must be made between 00:00 UTC and 23:59 UTC
- Winners are announced the following day
- Weekly building in public rewards are announced every Monday

## Building in Public Guidelines

To qualify for weekly building in public rewards:

1. Tweet your daily progress
2. Include @flow_blockchain
3. Describe what you accomplished
4. Link back to this page
5. Use the hashtag #MayTheFlowBeWithYou

In addition to the daily rewards, we will regularly give bonus FLOW to the top Building in Public posts on X.

Example tweet:
```
@flow_blockchain Day 3 of #MayTheFlowBeWithYou! 
✅ Implemented NFT minting functionality
✅ Added unit tests
✅ Deployed to testnet
Building something special on Flow! 
Learn more: [link to this page]
```

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
  - Daily FLOW prizes are distributed within 24 hours of the draw
  - Weekly building in public rewards are announced every Monday
</FAQ>

## Stay Connected

- Follow [@flow_blockchain](https://twitter.com/flow_blockchain) for updates
- Join our [Discord](https://discord.gg/flow) for community support
- Check [@aliserag0](https://twitter.com/aliserag0) for daily winner announcements

--- 