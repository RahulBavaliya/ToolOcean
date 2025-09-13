import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ThemeToggleComponent,
  ],
  template: `
   <header class="bg-gradient-to-r from-ocean-600 to-ocean-700 shadow-lg sticky top-0 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      
      <!-- Logo -->
      <div class="flex items-center">
        <a routerLink="/" class="flex items-center space-x-3 text-white hover:text-blue-100 transition-colors">
          <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
          <img src="assets/logo.png" alt="Tool Ocean Logo" class="w-8 h-8 object-contain" style="width: 50px; height: 50px;">

          </div>
          <div>
             <h1 style="
    margin-bottom: 0px;
    font-size: 27px;
"> 
             <span
    style="
      background: #043f7f;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
      display: inline-block;
    "
  >
    Tool
  </span>
  <span
    style="
    padding-left:10px;
      background: linear-gradient(to right, #14b8a6, #14b8a6, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
      display: inline-block;
    "
  > Ocean</span>
</h1>


            <p style="
    margin-bottom: 10px;
    padding-bottom: 10px;
    margin-top: 0px;
    padding-top: 0px;
    font-size: 12px;
">Free Online Tools</p>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-2">
        <ng-container *ngFor="let menu of menus">
          <div class="relative group">
            <button mat-button class="!text-white font-medium hover:bg-white/10 rounded-lg px-4 py-2 transition-all">
              <span>{{ menu.label }}</span>
              <mat-icon>keyboard_arrow_down</mat-icon>
            </button>
            <div class="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div class="py-2">
                <a *ngFor="let item of menu.items"
                   [routerLink]="item.link"
                   class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                   [ngClass]="'hover:text-' + menu.color + '-600'">
                  <mat-icon class="mr-3" [ngClass]="'text-' + menu.color + '-500'">
                    {{ item.icon }}
                  </mat-icon>
                  {{ item.label }}
                </a>
              </div>
            </div>
          </div>
        </ng-container>
        
        <!-- Theme Toggle -->
        <app-theme-toggle></app-theme-toggle>
      </div>

      <!-- Mobile Menu Button -->
      <div class="md:hidden">
        <app-theme-toggle></app-theme-toggle>
        <button mat-icon-button class="text-white" [matMenuTriggerFor]="mobileMenu">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu -->
  <mat-menu #mobileMenu="matMenu" class="w-64">
    <div class="py-2 divide-y divide-gray-200 pt-100" >
      <ng-container *ngFor="let menu of menus">
        <div>
          <h3 class="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
            {{ menu.label }}
          </h3>
          <a *ngFor="let item of menu.items"
             mat-menu-item
             [routerLink]="item.link" class="menuitem">
            <mat-icon class="mr-3" [ngClass]="'text-' + menu.color + '-500'">
              {{ item.icon }}
            </mat-icon>
            {{ item.label }}
          </a>
        </div>
      </ng-container>
    </div>
  </mat-menu>
</header>

  `,
  styles: [
    `/* ===========================
    Mobile Menu Padding & Background
    =========================== */
 .pt-100 {
   padding-top: 50px;
   padding-left: 10px;
   padding-right: 10px;
   box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
   background-color: var(--bg-card, #ffffff); /* Light mode default */
   transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
 }
 
 /* Dark mode support for menu container */
 [data-theme='dark'] .pt-100 {
   background-color: var(--bg-card, #1e293b);
   box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.4);
 }
 
 /* ===========================
    Menu Item
    =========================== */
 .menuitem {
   transition: box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease, color 0.3s ease;
   color: var(--text-primary, #111827); /* Light mode text */
   border-radius: 4px;
   display: flex;
   align-items: center;
   padding: 0.5rem 1rem;
 }
 
 /* Dark mode default text color */
 [data-theme='dark'] .menuitem {
   color: var(--text-primary, #f8fafc); /* Dark mode text */
 }
 
 /* Light mode hover */
 .menuitem:hover {
   box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.15);
   transform: translateY(-2px);
   background-color: #f3f4f6; /* Light gray hover */
   color: #111827;
 }
 
 /* Dark mode hover */
 [data-theme='dark'] .menuitem:hover {
   box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.5);
   transform: translateY(-2px);
   background-color: #FFFFFF; /* White hover */
   color: #f8fafc;
 } 
`,
  ],
})
export class HeaderComponent {
  menus = [
    {
      label: 'Tech',
      color: 'ocean',
      items: [
        { label: 'JSON Validator', link: '/tech/json-validator', icon: 'code' },
        { label: 'XML Validator', link: '/tech/xml-validator', icon: 'code' },
        {
          label: 'Code Beautifier',
          link: '/tech/beautifier',
          icon: 'auto_fix_high',
        },
        { label: 'Regex Tester', link: '/tech/regex-tester', icon: 'search' },
      ],
    },
    {
      label: 'Text',
      color: 'teal',
      items: [
        {
          label: 'Character Counter',
          link: '/text/character-counter',
          icon: 'text_fields',
        },
        {
          label: 'Word Counter',
          link: '/text/word-counter',
          icon: 'format_list_numbered',
        },
        {
          label: 'Case Converter',
          link: '/text/case-converter',
          icon: 'text_format',
        },
      ],
    },
    {
      label: 'Document',
      color: 'green',
      items: [
        {
          label: 'PDF to Word',
          link: '/document/pdf-to-word',
          icon: 'picture_as_pdf',
        },
        {
          label: 'Word to PDF',
          link: '/document/word-to-pdf',
          icon: 'description',
        },
      ],
    },
    {
      label: 'Calculator',
      color: 'purple',
      items: [
        {
          label: 'Percentage Calculator',
          link: '/calculator/percentage-calculator',
          icon: 'percent',
        },
        {
          label: 'Unit Converter',
          link: '/calculator/measurement-converter',
          icon: 'straighten',
        },
      ],
    },
    {
      label: 'More',
      color: 'indigo',
      items: [
        { label: 'QR Generator', link: '/misc/qr-generator', icon: 'qr_code' },
        {
          label: 'QR Reader',
          link: '/misc/qr-reader',
          icon: 'qr_code_scanner',
        },
        {
          label: 'Barcode Generator',
          link: '/misc/barcode-generator',
          icon: 'view_stream',
        },
        {
          label: 'Barcode Reader',
          link: '/misc/barcode-reader',
          icon: 'scanner',
        },
        { label: 'URL Shortener', link: '/misc/url-shortener', icon: 'link' },
      ],
    },
  ];
}
