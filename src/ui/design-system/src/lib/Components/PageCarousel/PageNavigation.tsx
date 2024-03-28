import React from 'react';
import PageBack from '../../../../images/page/page-carousel-back.svg';
import PageForward from '../../../../images/page/page-carousel-forward.svg';
import PageBack2 from '../../../../images/page/page-carousel-back-2.svg';
import PageForward2 from '../../../../images/page/page-carousel-forward-2.svg';

export interface PageNavigationProps {
  forward: () => void;
  back: () => void;
  category: string;
}

export const PageNavigation = ({
  forward,
  back,
  category,
}: PageNavigationProps): React.ReactNode => {
  return (
    <>
      <div className="hidden md:flex flex justify-start items-center py-6">
        <button className="text-primary bg-transparent hover:cursor-pointer rounded-full border-none">
          <PageBack
            className="stroke-current"
            onClick={() => {
              back();
            }}
          />
        </button>
        <button className="bg-transparent hover:cursor-pointer rounded-full border-none">
          <PageForward
            className="stroke-current"
            onClick={() => {
              forward();
            }}
          />
        </button>
        <span className="px-4 text-sm">View all {category}</span>
      </div>
      <div className="flex items-center justify-between md:hidden w-full">
        <button className="bg-transparent hover:cursor-pointer rounded-full border-none">
          <PageBack2
            onClick={() => {
              back();
            }}
          />
        </button>
        <div className="text-sm font-semibold">View all</div>
        <button className="bg-transparent hover:cursor-pointer rounded-full border-none">
          <PageForward2
            onClick={() => {
              forward();
            }}
          />
        </button>
      </div>
    </>
  );
};
