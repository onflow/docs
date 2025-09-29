import React from 'react';
import LinkItem from '@theme-original/Footer/LinkItem';
import type {WrapperProps} from '@docusaurus/types';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES } from '@site/src/constants/ga-events';

type Props = WrapperProps<typeof LinkItem>;

export default function LinkItemWrapper(props: Props): JSX.Element {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Extract meaningful label from props
    const label = props.label || props.href || 'unknown-footer-item';
    
    // Check if we're on the homepage
    const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';
    
    // Track the footer link click with appropriate event based on page
    event({
      action: isHomepage ? GA_EVENTS.ACTION_CARD_CLICK : GA_EVENTS.FOOTER_CLICK,
      category: GA_CATEGORIES.FOOTER,
      label: label,
      location: true,
    });
    
    // Call original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <>
      <LinkItem {...props} onClick={handleClick} />
    </>
  );
}
