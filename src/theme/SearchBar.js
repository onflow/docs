import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import AskCookbook from '@cookbookdev/docsbot/react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';
/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzEyYWRkYjk5YjBmNWViM2ZkODQxOGMiLCJpYXQiOjE3MjkyNzc0MDMsImV4cCI6MjA0NDg1MzQwM30._bhlmAnFpvxvkTV0PvU-6FwabhFOdSOx-qed2UIogpY';
export default function SearchBarWrapper(props) {
  const handleSearchClick = () => {
    // Check if we're on the homepage
    const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';
    
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
        <BrowserOnly>
          {() => <SearchBar {...props} />}
        </BrowserOnly>
      </div>
      <BrowserOnly>
        {() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />}
      </BrowserOnly>
    </>
  );
}
