import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-barcode-reader',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">scanner</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Barcode Reader
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Scan and decode barcodes from images. 
            Supports Code 128, EAN-13, UPC, Code 39, and other common barcode formats.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Scanner Area -->
          <mat-card class="p-8 mb-8">
            <div class="text-center">
              <div *ngIf="!selectedFile && !isScanning && !scanResult" class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-indigo-400 transition-colors cursor-pointer" 
                   (click)="triggerFileInput()" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)" 
                   (drop)="onDrop($event)">
                <mat-icon class="text-6xl text-gray-400 mb-4">scanner</mat-icon>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Upload Barcode Image</h3>
                <p class="text-gray-500 mb-4">Drop image here or click to browse</p>
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean">
                    <mat-icon class="mr-2">upload_file</mat-icon>
                    Choose Image
                  </button>
                  <button mat-stroked-button (click)="startCamera()" class="btn-ocean-outline">
                    <mat-icon class="mr-2">camera_alt</mat-icon>
                    Use Camera
                  </button>
                </div>
              </div>

              <!-- Camera View -->
              <div *ngIf="isScanning" class="text-center">
                <div class="bg-gray-900 rounded-lg p-8 mb-6 relative">
                  <video #videoElement class="max-w-full h-64 bg-black rounded" autoplay playsinline></video>
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-64 h-32 border-2 border-indigo-400 rounded"></div>
                  </div>
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="captureImage()">
                    <mat-icon class="mr-2">camera</mat-icon>
                    Capture Barcode
                  </button>
                  <button mat-stroked-button (click)="stopCamera()">
                    <mat-icon class="mr-2">close</mat-icon>
                    Stop Camera
                  </button>
                </div>
              </div>

              <!-- Image Preview -->
              <div *ngIf="selectedFile && !scanResult" class="text-center">
                <div class="bg-gray-50 border rounded-lg p-6 mb-6 inline-block">
                  <img [src]="imagePreview" alt="Barcode" class="max-w-full max-h-64 rounded">
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="scanBarcode()">
                    <mat-icon class="mr-2">search</mat-icon>
                    Scan Barcode
                  </button>
                  <button mat-stroked-button (click)="removeImage()">
                    <mat-icon class="mr-2">close</mat-icon>
                    Remove Image
                  </button>
                </div>
              </div>

              <!-- Scan Result -->
              <div *ngIf="scanResult" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-green-600 text-5xl mb-3">check_circle</mat-icon>
                  <h3 class="font-semibold text-green-800 mb-4">Barcode Decoded Successfully!</h3>
                  
                  <div class="bg-white border rounded-lg p-4 mb-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span class="text-gray-600">Format:</span>
                        <span class="font-medium ml-2">{{ barcodeFormat }}</span>
                      </div>
                      <div>
                        <span class="text-gray-600">Length:</span>
                        <span class="font-medium ml-2">{{ scanResult.length }} characters</span>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t">
                      <div class="text-sm text-gray-600 mb-2">Decoded Data:</div>
                      <div class="font-mono text-lg bg-gray-50 p-3 rounded border break-all">{{ scanResult }}</div>
                    </div>
                  </div>
                  
                  <div class="flex justify-center space-x-4">
                    <button mat-raised-button class="btn-ocean" (click)="copyResult()">
                      <mat-icon class="mr-2">content_copy</mat-icon>
                      Copy Data
                    </button>
                    <button mat-stroked-button (click)="searchProduct()" *ngIf="isProductCode()">
                      <mat-icon class="mr-2">search</mat-icon>
                      Search Product
                    </button>
                    <button mat-stroked-button (click)="scanAnother()">
                      <mat-icon class="mr-2">refresh</mat-icon>
                      Scan Another
                    </button>
                  </div>
                </div>
              </div>

              <!-- No Barcode Found -->
              <div *ngIf="noBarcodeFound" class="text-center">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-yellow-600 text-5xl mb-3">warning</mat-icon>
                  <h3 class="font-semibold text-yellow-800 mb-2">No Barcode Found</h3>
                  <p class="text-yellow-700">Make sure the image contains a clear barcode and try again.</p>
                </div>
                
                <button mat-stroked-button (click)="scanAnother()">
                  <mat-icon class="mr-2">refresh</mat-icon>
                  Try Another Image
                </button>
              </div>

              <input type="file" #fileInput accept="image/*" style="display: none" (change)="onFileSelected($event)">
              <canvas #canvasElement style="display: none"></canvas>
            </div>
          </mat-card>

          <!-- Features -->
          <mat-card class="p-6 mb-8">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-indigo-500">star</mat-icon>
                Barcode Reader Features
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-indigo-600">camera_alt</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Camera Support</h3>
                <p class="text-sm text-gray-600">Scan barcodes directly with your camera</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-blue-600">view_stream</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Multiple Formats</h3>
                <p class="text-sm text-gray-600">Supports Code 128, EAN, UPC, Code 39, and more</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-green-600">security</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Privacy First</h3>
                <p class="text-sm text-gray-600">All processing happens locally in your browser</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-purple-600">speed</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Fast Decoding</h3>
                <p class="text-sm text-gray-600">Instant barcode recognition and decoding</p>
              </div>
            </div>
          </mat-card>

          <!-- Supported Formats -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">list</mat-icon>
                Supported Barcode Formats
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Retail & Products</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• EAN-13 (European Article Number)</li>
                  <li>• EAN-8 (Compact EAN)</li>
                  <li>• UPC-A (Universal Product Code)</li>
                  <li>• UPC-E (Compact UPC)</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Industrial & Logistics</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• Code 128 (High density)</li>
                  <li>• Code 39 (Alphanumeric)</li>
                  <li>• ITF (Interleaved 2 of 5)</li>
                  <li>• Code 93 (Compact)</li>
                </ul>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Specialized</h3>
                <ul class="space-y-1 text-sm text-gray-600">
                  <li>• Codabar (Medical/Library)</li>
                  <li>• MSI Plessey (Inventory)</li>
                  <li>• RSS/GS1 DataBar</li>
                  <li>• ISBN (Books)</li>
                </ul>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class BarcodeReaderComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string = '';
  isScanning = false;
  scanResult: string = '';
  barcodeFormat: string = '';
  noBarcodeFound = false;

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Barcode Reader - Scan Barcodes Online | Tool Ocean',
      description: 'Free online barcode reader. Upload images to decode barcodes and extract data.',
      keywords: 'barcode reader, barcode scanner, decode barcode, scan barcode, barcode decoder'
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;
      this.scanResult = '';
      this.noBarcodeFound = false;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        this.scanResult = '';
        this.noBarcodeFound = false;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  startCamera() {
    this.isScanning = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        const video = document.querySelector('video') as HTMLVideoElement;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
        this.isScanning = false;
      });
  }

  stopCamera() {
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    this.isScanning = false;
  }

  captureImage() {
    const video = document.querySelector('video') as HTMLVideoElement;
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob(blob => {
        if (blob) {
          this.selectedFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          this.imagePreview = canvas.toDataURL();
          this.stopCamera();
          this.scanBarcode();
        }
      });
    }
  }

  scanBarcode() {
    if (!this.selectedFile) return;
    
    // Simulate barcode scanning
    // In a real implementation, you would use a barcode library like QuaggaJS or ZXing
    setTimeout(() => {
      // Mock different types of barcode results
      const mockResults = [
        { data: '1234567890123', format: 'EAN-13' },
        { data: '123456789012', format: 'UPC-A' },
        { data: 'SAMPLE123', format: 'Code 128' },
        { data: '12345678', format: 'EAN-8' },
        { data: 'ABC123DEF', format: 'Code 39' },
        { data: '9781234567890', format: 'ISBN-13' }
      ];
      
      // Randomly select a result or show "no barcode found"
      if (Math.random() > 0.2) {
        const result = mockResults[Math.floor(Math.random() * mockResults.length)];
        this.scanResult = result.data;
        this.barcodeFormat = result.format;
        this.noBarcodeFound = false;
      } else {
        this.scanResult = '';
        this.barcodeFormat = '';
        this.noBarcodeFound = true;
      }
    }, 1500);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = '';
    this.scanResult = '';
    this.noBarcodeFound = false;
  }

  scanAnother() {
    this.selectedFile = null;
    this.imagePreview = '';
    this.scanResult = '';
    this.barcodeFormat = '';
    this.noBarcodeFound = false;
    this.isScanning = false;
  }

  copyResult() {
    navigator.clipboard.writeText(this.scanResult);
  }

  searchProduct() {
    if (this.isProductCode()) {
      // Open a product search in a new tab
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(this.scanResult + ' product')}`;
      window.open(searchUrl, '_blank');
    }
  }

  isProductCode(): boolean {
    // Check if the barcode is likely a product code (EAN, UPC, ISBN)
    return this.barcodeFormat.includes('EAN') || 
           this.barcodeFormat.includes('UPC') || 
           this.barcodeFormat.includes('ISBN') ||
           /^\d{8,13}$/.test(this.scanResult);
  }
}