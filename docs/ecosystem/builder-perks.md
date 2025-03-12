---
title: Builder Perks
description: Exclusive perks and benefits for Flow builders
sidebar_position: 8
---

import Modal from "@site/src/ui/design-system/src/lib/Components/Modal";
import { Button } from "@site/src/ui/design-system/src/lib/Components/Button";
import ActionCard from "@site/src/components/ActionCard";
import React from "react";
import { useCurrentUser } from "@site/src/hooks/use-current-user";
import { useProgress } from "@site/src/hooks/use-progress";
import { useProfile } from "@site/src/hooks/use-profile";
import ProfileModal from "@site/src/components/ProfileModal";

export const BuilderPerks = () => {
  const [activeModal, setActiveModal] = React.useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const { user, logIn } = useCurrentUser();
  const { profile } = useProfile(user?.addr);
  const { getProgress } = useProgress();
  const progress = user?.addr ? getProgress() : 0;
  const isProfileComplete = progress === 1;

  const handleCardClick = (modalId) => {
    if (!user?.loggedIn || !isProfileComplete) {
      setActiveModal('profile-check');
    } else {
      setActiveModal(modalId);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       
        <ActionCard
          heading="Builder Gas Subsidy"
          description="Get enough FLOW to launch on Mainnet and sponsor up to 10,000 transactions for your users."
          icon="flow"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('gas-subsidy')}
        />

        <ActionCard
          heading="Alchemy for Startups"
          description="Get free credits, product discounts, and access to an extensive partner network to help accelerate your project's growth."
          icon="alchemy"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('alchemy')}
        />

        <ActionCard
          heading="QuickNode"
          description="Power your Web3 journey with QuickNode - the leading end-to-end development platform for Web3 builders. Get $100 credit with our special offer."
          icon="quicknode"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('quicknode')}
        />

        <ActionCard
          heading="Thirdweb"
          description="Get $99 worth of production-grade tools to build complete web3 apps and games on any platform with 1 month of free Growth & Engine tier access."
          icon="thirdweb"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('thirdweb')}
        />
 
        
        <ActionCard
          heading="Olympix"
          description="State-of-the-art, developer-first security tools for in-house assurance. Get $2000 in credits for your team."
          icon="olympix-logo"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('olympix')}
        />

       </div>

      {/* Profile Check Modal */}
      <Modal
        isOpen={activeModal === 'profile-check'}
        onClose={() => setActiveModal(null)}
        title="Complete Your Profile"
      >
        <div className="space-y-6 text-center">
          <p className="text-lg">
            {!user?.loggedIn 
              ? "Please connect your wallet to access Flow Builder Perks."
              : "Complete your Flow Builder Profile to access exclusive perks."}
          </p>
          
          {user?.loggedIn && (
            <div className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.floor(progress * 100)}%</span>
              </div>
              <p>Your profile is {Math.floor(progress * 100)}% complete</p>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!user?.loggedIn) {
                  logIn();
                } else {
                  setIsProfileModalOpen(true);
                }
                setActiveModal(null);
              }}
            >
              {!user?.loggedIn ? "Connect Wallet" : "Complete Profile"}
            </Button>
          </div>
        </div>
      </Modal>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <Modal 
        isOpen={activeModal === 'quicknode'} 
        onClose={() => setActiveModal(null)}
        title="QuickNode - $100 Credit for Builders"
      >
        <div className="space-y-4">
          <p>
            QuickNode is the leading end-to-end development platform for Web3 builders, trusted by enterprises worldwide for reliable, high-performance blockchain infrastructure. Whether you're building the next DeFi protocol or launching an NFT marketplace, we've got you covered.
          </p>
          
          <h3 className="text-xl font-bold">Offer Details</h3>
          <p>Get 2 months of supercharged development with our Build plan, including:</p>
          <ul className="list-disc pl-6">
            <li>Lightning-fast RPC endpoints</li>
            <li>Real-time WebSocket streams</li>
            <li>Historical data backfills</li>
            <li>Multi-chain support</li>
            <li>Advanced monitoring tools</li>
          </ul>

          <h3 className="text-xl font-bold">How to Claim</h3>
          Go to the <a href="https://www.quicknode.com/"> signup page </a>
   
          and enter the code:
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">BUILDWITHFLOW</span>
        
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'olympix'} 
        onClose={() => setActiveModal(null)}
        title="Olympix - $2000 in Security Tools Credits"
      >
        <div className="space-y-4">
          <p>
            Olympix equips developers with state-of-the-art, developer-first tools for in-house security
            assurance, reducing reliance on costly, time-consuming external audits. Early-stage teams are
            empowered with low-barrier, light-touch tooling that keeps their focus on innovation while
            ensuring security from day one.
          </p>
          
          <h3 className="text-xl font-bold">Offer Details</h3>
          <ul className="list-disc pl-6">
            <li>Amount: $2000 credits</li>
            <li>Requirements: Team of 1-2 devs, 5k+ revenue a year</li>
          </ul>

          <h3 className="text-xl font-bold">How to Claim</h3>
          <p>
            Email sarah@olympix.ai and CC ali.serag@flowfoundation.org with 'Olympix Flow Perk' in email header and include your GitHub username the email body as well as a link to your project.
          </p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'gas-subsidy'} 
        onClose={() => setActiveModal(null)}
        title="Builder Gas Subsidy"
      >
        <div className="space-y-4">
          <p>
            The Flow Gas Subsidy offers builders in the ecosystem enough FLOW to get their project on Mainnet 
            and sponsor up to 10,000 transactions for their users. Data shows that apps which sponsor their 
            user's transactions see up to 4x more usage.
          </p>

          <h3 className="text-xl font-bold">How to Claim</h3>
          <p>
            Email ali.serag@flowfoundation.org with 'Olympix Perk' in email header and include your GitHub username in the email body along with your deployer address.
          </p>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'alchemy'} 
        onClose={() => setActiveModal(null)}
        title="Alchemy for Startups"
      >
        <div className="space-y-4">
          <p>
            Flow is partnering with Alchemy to offer startups building in the ecosystem extra support, free credits, 
            and access to an extensive partners network. Accelerate your project's development with industry-leading 
            infrastructure and resources.
          </p>
          
          <h3 className="text-xl font-bold">Program Benefits</h3>
          <ul className="list-disc pl-6">
            <li>Complementary credits and product discounts to help you ship faster</li>
            <li>Access to an extensive network of partners to amplify launches</li>
            <li>Exclusive offers and community expansion opportunities</li>
            <li>Dedicated startup resources and technical support</li>
          </ul>

          <h3 className="text-xl font-bold">How to Apply</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Fill out the application form at <a href="https://www.alchemy.com/startup-program" className="text-blue-600 hover:text-blue-800">alchemy.com/startup-program</a></li>
            <li>Email zaib@alchemy.com and CC ali.serag@flowfoundation.org with 'Flow Alchemy Perk' in the email title. Ensure to include your GitHub username in the email body and a link to your project.</li>
          </ol>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'thirdweb'} 
        onClose={() => setActiveModal(null)}
        title="Thirdweb - Free Growth & Engine Tier Access"
      >
        <div className="space-y-4">
          <p>
            Thirdweb provides a full stack web3 development platform. Get $99 credits for 1 month of free access to production-grade tools 
            to build complete web3 apps and games on any platform.
          </p>
          
          <h3 className="text-xl font-bold">What You Get</h3>
          <ul className="list-disc pl-6">
            <li>Production Grade Infrastructure and RPCs</li>
            <li>Custom Branding & User Analytics</li>
            <li>Nonce Management & Automatic Retries</li>
            <li>Securely Managed Backend Wallets with Team Access Controls</li>
          </ul>

          <h3 className="text-xl font-bold">Available Stacks</h3>
          <ul className="list-disc pl-6">
            <li><a href="https://thirdweb.com/solutions/gaming" className="text-blue-600 hover:text-blue-800">Gaming Stack</a> - Build seamless onchain games with web3-powered features on Unity, Unreal Engine, & any platform</li>
            <li><a href="https://thirdweb.com/nebula" className="text-blue-600 hover:text-blue-800">AI Stack</a> - Powerful blockchain AI model with access to live and historical onchain data</li>
            <li><a href="https://thirdweb.com/solutions/defi" className="text-blue-600 hover:text-blue-800">DeFi Stack</a> - Build DeFi applications with secure onboarding and cross-chain capabilities</li>
            <li><a href="https://thirdweb.com/solutions/consumer-apps" className="text-blue-600 hover:text-blue-800">Consumer App Stack</a> - Create abstracted, secure, and decentralized digital experiences</li>
          </ul>

          <h3 className="text-xl font-bold">How to Claim</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Go to the <a href="https://thirdweb.com/dashboard" className="text-blue-600 hover:text-blue-800">thirdweb Dashboard</a></li>
            <li>Apply coupon code: <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">3WEBDEV-FLOW</span></li>
            <li>Upgrade to Growth and deploy an Engine instance</li>
          </ol>
        </div>
      </Modal>
    </div>
  );
};

<BuilderPerks />
