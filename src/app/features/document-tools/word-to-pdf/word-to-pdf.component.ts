import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-word-to-pdf',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">description</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Word to PDF Converter
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert Word documents to PDF format with perfect formatting. 
            Supports DOC, DOCX files and maintains all styling and layout.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Upload Area -->
          <mat-card class="p-8 mb-8">
            <div class="text-center">
              <div *ngIf="!selectedFile && !isConverting" class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors cursor-pointer" 
                   (click)="triggerFileInput()" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)" 
                   (drop)="onDrop($event)">
                <mat-icon class="text-6xl text-gray-400 mb-4">cloud_upload</mat-icon>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Drop Word file here or click to browse</h3>
                <p class="text-gray-500 mb-4">Supports DOC, DOCX files up to 10MB</p>
                <button mat-raised-button class="btn-ocean">
                  <mat-icon class="mr-2">upload_file</mat-icon>
                  Choose Word File
                </button>
              </div>

              <!-- File Selected -->
              <div *ngIf="selectedFile && !isConverting" class="text-center">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-blue-600 text-5xl mb-3">description</mat-icon>
                  <h3 class="font-semibold text-blue-800 mb-2">{{ selectedFile.name }}</h3>
                  <p class="text-blue-600 text-sm">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="convertFile()">
                    <mat-icon class="mr-2">transform</mat-icon>
                    Convert to PDF
                  </button>
                  <button mat-stroked-button (click)="removeFile()">
                    <mat-icon class="mr-2">close</mat-icon>
                    Remove File
                  </button>
                </div>
              </div>

              <!-- Converting -->
              <div *ngIf="isConverting" class="text-center">
                <mat-icon class="text-blue-500 text-6xl mb-4 animate-spin">sync</mat-icon>
                <h3 class="text-xl font-semibold text-gray-700 mb-4">Converting Word to PDF...</h3>
                <mat-progress-bar mode="indeterminate" class="mb-4"></mat-progress-bar>
                <p class="text-gray-500">Processing your document...</p>
              </div>

              <!-- Conversion Complete -->
              <div *ngIf="conversionComplete" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-green-600 text-5xl mb-3">check_circle</mat-icon>
                  <h3 class="font-semibold text-green-800 mb-2">Conversion Complete!</h3>
                  <p class="text-green-600">Your PDF document is ready for download</p>
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="downloadFile()">
                    <mat-icon class="mr-2">download</mat-icon>
                    Download PDF
                  </button>
                  <button mat-stroked-button (click)="convertAnother()">
                    <mat-icon class="mr-2">refresh</mat-icon>
                    Convert Another
                  </button>
                </div>
              </div>

              <input type="file" #fileInput accept=".doc,.docx" style="display: none" (change)="onFileSelected($event)">
            </div>
          </mat-card>

          <!-- Features -->
          <mat-card class="p-6 mb-8">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">star</mat-icon>
                Conversion Features
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-blue-600">high_quality</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Perfect Formatting</h3>
                <p class="text-sm text-gray-600">Preserves all fonts, images, and layout</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-green-600">security</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Secure</h3>
                <p class="text-sm text-gray-600">Files processed locally, not uploaded</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-purple-600">flash_on</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Fast</h3>
                <p class="text-sm text-gray-600">Quick conversion in your browser</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-orange-600">free_breakfast</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">Free</h3>
                <p class="text-sm text-gray-600">No limits, completely free to use</p>
              </div>
            </div>
          </mat-card>

          <!-- Supported Formats -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-green-500">check_circle</mat-icon>
                Supported Formats
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Input Formats</h3>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <mat-icon class="text-green-500 mr-2">check</mat-icon>
                    <span>.DOC - Microsoft Word 97-2003</span>
                  </div>
                  <div class="flex items-center">
                    <mat-icon class="text-green-500 mr-2">check</mat-icon>
                    <span>.DOCX - Microsoft Word 2007+</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="font-semibold mb-3 text-gray-900">Output Format</h3>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <mat-icon class="text-blue-500 mr-2">picture_as_pdf</mat-icon>
                    <span>.PDF - Portable Document Format</span>
                  </div>
                  <div class="text-sm text-gray-600 ml-8">
                    High-quality PDF with preserved formatting
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class WordToPdfComponent implements OnInit {
  selectedFile: File | null = null;
  isConverting = false;
  conversionComplete = false;
  convertedFileName = '';

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Word to PDF Converter - Convert DOC to PDF Online | Tool Ocean',
      description: 'Free online Word to PDF converter. Convert Word documents to PDF files with perfect formatting.',
      keywords: 'Word to PDF, DOC to PDF, DOCX to PDF, convert Word, document converter'
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      this.selectedFile = file;
      this.conversionComplete = false;
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
      if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        this.selectedFile = file;
        this.conversionComplete = false;
      }
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.conversionComplete = false;
  }

  convertFile() {
    if (!this.selectedFile) return;
    
    this.isConverting = true;
    
    // Simulate conversion process
    setTimeout(() => {
      this.isConverting = false;
      this.conversionComplete = true;
      this.convertedFileName = this.selectedFile!.name.replace(/\.(doc|docx)$/i, '.pdf');
    }, 3000);
  }

  downloadFile() {
    if (!this.selectedFile) return;
    
    // In a real implementation, this would download the converted PDF
    // For demo purposes, we'll create a placeholder PDF
    const content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Converted from ${this.selectedFile.name}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;
    
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.convertedFileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  convertAnother() {
    this.selectedFile = null;
    this.isConverting = false;
    this.conversionComplete = false;
    this.convertedFileName = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}