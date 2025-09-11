import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
  ],
  template: `
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <!-- Brand -->
          <div class="lg:col-span-2">
          <div>
          <a routerLink="/" class="flex items-start">
  <!-- Logo -->
  <img src="assets/logo.png" alt="Tool Ocean Logo" class="w-[50px] h-[50px] object-contain mr-2">

  <!-- Text block -->
  <div class="flex flex-col">
    <!-- Title as h1 -->
    <h2 class="flex items-center m-0" style="margin: 0px;">
      <span
        style="
          background: #043f7f;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          margin-right: 6px;
        "
      >
        Tool
      </span>

      <span
        style="
          background: linear-gradient(to right, #14b8a6, #14b8a6, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        "
      >
        Ocean
      </span>
    </h2>

    <!-- Tagline under "Tool" -->
    <p class="text-xs mt-1 mb-0">Free Online Tools</p>
  </div>
</a>

          </div>
            <p class="text-gray-400 text-sm leading-relaxed mb-6">
              Your go-to destination for free, fast, and secure online tools. 
              No registration required. All processing happens in your browser 
              to keep your data private and secure.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>facebook</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>alternate_email</mat-icon>
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                <mat-icon>link</mat-icon>
              </a>
            </div>
          </div>

          <!-- Tech Tools -->
          <div>
            <h4 class="font-semibold mb-4 text-ocean-400">Tech Tools</h4>
            <ul class="space-y-2">
              <li><a routerLink="/tech/json-validator" class="text-gray-400 hover:text-white transition-colors text-sm">JSON Validator</a></li>
              <li><a routerLink="/tech/xml-validator" class="text-gray-400 hover:text-white transition-colors text-sm">XML Validator</a></li>
              <li><a routerLink="/tech/beautifier" class="text-gray-400 hover:text-white transition-colors text-sm">Code Beautifier</a></li>
              <li><a routerLink="/tech/regex-tester" class="text-gray-400 hover:text-white transition-colors text-sm">Regex Tester</a></li>
            </ul>
          </div>

          <!-- Text & Document -->
          <div>
            <h4 class="font-semibold mb-4 text-teal-400">Text & Document</h4>
            <ul class="space-y-2">
              <li><a routerLink="/text/character-counter" class="text-gray-400 hover:text-white transition-colors text-sm">Character Counter</a></li>
              <li><a routerLink="/text/word-counter" class="text-gray-400 hover:text-white transition-colors text-sm">Word Counter</a></li>
              <li><a routerLink="/text/case-converter" class="text-gray-400 hover:text-white transition-colors text-sm">Case Converter</a></li>
              <li><a routerLink="/document/pdf-to-word" class="text-gray-400 hover:text-white transition-colors text-sm">PDF to Word</a></li>
            </ul>
          </div>

          <!-- Other Tools -->
          <div>
            <h4 class="font-semibold mb-4 text-purple-400">More Tools</h4>
            <ul class="space-y-2">
              <li><a routerLink="/calculator/percentage-calculator" class="text-gray-400 hover:text-white transition-colors text-sm">Percentage Calculator</a></li>
              <li><a routerLink="/misc/qr-generator" class="text-gray-400 hover:text-white transition-colors text-sm">QR Generator</a></li>
              <li><a routerLink="/misc/url-shortener" class="text-gray-400 hover:text-white transition-colors text-sm">URL Shortener</a></li>
              <li><a routerLink="/calculator/measurement-converter" class="text-gray-400 hover:text-white transition-colors text-sm">Unit Converter</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm mb-4 md:mb-0">
              © {{ currentYear }} Tool Ocean. All rights reserved.
            </p>
            
            <div class="flex space-x-6">
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
