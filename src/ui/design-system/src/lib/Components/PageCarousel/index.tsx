import React from 'react';
import { PageCard, PageOfCards } from './PageCard';
import { PageNavigation } from './PageNavigation';

const categories = ['Guides', 'Code Snippets', 'Resources'];
const cards = {
  Guides: [
    {
      title: 'Create Fungible Tokens',
      subtitle: 'Deploy fungible tokens for your project',
      imageName: 'create-fungible-tokens',
      hoverText: 'Get Started',
    },
    {
      title: 'Launch an NFT',
      subtitle: 'Deploy your first NFT collection',
      imageName: 'launch-an-nft',
      hoverText: 'Get Started',
    },
    {
      title: 'Quickstarts',
      subtitle: 'Some codes for quick implementation',
      imageName: 'quickstart-impl',
      hoverText: 'Get Started',
    },
  ],
  'Code Snippets': [
    {
      title: 'Emerald Snippets',
      subtitle: 'Examples of how to code things in Cadence and Flow.',
      imageName: 'emerald-snippets',
      hoverText: 'Get Started',
    },
    {
      title: 'Emerald Examples',
      subtitle: 'Basic Cadence code examples',
      imageName: 'emerald-examples',
      hoverText: 'Get Started',
    },
    {
      title: 'Cookbook',
      subtitle:
        'Explore Cadence smart contracts and transaction scripts for different use cases',
      imageName: 'cadence-cookbook',
      hoverText: 'Get Started',
    },
  ],
  Resources: [
    {
      title: 'Ecosystem & Tools',
      subtitle: 'Explore an array of exciting, grassroots initiatives, and projects',
      imageName: 'ecosystem-tools',
      hoverText: 'Get Started',
    },
    {
      title: 'Cadence',
      subtitle: 'Forge the future of decentralized apps.',
      imageName: 'cadence-vscode',
      hoverText: 'Get Started',
    },
    {
      title: 'Playground',
      subtitle: 'A smart contract tutorial for Cadence.',
      imageName: 'cadence-playground',
      hoverText: 'Get Started',
    },
  ],
};
export const PageCarousel = (): React.ReactNode => {
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);

  const incrementCategory = (increment: number): void => {
    const currentIndex = categories.indexOf(activeCategory);
    const nIdx = currentIndex + increment;
    const nextIndex =
      nIdx < 0 ? categories.length - 1 : nIdx % categories.length;
    setActiveCategory(categories[nextIndex]);
  };

  return (
    <div className="container">
      <div className="text-primary text-5xl">
        Start building <span className="font-semibold">#onflow</span>
      </div>
      <div className="flex hidden md:flex md:flex-row gap-4 w-full py-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category);
            }}
            className={`border border-primary-gray-100 hover:cursor-pointer text-black bg-white px-4 py-2 rounded-lg ${
              activeCategory === category ? 'bg-primary-green' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:justify-center items-center gap-4 py-4">
        <div className="hidden md:flex md:gap-4">
          {cards[activeCategory].map((card, i) => (
            <PageCard key={i} {...card} />
          ))}
        </div>
        <div className="md:hidden">
          {Object.keys(cards).map((category, i) => (
            <PageOfCards
              key={`category-${i}`}
              category={category}
              cards={cards[category]}
            />
          ))}
        </div>
      </div>
      <div className="hidden md:block">
        <PageNavigation
          back={() => {
            incrementCategory(-1);
          }}
          forward={() => {
            incrementCategory(1);
          }}
          category={activeCategory}
        />
      </div>
    </div>
  );
};
