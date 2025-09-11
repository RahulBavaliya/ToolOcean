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
    <div class="min-h-screen bg-gradient-to-b from-teal-50 to-white py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <mat-icon class="text-white text-3xl">text_fields</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Character Counter & Text Analyzer
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Count characters, words, sentences, and analyze your text in real-time. 
            Perfect for social media posts, essays, and content creation.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Text Input -->
          <div class="lg:col-span-2">
            <mat-card class="p-6 h-full">
              <mat-card-header class="pb-4">
                <mat-card-title class="flex items-center">
                  <mat-icon class="mr-2 text-teal-500">edit</mat-icon>
                  Text Input
                </mat-card-title>
                <mat-card-subtitle>
                  Type or paste your text here
                </mat-card-subtitle>
              </mat-card-header>

              <mat-form-field class="w-full">
                <textarea
                  matInput
                  [(ngModel)]="textInput"
                  placeholder="Start typing or paste your text here..."
                  class="form-textarea min-h-[400px]"
                  (input)="analyzeText()"
                  aria-label="Text input for analysis"
                ></textarea>
              </mat-form-field>

              <div class="flex flex-wrap gap-3 mt-4">
                <button mat-stroked-button (click)="clearText()">
                  <mat-icon class="mr-1">clear</mat-icon>
                  Clear Text
                </button>
                <button mat-stroked-button (click)="copyText()">
                  <mat-icon class="mr-1">content_copy</mat-icon>
                  Copy Text
                </button>
                <button mat-stroked-button (click)="uploadFile()">
                  <mat-icon class="mr-1">upload_file</mat-icon>
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
            <mat-card class="p-6 sticky top-8">
              <mat-card-header class="pb-4">
                <mat-card-title class="flex items-center">
                  <mat-icon class="mr-2 text-teal-500">analytics</mat-icon>
                  Text Statistics
                </mat-card-title>
              </mat-card-header>

              <div class="space-y-4">
                <!-- Primary Stats -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-teal-600">{{ stats.characters }}</div>
                    <div class="text-sm text-teal-700">Characters</div>
                  </div>
                  
                  <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ stats.words }}</div>
                    <div class="text-sm text-blue-700">Words</div>
                  </div>
                </div>

                <!-- Detailed Stats -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Characters (no spaces)</span>
                    <span class="font-semibold">{{ stats.charactersNoSpaces }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Sentences</span>
                    <span class="font-semibold">{{ stats.sentences }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Paragraphs</span>
                    <span class="font-semibold">{{ stats.paragraphs }}</span>
                  </div>
                  
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Lines</span>
                    <span class="font-semibold">{{ stats.lines }}</span>
                  </div>
                </div>

                <!-- Reading Time -->
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <h4 class="font-semibold text-purple-800 mb-2">Reading Time</h4>
                  <div class="space-y-1">
                    <div class="flex justify-between text-sm">
                      <span class="text-purple-700">Reading:</span>
                      <span class="font-medium">{{ formatTime(stats.readingTime) }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-purple-700">Speaking:</span>
                      <span class="font-medium">{{ formatTime(stats.speakingTime) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Social Media Limits -->
                <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                  <h4 class="font-semibold text-orange-800 mb-2">Social Media</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-orange-700">Twitter:</span>
                      <span class="font-medium" [class.text-red-600]="stats.characters > 280">
                        {{ stats.characters }}/280
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-orange-700">Facebook:</span>
                      <span class="font-medium" [class.text-red-600]="stats.characters > 63206">
                        {{ stats.characters }}/63,206
                      </span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-orange-700">Instagram:</span>
                      <span class="font-medium" [class.text-red-600]="stats.characters > 2200">
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
        <mat-card class="mt-8 p-6">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">featured_play_list</mat-icon>
              Features & Use Cases
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="w-12 h-12 bg-teal-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-teal-600">social_media</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Social Media Posts</h3>
              <p class="text-sm text-gray-600">Check character limits for Twitter, Facebook, Instagram</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-blue-600">article</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Content Writing</h3>
              <p class="text-sm text-gray-600">Analyze blog posts, articles, and essays</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-purple-600">schedule</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Reading Time</h3>
              <p class="text-sm text-gray-600">Estimate reading and speaking duration</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-green-600">analytics</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Text Analysis</h3>
              <p class="text-sm text-gray-600">Detailed statistics and insights</p>
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