import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function Redirect({ to }: { to: string }): null {
  React.useEffect(() => {
    window.location.href = useBaseUrl(to);
  }, []);
  return null;
}
