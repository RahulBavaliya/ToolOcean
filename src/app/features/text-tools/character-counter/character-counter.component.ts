import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from '../../../core/services/seo.service';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
}

@Component({
  selector: 'app-character-counter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-teal-900 dark:to-cyan-900 py-8 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
              <mat-icon class="text-white text-4xl">text_fields</mat-icon>
              <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl blur opacity-30 animate-pulse"></div>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            Character Counter & Text Analyzer
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Count characters, words, sentences, and analyze your text in real-time. 
            Perfect for social media posts, essays, and content creation.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <!-- Text Input -->
          <div class="lg:col-span-2">
            <mat-card class="p-8 h-full rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
              <mat-card-header class="pb-6">
                <mat-card-title class="flex items-center text-2xl font-bold">
                  <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <mat-icon class="text-white">edit</mat-icon>
                  </div>
                  Text Input
                </mat-card-title>
                <mat-card-subtitle class="text-gray-600 dark:text-gray-300 mt-2">
                  Type or paste your text here
                </mat-card-subtitle>
              </mat-card-header>

              <mat-form-field class="w-full" appearance="outline">
                <textarea
                  matInput
                  [(ngModel)]="textInput"
                  placeholder="Start typing or paste your text here..."
                  class="min-h-[400px] resize-none"
                  (input)="analyzeText()"
                  aria-label="Text input for analysis"
                ></textarea>
              </mat-form-field>

              <div class="flex flex-wrap gap-3 mt-6">
                <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="clearText()">
                  <mat-icon class="mr-2">clear</mat-icon>
                  Clear Text
                </button>
                <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="copyText()">
                  <mat-icon class="mr-2">content_copy</mat-icon>
                  Copy Text
                </button>
                <button mat-stroked-button class="rounded-xl px-6 py-3" (click)="uploadFile()">
                  <mat-icon class="mr-2">upload_file</mat-icon>
                  Upload File
                </button>
              </div>
              
              <input 
                type="file" 
                #fileInput 
                accept=".txt,.doc,.docx" 
                style="display: none" 
                (change)="onFileSelected($event)"
              />
            </mat-card>
          </div>

          <!-- Statistics Panel -->
          <div class="lg:col-span-1">
            <mat-card class="p-8 sticky top-8 rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <mat-card-header class="pb-6">
                <mat-card-title class="flex items-center text-2xl font-bold">
                  <div class="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <mat-icon class="text-white">analytics</mat-icon>
                  </div>
                  Text Statistics
                </mat-card-title>
              </mat-card-header>

              <div class="space-y-6">
                <!-- Primary Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-xl p-4 text-center border border-teal-200 dark:border-teal-700">
                    <div class="text-3xl font-bold text-teal-600 dark:text-teal-400">{{ stats.characters }}</div>
                    <div class="text-sm text-teal-700 dark:text-teal-300 font-medium">Characters</div>
                  </div>
                  
                  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-700">
                    <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats.words }}</div>
                    <div class="text-sm text-blue-700 dark:text-blue-300 font-medium">Words</div>
                  </div>
                </div>

                <!-- Detailed Stats -->
                <div class="space-y-4">
                  <div class="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-300 font-medium">Characters (no spaces)</span>
                    <span class="font-bold text-lg text-gray-800 dark:text-gray-200">{{ stats.charactersNoSpaces }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-300 font-medium">Sentences</span>
                    <span class="font-bold text-lg text-gray-800 dark:text-gray-200">{{ stats.sentences }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-300 font-medium">Paragraphs</span>
                    <span class="font-bold text-lg text-gray-800 dark:text-gray-200">{{ stats.paragraphs }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span class="text-gray-600 dark:text-gray-300 font-medium">Lines</span>
                    <span class="font-bold text-lg text-gray-800 dark:text-gray-200">{{ stats.lines }}</span>
                  </div>
                </div>

                <!-- Reading Time -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
                  <h4 class="font-bold text-purple-800 dark:text-purple-300 mb-3">Reading Time</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-purple-700 dark:text-purple-300 font-medium">Reading:</span>
                      <span class="font-bold text-purple-800 dark:text-purple-200">{{ formatTime(stats.readingTime) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-purple-700 dark:text-purple-300 font-medium">Speaking:</span>
                      <span class="font-bold text-purple-800 dark:text-purple-200">{{ formatTime(stats.speakingTime) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Social Media Limits -->
                <div class="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                  <h4 class="font-bold text-orange-800 dark:text-orange-300 mb-3">Social Media</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-orange-700 dark:text-orange-300 font-medium">Twitter:</span>
                      <span class="font-bold" [class.text-red-600]="stats.characters > 280" [class.text-orange-800]="stats.characters <= 280" [class.dark:text-red-400]="stats.characters > 280" [class.dark:text-orange-200]="stats.characters <= 280">
                        {{ stats.characters }}/280
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-orange-700 dark:text-orange-300 font-medium">Facebook:</span>
                      <span class="font-bold" [class.text-red-600]="stats.characters > 63206" [class.text-orange-800]="stats.characters <= 63206" [class.dark:text-red-400]="stats.characters > 63206" [class.dark:text-orange-200]="stats.characters <= 63206">
                        {{ stats.characters }}/63,206
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-orange-700 dark:text-orange-300 font-medium">Instagram:</span>
                      <span class="font-bold" [class.text-red-600]="stats.characters > 2200" [class.text-orange-800]="stats.characters <= 2200" [class.dark:text-red-400]="stats.characters > 2200" [class.dark:text-orange-200]="stats.characters <= 2200">
                        {{ stats.characters }}/2,200
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </div>

        <!-- Features Section -->
        <mat-card class="p-8 rounded-2xl shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <mat-card-header class="pb-6">
            <mat-card-title class="flex items-center text-2xl font-bold">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
                <mat-icon class="text-white">featured_play_list</mat-icon>
              </div>
              Features & Use Cases
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">share</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">Social Media Posts</h3>
              <p class="text-gray-600 dark:text-gray-300">Check character limits for Twitter, Facebook, Instagram</p>
            </div>
            
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">article</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">Content Writing</h3>
              <p class="text-gray-600 dark:text-gray-300">Analyze blog posts, articles, and essays</p>
            </div>
            
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">schedule</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">Reading Time</h3>
              <p class="text-gray-600 dark:text-gray-300">Estimate reading and speaking duration</p>
            </div>
            
            <div class="text-center group">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <mat-icon class="text-white text-2xl">analytics</mat-icon>
              </div>
              <h3 class="font-bold text-lg mb-3">Text Analysis</h3>
              <p class="text-gray-600 dark:text-gray-300">Detailed statistics and insights</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class CharacterCounterComponent implements OnInit {
  textInput = '';
  
  stats: TextStats = {
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0
  };

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Character Counter - Count Characters Online | Tool Ocean',
      description: 'Free online character counter tool. Count characters, words, sentences, and paragraphs in your text.',
      keywords: 'character counter, word counter, text analyzer, character count, social media character limit'
    });
  }

  analyzeText() {
    if (!this.textInput) {
      this.resetStats();
      return;
    }

    // Characters
    this.stats.characters = this.textInput.length;
    this.stats.charactersNoSpaces = this.textInput.replace(/\s/g, '').length;
    
    // Words
    this.stats.words = this.textInput.trim() ? 
      this.textInput.trim().split(/\s+/).length : 0;
    
    // Sentences
    this.stats.sentences = this.textInput.trim() ? 
      this.textInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Paragraphs
    this.stats.paragraphs = this.textInput.trim() ? 
      this.textInput.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    // Lines
    this.stats.lines = this.textInput ? this.textInput.split('\n').length : 0;
    
    // Reading time (average 200 words per minute)
    this.stats.readingTime = this.stats.words / 200;
    
    // Speaking time (average 150 words per minute)
    this.stats.speakingTime = this.stats.words / 150;
  }

  resetStats() {
    this.stats = {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: 0,
      speakingTime: 0
    };
  }

  clearText() {
    this.textInput = '';
    this.analyzeText();
  }

  copyText() {
    navigator.clipboard.writeText(this.textInput);
  }

  uploadFile() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.textInput = e.target?.result as string;
        this.analyzeText();
      };
      reader.readAsText(file);
    }
  }

  formatTime(minutes: number): string {
    if (minutes < 1) {
      return '< 1 min';
    } else if (minutes < 60) {
      return `${Math.ceil(minutes)} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.ceil(minutes % 60);
      return `${hours}h ${remainingMinutes}m`;
    }
  }
}