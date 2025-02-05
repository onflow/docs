import React from 'react';
import ActionCard from '@site/src/components/ActionCard';

const NAVIGATION_CARDS = [
  {
    heading: 'Build',
    description:
      'Fire up a new app, add blue-chip features such as tokens and NFTs, or supercharge your user experience.',
    iconColor: 'green' as const,
    cardColor: 'black' as const,
    href: '#Build',
    variant: 'overlay' as const,
    icon: 'Getting Started'
  },
  {
    heading: 'Grow',
    description:
      'Access builder credits, startup support, and connect with the Flow team in weekly office hours.',
    iconColor: 'blue' as const,
    cardColor: 'black' as const,
    href: '#Grow',
    variant: 'overlay' as const,
    icon: 'Grow'
  },
  {
    heading: 'Fund',
    description:
      'Explore funding opportunities through VCs, grants, and hackathons to bring your project to life.',
    iconColor: 'purple' as const,
    cardColor: 'black' as const,
    href: '#Fund',
    variant: 'overlay' as const,
    icon: 'Fund'
  },
  {
    heading: 'Learn',
    description:
      'Learn the basics, dive into the Cadence smart contract language, or explore how to keep building on EVM with the advantages of Flow.',
    iconColor: 'teal' as const,
    cardColor: 'black' as const,
    href: '#Learn',
    variant: 'overlay' as const,
    icon: 'Learn'
  },
] as const;

export interface HomeNavProps {
  title: string;
}

export function HomeNav({
  title,
}: HomeNavProps): JSX.Element {
  return (
    <div className="relative p-8">
      <div className="relative pl-8">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Title */}
          <div className="flex-1 basis-1/3 pr-8 flex items-center">
            <h1 className="text mb-8 max-w-full !text-3xl md:!text-6xl font-normal leading-[1.4]">
              {title}
            </h1>
          </div>

          {/* Right side - Grid of Cards */}
          <div className="flex-1 basis-2/3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pl-8">
              {NAVIGATION_CARDS.map((card) => (
                <ActionCard
                  key={card.heading}
                  heading={card.heading}
                  description={card.description}
                  iconColor={card.iconColor}
                  cardColor={card.cardColor}
                  variant={card.variant}
                  icon={card.icon}
                  onClick={() => {
                    window.location.href = card.href;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
