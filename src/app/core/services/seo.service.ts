import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateSeoTags(seoData: SeoData): void {
    // Update title
    if (seoData.title) {
      this.title.setTitle(seoData.title);
      this.meta.updateTag({ property: 'og:title', content: seoData.title });
      this.meta.updateTag({ name: 'twitter:title', content: seoData.title });
    }

    // Update description
    if (seoData.description) {
      this.meta.updateTag({ name: 'description', content: seoData.description });
      this.meta.updateTag({ property: 'og:description', content: seoData.description });
      this.meta.updateTag({ name: 'twitter:description', content: seoData.description });
    }

    // Update keywords
    if (seoData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoData.keywords });
    }

    // Update image
    if (seoData.image) {
      this.meta.updateTag({ property: 'og:image', content: seoData.image });
      this.meta.updateTag({ name: 'twitter:image', content: seoData.image });
    }

    // Update URL
    if (seoData.url) {
      this.meta.updateTag({ property: 'og:url', content: seoData.url });
      this.meta.updateTag({ name: 'twitter:url', content: seoData.url });
    }

    // Update type
    if (seoData.type) {
      this.meta.updateTag({ property: 'og:type', content: seoData.type });
    }
  }

  generateStructuredData(toolName: string, toolDescription: string): string {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": toolName,
      "description": toolDescription,
      "url": window.location.href,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
    return JSON.stringify(structuredData);
  }
}