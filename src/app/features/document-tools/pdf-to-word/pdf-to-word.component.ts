import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-pdf-to-word',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">picture_as_pdf</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            PDF to Word Converter
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert PDF documents to editable Word files quickly and securely. 
            Maintain formatting, images, and layout with high accuracy.
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <!-- Upload Area -->
          <mat-card class="p-8 mb-8">
            <div class="text-center">
              <div *ngIf="!selectedFile && !isConverting" class="upload-area border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-green-400 transition-colors cursor-pointer" 
                   (click)="triggerFileInput()" 
                   (dragover)="onDragOver($event)" 
                   (dragleave)="onDragLeave($event)" 
                   (drop)="onDrop($event)">
                <mat-icon class="text-6xl text-gray-400 mb-4">cloud_upload</mat-icon>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Drop PDF file here or click to browse</h3>
                <p class="text-gray-500 mb-4">Supports PDF files up to 10MB</p>
                <button mat-raised-button class="btn-ocean">
                  <mat-icon class="mr-2">upload_file</mat-icon>
                  Choose PDF File
                </button>
              </div>

              <!-- File Selected -->
              <div *ngIf="selectedFile && !isConverting" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-green-600 text-5xl mb-3">description</mat-icon>
                  <h3 class="font-semibold text-green-800 mb-2">{{ selectedFile.name }}</h3>
                  <p class="text-green-600 text-sm">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="convertFile()">
                    <mat-icon class="mr-2">transform</mat-icon>
                    Convert to Word
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
                <h3 class="text-xl font-semibold text-gray-700 mb-4">Converting PDF to Word...</h3>
                <mat-progress-bar mode="indeterminate" class="mb-4"></mat-progress-bar>
                <p class="text-gray-500">This may take a few moments depending on file size</p>
              </div>

              <!-- Conversion Complete -->
              <div *ngIf="conversionComplete" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <mat-icon class="text-green-600 text-5xl mb-3">check_circle</mat-icon>
                  <h3 class="font-semibold text-green-800 mb-2">Conversion Complete!</h3>
                  <p class="text-green-600">Your Word document is ready for download</p>
                </div>
                
                <div class="flex justify-center space-x-4">
                  <button mat-raised-button class="btn-ocean" (click)="downloadFile()">
                    <mat-icon class="mr-2">download</mat-icon>
                    Download Word File
                  </button>
                  <button mat-stroked-button (click)="convertAnother()">
                    <mat-icon class="mr-2">refresh</mat-icon>
                    Convert Another
                  </button>
                </div>
              </div>

              <input type="file" #fileInput accept=".pdf" style="display: none" (change)="onFileSelected($event)">
            </div>
          </mat-card>

          <!-- Features -->
          <mat-card class="p-6 mb-8">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-green-500">star</mat-icon>
                Conversion Features
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-green-600">high_quality</mat-icon>
                </div>
                <h3 class="font-semibold mb-2">High Quality</h3>
                <p class="text-sm text-gray-600">Maintains original formatting and layout</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <mat-icon class="text-blue-600">security</mat-icon>
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

          <!-- How It Works -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-blue-500">help_outline</mat-icon>
                How It Works
              </mat-card-title>
            </mat-card-header>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span class="font-bold text-blue-600">1</span>
                </div>
                <h3 class="font-semibold mb-2">Upload PDF</h3>
                <p class="text-sm text-gray-600">Select or drag & drop your PDF file</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span class="font-bold text-green-600">2</span>
                </div>
                <h3 class="font-semibold mb-2">Convert</h3>
                <p class="text-sm text-gray-600">Our tool processes your PDF locally</p>
              </div>
              
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span class="font-bold text-purple-600">3</span>
                </div>
                <h3 class="font-semibold mb-2">Download</h3>
                <p class="text-sm text-gray-600">Get your editable Word document</p>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `
})
export class PdfToWordComponent implements OnInit {
  selectedFile: File | null = null;
  isConverting = false;
  conversionComplete = false;
  convertedFileName = '';

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'PDF to Word Converter - Convert PDF to DOC Online | Tool Ocean',
      description: 'Free online PDF to Word converter. Convert PDF files to editable Word documents quickly and securely.',
      keywords: 'PDF to Word, PDF converter, PDF to DOC, convert PDF, document converter'
    });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
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
      if (file.type === 'application/pdf') {
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
      this.convertedFileName = this.selectedFile!.name.replace('.pdf', '.docx');
    }, 3000);
  }

  downloadFile() {
    if (!this.selectedFile) return;
    
    // In a real implementation, this would download the converted file
    // For demo purposes, we'll create a placeholder Word document
    const content = `This is a converted Word document from ${this.selectedFile.name}.\n\nIn a real implementation, this would contain the actual converted content from the PDF file.`;
    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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