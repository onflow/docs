import React, { useEffect } from 'react';
import Content from '@theme-original/NotFound/Content';

export default function ContentWrapper(props) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window?.mixpanel) {
      window.mixpanel.track('Page Not Found', {
        'Page URL': window.location.pathname,
      });
    }
  }, []);
  return (
    <>
      <Content {...props} />
    </>
  );
}
