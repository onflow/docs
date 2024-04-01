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
  cardsPerPage?: number;
  showCategory?: boolean;
}

export const PageOfCards = ({
  cards,
  category,
  cardsPerPage = 1,
  showCategory = true,
}: PageOfCardsProps): React.ReactNode => {
  const [currentPage, setCurrentPage] = React.useState(0);

  const incrementPage = (increment: number): void => {
    const totalPages = Math.ceil(cards.length / cardsPerPage);
    const nPage = currentPage + increment;
    const nextPage = nPage < 0 ? totalPages - 1 : nPage % totalPages;
    setCurrentPage(nextPage);
  };

  // Calculate the cards to show on the current page
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const cardsToShow = cards.slice(startIndex, endIndex);
  const showNavigation = cards.length > cardsPerPage;
  return (
    <>
      <div className="text-primary font-semibold text-2xl justify-start">
        {showCategory && category}
      </div>

      <div className="flex flex-col md:justify-center items-center gap-4 py-4">
        <div className="flex flex-row gap-4">
          {cardsToShow.map((card) => (
            <PageCard key={card.imageName} {...card} />
          ))}
        </div>
        <PageNavigation
          show={showNavigation}
          back={() => {
            incrementPage(-1);
          }}
          forward={() => {
            incrementPage(1);
          }}
        />
      </div>
    </>
  );
};
