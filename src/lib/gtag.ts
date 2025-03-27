import ReactGA from 'react-ga4';

// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = 'G-H4S817RX07'; // Updated measurement ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({ hitType: 'pageview', page: url });
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined') {
    ReactGA.event({
      action,
      category,
      label,
      value
    });
  }
};

// Example usage:
// Track tax calculation events
export const trackTaxCalculation = (taxType: string, region: string, amount: number) => {
  event({
    action: 'calculate_tax',
    category: taxType,
    label: region,
    value: Math.round(amount)
  });
};

// Track user preferences
export const trackRegionSelection = (region: string) => {
  event({
    action: 'select_region',
    category: 'user_preference',
    label: region
  });
};

// Track feature usage
export const trackFeatureUsage = (feature: string) => {
  event({
    action: 'use_feature',
    category: 'feature_usage',
    label: feature
  });
};
