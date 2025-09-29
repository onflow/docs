// Google Analytics Event Constants - Using existing event names to avoid breaking GA data
export const GA_EVENTS = {
  // Existing events currently used in the codebase
  ACTION_CARD_CLICK: 'action_card_click',
  NAV_BAR_CLICK: 'nav_bar_click',
  SEARCH_CLICK: 'search_click',
  FEEDBACK_CLICK: 'feedback_click',
  AUTH_LOGIN: 'login',
} as const;

// Event categories for consistent tracking - Using existing categories
export const GA_CATEGORIES = {
  ACTION_CARD: 'action_card',
  NAV_BAR: 'nav_bar',
  SEARCH: 'search',
  FEEDBACK: 'feedback',
  AUTH: 'auth',
} as const;

// Event actions for consistent tracking - Using existing actions
export const GA_ACTIONS = {
  CLICK: 'click',
  LOGIN: 'login',
} as const;
