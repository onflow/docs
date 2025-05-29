import React, { useState, useEffect, useCallback } from 'react';
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
    href: 'https://e.customeriomail.com/manage_subscription_preferences/dgTdoQoDAI7HAY3HAQGWxJT9wbM-Af61EgxuM6E=',
    variant: 'horizontal' as const,
    icon: 'learn'
  },
  {
    heading: 'May the Flow be with You!',
    description: 'We are wrapping up our month-long vibe coding challenge on Flow! Check out the winners, or submit for the last week!',
    iconColor: 'green',
    cardColor: 'black',
    href: '/ecosystem/Hackathons%20and%20Events/may-the-flow-be-with-you',
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(1);
  const totalCards = CAROUSEL_CARDS.length;
  // Calculate maxIndex properly to prevent empty segments
  const maxIndex = Math.max(0, totalCards - cardsToShow);

  // Initialize cardsToShow based on screen width
  useEffect(() => {
    const updateCardsToShow = () => {
      setCardsToShow(window.innerWidth >= 1024 ? 2 : 1);
    };
    
    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);
    return () => window.removeEventListener('resize', updateCardsToShow);
  }, []);

  // Handle automatic sliding
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        handleNext();
      }
    }, 5000); // Auto slide every 5 seconds

    return () => clearInterval(timer);
  }, [activeIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Loop back to beginning if at the end
    if (activeIndex >= maxIndex) {
      setActiveIndex(0);
    } else {
      setActiveIndex(prev => prev + 1);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [activeIndex, isTransitioning, maxIndex]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Loop to the end if at the beginning
    if (activeIndex <= 0) {
      setActiveIndex(maxIndex);
    } else {
      setActiveIndex(prev => prev - 1);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [activeIndex, isTransitioning, maxIndex]);

  const handleDotClick = useCallback((index: number) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setActiveIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [activeIndex, isTransitioning]);

  return (
    <div className="relative w-full" aria-label="News carousel">
      {/* Card Container */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out" 
          style={{ 
            transform: `translateX(-${activeIndex * (100 / cardsToShow)}%)`,
            gap: '1.5rem' 
          }}
        >
          {CAROUSEL_CARDS.map((card, index) => (
            <div 
              key={`card-${index}`}
              className="flex-shrink-0"
              style={{ 
                width: cardsToShow === 1 ? '100%' : `calc((100% - ${1.5 * (cardsToShow - 1)}rem) / ${cardsToShow})`
              }}
            >
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

      {/* Navigation Buttons */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 md:flex hidden">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border-0 shadow-md cursor-pointer"
          aria-label="Previous slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 -rotate-90"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border-0 shadow-md cursor-pointer"
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 rotate-90"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        </button>
      </div>

      {/* Mobile navigation buttons */}
      <div className="flex justify-center items-center mt-4 gap-4 md:hidden">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border-0 cursor-pointer"
          aria-label="Previous slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        {/* Dots indicator for mobile */}
        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full border-0 transition-colors ${
                index === activeIndex 
                  ? 'bg-gray-800 dark:bg-gray-200' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
        
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors border-0 cursor-pointer"
          aria-label="Next slide"
          disabled={isTransitioning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      {/* Desktop progress indicator */}
      <div className="hidden md:flex justify-center items-center mt-4 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => handleDotClick(index)}
            className={`w-8 h-1 rounded-sm border-0 transition-all ${
              index === activeIndex 
                ? 'bg-gray-800 dark:bg-gray-200 w-12' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
};