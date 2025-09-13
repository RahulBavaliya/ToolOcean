import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SeoService } from '../../core/services/seo.service';

interface Tool {
  name: string;
  description: string;
  icon: string;
  route: string;
  category: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-ocean-600 via-ocean-700 to-ocean-800 text-ocean-600 py-20"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> <div class="mb-8"> <div class="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center animate-float" style="padding-top: 22px;"> <img src="assets/logo.png" alt="Tool Ocean Logo" class="w-8 h-8 object-contain" style="width: 250px; height: 250px;"> </div> </div> <p class="text-xl md:text-2xl !text-blue-100 mb-4 max-w-4xl mx-auto"> Your One-Stop Destination for Free Online Tools </p> <p class="text-lg text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed"> Discover 15+ powerful, fast, and secure online tools for developers, writers, and professionals. No registration required - just click and use! </p> <div class="flex flex-col sm:flex-row gap-4 justify-center items-center"> <button mat-raised-button class="bg-white text-ocean-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" (click)="scrollToTools()"> <mat-icon class="mr-2">explore</mat-icon> Explore Tools </button> <a routerLink="/tech/json-validator" mat-stroked-button class="border-2 border-white text-white hover:bg-white hover:text-ocean-700 px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300"> <mat-icon class="mr-2">code</mat-icon> Try JSON Validator </a> </div> </div> </section>


      <!-- Features Section -->
      <section class="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Tool Ocean?
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with modern web technologies for speed, security, and accessibility
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <mat-card class="text-center p-8 card-hover border-0 shadow-lg">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <mat-icon class="text-ocean-600 text-2xl">flash_on</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p class="text-gray-600 leading-relaxed">
                Optimized for speed with instant results. No waiting, no delays - just pure productivity.
              </p>
            </mat-card>
            
            <mat-card class="text-center p-8 card-hover border-0 shadow-lg">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <mat-icon class="text-ocean-600 text-2xl">security</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">100% Secure</h3>
              <p class="text-gray-600 leading-relaxed">
                Your data stays private. All processing happens in your browser - nothing is stored on our servers.
              </p>
            </mat-card>
            
            <mat-card class="text-center p-8 card-hover border-0 shadow-lg">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <mat-icon class="text-ocean-600 text-2xl">free_breakfast</mat-icon>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-4">Always Free</h3>
              <p class="text-gray-600 leading-relaxed">
                No hidden fees, no subscriptions, no limits. All tools are completely free to use forever.
              </p>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Tools Grid -->
      <section id="tools" class="mat-typography tools-section">
        <div class="container">
          <!-- Section Title -->
          <div class="tools-header">
            <h1 class="mat-display-1">Explore Our Tools</h1>
            <p class="mat-subheading-1">
              Carefully crafted tools for developers, writers, and digital professionals
            </p>
          </div>
      
          <!-- Tool Cards -->
          <div class="tools-grid">
            <mat-card
              *ngFor="let tool of tools"
              class="tool-card"
              [routerLink]="tool.route"
              [attr.aria-label]="'Navigate to ' + tool.name"
            >
              <mat-card-header>
                <div
                  mat-card-avatar
                  class="tool-icon"
                  [ngStyle]="{ background: getToolColor(tool.category) }"
                >
                  <mat-icon style="color: white">{{ tool.icon }}</mat-icon>
                </div>
                <mat-card-title>{{ tool.name }}</mat-card-title>
                <mat-card-subtitle>{{ tool.category }}</mat-card-subtitle>
              </mat-card-header>
      
              <mat-card-content>
                <p>{{ tool.description }}</p>
              </mat-card-content>
      
              <mat-card-actions align="end">
                <button
                  mat-raised-button
                  color="primary"
                  class="try-now-btn"
                  [ngStyle]="{ background: getToolColor(tool.category) }"
                >
                  <span>Try now</span>
                  <mat-icon class="arrow-icon">arrow_forward</mat-icon>
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
      </section>
      



