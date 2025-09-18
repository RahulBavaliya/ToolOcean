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
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <mat-icon class="text-white text-4xl">code</mat-icon>
              <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            JSON Validator & Formatter
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Validate JSON syntax, format JSON code, and fix JSON errors instantly. 
            Works completely in your browser - your data stays private.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Input Panel -->
          <mat-card class="p-8 rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
            <mat-card-header class="pb-6">
              <mat-card-title class="flex items-center text-2xl font-bold">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                  <mat-icon class="text-white">edit</mat-icon>
                </div>
                JSON Input
              </mat-card-title>
              <mat-card-subtitle class="text-gray-600 dark:text-gray-300 mt-2">
                Paste your JSON data here
              </mat-card-subtitle>
            </mat-card-header>

            <mat-form-field class="w-full" appearance="outline">
              <textarea
                matInput
                [(ngModel)]="jsonInput"
                placeholder="Enter or paste JSON data..."
                class="min-h-[400px] font-mono text-sm resize-none"
                (input)="validateJSON()"
                aria-label="JSON input textarea"
              ></textarea>
            </mat-form-field>

            <div class="flex flex-wrap gap-3 mt-6">
              <button mat-raised-button color="primary" class="rounded-xl px-6 py-3 font-semibold" (click)="validateJSON()">
                <mat-icon class="mr-2">check_circle</mat-icon>
                Validate JSON
              </button>
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="formatJSON()">
                <mat-icon class="mr-2">auto_fix_high</mat-icon>
                Format JSON
              </button>
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="minifyJSON()">
                <mat-icon class="mr-2">compress</mat-icon>
                Minify JSON
              </button>
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="clearInput()">
                <mat-icon class="mr-2">clear</mat-icon>
                Clear
              </button>
            </div>
          </mat-card>

          <!-- Output Panel -->
          <mat-card class="p-8 rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
            <mat-card-header class="pb-6">
              <mat-card-title class="flex items-center text-2xl font-bold">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center mr-3" 
                     [class.bg-gradient-to-r]="true"
                     [class.from-green-500]="isValid"
                     [class.to-emerald-500]="isValid"
                     [class.from-red-500]="!isValid && jsonInput"
                     [class.to-rose-500]="!isValid && jsonInput"
                     [class.from-gray-400]="!jsonInput"
                     [class.to-gray-500]="!jsonInput">
                  <mat-icon class="text-white" [class.text-green-500]="isValid" [class.text-red-500]="!isValid && jsonInput">
                  {{ isValid ? 'check_circle' : 'error' }}
                  </mat-icon>
                </div>
                <span [class.text-green-600]="isValid" [class.text-red-600]="!isValid && jsonInput" [class.text-gray-600]="!jsonInput">
                  {{ getStatusTitle() }}
                </span>
              </mat-card-title>
              <mat-card-subtitle class="text-gray-600 dark:text-gray-300 mt-2">
                {{ getStatusSubtitle() }}
              </mat-card-subtitle>
            </mat-card-header>

            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 min-h-[400px] border border-gray-200 dark:border-gray-600">
              <div *ngIf="!jsonInput" class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <div class="text-center">
                  <mat-icon class="text-8xl mb-4 opacity-50">code</mat-icon>
                  <p class="text-lg">Enter JSON data to see validation results</p>
                </div>
              </div>

              <div *ngIf="jsonInput && isValid" class="space-y-4">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4">
                  <div class="flex items-center text-green-700 dark:text-green-300">
                    <mat-icon class="mr-3 text-2xl">check_circle</mat-icon>
                    <span class="font-semibold text-lg">Valid JSON</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-600">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ jsonStats.characters }}</div>
                    <div class="text-gray-600 dark:text-gray-400">Characters</div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-600">
                    <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ jsonStats.lines }}</div>
                    <div class="text-gray-600 dark:text-gray-400">Lines</div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-600">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ jsonStats.size }}</div>
                    <div class="text-gray-600 dark:text-gray-400">Size</div>
                  </div>
                </div>

                <pre class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-sm overflow-auto max-h-64 font-mono"><code class="text-gray-800 dark:text-gray-200">{{ formattedJSON }}</code></pre>
              </div>

              <div *ngIf="jsonInput && !isValid" class="space-y-4">
                <div class="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200 dark:border-red-700 rounded-xl p-4">
                  <div class="flex items-start text-red-700 dark:text-red-300">
                    <mat-icon class="mr-3 mt-1 text-2xl">error</mat-icon>
                    <div>
                      <p class="font-semibold text-lg">Invalid JSON</p>
                      <p class="text-sm mt-2">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                  <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-3">Common JSON Errors:</h4>
                  <ul class="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                    <li>• Missing quotes around property names</li>
                    <li>• Using single quotes instead of double quotes</li>
                    <li>• Trailing commas after the last element</li>
                    <li>• Missing commas between elements</li>
                    <li>• Unmatched brackets or braces</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mt-6" *ngIf="jsonInput && isValid">
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="copyToClipboard(formattedJSON)">
                <mat-icon class="mr-2">content_copy</mat-icon>
                Copy Formatted
              </button>
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="copyToClipboard(minifiedJSON)">
                <mat-icon class="mr-2">content_copy</mat-icon>
                Copy Minified
              </button>
              <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="downloadJSON()">
                <mat-icon class="mr-2">download</mat-icon>
                Download
              </button>
            </div>
          </mat-card>
        </div>

        <!-- Help Section -->
        <mat-card class="p-8 rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <mat-card-header class="pb-6">
            <mat-card-title class="flex items-center text-2xl font-bold">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <mat-icon class="text-white">help_outline</mat-icon>
              </div>
              How to Use the JSON Validator
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">edit</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">1. Paste JSON</h3>
              <p class="text-gray-600 dark:text-gray-300">Copy and paste your JSON data into the input field</p>
            </div>
            
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">check_circle</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">2. Validate</h3>
              <p class="text-gray-600 dark:text-gray-300">Click validate or formatting happens automatically</p>
            </div>
            
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">download</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">3. Copy or Download</h3>
              <p class="text-gray-600 dark:text-gray-300">Copy the formatted result or download as a file</p>
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