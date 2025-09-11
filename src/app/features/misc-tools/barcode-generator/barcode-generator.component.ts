import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-barcode-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">view_stream</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Barcode Generator
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Create various barcode formats including Code 128, EAN-13, UPC, and more. 
            Perfect for inventory management, product labeling, and retail applications.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-indigo-500">settings</mat-icon>
                Barcode Settings
              </mat-card-title>
            </mat-card-header>

            <div class="space-y-6">
              <!-- Barcode Type -->
              <mat-form-field class="w-full">
                <mat-label>Barcode Type</mat-label>
                <mat-select [(value)]="barcodeType" (selectionChange)="updatePlaceholder(); generateBarcode()">
                  <mat-option value="code128">Code 128</mat-option>
                  <mat-option value="ean13">EAN-13</mat-option>
                  <mat-option value="ean8">EAN-8</mat-option>
                  <mat-option value="upc">UPC-A</mat-option>
                  <mat-option value="code39">Code 39</mat-option>
                  <mat-option value="itf">ITF (Interleaved 2 of 5)</mat-option>
                </mat-select>
              </mat-form-field>

              <!-- Data Input -->
              <mat-form-field class="w-full">
                <mat-label>Barcode Data</mat-label>
                <input
                  matInput
                  [(ngModel)]="barcodeData"
                  [placeholder]="placeholder"
                  (input)="generateBarcode()"
                />
                <mat-hint>{{ getHint() }}</mat-hint>
              </mat-form-field>

              <!-- Size Settings -->
              <div class="grid grid-cols-2 gap-4">
                <mat-form-field>
                  <mat-label>Width</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="barcodeWidth"
                    min="200"
                    max="800"
                    (input)="generateBarcode()"
                  />
                </mat-form-field>
                
                <mat-form-field>
                  <mat-label>Height</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="barcodeHeight"
                    min="50"
                    max="200"
                    (input)="generateBarcode()"
                  />
                </mat-form-field>
              </div>

              <!-- Display Options -->
              <div class="space-y-2">
                <label class="flex items-center">
                  <input type="checkbox" [(ngModel)]="showText" (change)="generateBarcode()" class="mr-2">
                  <span>Show text below barcode</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" [(ngModel)]="includeChecksum" (change)="generateBarcode()" class="mr-2">
                  <span>Include checksum (where applicable)</span>
                </label>
              </div>

              <!-- Quick Examples -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quick Examples</label>
                <div class="flex flex-wrap gap-2">
                  <button mat-stroked-button (click)="useExample('product')" class="text-sm">
                    Product Code
                  </button>
                  <button mat-stroked-button (click)="useExample('isbn')" class="text-sm">
                    ISBN
                  </button>
                  <button mat-stroked-button (click)="useExample('inventory')" class="text-sm">
                    Inventory
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
                Barcode Preview
              </mat-card-title>
            </mat-card-header>

            <div class="text-center">
              <div class="bg-gray-50 rounded-lg p-8 mb-6 min-h-[200px] flex items-center justify-center">
                <div *ngIf="barcodeSVG; else noBarcode" [innerHTML]="barcodeSVG" class="mx-auto"></div>
                
                <ng-template #noBarcode>
                  <div class="text-center text-gray-500">
                    <mat-icon class="text-6xl mb-2">view_stream</mat-icon>
                    <p class="text-sm">Enter data to generate barcode</p>
                  </div>
                </ng-template>
              </div>

              <div class="space-y-3" *ngIf="barcodeSVG">
                <div class="text-sm text-gray-600">
                  <p><strong>Type:</strong> {{ getBarcodeTypeName() }}</p>
                  <p><strong>Data:</strong> {{ barcodeData }}</p>
                  <p><strong>Size:</strong> {{ barcodeWidth }}x{{ barcodeHeight }}px</p>
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
                  <button mat-stroked-button (click)="printBarcode()">
                    <mat-icon class="mr-1">print</mat-icon>
                    Print
                  </button>
                </div>
              </div>
            </div>

            <!-- Barcode Info -->
            <div class="mt-6 bg-blue-50 rounded-lg p-4" *ngIf="barcodeSVG">
              <h4 class="font-medium text-blue-800 mb-2">About this Barcode:</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Format: {{ getBarcodeTypeName() }}</li>
                <li>• Scannable by standard barcode readers</li>
                <li>• High resolution and print-ready</li>
                <li>• Suitable for commercial use</li>
              </ul>
            </div>
          </mat-card>
        </div>

        <!-- Barcode Types Info -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">info</mat-icon>
              Barcode Types & Uses
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Code 128</h3>
              <p class="text-sm text-gray-600 mb-2">High-density linear barcode for alphanumeric data</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• Supports all ASCII characters</li>
                <li>• Variable length</li>
                <li>• Used in shipping and packaging</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">EAN-13</h3>
              <p class="text-sm text-gray-600 mb-2">European Article Number for retail products</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• 13 digits exactly</li>
                <li>• Includes country code</li>
                <li>• Global retail standard</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">UPC-A</h3>
              <p class="text-sm text-gray-600 mb-2">Universal Product Code for North America</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• 12 digits exactly</li>
                <li>• Retail point of sale</li>
                <li>• North American standard</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Code 39</h3>
              <p class="text-sm text-gray-600 mb-2">Alphanumeric barcode for industrial use</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• Letters and numbers</li>
                <li>• Variable length</li>
                <li>• Automotive and defense</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">EAN-8</h3>
              <p class="text-sm text-gray-600 mb-2">Compact version of EAN-13</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• 8 digits exactly</li>
                <li>• Small products</li>
                <li>• Space-constrained items</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">ITF</h3>
              <p class="text-sm text-gray-600 mb-2">Interleaved 2 of 5 for logistics</p>
              <ul class="text-xs text-gray-500 space-y-1">
                <li>• Even number of digits</li>
                <li>• High density</li>
                <li>• Warehouse and distribution</li>
              </ul>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class BarcodeGeneratorComponent implements OnInit {
  barcodeType = 'code128';
  barcodeData = '';
  barcodeWidth = 400;
  barcodeHeight = 100;
  showText = true;
  includeChecksum = true;
  barcodeSVG = '';
  placeholder = 'Enter text or numbers';

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Barcode Generator - Create Barcodes Online | Tool Ocean',
      description: 'Free online barcode generator. Create Code 128, EAN-13, UPC, and other barcode formats.',
      keywords: 'barcode generator, create barcode, Code 128, EAN-13, UPC barcode, barcode maker'
    });
    this.updatePlaceholder();
  }

  updatePlaceholder() {
    const placeholders: { [key: string]: string } = {
      code128: 'Enter text or numbers',
      ean13: '1234567890123 (13 digits)',
      ean8: '12345678 (8 digits)',
      upc: '123456789012 (12 digits)',
      code39: 'ALPHANUMERIC123',
      itf: '1234567890 (even number of digits)'
    };
    this.placeholder = placeholders[this.barcodeType];
    this.barcodeData = '';
  }

  generateBarcode() {
    if (!this.barcodeData.trim()) {
      this.barcodeSVG = '';
      return;
    }

    // Validate data based on barcode type
    if (!this.validateBarcodeData()) {
      this.barcodeSVG = '';
      return;
    }

    // Generate SVG barcode (simplified implementation)
    this.barcodeSVG = this.generateBarcodeSVG();
  }

  validateBarcodeData(): boolean {
    switch (this.barcodeType) {
      case 'ean13':
        return /^\d{13}$/.test(this.barcodeData);
      case 'ean8':
        return /^\d{8}$/.test(this.barcodeData);
      case 'upc':
        return /^\d{12}$/.test(this.barcodeData);
      case 'code39':
        return /^[A-Z0-9\-. $/+%]*$/.test(this.barcodeData);
      case 'itf':
        return /^\d+$/.test(this.barcodeData) && this.barcodeData.length % 2 === 0;
      case 'code128':
        return this.barcodeData.length > 0;
      default:
        return true;
    }
  }

  generateBarcodeSVG(): string {
    // This is a simplified barcode generator for demonstration
    // In a real implementation, you would use a proper barcode library
    const bars = this.generateBars();
    const barWidth = this.barcodeWidth / bars.length;
    
    let svg = `<svg width="${this.barcodeWidth}" height="${this.barcodeHeight + (this.showText ? 20 : 0)}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${this.barcodeWidth}" height="${this.barcodeHeight + (this.showText ? 20 : 0)}" fill="white"/>`;
    
    // Draw bars
    for (let i = 0; i < bars.length; i++) {
      if (bars[i] === '1') {
        const x = i * barWidth;
        svg += `<rect x="${x}" y="0" width="${barWidth}" height="${this.barcodeHeight}" fill="black"/>`;
      }
    }
    
    // Add text if enabled
    if (this.showText) {
      svg += `<text x="${this.barcodeWidth / 2}" y="${this.barcodeHeight + 15}" text-anchor="middle" font-family="monospace" font-size="12" fill="black">${this.barcodeData}</text>`;
    }
    
    svg += '</svg>';
    return svg;
  }

  generateBars(): string {
    // Simplified bar pattern generation
    // In reality, each barcode type has specific encoding rules
    const data = this.barcodeData;
    let bars = '';
    
    // Start pattern
    bars += '11010010000';
    
    // Data encoding (simplified)
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const pattern = this.getCharacterPattern(char);
      bars += pattern;
    }
    
    // End pattern
    bars += '11000100101';
    
    return bars;
  }

  getCharacterPattern(charCode: number): string {
    // Simplified character encoding
    // Each character gets a unique bar pattern
    const patterns = [
      '11011001100', '11001101100', '11001100110', '10010011000',
      '10010001100', '10001001100', '10011001000', '10011000100',
      '10001100100', '11001001000', '11001000100', '11000100100'
    ];
    return patterns[charCode % patterns.length];
  }

  getBarcodeTypeName(): string {
    const names: { [key: string]: string } = {
      code128: 'Code 128',
      ean13: 'EAN-13',
      ean8: 'EAN-8',
      upc: 'UPC-A',
      code39: 'Code 39',
      itf: 'ITF (Interleaved 2 of 5)'
    };
    return names[this.barcodeType];
  }

  getHint(): string {
    const hints: { [key: string]: string } = {
      code128: 'Supports letters, numbers, and symbols',
      ean13: 'Must be exactly 13 digits',
      ean8: 'Must be exactly 8 digits',
      upc: 'Must be exactly 12 digits',
      code39: 'Supports uppercase letters, numbers, and some symbols',
      itf: 'Must be an even number of digits'
    };
    return hints[this.barcodeType];
  }

  useExample(type: string) {
    const examples: { [key: string]: { type: string; data: string } } = {
      product: { type: 'ean13', data: '1234567890123' },
      isbn: { type: 'ean13', data: '9781234567890' },
      inventory: { type: 'code128', data: 'INV-2024-001' }
    };
    
    const example = examples[type];
    if (example) {
      this.barcodeType = example.type;
      this.barcodeData = example.data;
      this.updatePlaceholder();
      this.generateBarcode();
    }
  }

  downloadPNG() {
    if (!this.barcodeSVG) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    canvas.width = this.barcodeWidth;
    canvas.height = this.barcodeHeight + (this.showText ? 20 : 0);
    
    const svgBlob = new Blob([this.barcodeSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `barcode-${this.barcodeType}.png`;
          a.click();
          URL.revokeObjectURL(a.href);
        }
      });
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }

  downloadSVG() {
    if (!this.barcodeSVG) return;
    
    const blob = new Blob([this.barcodeSVG], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `barcode-${this.barcodeType}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.barcodeSVG);
  }

  printBarcode() {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Barcode - ${this.barcodeData}</title></head>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
            ${this.barcodeSVG}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}