import React from 'react';
import { PageCardImage } from './PageCardImages';
import AppLink from '../AppLink';
import { PageNavigation } from './PageNavigation';

export interface PageCardProps {
  link: string;
  title: string;
  subtitle: string;
  imageName: string;
  hoverText: string;
}

export const PageCard = ({
  link,
  title,
  subtitle,
  imageName,
  hoverText,
}: PageCardProps): React.ReactElement => {
  return (
    <AppLink
      className="hover:no-underline flex flex-col h-[440px] justify-between hover:cursor-pointer w-full bg-white rounded-lg overflow-hidden shadow-lg text-start transition-opacity duration-300 ease-in-out group"
      to={link}
    >
      {/* Apply the scale transition classes to the PageCardImage component */}
      <div className="transform transition-transform duration-300 ease-in-out group-hover:scale-105">
        <PageCardImage imageName={imageName} />
      </div>
      <div className="px-6 py-4 bg-white">
        <div className="text-black font-semibold text-xl mb-2">{title}</div>
        <p className="text-gray-400 text-base">{subtitle}</p>
      </div>
      <div className="flex-grow" />
      <div className="px-6 pt-4 pb-4">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <span className="text-gray-500 text-xs block">{hoverText} →</span>
        </div>
      </div>
    </AppLink>
  );
};

export interface PageOfCardsProps {
  cards: PageCardProps[];
  category: string;
}

export const PageOfCards = ({
  cards,
  category,
}: PageOfCardsProps): React.ReactNode => {
  const [activeCard, setActiveCard] = React.useState(cards[0]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const incrementCard = (increment: number): void => {
    const nIdx = activeIndex + increment;
    const nextIndex = nIdx < 0 ? cards.length - 1 : nIdx % cards.length;
    setActiveIndex(nextIndex);
    setActiveCard(cards[nextIndex]);
  };
  return (
    <>
      <div className="text-primary font-semibold text-2xl justify-start">
        {category}
      </div>

      <div className="flex flex-col md:flex-row md:justify-center items-center gap-4 py-4">
        <PageCard key={activeCard.imageName} {...activeCard} />
        <PageNavigation
          back={() => {
            incrementCard(-1);
          }}
          forward={() => {
            incrementCard(1);
          }}
          category={''}
        />
      </div>
    </>
  );
};