      <!-- CTA Section -->
      <section class="py-16 bg-gradient-to-r from-ocean-600 to-ocean-700 text-ocean-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your Productivity?
          </h1>
          <p class="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Tool Ocean for their daily tasks
          </p>
          <!-- <button mat-raised-button 
                  class="bg-white text-ocean-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
                  (click)="scrollToTools()">
            <mat-icon class="mr-2">rocket_launch</mat-icon>
            Start Using Tools Now
          </button> -->
          <button mat-raised-button color="primary" class="launch-btn"
            (click)="scrollToTools()">
            <span>Start Using Tools Now</span>
            <mat-icon class="launch-icon">rocket_launch</mat-icon>
          </button>

          <!-- <button mat-raised-button color="primary" class="launch-btn launch-btn-gradient-text" (click)="scrollToTools()">
            <span class="launch-btn-gradient-text">Start Using Tools Now</span>
            <mat-icon class="launch-icon">rocket_launch</mat-icon>
          </button> -->

        </div>
      </section>
    </div>
  `,
  styles:  `
  /* ===========================
   Theme Variables
   =========================== */
:root {
  --bg-page: #ffffff;
  --bg-section: #f9fafb;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #6b7280;
  --shadow-card: rgba(0, 0, 0, 0.15);
}
[data-theme='dark'] {
  --bg-page: #0f172a;
  --bg-section: #1e293b;
  --bg-card: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --shadow-card: rgba(0, 0, 0, 0.4);
}

/* ===========================
   Layout
   =========================== */
.min-h-screen {
  background: var(--bg-page);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}

section {
  transition: background 0.3s ease, color 0.3s ease;
}

/* ===========================
   Tools Section
   =========================== */
.tools-section {
  padding: 80px 0;
  background: var(--bg-section);
  transition: background 0.3s ease, color 0.3s ease;
}
.tools-header {
  text-align: center;
  margin-bottom: 64px;
}
.tools-header h1 {
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}
.tools-header p {
  max-width: 640px;
  margin: 0 auto;
  color: var(--text-muted);
}

/* ===========================
   Tools Grid Container Fix
   =========================== */
.tools-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  padding: 0 16px; /* add horizontal padding to restore space */
  box-sizing: border-box; /* ensure padding doesn't break layout */
}

@media (min-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 24px; /* increase padding on medium screens */
  }
}

@media (min-width: 1024px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 0 32px; /* increase padding on large screens */
  }
}

/* ===========================
   Tool Card
   =========================== */
.tool-card {
  border-radius: 16px;
  cursor: pointer;
  padding-bottom: 8px;
  box-shadow: 0px 6px 20px var(--shadow-card);
  background: var(--bg-card);
  color: var(--text-primary);
  transition: box-shadow 0.3s ease, transform 0.3s ease,
    background 0.3s ease, color 0.3s ease;
}
.tool-card:hover {
  box-shadow: 0px 6px 20px var(--shadow-card);
  transform: translateY(-4px);
}
.tool-card mat-card-title,
.tool-card mat-card-subtitle,
.tool-card p {
  color: var(--text-secondary);
}

/* ===========================
   Tool Icon
   =========================== */
.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  width: 48px;
  height: 48px;
}

/* ===========================
   Buttons
   =========================== */
.try-now-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  border-radius: 9999px;
  padding: 6px 18px;
  transition: background 0.3s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
}
.try-now-btn .arrow-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}
.try-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
}
.try-now-btn:hover .arrow-icon {
  transform: translateX(4px);
}

