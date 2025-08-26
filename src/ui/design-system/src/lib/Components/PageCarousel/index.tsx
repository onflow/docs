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
      link: '/build/cadence/core-contracts/fungible-token',
    },
    {
      title: 'Launch an NFT',
      subtitle: 'Deploy your first NFT collection',
      imageName: 'launch-an-nft',
      hoverText: 'Get Started',
      link: '/build/cadence/guides/nft',
    },
    {
      title: 'Quickstarts',
      subtitle: 'Some codes for quick implementation',
      imageName: 'quickstart-impl',
      hoverText: 'Get Started',
      link: 'https://academy.ecdao.org/en/quickstarts',
    },
  ],
  'Code Snippets': [
    {
      title: 'Emerald Snippets',
      subtitle: 'Examples of how to code things in Cadence and Flow.',
      imageName: 'emerald-snippets',
      hoverText: 'Get Started',
      link: 'https://academy.ecdao.org/en/snippets',
    },
    {
      title: 'Emerald Examples',
      subtitle: 'Basic Cadence code examples',
      imageName: 'emerald-examples',
      hoverText: 'Get Started',
      link: 'https://academy.ecdao.org/en/cadence-by-example',
    },
    {
      title: 'Cookbook',
      subtitle:
        'Explore Cadence smart contracts and transaction scripts for different use cases',
      imageName: 'cadence-cookbook',
      hoverText: 'Get Started',
      link: 'https://cookbook.flow.com/',
    },
  ],
  Resources: [
    {
      title: 'Ecosystem',
      subtitle:
        'Explore an array of exciting, grassroots initiatives, and projects',
      imageName: 'ecosystem-tools',
      hoverText: 'Get Started',
      link: '/ecosystem',
    },
    {
      title: 'Cadence',
      subtitle: 'Forge the future of decentralized apps.',
      imageName: 'cadence-vscode',
      hoverText: 'Get Started',
      link: 'https://cadence-lang.org/',
    },
    {
      title: 'Playground',
      subtitle: 'A smart contract tutorial for Cadence.',
      imageName: 'cadence-playground',
      hoverText: 'Get Started',
      link: 'https://play.flow.com/',
    },
  ],
};
export const PageCarousel = (): React.ReactNode => {
  const [activeCategory, setActiveCategory] = React.useState(categories[0]);

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
              activeCategory === category ? 'md:bg-primary-green' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:justify-center items-center gap-4 py-4">
        <div className="hidden md:flex">
          <PageOfCards
            key={`category-${activeCategory}`}
            category={activeCategory}
            cards={cards[activeCategory]}
            cardsPerPage={3}
            showCategory={false}
          />
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
    </div>
  );
};
