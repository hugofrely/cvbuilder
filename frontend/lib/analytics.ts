// Google Analytics Event Tracking
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
interface GTagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Meta Pixel Event Tracking
export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

// Custom event tracking helpers
export const trackCVCreated = (templateName: string) => {
  event({
    action: 'cv_created',
    category: 'engagement',
    label: templateName,
  });
  trackMetaEvent('Lead', { template: templateName });
};

export const trackCVExported = (format: string) => {
  event({
    action: 'cv_exported',
    category: 'conversion',
    label: format,
  });
  trackMetaEvent('Purchase', { format: format, value: 0, currency: 'EUR' });
};

export const trackTemplateViewed = (templateName: string) => {
  event({
    action: 'template_viewed',
    category: 'engagement',
    label: templateName,
  });
};

export const trackPremiumClick = () => {
  event({
    action: 'premium_click',
    category: 'engagement',
    label: 'premium_button',
  });
  trackMetaEvent('InitiateCheckout');
};

export const trackPaymentSuccess = (amount: number) => {
  event({
    action: 'payment_success',
    category: 'conversion',
    label: 'premium_purchase',
    value: amount,
  });
  trackMetaEvent('Purchase', { value: amount, currency: 'EUR' });
};
