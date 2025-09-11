import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeoService } from '../../../core/services/seo.service';

interface WordStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  averageWordsPerSentence: number;
  readingTime: number;
  speakingTime: number;
  mostCommonWords: { word: string; count: number }[];
  wordFrequency: { [key: string]: number };
}

@Component({
  selector: 'app-word-counter',
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
            <mat-icon class="text-white text-3xl">format_list_numbered</mat-icon>
          </div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Word Counter & Text Analyzer
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze text statistics including word count, reading time, and word frequency. 
            Perfect for writers, students, and content creators.
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
                  Type or paste your text here for analysis
                </mat-card-subtitle>
              </mat-card-header>

              <mat-form-field class="w-full">
                <textarea
                  matInput
                  [(ngModel)]="textInput"
                  placeholder="Start typing or paste your text here..."
                  class="form-textarea min-h-[400px]"
                  (input)="analyzeText()"
                  aria-label="Text input for word count analysis"
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
                <button mat-stroked-button (click)="exportStats()">
                  <mat-icon class="mr-1">download</mat-icon>
                  Export Stats
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
                  Word Statistics
                </mat-card-title>
              </mat-card-header>

              <div class="space-y-4">
                <!-- Primary Stats -->
                <div class="grid grid-cols-1 gap-4">
                  <div class="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4 text-center">
                    <div class="text-3xl font-bold text-teal-600">{{ stats.words }}</div>
                    <div class="text-sm text-teal-700">Words</div>
                  </div>
                  
                  <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ stats.characters }}</div>
                    <div class="text-sm text-blue-700">Characters</div>
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
                    <span class="text-gray-600">Avg words/sentence</span>
                    <span class="font-semibold">{{ stats.averageWordsPerSentence }}</span>
                  </div>
                </div>

                <!-- Reading Time -->
                <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                  <h4 class="font-semibold text-purple-800 mb-2">Time Estimates</h4>
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

                <!-- Most Common Words -->
                <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4" *ngIf="stats.mostCommonWords.length > 0">
                  <h4 class="font-semibold text-green-800 mb-2">Most Common Words</h4>
                  <div class="space-y-1">
                    <div *ngFor="let word of stats.mostCommonWords.slice(0, 5)" class="flex justify-between text-sm">
                      <span class="text-green-700">{{ word.word }}</span>
                      <span class="font-medium">{{ word.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>
        </div>

        <!-- Word Frequency Analysis -->
        <mat-card class="mt-8 p-6" *ngIf="textInput && stats.words > 0">
          <mat-card-header class="pb-4">
            <mat-card-title class="flex items-center">
              <mat-icon class="mr-2 text-blue-500">bar_chart</mat-icon>
              Word Frequency Analysis
            </mat-card-title>
          </mat-card-header>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Top 10 Words</h3>
              <div class="space-y-2">
                <div *ngFor="let word of stats.mostCommonWords.slice(0, 10); let i = index" class="flex items-center">
                  <span class="w-6 text-sm text-gray-500">{{ i + 1 }}.</span>
                  <span class="flex-1 font-medium">{{ word.word }}</span>
                  <span class="text-sm text-gray-600">{{ word.count }} times</span>
                  <div class="w-20 bg-gray-200 rounded-full h-2 ml-3">
                    <div 
                      class="bg-teal-500 h-2 rounded-full" 
                      [style.width.%]="(word.count / stats.mostCommonWords[0].count) * 100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3 text-gray-900">Text Complexity</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Unique words:</span>
                  <span class="font-semibold">{{ getUniqueWordCount() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Vocabulary diversity:</span>
                  <span class="font-semibold">{{ getVocabularyDiversity() }}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Longest word:</span>
                  <span class="font-semibold">{{ getLongestWord() }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Average word length:</span>
                  <span class="font-semibold">{{ getAverageWordLength() }} chars</span>
                </div>
              </div>
            </div>
          </div>
        </mat-card>

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
                <mat-icon class="text-teal-600">article</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Content Writing</h3>
              <p class="text-sm text-gray-600">Track word count for articles, blogs, and essays</p>
            </div>
            
            <div class="text-center">
              <div class="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <mat-icon class="text-blue-600">school</mat-icon>
              </div>
              <h3 class="font-semibold mb-2">Academic Writing</h3>
              <p class="text-sm text-gray-600">Meet word requirements for assignments</p>
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
              <p class="text-sm text-gray-600">Word frequency and complexity analysis</p>
            </div>
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class WordCounterComponent implements OnInit {
  textInput = '';
  
  stats: WordStats = {
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    sentences: 0,
    paragraphs: 0,
    averageWordsPerSentence: 0,
    readingTime: 0,
    speakingTime: 0,
    mostCommonWords: [],
    wordFrequency: {}
  };

  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.updateSeoTags({
      title: 'Word Counter - Count Words Online | Tool Ocean',
      description: 'Free online word counter tool. Count words, characters, sentences, and analyze text statistics.',
      keywords: 'word counter, text analyzer, word count, reading time, text statistics, word frequency'
    });
  }

  analyzeText() {
    if (!this.textInput) {
      this.resetStats();
      return;
    }

    // Basic counts
    this.stats.characters = this.textInput.length;
    this.stats.charactersNoSpaces = this.textInput.replace(/\s/g, '').length;
    
    // Words
    const words = this.textInput.trim().split(/\s+/).filter(word => word.length > 0);
    this.stats.words = words.length;
    
    // Sentences
    this.stats.sentences = this.textInput.trim() ? 
      this.textInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Paragraphs
    this.stats.paragraphs = this.textInput.trim() ? 
      this.textInput.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    // Average words per sentence
    this.stats.averageWordsPerSentence = this.stats.sentences > 0 ? 
      Math.round((this.stats.words / this.stats.sentences) * 10) / 10 : 0;
    
    // Reading time (average 200 words per minute)
    this.stats.readingTime = this.stats.words / 200;
    
    // Speaking time (average 150 words per minute)
    this.stats.speakingTime = this.stats.words / 150;
    
    // Word frequency analysis
    this.analyzeWordFrequency(words);
  }

  analyzeWordFrequency(words: string[]) {
    this.stats.wordFrequency = {};
    
    // Clean and count words
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 0 && !this.isStopWord(cleanWord)) {
        this.stats.wordFrequency[cleanWord] = (this.stats.wordFrequency[cleanWord] || 0) + 1;
      }
    });
    
    // Sort by frequency
    this.stats.mostCommonWords = Object.entries(this.stats.wordFrequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }

  isStopWord(word: string): boolean {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];
    return stopWords.includes(word);
  }

  resetStats() {
    this.stats = {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      averageWordsPerSentence: 0,
      readingTime: 0,
      speakingTime: 0,
      mostCommonWords: [],
      wordFrequency: {}
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

  exportStats() {
    const statsData = {
      text: this.textInput,
      statistics: this.stats,
      analysis: {
        uniqueWords: this.getUniqueWordCount(),
        vocabularyDiversity: this.getVocabularyDiversity(),
        longestWord: this.getLongestWord(),
        averageWordLength: this.getAverageWordLength()
      },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(statsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
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

  getUniqueWordCount(): number {
    return Object.keys(this.stats.wordFrequency).length;
  }

  getVocabularyDiversity(): number {
    if (this.stats.words === 0) return 0;
    return Math.round((this.getUniqueWordCount() / this.stats.words) * 100);
  }

  getLongestWord(): string {
    if (!this.textInput) return '';
    const words = this.textInput.split(/\s+/).map(word => word.replace(/[^\w]/g, ''));
    return words.reduce((longest, current) => current.length > longest.length ? current : longest, '');
  }

  getAverageWordLength(): number {
    if (this.stats.words === 0) return 0;
    const totalLength = this.textInput.split(/\s+/)
      .map(word => word.replace(/[^\w]/g, ''))
      .reduce((sum, word) => sum + word.length, 0);
    return Math.round((totalLength / this.stats.words) * 10) / 10;
  }
}