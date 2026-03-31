import { Injectable, signal } from '@angular/core';

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  storeDescription: string;
  currency: string;
  currencySymbol: string;
  settings: {
    enableDarkMode: boolean;
    defaultTheme: string;
    productsPerPage: number;
    enableWishlist: boolean;
    enableQuickView: boolean;
    enableCompare: boolean;
    showReviews: boolean;
    enableNewsletterPopup: boolean;
    newsletterDelay: number;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    instagram: string;
    twitter: string;
    facebook: string;
    pinterest: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
    estimatedDeliveryDays: {
      standard: string;
      express: string;
    };
  };
  navigation: {
    mainMenu: Array<{ label: string; path: string }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  config = signal<StoreConfig | null>(null);

  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/assets/config.json');
      const data = await response.json();
      this.config.set(data);
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }
}
