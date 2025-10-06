import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import LazyDocsbot from '@site/src/components/LazyDocsbot';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';

export default function SearchBarWrapper(props) {
  const handleSearchClick = () => {
    // Check if we're on the homepage
    const isHomepage =
      typeof window !== 'undefined' && window.location.pathname === '/';

    // Track the search bar click
    event({
      action: isHomepage ? GA_EVENTS.ACTION_CARD_CLICK : GA_EVENTS.SEARCH_CLICK,
      category: isHomepage ? GA_CATEGORIES.ACTION_CARD : GA_CATEGORIES.SEARCH,
      label: 'Nav-Search',
      location: true,
    });
  };

  return (
    <>
      <div onClick={handleSearchClick}>
        <SearchBar {...props} />
      </div>
      <BrowserOnly>
        {() => <LazyDocsbot />}
      </BrowserOnly>
    </>
  );
}
