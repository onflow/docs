import React, { useState } from 'react';
import ActionCard from '@site/src/components/ActionCard';

interface CarouselCard {
  heading: string;
  description: string;
  iconColor: 'green' | 'blue' | 'purple' | 'teal' | 'black' | 'white';
  cardColor: 'green' | 'blue' | 'purple' | 'teal' | 'black' | 'white';
  href: string;
  variant: 'horizontal' | 'default' | 'overlay';
  icon?: string;
}

const CAROUSEL_CARDS: CarouselCard[] = [
  {
    heading: 'Get the newsletter!',
    description: 'We send out a newsletter every week with the latest news for Flow developers.  Sign up to get it in your inbox!',
    iconColor: 'green',
    cardColor: 'black',
    href: 'https://break.link',
    variant: 'horizontal' as const,
    icon: 'learn'
  },
  {
    heading: 'May the Flow be with You!',
    description: 'Join us for a month-long vibe coding challenge on Flow! Starting May 4th, participate in our four themed weeks.',
    iconColor: 'green',
    cardColor: 'black',
    href: '/ecosystem/Hackathons%20and%20Events/may-the-flow-be-with-you',
    variant: 'horizontal' as const,
    icon: 'vcs-&-funds'
  },
  {
    heading: 'Web3 Founder x VC meetup',
    description: 'Calling all Web3 founders from Consensus! 🧠 Join us for an epic event of networking, learning, and fun.',
    iconColor: 'green',
    cardColor: 'black',
    href: 'https://lu.ma/vicz07zu',
    variant: 'horizontal' as const,
    icon: 'vcs-&-funds'
  },
  {
    heading: 'ETH Global Prague',
    description: 'Earn up to $10,000 in prizes for building on Flow at one of the biggest hackathons in Europe!',
    iconColor: 'purple',
    cardColor: 'black',
    href: 'https://ethglobal.com/events/prague/prizes/flow',
    variant: 'horizontal' as const,
    icon: 'grants'
  },
  {
    heading: 'EthCC Cannes',
    description: 'Earn up to $20,000 in prizes at the largest annual Ethereum conference in Europe!',
    iconColor: 'blue',
    cardColor: 'black',
    href: 'https://ethglobal.com/events/cannes/prizes/flow',
    variant: 'horizontal' as const,
    icon: 'grants'
  },
];

export const NewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_CARDS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? CAROUSEL_CARDS.length - 1 : prevIndex - 1
    );
  };

  const getVisibleCards = () => {
    if (CAROUSEL_CARDS.length < 2) return [CAROUSEL_CARDS[0]];

    const secondIndex = (currentIndex + 1) % CAROUSEL_CARDS.length;
    return [CAROUSEL_CARDS[currentIndex], CAROUSEL_CARDS[secondIndex]];
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -left-14 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-gray-300/20 text-black flex items-center justify-center hover:bg-gray-700 cursor-pointer border-0"
          aria-label="Next slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 rotate-90"
          >
            <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-gray-300/20 text-black flex items-center justify-center hover:bg-gray-700 cursor-pointer border-0"
          aria-label="Previous slide"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 -rotate-90"
          >
            <path d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getVisibleCards().map((card, index) => (
          <div key={`${currentIndex}-${index}`} className="w-full flex h-full cursor-pointer">
            <ActionCard
              heading={card.heading}
              description={card.description}
              iconColor={card.iconColor}
              cardColor={card.cardColor}
              variant={card.variant}
              icon={card.icon}
              onClick={() => {
                if (card.href.startsWith('https://')) {
                  window.open(card.href, '_blank');
                } else {
                  window.location.href = card.href;
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};