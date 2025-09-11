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
  selector: 'app-xml-validator',
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
            XML Validator & Formatter
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Validate XML syntax, format XML documents, and check for well-formedness. 
            Supports XML namespaces and provides detailed error reporting.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <mat-card class="p-6">
            <mat-card-header class="pb-4">
              <mat-card-title class="flex items-center">
                <mat-icon class="mr-2 text-ocean-500">edit</mat-icon>
                XML Input
              </mat-card-title>
              <mat-card-subtitle>
                Paste your XML document here
              </mat-card-subtitle>
            </mat-card-header>

            <mat-form-field class="w-full">
              <textarea
                matInput
                [(ngModel)]="xmlInput"
                placeholder="Enter or paste XML document..."
                class="form-textarea min-h-[400px] font-mono text-sm"
                (input)="validateXML()"
                aria-label="XML input textarea"
              ></textarea>
            </mat-form-field>

            <div class="flex flex-wrap gap-3 mt-4">
              <button mat-raised-button class="btn-ocean" (click)="validateXML()">
                <mat-icon class="mr-1">check_circle</mat-icon>
                Validate XML
              </button>
              <button mat-stroked-button (click)="formatXML()">
                <mat-icon class="mr-1">auto_fix_high</mat-icon>
                Format XML
              </button>
              <button mat-stroked-button (click)="minifyXML()">
                <mat-icon class="mr-1">compress</mat-icon>
                Minify XML
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
                <mat-icon class="mr-2" [class.text-green-500]="isValid" [class.text-red-500]="!isValid && xmlInput">
                  {{ isValid ? 'check_circle' : 'error' }}
                </mat-icon>
                <span [class.text-green-600]="isValid" [class.text-red-600]="!isValid && xmlInput">
                  {{ getStatusTitle() }}
                </span>
              </mat-card-title>
              <mat-card-subtitle>
                {{ getStatusSubtitle() }}
              </mat-card-subtitle>
            </mat-card-header>

            <div class="bg-gray-50 rounded-lg p-4 min-h-[400px]">
              <div *ngIf="!xmlInput" class="flex items-center justify-center h-full text-gray-500">
                <div class="text-center">
                  <mat-icon class="text-6xl mb-4">description</mat-icon>
                  <p>Enter XML data to see validation results</p>
                </div>
              </div>

              <div *ngIf="xmlInput && isValid" class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center text-green-700">
                    <mat-icon class="mr-2">check_circle</mat-icon>
                    <span class="font-medium">Valid XML Document</span>
                  </div>
                </div>
                
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Elements:</span>
                    <span class="font-medium">{{ xmlStats.elements }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Attributes:</span>
                    <span class="font-medium">{{ xmlStats.attributes }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Characters:</span>
                    <span class="font-medium">{{ xmlStats.characters }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Lines:</span>
                    <span class="font-medium">{{ xmlStats.lines }}</span>
                  </div>
                </div>

                <pre class="bg-white border rounded p-3 text-sm overflow-auto max-h-64"><code>{{ formattedXML }}</code></pre>
              </div>

              <div *ngIf="xmlInput && !isValid" class="space-y-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-start text-red-700">
                    <mat-icon class="mr-2 mt-0.5">error</mat-icon>
                    <div>
                      <p class="font-medium">Invalid XML Document</p>
                      <p class="text-sm mt-1">{{ errorMessage }}</p>
                    </div>
                  </div>
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 class="font-medium text-yellow-800 mb-2">Common XML Errors:</h4>
                  <ul class="text-sm text-yellow-700 space-y-1">
                    <li>• Missing closing tags</li>
                    <li>• Improperly nested elements</li>
                    <li>• Missing or malformed XML declaration</li>
                    <li>• Invalid characters in element names</li>
                    <li>• Unescaped special characters (&, <, >)</li>
                    <li>• Missing quotes around attribute values</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 mt-4" *ngIf="xmlInput && isValid">
              <button mat-stroked-button (click)="copyToClipboard(formattedXML)">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Formatted
              </button>
              <button mat-stroked-button (click)="copyToClipboard(minifiedXML)">
                <mat-icon class="mr-1">content_copy</mat-icon>
                Copy Minified
              </button>
              <button mat-stroked-button (click)="downloadXML()">
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
              XML Validation Guide
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">XML Rules</h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>• Every opening tag must have a closing tag</li>
                <li>• Elements must be properly nested</li>
                <li>• Attribute values must be quoted</li>
                <li>• XML is case-sensitive</li>
                <li>• There must be exactly one root element</li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Special Characters</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>&lt;</span>
                  <span>&amp;lt;</span>
                </div>
                <div class="flex justify-between">
                  <span>&gt;</span>
                  <span>&amp;gt;</span>
                </div>
                <div class="flex justify-between">
                  <span>&amp;</span>
                  <span>&amp;amp;</span>
                </div>
                <div class="flex justify-between">
                  <span>"</span>
                  <span>&amp;quot;</span>
                </div>
                <div class="flex justify-between">
                  <span>'</span>
                  <span>&amp;apos;</span>
                </div>
              </div>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class XmlValidatorComponent implements OnInit {
  xmlInput = '';
  formattedXML = '';
  minifiedXML = '';
  isValid = false;
  errorMessage = '';
  
  xmlStats = {
    elements: 0,
    attributes: 0,
    characters: 0,
    lines: 0
  };

  constructor(
    private seoService: SeoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'XML Validator - Validate XML Online | Tool Ocean',
      description: 'Free online XML validator. Check XML syntax, validate against schemas, and format XML documents.',
      keywords: 'XML validator, XML formatter, validate XML, XML syntax checker, XML parser'
    });
  }

  validateXML() {
    if (!this.xmlInput.trim()) {
      this.isValid = false;
      this.errorMessage = '';
      this.resetStats();
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlInput, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        throw new Error(parserError[0].textContent || 'XML parsing error');
      }

      this.isValid = true;
      this.errorMessage = '';
      this.formattedXML = this.formatXMLString(this.xmlInput);
      this.minifiedXML = this.minifyXMLString(this.xmlInput);
      this.updateStats(xmlDoc);
    } catch (error: any) {
      this.isValid = false;
      this.errorMessage = error.message;
      this.formattedXML = '';
      this.minifiedXML = '';
      this.resetStats();
    }
  }

  formatXMLString(xml: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    return this.formatXMLNode(xmlDoc.documentElement, 0);
  }

  formatXMLNode(node: Element, depth: number): string {
    const indent = '  '.repeat(depth);
    let result = '';
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      result += indent + '<' + node.nodeName;
      
      // Add attributes
      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        result += ` ${attr.name}="${attr.value}"`;
      }
      
      if (node.childNodes.length === 0) {
        result += '/>\n';
      } else {
        result += '>\n';
        
        // Add child nodes
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

  minifyXMLString(xml: string): string {
    return xml.replace(/>\s+</g, '><').trim();
  }

  formatXML() {
    if (this.isValid && this.xmlInput) {
      this.xmlInput = this.formattedXML;
      this.showSuccess('XML formatted successfully');
    }
  }

  minifyXML() {
    if (this.isValid && this.xmlInput) {
      this.xmlInput = this.minifiedXML;
      this.validateXML();
      this.showSuccess('XML minified successfully');
    }
  }

  clearInput() {
    this.xmlInput = '';
    this.validateXML();
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess('Copied to clipboard');
    });
  }

  downloadXML() {
    if (!this.isValid) return;
    
    const blob = new Blob([this.formattedXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.xml';
    a.click();
    URL.revokeObjectURL(url);
    this.showSuccess('XML file downloaded');
  }

  private updateStats(xmlDoc: Document) {
    const elements = xmlDoc.getElementsByTagName('*');
    this.xmlStats.elements = elements.length;
    
    let attributeCount = 0;
    for (let i = 0; i < elements.length; i++) {
      attributeCount += elements[i].attributes.length;
    }
    this.xmlStats.attributes = attributeCount;
    
    this.xmlStats.characters = this.xmlInput.length;
    this.xmlStats.lines = this.xmlInput.split('\n').length;
  }

  private resetStats() {
    this.xmlStats = { elements: 0, attributes: 0, characters: 0, lines: 0 };
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  getStatusTitle(): string {
    if (!this.xmlInput) return 'XML Validator Ready';
    return this.isValid ? 'Valid XML Document' : 'Invalid XML Document';
  }

  getStatusSubtitle(): string {
    if (!this.xmlInput) return 'Paste XML document to validate';
    return this.isValid ? 'Your XML is well-formed' : 'Please fix the errors below';
  }
}