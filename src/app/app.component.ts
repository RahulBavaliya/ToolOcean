import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    HeaderComponent,
    FooterComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-header></app-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    // Set default SEO tags
    this.seoService.updateSeoTags({
      title: 'Tool Ocean - Free Online Tools for Developers & Everyone',
      description:
        'Discover 15+ free online tools including JSON validator, text converters, calculators, QR generators, and more. Fast, secure, and user-friendly tools for developers and professionals.',
      keywords:
        'online tools, JSON validator, text converter, QR code generator, calculator tools, developer tools, free tools',
    });
  }
}
