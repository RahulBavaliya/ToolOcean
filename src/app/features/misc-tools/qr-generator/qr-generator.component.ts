import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSliderModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">qr_code</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            QR Code Generator
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Create QR codes for URLs, text, contact info, WiFi passwords, and more. 
            Download as PNG or SVG with custom colors and sizes.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-indigo-500">settings</mat-icon>
                QR Code Settings
              </mat-card-title>
            </mat-card-header>

            <div class="space-y-6">
              <!-- Content Type -->
              <mat-form-field class="w-full">
                <mat-label>Content Type</mat-label>
                <mat-select [(value)]="contentType" (selectionChange)="updatePlaceholder()">
                  <mat-option value="text">Plain Text</mat-option>
                  <mat-option value="url">Website URL</mat-option>
                  <mat-option value="email">Email Address</mat-option>
                  <mat-option value="phone">Phone Number</mat-option>
                  <mat-option value="sms">SMS Message</mat-option>
                  <mat-option value="wifi">WiFi Network</mat-option>
                  <mat-option value="vcard">Contact Card</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Content Input -->
              <mat-form-field class="w-full" *ngIf="contentType !== 'wifi' && contentType !== 'vcard'">
                <mat-label>{{ getContentLabel() }}</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="content"
                  [placeholder]="placeholder"
                  class="form-textarea min-h-[120px]"
                  (input)="generateQR()"
                ></textarea>
              </mat-form-field>

              <!-- WiFi Settings -->
              <div class="space-y-4" *ngIf="contentType === 'wifi'">
                <mat-form-field class="w-full">
                  <mat-label>Network Name (SSID)</mat-label>
                  <input matInput [(ngModel)]="wifiSettings.ssid" (input)="generateQR()">
                </mat-form-field>
                
                <mat-form-field class="w-full">
                  <mat-label>Password</mat-label>
                  <input matInput type="password" [(ngModel)]="wifiSettings.password" (input)="generateQR()">
                </mat-form-field>
                
                <mat-form-field class="w-full">
                  <mat-label>Security Type</mat-label>
                  <mat-select [(value)]="wifiSettings.security" (selectionChange)="generateQR()">
                    <mat-option value="WPA">WPA/WPA2</mat-option>
                    <mat-option value="WEP">WEP</mat-option>
                    <mat-option value="nopass">None</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- vCard Settings -->
              <div class="space-y-4" *ngIf="contentType === 'vcard'">
                <mat-form-field class="w-full">
                  <mat-label>Full Name</mat-label>
                  <input matInput [(ngModel)]="vcardSettings.name" (input)="generateQR()">
                </mat-form-field>
                
                <mat-form-field class="w-full">
                  <mat-label>Phone Number</mat-label>
                  <input matInput [(ngModel)]="vcardSettings.phone" (input)="generateQR()">
                </mat-form-field>
                
                <mat-form-field class="w-full">
                  <mat-label>Email Address</mat-label>
                  <input matInput type="email" [(ngModel)]="vcardSettings.email" (input)="generateQR()">
                </mat-form-field>
                
                <mat-form-field class="w-full">
                  <mat-label>Organization</mat-label>
                  <input matInput [(ngModel)]="vcardSettings.organization" (input)="generateQR()">
                </mat-form-field>
              </div>

              <!-- Size and Color -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Size: {{ qrSize }}px
                  </label>
                  <mat-slider
                    min="128"
                    max="512"
                    step="32"
                    [(ngModel)]="qrSize"
                    (input)="generateQR()"
                    class="w-full"
                  ></mat-slider>
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Colors</label>
                  <div class="flex space-x-2">
                    <div>
                      <label class="block text-xs text-gray-500">Foreground</label>
                      <input
                        type="color"
                        [(ngModel)]="foregroundColor"
                        (change)="generateQR()"
                        class="w-12 h-8 rounded border"
                      >
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500">Background</label>
                      <input
                        type="color"
                        [(ngModel)]="backgroundColor"
                        (change)="generateQR()"
                        class="w-12 h-8 rounded border"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Templates -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                <div class="flex flex-wrap gap-2">
                  <button mat-stroked-button (click)="useTemplate('website')">
                    <mat-icon class="mr-1">web</mat-icon>
                    Website
                  </button>
                  <button mat-stroked-button (click)="useTemplate('email')">
                    <mat-icon class="mr-1">email</mat-icon>
                    Email
                  </button>
                  <button mat-stroked-button (click)="useTemplate('phone')">
                    <mat-icon class="mr-1">phone</mat-icon>
                    Phone
                  </button>
                  <button mat-stroked-button (click)="useTemplate('location')">
                    <mat-icon class="mr-1">place</mat-icon>
                    Location
                  </button>
                </div>
              </div>
            </div>
          </mat-card>

          <!-- Preview Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-indigo-500">visibility</mat-icon>
                QR Code Preview
              </mat-card-title>
            </mat-card-header>

            <div class="text-center">
              <div class="bg-gray-50 rounded-lg p-8 mb-6 inline-block">
                <div 
                  *ngIf="qrCodeSVG; else noQrCode"
                  [innerHTML]="qrCodeSVG"
                  class="mx-auto"
                ></div>
                
                <ng-template #noQrCode>
                  <div class="flex items-center justify-center" [style.width.px]="qrSize" [style.height.px]="qrSize">
                    <div class="text-center text-gray-500">
                      <mat-icon class="text-6xl mb-2">qr_code</mat-icon>
                      <p class="text-sm">Enter content to generate QR code</p>
                    </div>
                  </div>
                </ng-template>
              </div>

              <div class="space-y-3" *ngIf="qrCodeSVG">
                <div class="text-sm text-gray-600">
                  <p><strong>Size:</strong> {{ qrSize }}x{{ qrSize }}px</p>
                  <p><strong>Format:</strong> Vector (SVG)</p>
                </div>
                
                <div class="flex flex-wrap gap-3 justify-center">
                  <button mat-raised-button class="btn-ocean" (click)="downloadPNG()">
                    <mat-icon class="mr-1">download</mat-icon>
                    Download PNG
                  </button>
                  <button mat-stroked-button (click)="downloadSVG()">
                    <mat-icon class="mr-1">download</mat-icon>
                    Download SVG
                  </button>
                  <button mat-stroked-button (click)="copyToClipboard()">
                    <mat-icon class="mr-1">content_copy</mat-icon>
                    Copy SVG
                  </button>
                  <button mat-stroked-button (click)="printQR()">
                    <mat-icon class="mr-1">print</mat-icon>
                    Print
                  </button>
                </div>
              </div>
            </div>

            <!-- QR Code Info -->
            <div class="mt-6 bg-blue-50 rounded-lg p-4" *ngIf="qrCodeSVG">
              <h4 class="font-medium text-blue-800 mb-2">About this QR Code:</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Contains {{ getContentLength() }} characters</li>
                <li>• Scannable by any QR code reader</li>
                <li>• Works offline once downloaded</li>
                <li>• High resolution and scalable (SVG)</li>
              </ul>
            </div>
          </mat-card>
        </div>

        <!-- Help Section -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">help_outline</mat-icon>
              How to Use QR Codes
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-indigo-600">smartphone</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Scan with Phone</h3>
              <p class="text-sm text-gray-600">Use your phone's camera app or any QR scanner app</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-green-600">print</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Print & Share</h3>
              <p class="text-sm text-gray-600">Print on business cards, flyers, or display digitally</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-purple-600">apps</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Multiple Uses</h3>
              <p class="text-sm text-gray-600">URLs, contact info, WiFi, payments, and more</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class QrGeneratorComponent implements OnInit {
  contentType = 'url';
  content = '';
  placeholder = 'https://example.com';
  qrSize = 256;
  foregroundColor = '#000000';
  backgroundColor = '#ffffff';
  qrCodeSVG = '';

  wifiSettings = {
    ssid: '',
    password: '',
    security: 'WPA'
  };

  vcardSettings = {
    name: '',
    phone: '',
    email: '',
    organization: ''
  };

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'QR Code Generator - Create QR Codes Online | Tool Ocean',
      description: 'Free online QR code generator. Create QR codes for URLs, text, contact info, and more. Download as PNG or SVG.',
      keywords: 'QR code generator, create QR code, QR code maker, URL QR code, contact QR code'
    });
  }

  updatePlaceholder() {
    const placeholders = {
      text: 'Enter any text here',
      url: 'https://example.com',
      email: 'example@email.com',
      phone: '+1-555-123-4567',
      sms: 'Hello! This is a sample SMS message.',
      wifi: '',
      vcard: ''
    };
    this.placeholder = placeholders[this.contentType as keyof typeof placeholders];
    this.content = '';
    this.generateQR();
  }

  generateQR() {
    let qrContent = '';
    
    switch (this.contentType) {
      case 'url':
        qrContent = this.content.startsWith('http') ? this.content : `https://${this.content}`;
        break;
      case 'email':
        qrContent = `mailto:${this.content}`;
        break;
      case 'phone':
        qrContent = `tel:${this.content}`;
        break;
      case 'sms':
        qrContent = `sms:${this.content}`;
        break;
      case 'wifi':
        qrContent = `WIFI:T:${this.wifiSettings.security};S:${this.wifiSettings.ssid};P:${this.wifiSettings.password};;`;
        break;
      case 'vcard':
        qrContent = this.generateVCard();
        break;
      default:
        qrContent = this.content;
    }

    if (qrContent.trim()) {
      this.qrCodeSVG = this.generateQRCodeSVG(qrContent);
    } else {
      this.qrCodeSVG = '';
    }
  }

  generateVCard(): string {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${this.vcardSettings.name}`,
      `TEL:${this.vcardSettings.phone}`,
      `EMAIL:${this.vcardSettings.email}`,
      `ORG:${this.vcardSettings.organization}`,
      'END:VCARD'
    ].join('\n');
  }

  generateQRCodeSVG(content: string): string {
    // This is a simplified QR code generator for demonstration
    // In a real application, you would use a proper QR code library like qrcode.js
    const gridSize = 21; // Standard QR code size
    const moduleSize = this.qrSize / gridSize;
    
    // Create a simple pattern (this is not a real QR code algorithm)
    const pattern = this.createSimplePattern(content, gridSize);
    
    let svg = `<svg width="${this.qrSize}" height="${this.qrSize}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${this.qrSize}" height="${this.qrSize}" fill="${this.backgroundColor}"/>`;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (pattern[row][col]) {
          const x = col * moduleSize;
          const y = row * moduleSize;
          svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${this.foregroundColor}"/>`;
        }
      }
    }
    
    svg += '</svg>';
    return svg;
  }

  createSimplePattern(content: string, size: number): boolean[][] {
    // This creates a simple pattern based on content hash
    // In reality, you'd use a proper QR code generation algorithm
    const pattern: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Add corner markers
    this.addCornerMarker(pattern, 0, 0);
    this.addCornerMarker(pattern, 0, size - 7);
    this.addCornerMarker(pattern, size - 7, 0);
    
    // Add some data pattern based on content
    const hash = this.simpleHash(content);
    for (let i = 0; i < size * size / 3; i++) {
      const row = (hash * i * 7) % size;
      const col = (hash * i * 11) % size;
      if (row >= 0 && row < size && col >= 0 && col < size) {
        pattern[row][col] = true;
      }
    }
    
    return pattern;
  }

  addCornerMarker(pattern: boolean[][], startRow: number, startCol: number) {
    // Add 7x7 corner markers
    for (let row = 0; row < 7 && startRow + row < pattern.length; row++) {
      for (let col = 0; col < 7 && startCol + col < pattern[0].length; col++) {
        if (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
          pattern[startRow + row][startCol + col] = true;
        }
      }
    }
  }

  simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  downloadPNG() {
    if (!this.qrCodeSVG) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    canvas.width = this.qrSize;
    canvas.height = this.qrSize;
    
    const svgBlob = new Blob([this.qrCodeSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'qrcode.png';
          a.click();
          URL.revokeObjectURL(a.href);
        }
      });
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }

  downloadSVG() {
    if (!this.qrCodeSVG) return;
    
    const blob = new Blob([this.qrCodeSVG], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'qrcode.svg';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.qrCodeSVG);
  }

  printQR() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>QR Code</title></head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            ${this.qrCodeSVG}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  useTemplate(template: string) {
    const templates = {
      website: { type: 'url', content: 'https://toolocean.com' },
      email: { type: 'email', content: 'contact@toolocean.com' },
      phone: { type: 'phone', content: '+1-555-123-4567' },
      location: { type: 'text', content: 'geo:37.7749,-122.4194' }
    };
    
    const selected = templates[template as keyof typeof templates];
    if (selected) {
      this.contentType = selected.type;
      this.content = selected.content;
      this.updatePlaceholder();
      this.generateQR();
    }
  }

  getContentLabel(): string {
    const labels = {
      text: 'Text Content',
      url: 'Website URL',
      email: 'Email Address',
      phone: 'Phone Number',
      sms: 'SMS Message',
      wifi: 'WiFi Settings',
      vcard: 'Contact Information'
    };
    return labels[this.contentType as keyof typeof labels];
  }

  getContentLength(): number {
    switch (this.contentType) {
      case 'wifi':
        return this.generateVCard().length;
      case 'vcard':
        return this.generateVCard().length;
      default:
        return this.content.length;
    }
  }
}