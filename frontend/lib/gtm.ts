// Google Tag Manager Events

type GTMEvent = {
  event: string;
  [key: string]: string | number | boolean | undefined;
};

// Fonction pour envoyer des événements à Google Tag Manager
export const sendGTMEvent = (event: GTMEvent) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push(event);
  }
};

// Événements de conversion pour Google Ads

// 1. Événement: Création de CV commencée
export const trackCVCreationStart = () => {
  sendGTMEvent({
    event: 'cv_creation_start',
    event_category: 'engagement',
    event_label: 'User started creating CV',
  });
};

// 2. Événement: CV complété (toutes les sections remplies)
export const trackCVCompleted = () => {
  sendGTMEvent({
    event: 'cv_completed',
    event_category: 'conversion',
    event_label: 'User completed CV',
    value: 1, // Valeur de conversion
  });
};

// 3. Événement: Téléchargement PDF (CONVERSION PRINCIPALE)
export const trackPDFDownload = (templateName?: string) => {
  sendGTMEvent({
    event: 'pdf_download',
    event_category: 'conversion',
    event_label: templateName || 'PDF downloaded',
    value: 1,
  });
};

// 4. Événement: Template sélectionné
export const trackTemplateSelection = (templateName: string, isPremium: boolean) => {
  sendGTMEvent({
    event: 'template_selected',
    event_category: 'engagement',
    event_label: templateName,
    premium: isPremium,
  });
};

// 5. Événement: Inscription utilisateur (CONVERSION SECONDAIRE)
export const trackUserSignup = (method: string) => {
  sendGTMEvent({
    event: 'user_signup',
    event_category: 'conversion',
    event_label: `Signup via ${method}`,
    value: 2, // Valeur plus élevée car l'utilisateur s'engage plus
  });
};

// 6. Événement: Achat template premium (CONVERSION HAUTE VALEUR)
export const trackPremiumPurchase = (amount: number, templateId: string) => {
  sendGTMEvent({
    event: 'purchase',
    event_category: 'ecommerce',
    event_label: `Premium template: ${templateId}`,
    value: amount,
    currency: 'EUR',
  });
};

// 7. Événement: Clic sur bouton CTA
export const trackCTAClick = (ctaLocation: string) => {
  sendGTMEvent({
    event: 'cta_click',
    event_category: 'engagement',
    event_label: ctaLocation,
  });
};

// 8. Événement: Page vue (pour le remarketing)
export const trackPageView = (pagePath: string, pageTitle: string) => {
  sendGTMEvent({
    event: 'page_view',
    page_path: pagePath,
    page_title: pageTitle,
  });
};

// 9. Événement: Temps passé sur le builder (engagement)
export const trackTimeOnBuilder = (seconds: number) => {
  sendGTMEvent({
    event: 'time_on_builder',
    event_category: 'engagement',
    event_label: 'Time spent on CV builder',
    value: seconds,
  });
};

// 10. Événement: Abandon du builder (pour le remarketing)
export const trackBuilderAbandonment = () => {
  sendGTMEvent({
    event: 'builder_abandoned',
    event_category: 'engagement',
    event_label: 'User left builder without completing',
  });
};
