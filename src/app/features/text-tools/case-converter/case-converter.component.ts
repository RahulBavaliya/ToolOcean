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
  selector: 'app-case-converter',
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
    <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-teal-900 dark:to-cyan-900 py-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <mat-icon class="text-white text-4xl">text_format</mat-icon>
              <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            Case Converter
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Convert text between uppercase, lowercase, title case, sentence case, and more. 
            Perfect for formatting text for different purposes.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-teal-500">edit</mat-icon>
                Text Input
              </mat-card-title>
              <mat-card-subtitle>
                Enter text to convert case
              </mat-card-subtitle>
            </mat-card-header>

            <mat-form-field class="w-full">
              <textarea
                matInput
                [(ngModel)]="inputText"
                placeholder="Enter or paste your text here..."
                class="form-textarea min-h-[300px]"
                (input)="updateConversions()"
                aria-label="Text input for case conversion"
              ></textarea>
            </mat-form-field>

            <div class="flex flex-wrap gap-3 mt-4">
              <button mat-stroked-button (click)="clearText()">
                <mat-icon class="mr-1">clear</mat-icon>
                Clear Text
              </button>
              <button mat-stroked-button (click)="pasteFromClipboard()">
                <mat-icon class="mr-1">content_paste</mat-icon>
                Paste
              </button>
            </div>
          </mat-card>

          <!-- Conversion Results -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-teal-500">transform</mat-icon>
                Conversion Results
              </mat-card-title>
              <mat-card-subtitle>
                Click any result to copy
              </mat-card-subtitle>
            </mat-card-header>

            <div class="space-y-4">
              <div *ngIf="!inputText" class="text-center text-gray-500 py-8">
                <mat-icon class="text-6xl mb-4">text_format</mat-icon>
                <p>Enter text to see conversions</p>
              </div>

              <div *ngIf="inputText" class="space-y-4">
                <!-- Uppercase -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">UPPERCASE</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.uppercase, 'UPPERCASE')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.uppercase, 'UPPERCASE')">
                    <p class="text-sm break-words">{{ conversions.uppercase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Lowercase -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">lowercase</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.lowercase, 'lowercase')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.lowercase, 'lowercase')">
                    <p class="text-sm break-words">{{ conversions.lowercase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Title Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">Title Case</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.titleCase, 'Title Case')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.titleCase, 'Title Case')">
                    <p class="text-sm break-words">{{ conversions.titleCase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Sentence Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">Sentence case</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.sentenceCase, 'Sentence case')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.sentenceCase, 'Sentence case')">
                    <p class="text-sm break-words">{{ conversions.sentenceCase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Camel Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">camelCase</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.camelCase, 'camelCase')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.camelCase, 'camelCase')">
                    <p class="text-sm break-words">{{ conversions.camelCase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Pascal Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">PascalCase</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.pascalCase, 'PascalCase')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.pascalCase, 'PascalCase')">
                    <p class="text-sm break-words">{{ conversions.pascalCase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Snake Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">snake_case</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.snakeCase, 'snake_case')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.snakeCase, 'snake_case')">
                    <p class="text-sm break-words">{{ conversions.snakeCase || 'No text to convert' }}</p>
                  </div>
                </div>

                <!-- Kebab Case -->
                <div class="conversion-item">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-800">kebab-case</h4>
                    <button mat-icon-button (click)="copyToClipboard(conversions.kebabCase, 'kebab-case')">
                      <mat-icon class="text-gray-500">content_copy</mat-icon>
                    </button>
                  </div>
                  <div class="bg-gray-50 border rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors" 
                       (click)="copyToClipboard(conversions.kebabCase, 'kebab-case')">
                    <p class="text-sm break-words">{{ conversions.kebabCase || 'No text to convert' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Quick Actions -->
        <mat-card class="mt-8 p-6" *ngIf="inputText">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">flash_on</mat-icon>
              Quick Actions
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button mat-stroked-button (click)="replaceText(conversions.uppercase)" class="text-left">
              <div>
                <div class="font-medium">Use UPPERCASE</div>
                <div class="text-sm text-gray-500">Replace input text</div>
              </div>
            </button>
            
            <button mat-stroked-button (click)="replaceText(conversions.lowercase)" class="text-left">
              <div>
                <div class="font-medium">Use lowercase</div>
                <div class="text-sm text-gray-500">Replace input text</div>
              </div>
            </button>
            
            <button mat-stroked-button (click)="replaceText(conversions.titleCase)" class="text-left">
              <div>
                <div class="font-medium">Use Title Case</div>
                <div class="text-sm text-gray-500">Replace input text</div>
              </div>
            </button>
            
            <button mat-stroked-button (click)="replaceText(conversions.sentenceCase)" class="text-left">
              <div>
                <div class="font-medium">Use Sentence case</div>
                <div class="text-sm text-gray-500">Replace input text</div>
              </div>
            </button>
          </div>
        </mat-card>

        <!-- Help Section -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">help_outline</mat-icon>
              Case Conversion Guide
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Text Cases</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><strong>UPPERCASE:</strong> ALL LETTERS CAPITALIZED</li>
                <li><strong>lowercase:</strong> all letters in small case</li>
                <li><strong>Title Case:</strong> First Letter Of Each Word</li>
                <li><strong>Sentence case:</strong> First letter capitalized</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Programming Cases</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><strong>camelCase:</strong> firstWordLowercase</li>
                <li><strong>PascalCase:</strong> FirstWordCapitalized</li>
                <li><strong>snake_case:</strong> words_separated_by_underscores</li>
                <li><strong>kebab-case:</strong> words-separated-by-hyphens</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Use Cases</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Headlines and titles</li>
                <li>• Programming variables</li>
                <li>• URL slugs</li>
                <li>• Database field names</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Features</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Real-time conversion</li>
                <li>• One-click copying</li>
                <li>• Multiple formats</li>
                <li>• Preserve formatting</li>
              </ul>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class CaseConverterComponent implements OnInit {
  inputText = '';
  
  conversions = {
    uppercase: '',
    lowercase: '',
    titleCase: '',
    sentenceCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: ''
  };

  constructor(
    private seoService: SeoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Case Converter - Change Text Case Online | Tool Ocean',
      description: 'Free online case converter. Convert text to uppercase, lowercase, title case, sentence case, and more.',
      keywords: 'case converter, text case, uppercase, lowercase, title case, camel case, snake case'
    });
  }

  updateConversions() {
    if (!this.inputText) {
      this.resetConversions();
      return;
    }

    this.conversions.uppercase = this.inputText.toUpperCase();
    this.conversions.lowercase = this.inputText.toLowerCase();
    this.conversions.titleCase = this.toTitleCase(this.inputText);
    this.conversions.sentenceCase = this.toSentenceCase(this.inputText);
    this.conversions.camelCase = this.toCamelCase(this.inputText);
    this.conversions.pascalCase = this.toPascalCase(this.inputText);
    this.conversions.snakeCase = this.toSnakeCase(this.inputText);
    this.conversions.kebabCase = this.toKebabCase(this.inputText);
  }

  toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  toSentenceCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  toCamelCase(text: string): string {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');
  }

  toPascalCase(text: string): string {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^\w]/g, '');
  }

  toSnakeCase(text: string): string {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  }

  toKebabCase(text: string): string {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
  }

  resetConversions() {
    this.conversions = {
      uppercase: '',
      lowercase: '',
      titleCase: '',
      sentenceCase: '',
      camelCase: '',
      pascalCase: '',
      snakeCase: '',
      kebabCase: ''
    };
  }

  clearText() {
    this.inputText = '';
    this.updateConversions();
  }

  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText = text;
      this.updateConversions();
      this.showSuccess('Text pasted from clipboard');
    } catch (err) {
      this.showError('Failed to paste from clipboard');
    }
  }

  copyToClipboard(text: string, caseName: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess(`${caseName} copied to clipboard`);
    }).catch(() => {
      this.showError('Failed to copy to clipboard');
    });
  }

  replaceText(newText: string) {
    this.inputText = newText;
    this.updateConversions();
    this.showSuccess('Input text replaced');
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