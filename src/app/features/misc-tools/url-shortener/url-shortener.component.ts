import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '../../../core/services/seo.service';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  customAlias?: string;
}

@Component({
  selector: 'app-url-shortener',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">link</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            URL Shortener
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Create short links and track clicks with detailed analytics. 
            Perfect for social media, email campaigns, and link management.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- URL Shortener Form -->
          <mat-card class="p-6 mb-8">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-indigo-500">link</mat-icon>
                Shorten Your URL
              </mat-card-title>
            </mat-card-header>

            <div class="space-y-4">
              <mat-form-field class="w-full">
                <mat-label>Enter URL to shorten</mat-label>
                <input
                  matInput
                  [(ngModel)]="originalUrl"
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  type="url"
                />
                <mat-hint>Enter a valid URL starting with http:// or https://</mat-hint>
              </mat-form-field>

              <mat-form-field class="w-full">
                <mat-label>Custom alias (optional)</mat-label>
                <input
                  matInput
                  [(ngModel)]="customAlias"
                  placeholder="my-custom-link"
                  pattern="[a-zA-Z0-9-_]+"
                />
                <mat-hint>Only letters, numbers, hyphens, and underscores allowed</mat-hint>
              </mat-form-field>

              <div class="flex space-x-4">
                <button mat-raised-button class="btn-ocean" (click)="shortenUrl()" [disabled]="!isValidUrl()">
                  <mat-icon class="mr-2">compress</mat-icon>
                  Shorten URL
                </button>
                <button mat-stroked-button (click)="clearForm()">
                  <mat-icon class="mr-2">clear</mat-icon>
                  Clear
                </button>
              </div>
            </div>

            <!-- Result -->
            <div *ngIf="latestShortened" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center mb-3">
                <mat-icon class="text-green-600 mr-2">check_circle</mat-icon>
                <h3 class="font-semibold text-green-800">URL Shortened Successfully!</h3>
              </div>
              
              <div class="space-y-3">
                <div>
                  <label class="text-sm text-gray-600">Original URL:</label>
                  <div class="font-mono text-sm bg-white p-2 rounded border break-all">{{ latestShortened.originalUrl }}</div>
                </div>
                
                <div>
                  <label class="text-sm text-gray-600">Short URL:</label>
                  <div class="flex items-center space-x-2">
                    <div class="font-mono text-lg bg-white p-2 rounded border flex-1">{{ latestShortened.shortUrl }}</div>
                    <button mat-icon-button (click)="copyShortUrl(latestShortened.shortUrl)" title="Copy to clipboard">
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                </div>
                
                <div class="flex space-x-4">
                  <button mat-stroked-button (click)="openShortUrl(latestShortened.shortUrl)">
                    <mat-icon class="mr-2">open_in_new</mat-icon>
                    Test Link
                  </button>
                  <button mat-stroked-button (click)="shareUrl(latestShortened.shortUrl)">
                    <mat-icon class="mr-2">share</mat-icon>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- URL History -->
          <mat-card class="p-6 mb-8" *ngIf="shortenedUrls.length > 0">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">history</mat-icon>
                Your Shortened URLs
              </mat-card-title>
              <mat-card-subtitle>
                Manage and track your shortened links
              </mat-card-subtitle>
            </mat-card-header>

            <div class="space-y-4">
              <div *ngFor="let url of shortenedUrls" class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="font-mono text-lg text-indigo-600">{{ url.shortUrl }}</div>
                      <button mat-icon-button (click)="copyShortUrl(url.shortUrl)" class="text-gray-400 hover:text-gray-600">
                        <mat-icon class="text-sm">content_copy</mat-icon>
                      </button>
                    </div>
                    
                    <div class="text-sm text-gray-600 mb-2 break-all">
                      <strong>Original:</strong> {{ url.originalUrl }}
                    </div>
                    
                    <div class="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{{ url.clicks }} clicks</span>
                      <span>Created {{ formatDate(url.createdAt) }}</span>
                      <span *ngIf="url.customAlias" class="bg-blue-100 text-blue-800 px-2 py-1 rounded">Custom</span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2 ml-4">
                    <button mat-icon-button (click)="openShortUrl(url.shortUrl)" title="Open link">
                      <mat-icon class="text-gray-400">open_in_new</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteUrl(url.id)" title="Delete link">
                      <mat-icon class="text-red-400">delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t">
              <button mat-stroked-button (click)="clearHistory()" class="text-red-600">
                <mat-icon class="mr-2">delete_sweep</mat-icon>
                Clear All History
              </button>
            </div>
          </mat-card>

          <!-- Features -->
          <mat-card class="p-6 mb-8">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-green-500">star</mat-icon>
                URL Shortener Features
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-indigo-600">speed</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Instant Shortening</h3>
                <p class="text-sm text-gray-600">Create short links in seconds</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-blue-600">edit</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Custom Aliases</h3>
                <p class="text-sm text-gray-600">Create memorable custom short links</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-green-600">analytics</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Click Tracking</h3>
                <p class="text-sm text-gray-600">Monitor link performance and clicks</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-purple-600">security</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Secure & Private</h3>
                <p class="text-sm text-gray-600">Your data stays private and secure</p>
              </div>
            </div>
          </mat-card>

          <!-- Use Cases -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">lightbulb</mat-icon>
                Perfect For
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Social Media</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• Twitter character limits</li>
                  <li>• Instagram bio links</li>
                  <li>• Facebook posts</li>
                  <li>• LinkedIn updates</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Marketing</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• Email campaigns</li>
                  <li>• Print advertisements</li>
                  <li>• QR codes</li>
                  <li>• SMS marketing</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Analytics</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• Click tracking</li>
                  <li>• Campaign performance</li>
                  <li>• Link management</li>
                  <li>• User engagement</li>
                </ul>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class UrlShortenerComponent implements OnInit {
  originalUrl = '';
  customAlias = '';
  latestShortened: ShortenedUrl | null = null;
  shortenedUrls: ShortenedUrl[] = [];

  constructor(
    private seoService: SeoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'URL Shortener - Shorten Links Online | Tool Ocean',
      description: 'Free online URL shortener. Create short links and track clicks with detailed analytics.',
      keywords: 'URL shortener, short links, link shortener, shorten URL, link tracking'
    });
    
    this.loadHistory();
  }

  isValidUrl(): boolean {
    try {
      new URL(this.originalUrl);
      return true;
    } catch {
      return false;
    }
  }

  shortenUrl() {
    if (!this.isValidUrl()) {
      this.showError('Please enter a valid URL');
      return;
    }

    // Check if custom alias is already used
    if (this.customAlias && this.shortenedUrls.some(url => url.customAlias === this.customAlias)) {
      this.showError('Custom alias already exists. Please choose a different one.');
      return;
    }

    // Generate short URL
    const id = this.generateId();
    const shortCode = this.customAlias || this.generateShortCode();
    const shortUrl = `https://short.ly/${shortCode}`;

    const newUrl: ShortenedUrl = {
      id,
      originalUrl: this.originalUrl,
      shortUrl,
      clicks: 0,
      createdAt: new Date(),
      customAlias: this.customAlias || undefined
    };

    this.shortenedUrls.unshift(newUrl);
    this.latestShortened = newUrl;
    this.saveHistory();
    this.showSuccess('URL shortened successfully!');
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  clearForm() {
    this.originalUrl = '';
    this.customAlias = '';
    this.latestShortened = null;
  }

  copyShortUrl(shortUrl: string) {
    navigator.clipboard.writeText(shortUrl).then(() => {
      this.showSuccess('Short URL copied to clipboard!');
    });
  }

  openShortUrl(shortUrl: string) {
    // In a real implementation, this would redirect through your short URL service
    // For demo purposes, we'll open the original URL
    const urlData = this.shortenedUrls.find(u => u.shortUrl === shortUrl);
    if (urlData) {
      // Increment click count
      urlData.clicks++;
      this.saveHistory();
      window.open(urlData.originalUrl, '_blank');
    }
  }

  shareUrl(shortUrl: string) {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this link',
        url: shortUrl
      });
    } else {
      this.copyShortUrl(shortUrl);
    }
  }

  deleteUrl(id: string) {
    this.shortenedUrls = this.shortenedUrls.filter(url => url.id !== id);
    this.saveHistory();
    this.showSuccess('URL deleted successfully');
  }

  clearHistory() {
    this.shortenedUrls = [];
    this.latestShortened = null;
    this.saveHistory();
    this.showSuccess('History cleared successfully');
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  private loadHistory() {
    const saved = localStorage.getItem('url-shortener-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.shortenedUrls = parsed.map((url: any) => ({
          ...url,
          createdAt: new Date(url.createdAt)
        }));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }

  private saveHistory() {
    localStorage.setItem('url-shortener-history', JSON.stringify(this.shortenedUrls));
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}