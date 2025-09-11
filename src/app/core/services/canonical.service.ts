import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CanonicalService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  setCanonicalURL(url?: string) {
    const head = this.doc.head;

    // Let element be HTMLLinkElement | null
    let element = head.querySelector<HTMLLinkElement>("link[rel='canonical']");

    if (element) {
      // If exists, update href
      element.href = url || this.doc.URL;
    } else {
      // If not exists, create new link element
      element = this.doc.createElement('link');
      element.setAttribute('rel', 'canonical');
      element.href = url || this.doc.URL;
      head.appendChild(element);
    }
  }
}
