import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { filter, map, mergeMap } from 'rxjs/operators';

import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SeoService } from './core/services/seo.service';
import { CanonicalService } from './core/services/canonical.service';
import { ThemeService } from './core/services/theme.service';

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
    <div class="min-h-screen flex flex-col bg-primary text-primary">
      <app-header></app-header>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles:`
    main {
      padding-top: 64px; /* h-16 = 64px */
    }
  `
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private canonicalService: CanonicalService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Initialize theme service
    this.themeService.applyThemeClasses();
    
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(() => {
          let route = this.activatedRoute.firstChild;
          while (route?.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route?.outlet === 'primary'),
        mergeMap((route) => route?.data ?? [])
      )
      .subscribe((data: any) => {
        // Update SEO tags
        this.seoService.updateSeoTags({
          title:
            data.title ||
            'Tool Ocean - Free Online Tools for Developers & Everyone',
          description:
            data.description ||
            'Discover 15+ free online tools including JSON validator, text converters, calculators, QR generators, and more. Fast, secure, and user-friendly tools for developers and professionals.',
          keywords:
            data.keywords ||
            'online tools, JSON validator, text converter, QR code generator, calculator tools, developer tools, free tools',
        });

        // Update canonical URL
        const canonicalUrl =
          data.canonical || `https://tool-ocean.vercel.app${this.router.url}`;
        this.canonicalService.setCanonicalURL(canonicalUrl);
      });
  }
}
