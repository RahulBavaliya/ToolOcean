import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">search</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Regular Expression Tester
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Test regular expressions with real-time matching, explanation, and examples. 
            Perfect for developers working with pattern matching and text processing.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-ocean-500">code</mat-icon>
                Regular Expression
              </mat-card-title>
            </mat-card-header>

            <div class="space-y-4">
              <mat-form-field class="w-full">
                <mat-label>Regular Expression Pattern</mat-label>
                <input
                  matInput
                  [(ngModel)]="regexPattern"
                  placeholder="Enter regex pattern (e.g., \\d{3}-\\d{3}-\\d{4})"
                  class="font-mono"
                  (input)="testRegex()"
                />
              </mat-form-field>

              <div class="flex flex-wrap gap-4">
                <mat-checkbox [(ngModel)]="flags.global" (change)="testRegex()">
                  Global (g)
                </mat-checkbox>
                <mat-checkbox [(ngModel)]="flags.ignoreCase" (change)="testRegex()">
                  Ignore Case (i)
                </mat-checkbox>
                <mat-checkbox [(ngModel)]="flags.multiline" (change)="testRegex()">
                  Multiline (m)
                </mat-checkbox>
              </div>

              <mat-form-field class="w-full">
                <mat-label>Test String</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="testString"
                  placeholder="Enter text to test against the regex pattern..."
                  class="form-textarea min-h-[200px]"
                  (input)="testRegex()"
                ></textarea>
              </mat-form-field>

              <div class="flex flex-wrap gap-3">
                <button mat-raised-button class="btn-ocean" (click)="testRegex()">
                  <mat-icon class="mr-1">play_arrow</mat-icon>
                  Test Regex
                </button>
                <button mat-stroked-button (click)="clearAll()">
                  <mat-icon class="mr-1">clear</mat-icon>
                  Clear All
                </button>
              </div>
            </div>
          </mat-card>

          <!-- Results Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2" [class.text-green-500]="isValidRegex" [class.text-red-500]="!isValidRegex && regexPattern">
                  {{ isValidRegex ? 'check_circle' : 'error' }}
                </mat-icon>
                Test Results
              </mat-card-title>
            </mat-card-header>

            <div class="space-y-4">
              <div *ngIf="!regexPattern" class="text-center text-gray-500 py-8">
                <mat-icon class="text-6xl mb-4">search</mat-icon>
                <p>Enter a regex pattern to see results</p>
              </div>

              <div *ngIf="regexPattern && !isValidRegex" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-start text-red-700">
                  <mat-icon class="mr-2 mt-0.5">error</mat-icon>
                  <div>
                    <p class="font-medium">Invalid Regular Expression</p>
                    <p class="text-sm mt-1">{{ errorMessage }}</p>
                  </div>
                </div>
              </div>

              <div *ngIf="isValidRegex" class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center text-green-700">
                    <mat-icon class="mr-2">check_circle</mat-icon>
                    <span class="font-medium">Valid Regular Expression</span>
                  </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="font-medium text-blue-800 mb-2">Pattern: /{{ regexPattern }}/{{ getFlagsString() }}</h4>
                  <div class="text-sm text-blue-700">
                    <p><strong>Matches found:</strong> {{ matches.length }}</p>
                    <p><strong>Test result:</strong> {{ testResult ? 'Match' : 'No match' }}</p>
                  </div>
                </div>

                <div *ngIf="matches.length > 0" class="bg-gray-50 rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-3">Matches:</h4>
                  <div class="space-y-2 max-h-64 overflow-y-auto">
                    <div *ngFor="let match of matches; let i = index" class="bg-white border rounded p-3">
                      <div class="flex justify-between items-start mb-2">
                        <span class="font-medium text-sm">Match {{ i + 1 }}</span>
                        <span class="text-xs text-gray-500">Index: {{ match.index }}</span>
                      </div>
                      <div class="font-mono text-sm bg-yellow-100 px-2 py-1 rounded">{{ match.match }}</div>
                      <div *ngIf="match.groups.length > 0" class="mt-2">
                        <p class="text-xs text-gray-600 mb-1">Groups:</p>
                        <div class="space-y-1">
                          <div *ngFor="let group of match.groups; let j = index" class="text-xs">
                            <span class="text-gray-500">Group {{ j + 1 }}:</span>
                            <span class="font-mono bg-blue-100 px-1 rounded">{{ group }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white border rounded-lg p-4">
                  <h4 class="font-medium text-gray-800 mb-3">Highlighted Text:</h4>
                  <div class="font-mono text-sm bg-gray-50 p-3 rounded border" [innerHTML]="highlightedText"></div>
                </div>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Quick Examples -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">lightbulb</mat-icon>
              Common Regex Patterns
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let example of regexExamples" class="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors" (click)="useExample(example)">
              <h4 class="font-semibold text-gray-800 mb-2">{{ example.name }}</h4>
              <p class="text-sm text-gray-600 mb-2">{{ example.description }}</p>
              <code class="text-xs bg-white px-2 py-1 rounded border font-mono">{{ example.pattern }}</code>
            </div>
          </div>
        </mat-card>

        <!-- Help Section -->
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">help_outline</mat-icon>
              Regex Quick Reference
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Character Classes</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">\\d</code>
                  <span class="text-gray-600">Digit (0-9)</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">\\w</code>
                  <span class="text-gray-600">Word character</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">\\s</code>
                  <span class="text-gray-600">Whitespace</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">.</code>
                  <span class="text-gray-600">Any character</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Quantifiers</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">*</code>
                  <span class="text-gray-600">0 or more</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">+</code>
                  <span class="text-gray-600">1 or more</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">?</code>
                  <span class="text-gray-600">0 or 1</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">{{ '{' }}n{{ '}' }}</code>
                  <span class="text-gray-600">Exactly n</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Anchors</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">^</code>
                  <span class="text-gray-600">Start of string</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">$</code>
                  <span class="text-gray-600">End of string</span>
                </div>
                <div class="flex justify-between">
                  <code class="bg-gray-100 px-2 py-1 rounded">\\b</code>
                  <span class="text-gray-600">Word boundary</span>
                </div>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class RegexTesterComponent implements OnInit {
  regexPattern = '';
  testString = '';
  isValidRegex = false;
  errorMessage = '';
  matches: any[] = [];
  testResult = false;
  highlightedText = '';
  
  flags = {
    global: true,
    ignoreCase: false,
    multiline: false
  };

  regexExamples = [
    {
      name: 'Email Address',
      description: 'Validate email format',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      testString: 'user@example.com'
    },
    {
      name: 'Phone Number',
      description: 'US phone number format',
      pattern: '\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}',
      testString: '(555) 123-4567'
    },
    {
      name: 'URL',
      description: 'Web URL validation',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      testString: 'https://www.example.com'
    },
    {
      name: 'Credit Card',
      description: 'Credit card number',
      pattern: '\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}[-\\s]?\\d{4}',
      testString: '1234 5678 9012 3456'
    },
    {
      name: 'IP Address',
      description: 'IPv4 address',
      pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
      testString: '192.168.1.1'
    },
    {
      name: 'Date (MM/DD/YYYY)',
      description: 'US date format',
      pattern: '\\b(0?[1-9]|1[0-2])\\/(0?[1-9]|[12]\\d|3[01])\\/(19|20)\\d{2}\\b',
      testString: '12/25/2023'
    }
  ];

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Regular Expression Tester - Test Regex Online | Tool Ocean',
      description: 'Free online regex tester and debugger. Test regular expressions, find matches, and debug regex patterns.',
      keywords: 'regex tester, regular expression tester, regex debugger, pattern matching, regex validator'
    });
  }

  testRegex() {
    if (!this.regexPattern) {
      this.isValidRegex = false;
      this.matches = [];
      this.highlightedText = this.testString;
      return;
    }

    try {
      const flags = this.getFlagsString();
      const regex = new RegExp(this.regexPattern, flags);
      this.isValidRegex = true;
      this.errorMessage = '';
      
      this.testResult = regex.test(this.testString);
      this.matches = [];
      
      if (this.flags.global) {
        let match;
        const globalRegex = new RegExp(this.regexPattern, flags);
        while ((match = globalRegex.exec(this.testString)) !== null) {
          this.matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (!this.flags.global) break;
        }
      } else {
        const match = this.testString.match(regex);
        if (match) {
          this.matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }
      
      this.highlightMatches();
    } catch (error: any) {
      this.isValidRegex = false;
      this.errorMessage = error.message;
      this.matches = [];
      this.highlightedText = this.testString;
    }
  }

  highlightMatches() {
    if (!this.testString || this.matches.length === 0) {
      this.highlightedText = this.testString;
      return;
    }

    let highlighted = this.testString;
    const sortedMatches = [...this.matches].sort((a, b) => b.index - a.index);
    
    sortedMatches.forEach(match => {
      const before = highlighted.substring(0, match.index);
      const matchText = highlighted.substring(match.index, match.index + match.match.length);
      const after = highlighted.substring(match.index + match.match.length);
      
      highlighted = before + `<mark class="bg-yellow-300 px-1 rounded">${matchText}</mark>` + after;
    });
    
    this.highlightedText = highlighted;
  }

  getFlagsString(): string {
    let flags = '';
    if (this.flags.global) flags += 'g';
    if (this.flags.ignoreCase) flags += 'i';
    if (this.flags.multiline) flags += 'm';
    return flags;
  }

  useExample(example: any) {
    this.regexPattern = example.pattern;
    this.testString = example.testString;
    this.testRegex();
  }

  clearAll() {
    this.regexPattern = '';
    this.testString = '';
    this.testRegex();
  }
}