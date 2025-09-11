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

@Component({
  selector: 'app-json-validator',
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
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">code</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            JSON Validator & Formatter
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Validate JSON syntax, format JSON code, and fix JSON errors instantly. 
            Works completely in your browser - your data stays private.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-ocean-500">edit</mat-icon>
                JSON Input
              </mat-card-title>
              <mat-card-subtitle>
                Paste your JSON data here
              </mat-card-subtitle>
            </mat-card-header>

            <mat-form-field class="w-full">
              <textarea
                matInput
                [(ngModel)]="jsonInput"
                placeholder="Enter or paste JSON data..."
                class="form-textarea min-h-[400px] font-mono text-sm"
                (input)="validateJSON()"
                aria-label="JSON input textarea"
              ></textarea>
            </mat-form-field>

            <div class="flex flex-wrap gap-3 mt-4">
              <button mat-raised-button class="btn-ocean" (click)="validateJSON()">
                <mat-icon class="mr-1">check_circle</mat-icon>
                Validate JSON
              </button>
              <button mat-stroked-button (click)="formatJSON()">
                <mat-icon class="mr-1">auto_fix_high</mat-icon>
                Format JSON
              </button>
              <button mat-stroked-button (click)="minifyJSON()">
                <mat-icon class="mr-1">compress</mat-icon>
                Minify JSON
              </button>
              <button mat-stroked-button (click)="clearInput()">
                <mat-icon class="mr-1">clear</mat-icon>
                Clear
              </button>
            </div>
          </mat-card>

          <!-- Output Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2" [class.text-green-500]="isValid" [class.text-red-500]="!isValid && jsonInput">
                  {{ isValid ? 'check_circle' : 'error' }}
                </mat-icon>
                <span [class.text-green-600]="isValid" [class.text-red-600]="!isValid && jsonInput">
                  {{ getStatusTitle() }}
                </span>
              </mat-card-title>
              <mat-card-subtitle>
                {{ getStatusSubtitle() }}
              </mat-card-subtitle>
            </mat-card-header>

            <div class="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              <div *ngIf="!jsonInput" class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <mat-icon class="text-6xl mb-4">code</mat-icon>
                  <p>Enter JSON data to see validation results</p>
                </div>
              </div>

              <div *ngIf="jsonInput && isValid" class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center text-green-700">
                    <mat-icon class="mr-2">check_circle</mat-icon>
                    <span class="font-medium">Valid JSON</span>
                  </div>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Characters:</span>
                    <span class="font-medium">{{ jsonStats.characters }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Lines:</span>
                    <span class="font-medium">{{ jsonStats.lines }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Size:</span>
                    <span class="font-medium">{{ jsonStats.size }}</span>
                  </div>
                </div>

                <pre class="bg-white border rounded p-3 text-sm overflow-auto max-h-64"><code>{{ formattedJSON }}</code></pre>
              </div>

              <div *ngIf="jsonInput && !isValid" class="space-y-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-start text-red-700">
                    <mat-icon class="mr-2 mt-0.5">error</mat-icon>
                    <div>
                      <p class="font-medium">Invalid JSON</p>
                      <p class="text-sm mt-1">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 class="font-medium text-yellow-800 mb-2">Common JSON Errors:</h4>
                  <ul class="text-sm text-yellow-700 space-y-1">
                    <li>• Missing quotes around property names</li>
                    <li>• Using single quotes instead of double quotes</li>
                    <li>• Trailing commas after the last element</li>
                    <li>• Missing commas between elements</li>
                    <li>• Unmatched brackets or braces</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mt-4" *ngIf="jsonInput && isValid">
              <button mat-stroked-button (click)="copyToClipboard(formattedJSON)">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Formatted
              </button>
              <button mat-stroked-button (click)="copyToClipboard(minifiedJSON)">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Minified
              </button>
              <button mat-stroked-button (click)="downloadJSON()">
                <mat-icon class="mr-1">download</mat-icon>
                Download
              </button>
            </div>
          </mat-card>
        </div>

        <!-- Help Section -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">help_outline</mat-icon>
              How to Use the JSON Validator
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-blue-600">edit</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">1. Paste JSON</h3>
              <p class="text-sm text-gray-600">Copy and paste your JSON data into the input field</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-green-600">check_circle</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">2. Validate</h3>
              <p class="text-sm text-gray-600">Click validate or formatting happens automatically</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-purple-600">download</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">3. Copy or Download</h3>
              <p class="text-sm text-gray-600">Copy the formatted result or download as a file</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class JsonValidatorComponent implements OnInit {
  jsonInput = '';
  formattedJSON = '';
  minifiedJSON = '';
  isValid = false;
  errorMessage = '';
  
  jsonStats = {
    characters: 0,
    lines: 0,
    size: '0 B'
  };

  constructor(
    private seoService: SeoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'JSON Validator - Validate & Format JSON Online | Tool Ocean',
      description: 'Free online JSON validator and formatter. Validate JSON syntax, format JSON code, and fix JSON errors instantly.',
      keywords: 'JSON validator, JSON formatter, validate JSON, JSON syntax checker, JSON beautifier'
    });
  }

  validateJSON() {
    if (!this.jsonInput.trim()) {
      this.isValid = false;
      this.errorMessage = '';
      this.resetStats();
      return;
    }

    try {
      const parsed = JSON.parse(this.jsonInput);
      this.isValid = true;
      this.errorMessage = '';
      this.formattedJSON = JSON.stringify(parsed, null, 2);
      this.minifiedJSON = JSON.stringify(parsed);
      this.updateStats();
    } catch (error: any) {
      this.isValid = false;
      this.errorMessage = error.message;
      this.formattedJSON = '';
      this.minifiedJSON = '';
      this.resetStats();
    }
  }

  formatJSON() {
    if (this.isValid && this.jsonInput) {
      this.jsonInput = this.formattedJSON;
      this.showSuccess('JSON formatted successfully');
    }
  }

  minifyJSON() {
    if (this.isValid && this.jsonInput) {
      this.jsonInput = this.minifiedJSON;
      this.validateJSON();
      this.showSuccess('JSON minified successfully');
    }
  }

  clearInput() {
    this.jsonInput = '';
    this.validateJSON();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copied to clipboard');
    });
  }

  downloadJSON() {
    if (!this.isValid) return;
    
    const blob = new Blob([this.formattedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
    this.showSuccess('JSON file downloaded');
  }

  private updateStats() {
    this.jsonStats.characters = this.jsonInput.length;
    this.jsonStats.lines = this.jsonInput.split('\n').length;
    
    const bytes = new TextEncoder().encode(this.jsonInput).length;
    this.jsonStats.size = this.formatBytes(bytes);
  }

  private resetStats() {
    this.jsonStats = { characters: 0, lines: 0, size: '0 B' };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  getStatusTitle(): string {
    if (!this.jsonInput) return 'JSON Validator Ready';
    return this.isValid ? 'Valid JSON' : 'Invalid JSON';
  }

  getStatusSubtitle(): string {
    if (!this.jsonInput) return 'Paste JSON data to validate';
    return this.isValid ? 'Your JSON is properly formatted' : 'Please fix the errors below';
  }
}