.launch-btn {
  border-radius: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  box-shadow: 0px 6px 20px var(--shadow-card);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.launch-btn:hover {
  transform: translateY(-4px);
}
.launch-btn .launch-icon {
  font-size: 18px;
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
}
.launch-btn:hover .launch-icon {
  transform: translateX(4px);
}

  `,
})
export class HomeComponent implements OnInit {
  tools: Tool[] = [
    {
      name: 'JSON Validator',
      description:
        'Validate and format JSON data with syntax highlighting and error detection.',
      icon: 'code',
      route: '/tech/json-validator',
      category: 'Tech Tools',
      color: '#1976d2',
    },
    {
      name: 'XML Validator',
      description:
        'Validate XML documents and check syntax with detailed error reporting.',
      icon: 'code',
      route: '/tech/xml-validator',
      category: 'Tech Tools',
      color: '#1976d2',
    },
    {
      name: 'Code Beautifier',
      description:
        'Format and beautify HTML, CSS, JavaScript, and other code languages.',
      icon: 'auto_fix_high',
      route: '/tech/beautifier',
      category: 'Tech Tools',
      color: '#1976d2',
    },
    {
      name: 'Regex Tester',
      description:
        'Test regular expressions with real-time matching and explanation.',
      icon: 'search',
      route: '/tech/regex-tester',
      category: 'Tech Tools',
      color: '#1976d2',
    },
    {
      name: 'Character Counter',
      description:
        'Count characters, words, sentences, and paragraphs in your text.',
      icon: 'text_fields',
      route: '/text/character-counter',
      category: 'Text Tools',
      color: '#00796b',
    },
    {
      name: 'Word Counter',
      description:
        'Analyze text statistics including word count, reading time, and density.',
      icon: 'format_list_numbered',
      route: '/text/word-counter',
      category: 'Text Tools',
      color: '#00796b',
    },
    {
      name: 'Case Converter',
      description:
        'Convert text between uppercase, lowercase, title case, and more.',
      icon: 'text_format',
      route: '/text/case-converter',
      category: 'Text Tools',
      color: '#00796b',
    },
    {
      name: 'PDF to Word',
      description:
        'Convert PDF documents to editable Word files quickly and securely.',
      icon: 'picture_as_pdf',
      route: '/document/pdf-to-word',
      category: 'Document',
      color: '#388e3c',
    },
    {
      name: 'Word to PDF',
      description:
        'Convert Word documents to PDF format with perfect formatting.',
      icon: 'description',
      route: '/document/word-to-pdf',
      category: 'Document',
      color: '#388e3c',
    },
    {
      name: 'Percentage Calculator',
      description:
        'Calculate percentages, percentage increase, decrease, and more.',
      icon: 'percent',
      route: '/calculator/percentage-calculator',
      category: 'Calculator',
      color: '#7b1fa2',
    },
    {
      name: 'Unit Converter',
      description:
        'Convert between different units of measurement including length, weight, temperature.',
      icon: 'straighten',
      route: '/calculator/measurement-converter',
      category: 'Calculator',
      color: '#7b1fa2',
    },
    {
      name: 'QR Code Generator',
      description: 'Generate QR codes for URLs, text, contact info, and more.',
      icon: 'qr_code',
      route: '/misc/qr-generator',
      category: 'Misc Tools',
      color: '#303f9f',
    },
    {
      name: 'QR Code Reader',
      description: 'Scan and decode QR codes from images or camera.',
      icon: 'qr_code_scanner',
      route: '/misc/qr-reader',
      category: 'Misc Tools',
      color: '#303f9f',
    },
    {
      name: 'Barcode Generator',
      description:
        'Create various barcode formats including Code 128, EAN-13, and UPC.',
      icon: 'view_stream',
      route: '/misc/barcode-generator',
      category: 'Misc Tools',
      color: '#303f9f',
    },
    {
      name: 'URL Shortener',
      description:
        'Create short links and track clicks with detailed analytics.',
      icon: 'link',
      route: '/misc/url-shortener',
      category: 'Misc Tools',
      color: '#303f9f',
    },
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Tool Ocean - Free Online Tools for Developers & Everyone',
      description:
        'Discover 15+ free online tools including JSON validator, text converters, calculators, QR generators, and more. Fast, secure, and user-friendly tools for developers and professionals.',
      keywords:
        'online tools, JSON validator, text converter, QR code generator, calculator tools, developer tools, free tools',
      type: 'website',
    });
  }

  scrollToTools() {
    document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' });
  }

  getToolColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Tech Tools': 'linear-gradient(135deg, #1976d2 0%, #0288d1 100%)',
      'Text Tools': 'linear-gradient(135deg, #00796b 0%, #00acc1 100%)',
      Document: 'linear-gradient(135deg, #388e3c 0%, #43a047 100%)',
      Calculator: 'linear-gradient(135deg, #7b1fa2 0%, #8e24aa 100%)',
      'Misc Tools': 'linear-gradient(135deg, #303f9f 0%, #3f51b5 100%)',
    };
    return (
      colors[category] || 'linear-gradient(135deg, #1976d2 0%, #0288d1 100%)'
    );
  }
}
