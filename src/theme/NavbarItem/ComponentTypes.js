import React from 'react';
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import ConnectButton from '@site/src/components/ConnectButton';
import { event } from '@site/src/utils/gtags.client';
import { GA_EVENTS, GA_CATEGORIES, GA_ACTIONS } from '@site/src/constants/ga-events';

// Wrapper component that adds tracking to navbar items
const withTracking = (Component) => {
  return (props) => {
    const handleClick = (e) => {
      // Extract meaningful label from props
      const label = props.label || 'unknown-navbar-item';
      
      // Check if we're on the homepage
      const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';
      
      // Track the navbar item click with appropriate event based on page
      event({
        action: isHomepage ? GA_EVENTS.ACTION_CARD_CLICK : GA_EVENTS.NAV_BAR_CLICK,
        category: isHomepage ? GA_CATEGORIES.ACTION_CARD : GA_CATEGORIES.NAV_BAR,
        label: label,
        location: true,
      });
      
      // Call original onClick if it exists
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return <Component {...props} onClick={handleClick} />;
  };
};

// Create tracked versions of all component types
const trackedComponentTypes = {};
Object.keys(ComponentTypes).forEach(key => {
  trackedComponentTypes[key] = withTracking(ComponentTypes[key]);
});

// Add specific wrapper for html type navbar items
const withHtmlTracking = (Component) => {
  return (props) => {
    const handleClick = (e) => {
      // Debug: log all available props
      
      // Try to get the label from various sources
      let label = props.label || props.item?.label;
      
      // If no label in props, try to extract from HTML span
      if (!label && props.html) {
        const spanMatch = props.html.match(/<span[^>]*>([^<]+)<\/span>/);
        if (spanMatch) {
          label = spanMatch[1].trim();
        }
      }

      // Final fallback
      if (!label) {
        label = 'unknown-html-item';
      }
      
      // Add Nav- prefix to match existing pattern
      const prefixedLabel = `Nav-${label}`;
      
      // Check if we're on the homepage
      const isHomepage = typeof window !== 'undefined' && window.location.pathname === '/';
      
      // Track the navbar item click with appropriate event based on page
      event({
        action: isHomepage ? GA_EVENTS.ACTION_CARD_CLICK : GA_EVENTS.NAV_BAR_CLICK,
        category: isHomepage ? GA_CATEGORIES.ACTION_CARD : GA_CATEGORIES.NAV_BAR,
        label: prefixedLabel,
        location: true,
      });
      
      // Call original onClick if it exists
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return <Component {...props} onClick={handleClick} />;
  };
};

export default {
  ...trackedComponentTypes,
  'custom-connectButton': ConnectButton,
  // Add html type if it exists
  ...(ComponentTypes.html ? { html: withHtmlTracking(ComponentTypes.html) } : {}),
  // Add default type if it exists (for href items)
  ...(ComponentTypes.default ? { default: withHtmlTracking(ComponentTypes.default) } : {}),
};