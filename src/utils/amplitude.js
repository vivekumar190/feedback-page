import * as amplitude from '@amplitude/analytics-browser';

// Initialize Amplitude with your API key
export const initAmplitude = () => {
  amplitude.init('32c28c73f53b9eb0db248673cb873313');
};

// Event tracking functions
export const trackEvent = (eventName, eventProperties = {}) => {
  amplitude.track(eventName, eventProperties);
};

// Predefined events
export const EVENTS = {
  // Menu page events

  Page_Viewed: 'Page View',
  MENU_PAGE_VIEWED: 'Page View',
  FEEDBACK_LINK_CLICKED: 'click_cta',
  TOOL_LINK_CLICKED: 'click_cta',

  // Feedback page events
  FEEDBACK_PAGE_VIEWED: 'Page View',
  FEEDBACK_SUBMITTED: 'click_cta',

  // Thank you page events
  THANK_YOU_PAGE_VIEWED: 'Page View',

  // Certificate and resources page events
  CERTIFICATE_PAGE_VIEWED: 'Page View',
  CERTIFICATE_DOWNLOADED: 'click_cta',
  RESOURCE_VIEWED: 'Page View',
  RESOURCE_DOWNLOADED: 'click_cta'
}; 