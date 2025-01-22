import React from 'react';
import Layout from '@theme-original/Layout';
import type LayoutType from '@theme/Layout';
import type { WrapperProps } from '@docusaurus/types';
import '../../config/fcl';
import { SWRConfig } from 'swr';

type Props = WrapperProps<typeof LayoutType>;

const CACHE_KEY = 'app-cache';

export default function LayoutWrapper(props: Props): JSX.Element {
  return (
    <SWRConfig value={{ provider: localStorageProvider }}>
      <Layout {...props} />
    </SWRConfig>
  );
}

function localStorageProvider() {
  // Initialize with data from localStorage
  const map = new Map<string, any>(
    JSON.parse(localStorage.getItem(CACHE_KEY) || '[]'),
  );

  // Before unloading the page, write data to localStorage
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(CACHE_KEY, appCache);
  });

  return map;
}
