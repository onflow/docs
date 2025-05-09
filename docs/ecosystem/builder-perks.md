---
title: Builder Perks
description: Exclusive perks and benefits for Flow builders
sidebar_position: 8
---

import Modal from "@site/src/ui/design-system/src/lib/Components/Modal";
import ActionCard from "@site/src/components/ActionCard";
import React from "react";
import { useCurrentUser } from "@site/src/hooks/use-current-user";
import { useProgress } from "@site/src/hooks/use-progress";
import { useProfile } from "@site/src/hooks/use-profile";
import ProfileModal from "@site/src/components/ProfileModal";
import ConnectButton from "@site/src/components/ConnectButton";
import { Button } from "@site/src/ui/design-system/src/lib/Components/Button";

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

        <ActionCard
          heading="Uniblock"
          description="Get $500+ OFF with 3 months of Uniblock Pro FREE. Access 50 data partners, 100 protocols, and 1500 APIs with enterprise features like load balancing and auto retry."
          icon="uniblock"
          iconColor="white"
          cardColor="black"
          onClick={() => handleCardClick('uniblock')}
        />

       </div>

      {/* Profile Check Modal */}
      <Modal
        isOpen={activeModal === 'profile-check'}
        onClose={() => setActiveModal(null)}
        title="Complete Your Profile"
      >
        <div className="space-y-8 text-center max-w-md mx-auto py-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {!user?.loggedIn 
              ? "Please connect your wallet to access Flow Builder Perks."
              : "Complete your Flow Builder Profile to access exclusive perks."}
          </p>
          
          {user?.loggedIn && (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl font-medium">{Math.floor(progress * 100)}%</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">Profile completion status</p>
            </div>
          )}

          {!user?.loggedIn ? (
            <ConnectButton onComplete={() => setActiveModal(null)} />
          ) : (
            <Button
              variant="black"
              size="sm"
              className="mt-4"
              onClick={() => {
                setIsProfileModalOpen(true);
                setActiveModal(null);
              }}
            >
              Complete Profile
            </Button>
          )}
        </div>
      </Modal>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* QuickNode Modal */}
      <Modal 
        isOpen={activeModal === 'quicknode'} 
        onClose={() => setActiveModal(null)}
        title="QuickNode"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">$100 Credit for Builders</h2>
              <p className="text-gray-600 dark:text-gray-300">Enterprise-grade Web3 infrastructure</p>
            </div>
            <img src="/img/ecosystem/quicknode.svg" alt="QuickNode" className="w-12 h-12" />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Lightning-fast RPC endpoints</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Real-time WebSocket streams</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Historical data backfills</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Multi-chain support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Advanced monitoring tools</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• 24/7 developer support</div>
                </div>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Claim</h3>
              <div className="space-y-4">
                <a 
                  href="https://www.quicknode.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-600"
                >
                  1. Visit QuickNode signup →
                </a>
                <div>
                  <div className="text-sm mb-2">2. Enter promo code:</div>
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">BUILDWITHFLOW</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText('BUILDWITHFLOW')}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>

      {/* Olympix Modal */}
      <Modal 
        isOpen={activeModal === 'olympix'} 
        onClose={() => setActiveModal(null)}
        title="Olympix"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">$2000 in Security Tools Credits</h2>
              <p className="text-gray-600 dark:text-gray-300">Developer-first security assurance</p>
            </div>
            <img src="/img/ecosystem/olympix-logo.svg" alt="Olympix" className="w-12 h-12" />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">Team Size</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">1-2 developers</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Revenue Requirement</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">$5,000+ per year</div>
                </div>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Apply</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Send email to:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">sarah@olympix.ai</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">CC:builders@flow.com</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Include:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Subject: "Olympix Flow Perk"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Your GitHub username</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Link to your project</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>

      {/* Gas Subsidy Modal */}
      <Modal 
        isOpen={activeModal === 'gas-subsidy'} 
        onClose={() => setActiveModal(null)}
        title="Gas Subsidy"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">Get Gas to Launch Today</h2>
              <p className="text-gray-600 dark:text-gray-300">Flow is offering all builders a one-time subsidy to bring their project to life and scale</p>
            </div>
            <img src="/img/ecosystem/flow.svg" alt="Flow" className="w-12 h-12" />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">Transaction Coverage</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Sponsor up to 10,000 user transactions</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Usage Impact</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Up to 4x more app engagement</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Contract Deployment</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Launch your contracts on Mainnet for FREE</div>
                </div>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Apply</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Send email to:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">builders@flow.com</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Include:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Subject: "Gas Subsidy Request"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Your GitHub username</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Your deployer address</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>

      {/* Alchemy Modal */}
      <Modal 
        isOpen={activeModal === 'alchemy'} 
        onClose={() => setActiveModal(null)}
        title="Alchemy"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">Startup Program Access</h2>
              <p className="text-gray-600 dark:text-gray-300">Accelerate your project growth</p>
            </div>
            <img src="/img/ecosystem/alchemy.svg" alt="Alchemy" className="w-12 h-12" />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Free infrastructure credits</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Product discounts</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Technical support</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Partner network access</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Launch amplification</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Community perks</div>
                </div>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Apply</h3>
              <div className="space-y-4">
                <a 
                  href="https://www.alchemy.com/startup-program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-600"
                >
                  1. Apply to Startup Program →
                </a>
                <div className="space-y-2">
                  <div className="font-medium">2. Send follow-up email:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">To: zaib@alchemy.com</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">CC: builders@flow.com</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Subject: "Flow Alchemy Perk"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Include your GitHub username and project link</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>

      {/* Thirdweb Modal */}
      <Modal 
        isOpen={activeModal === 'thirdweb'} 
        onClose={() => setActiveModal(null)}
        title="Thirdweb"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">1 Month Growth & Engine Access</h2>
              <p className="text-gray-600 dark:text-gray-300">$99 value in production tools</p>
            </div>
            <img src="/img/ecosystem/thirdweb.svg" alt="Thirdweb" className="w-12 h-12" />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Production-grade RPCs</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Custom branding options</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• User analytics dashboard</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Transaction management</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Automatic retries</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Team access controls</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-6 mt-10">Development Stacks</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <a 
                  href="https://thirdweb.com/solutions/gaming"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="font-medium group-hover:text-blue-500">Gaming</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Unity & Unreal Engine integration</div>
                </a>
                <a 
                  href="https://thirdweb.com/nebula"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="font-medium group-hover:text-blue-500">AI & ML</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Blockchain AI models and data</div>
                </a>
                <a 
                  href="https://thirdweb.com/solutions/defi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="font-medium group-hover:text-blue-500">DeFi</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Cross-chain DeFi applications</div>
                </a>
                <a 
                  href="https://thirdweb.com/solutions/consumer-apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="font-medium group-hover:text-blue-500">Consumer</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Web3 user experiences</div>
                </a>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Claim</h3>
              <div className="space-y-4">
                <a 
                  href="https://thirdweb.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-600"
                >
                  1. Visit Thirdweb Dashboard →
                </a>
                <div>
                  <div className="text-sm mb-2">2. Apply coupon code:</div>
                  <div className="flex items-center space-x-3">
                    <code className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">3WEBDEV-FLOW</code>
                    <button 
                      onClick={() => navigator.clipboard.writeText('3WEBDEV-FLOW')}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  3. Upgrade to Growth tier and deploy your Engine instance
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>

      {/* Uniblock Modal */}
      <Modal 
        isOpen={activeModal === 'uniblock'} 
        onClose={() => setActiveModal(null)}
        title="Uniblock"
      >
        <div className="max-w-2xl space-y-12 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="pr-8">
              <h2 className="text-2xl font-semibold mb-1">3 Months Pro Access + $500 OFF</h2>
              <p className="text-gray-600 dark:text-gray-300">Enterprise-grade API aggregation platform, connect to 1500+ APIs with optimized pricing and dynamic API switching that gurantees 0% downtime</p>
            </div>
            <img src="/img/ecosystem/uniblock.svg" alt="Uniblock"  />
          </header>

          <section className="space-y-24">
            <div>
              <h3 className="text-lg font-medium mb-6">Features</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• 50+ data partners</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• 100+ protocols</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• 1500+ APIs</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Load balancing</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Auto fallback</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Auto retry</div>
                </div>
              </div>
            </div>

            <div className="pt-20">
              <h3 className="text-lg font-medium mb-6 mt-10">How to Apply</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Send email to:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">hello@uniblock.dev</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">CC: builders@flow.com</div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Include:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Subject: "Uniblock Flow Builder Perk"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Brief project description</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">• Link to relevant materials</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
};

<BuilderPerks />
