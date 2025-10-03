import React, { lazy, Suspense, useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const AskCookbook = lazy(() => import('@cookbookdev/docsbot/react'));

export default function LazyDocsbot() {
  const { siteConfig } = useDocusaurusContext();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const load = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => setShouldLoad(true));
      } else {
        setTimeout(() => setShouldLoad(true), 1);
      }
    };

    if (document.readyState === 'complete') {
      load();
    } else {
      window.addEventListener('load', load);
      return () => window.removeEventListener('load', load);
    }
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <AskCookbook apiKey={siteConfig.customFields.cookbookApiKey} />
    </Suspense>
  );
}
