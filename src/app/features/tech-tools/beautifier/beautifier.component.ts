import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-beautifier',
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
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">auto_fix_high</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Code Beautifier & Formatter
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Format and beautify HTML, CSS, JavaScript, JSON, XML, and more. 
            Make your code readable with proper indentation and formatting.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-ocean-500">edit</mat-icon>
                Code Input
              </mat-card-title>
              <mat-card-subtitle>
                Paste your code here
              </mat-card-subtitle>
            </mat-card-header>

            <div class="mb-4">
              <mat-form-field class="w-full">
                <mat-label>Language</mat-label>
                <mat-select [(value)]="selectedLanguage" (selectionChange)="formatCode()">
                  <mat-option value="html">HTML</mat-option>
                  <mat-option value="css">CSS</mat-option>
                  <mat-option value="javascript">JavaScript</mat-option>
                  <mat-option value="json">JSON</mat-option>
                  <mat-option value="xml">XML</mat-option>
                  <mat-option value="sql">SQL</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field class="w-full">
              <textarea
                matInput
                [(ngModel)]="codeInput"
                placeholder="Enter or paste your code here..."
                class="form-textarea min-h-[400px] font-mono text-sm"
                (input)="formatCode()"
                aria-label="Code input textarea"
              ></textarea>
            </mat-form-field>

            <div class="flex flex-wrap gap-3 mt-4">
              <button mat-raised-button class="btn-ocean" (click)="formatCode()">
                <mat-icon class="mr-1">auto_fix_high</mat-icon>
                Beautify Code
              </button>
              <button mat-stroked-button (click)="minifyCode()">
                <mat-icon class="mr-1">compress</mat-icon>
                Minify Code
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
                <mat-icon class="mr-2 text-green-500">check_circle</mat-icon>
                Formatted Code
              </mat-card-title>
              <mat-card-subtitle>
                Beautified and formatted output
              </mat-card-subtitle>
            </mat-card-header>

            <div class="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              <div *ngIf="!codeInput" class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <mat-icon class="text-6xl mb-4">code</mat-icon>
                  <p>Enter code to see formatted output</p>
                </div>
              </div>

              <pre *ngIf="formattedCode" class="bg-white border rounded p-3 text-sm overflow-auto max-h-96 font-mono"><code>{{ formattedCode }}</code></pre>
            </div>

            <div class="flex flex-wrap gap-3 mt-4" *ngIf="formattedCode">
              <button mat-stroked-button (click)="copyToClipboard(formattedCode)">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Formatted
              </button>
              <button mat-stroked-button (click)="copyToClipboard(minifiedCode)" *ngIf="minifiedCode">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Minified
              </button>
              <button mat-stroked-button (click)="downloadCode()">
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
              Supported Languages & Features
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Web Languages</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• HTML - Format tags and attributes</li>
                <li>• CSS - Organize selectors and properties</li>
                <li>• JavaScript - Proper indentation and spacing</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Data Formats</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• JSON - Structure and validate data</li>
                <li>• XML - Format elements and attributes</li>
                <li>• SQL - Format queries and statements</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Features</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Auto-detect language</li>
                <li>• Customizable indentation</li>
                <li>• Minification support</li>
              </ul>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class BeautifierComponent implements OnInit {
  codeInput = '';
  formattedCode = '';
  minifiedCode = '';
  selectedLanguage = 'html';

  constructor(
    private seoService: SeoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Code Beautifier & Formatter - HTML, CSS, JS | Tool Ocean',
      description: 'Free online code beautifier and formatter for HTML, CSS, JavaScript, and more. Make your code readable and well-formatted.',
      keywords: 'code beautifier, code formatter, HTML formatter, CSS formatter, JavaScript formatter'
    });
  }

  formatCode() {
    if (!this.codeInput.trim()) {
      this.formattedCode = '';
      this.minifiedCode = '';
      return;
    }

    try {
      switch (this.selectedLanguage) {
        case 'json':
          const parsed = JSON.parse(this.codeInput);
          this.formattedCode = JSON.stringify(parsed, null, 2);
          this.minifiedCode = JSON.stringify(parsed);
          break;
        case 'html':
          this.formattedCode = this.formatHTML(this.codeInput);
          this.minifiedCode = this.minifyHTML(this.codeInput);
          break;
        case 'css':
          this.formattedCode = this.formatCSS(this.codeInput);
          this.minifiedCode = this.minifyCSS(this.codeInput);
          break;
        case 'javascript':
          this.formattedCode = this.formatJavaScript(this.codeInput);
          this.minifiedCode = this.minifyJavaScript(this.codeInput);
          break;
        case 'xml':
          this.formattedCode = this.formatXML(this.codeInput);
          this.minifiedCode = this.minifyXML(this.codeInput);
          break;
        case 'sql':
          this.formattedCode = this.formatSQL(this.codeInput);
          this.minifiedCode = this.minifySQL(this.codeInput);
          break;
        default:
          this.formattedCode = this.codeInput;
          this.minifiedCode = this.codeInput;
      }
    } catch (error) {
      this.formattedCode = this.codeInput;
      this.minifiedCode = this.codeInput;
    }
  }

  formatHTML(html: string): string {
    return html.replace(/></g, '>\n<')
               .replace(/^\s+|\s+$/gm, '')
               .split('\n')
               .map((line, index, array) => {
                 const depth = this.getHTMLDepth(array.slice(0, index + 1));
                 return '  '.repeat(Math.max(0, depth)) + line.trim();
               })
               .join('\n');
  }

  formatCSS(css: string): string {
    return css.replace(/\{/g, ' {\n')
              .replace(/\}/g, '\n}\n')
              .replace(/;/g, ';\n')
              .replace(/,/g, ',\n')
              .split('\n')
              .map(line => {
                const trimmed = line.trim();
                if (trimmed.includes('{') || trimmed.includes('}')) {
                  return trimmed;
                }
                return trimmed ? '  ' + trimmed : '';
              })
              .filter(line => line.length > 0)
              .join('\n');
  }

  formatJavaScript(js: string): string {
    return js.replace(/\{/g, ' {\n')
             .replace(/\}/g, '\n}\n')
             .replace(/;/g, ';\n')
             .replace(/,/g, ',\n')
             .split('\n')
             .map(line => line.trim())
             .filter(line => line.length > 0)
             .join('\n');
  }

  formatXML(xml: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    return this.formatXMLNode(xmlDoc.documentElement, 0);
  }

  formatXMLNode(node: Element, depth: number): string {
    const indent = '  '.repeat(depth);
    let result = '';
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      result += indent + '<' + node.nodeName;
      
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result += ` ${attr.name}="${attr.value}"`;
      }
      
      if (node.childNodes.length === 0) {
        result += '/>\n';
      } else {
        result += '>\n';
        
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            result += this.formatXMLNode(child as Element, depth + 1);
          } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
            result += '  '.repeat(depth + 1) + child.textContent.trim() + '\n';
          }
        }
        
        result += indent + '</' + node.nodeName + '>\n';
      }
    }
    
    return result;
  }

  formatSQL(sql: string): string {
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP'];
    let formatted = sql.toUpperCase();
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${keyword}`);
    });
    
    return formatted.split('\n')
                   .map(line => line.trim())
                   .filter(line => line.length > 0)
                   .join('\n');
  }

  minifyHTML(html: string): string {
    return html.replace(/>\s+</g, '><').trim();
  }

  minifyCSS(css: string): string {
    return css.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  minifyJavaScript(js: string): string {
    return js.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
  }

  minifyXML(xml: string): string {
    return xml.replace(/>\s+</g, '><').trim();
  }

  minifySQL(sql: string): string {
    return sql.replace(/\s+/g, ' ').trim();
  }

  getHTMLDepth(lines: string[]): number {
    let depth = 0;
    lines.forEach(line => {
      const openTags = (line.match(/</g) || []).length;
      const closeTags = (line.match(/>/g) || []).length;
      const selfClosing = (line.match(/\/>/g) || []).length;
      depth += openTags - closeTags - selfClosing;
    });
    return depth;
  }

  minifyCode() {
    if (this.minifiedCode) {
      this.codeInput = this.minifiedCode;
      this.formatCode();
      this.showSuccess('Code minified successfully');
    }
  }

  clearInput() {
    this.codeInput = '';
    this.formatCode();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copied to clipboard');
    });
  }

  downloadCode() {
    if (!this.formattedCode) return;
    
    const extensions: { [key: string]: string } = {
      html: 'html',
      css: 'css',
      javascript: 'js',
      json: 'json',
      xml: 'xml',
      sql: 'sql'
    };
    
    const extension = extensions[this.selectedLanguage] || 'txt';
    const blob = new Blob([this.formattedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    this.showSuccess('Code file downloaded');
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}