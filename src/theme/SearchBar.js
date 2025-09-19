import React from 'react';
import SearchBar from '@theme-original/SearchBar';
// import AskCookbook from '@cookbookdev/docsbot/react';
// import BrowserOnly from '@docusaurus/BrowserOnly';
/** It's a public API key, so it's safe to expose it here */
// const COOKBOOK_PUBLIC_API_KEY =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzEyYWRkYjk5YjBmNWViM2ZkODQxOGMiLCJpYXQiOjE3MjkyNzc0MDMsImV4cCI6MjA0NDg1MzQwM30._bhlmAnFpvxvkTV0PvU-6FwabhFOdSOx-qed2UIogpY';
export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
      {/* Replaced with Pylon chat widget integration */}
      {/* <BrowserOnly>
        {() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />}
      </BrowserOnly> */}
    </>
  );
}
