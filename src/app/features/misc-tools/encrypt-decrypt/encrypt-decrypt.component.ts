import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-encrypt-decrypt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-2" style="color: var(--text-primary);">Encrypt & Decrypt</h1>
        <p class="text-gray-600 mb-8" style="color: var(--text-secondary);">Encrypt and decrypt text using AES-256-CBC with Web Crypto API</p>

        <!-- Shared Key Input -->
        <div class="card mb-8">
          <h2 class="text-lg font-semibold mb-4" style="color: var(--text-primary);">Encryption Key</h2>
          <div class="flex gap-4 flex-col sm:flex-row">
            <input
              [(ngModel)]="sharedKey"
              type="text"
              placeholder="Enter encryption key (16-32 characters)"
              class="flex-1 px-4 py-2 border rounded-lg"
              style="border-color: var(--border-color); background: var(--bg-card); color: var(--text-primary);"
            />
            <button
              (click)="generateRandomKey()"
              class="px-6 py-2 text-white rounded-lg transition"
              style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);"
              onmouseover="this.style.opacity='0.9'"
              onmouseout="this.style.opacity='1'"
            >
              Generate Key
            </button>
          </div>
          <p class="text-sm mt-2" style="color: var(--text-tertiary);">
            Key length: <strong>{{ sharedKey.length }}</strong> characters
            <span *ngIf="sharedKey.length > 0 && isValidKeyLength()">
              ✓ Valid
            </span>
            <span *ngIf="sharedKey.length > 0 && !isValidKeyLength()" style="color: #ef4444;">
              ✗ Invalid (need 16-32 chars)
            </span>
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Encryption Section -->
          <div class="card">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <span style="font-size: 20px;">🔒</span> Encryption
            </h2>

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Plaintext</label>
              <textarea
                [(ngModel)]="plaintext"
                placeholder="Enter text to encrypt"
                rows="6"
                class="w-full px-4 py-2 border rounded-lg font-mono text-sm resize-none"
                style="border-color: var(--border-color); background: var(--bg-card); color: var(--text-primary);"
              ></textarea>
            </div>

            <button
              (click)="encryptData()"
              [disabled]="!sharedKey || !plaintext || !isValidKeyLength()"
              class="w-full px-4 py-2 text-white rounded-lg font-medium transition mb-4"
              style="background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); opacity: 1;"
              [style.opacity]="(!sharedKey || !plaintext || !isValidKeyLength()) ? '0.5' : '1'"
            >
              <span *ngIf="!encryptLoading">Encrypt</span>
              <span *ngIf="encryptLoading">Encrypting...</span>
            </button>

            <div *ngIf="encryptError" class="p-3 rounded-lg mb-4" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;">
              {{ encryptError }}
            </div>

            <div *ngIf="encryptedBase64" class="p-4 rounded-lg" style="background: var(--bg-surface); border: 1px solid var(--border-color);">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Encrypted (Base64)</label>
              <textarea
                [value]="encryptedBase64"
                readonly
                rows="4"
                class="w-full px-3 py-2 border rounded-lg font-mono text-sm resize-none"
                style="border-color: var(--border-color); background: var(--bg-card); color: var(--text-primary);"
              ></textarea>
              <button
                (click)="copyToClipboard(encryptedBase64)"
                class="mt-2 w-full px-3 py-2 text-sm rounded transition"
                style="background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-color);"
              >
                <span *ngIf="!copySuccess">📋 Copy to Clipboard</span>
                <span *ngIf="copySuccess">✓ Copied!</span>
              </button>
              <p class="text-xs mt-2" style="color: var(--text-tertiary);">
                Generated with IV from today's date
              </p>
            </div>
          </div>

          <!-- Decryption Section -->
          <div class="card">
            <h2 class="text-xl font-semibold mb-4 flex items-center gap-2" style="color: var(--text-primary);">
              <span style="font-size: 20px;">🔓</span> Decryption
            </h2>

            <div class="mb-4">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Encrypted Base64</label>
              <textarea
                [(ngModel)]="encryptedInput"
                placeholder="Paste encrypted Base64 text here"
                rows="6"
                class="w-full px-4 py-2 border rounded-lg font-mono text-sm resize-none"
                style="border-color: var(--border-color); background: var(--bg-card); color: var(--text-primary);"
              ></textarea>
            </div>

            <button
              (click)="decryptData()"
              [disabled]="!sharedKey || !encryptedInput || !isValidKeyLength()"
              class="w-full px-4 py-2 text-white rounded-lg font-medium transition mb-4"
              style="background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); opacity: 1;"
              [style.opacity]="(!sharedKey || !encryptedInput || !isValidKeyLength()) ? '0.5' : '1'"
            >
              <span *ngIf="!decryptLoading">Decrypt</span>
              <span *ngIf="decryptLoading">Decrypting...</span>
            </button>

            <div *ngIf="decryptError" class="p-3 rounded-lg mb-4" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5;">
              {{ decryptError }}
            </div>

            <div *ngIf="decryptedText" class="p-4 rounded-lg" style="background: var(--bg-surface); border: 1px solid var(--border-color);">
              <label class="block text-sm font-medium mb-2" style="color: var(--text-primary);">Decrypted Text</label>
              <textarea
                [value]="decryptedText"
                readonly
                rows="4"
                class="w-full px-3 py-2 border rounded-lg font-mono text-sm resize-none"
                style="border-color: var(--border-color); background: var(--bg-card); color: var(--text-primary);"
              ></textarea>
              <button
                (click)="copyToClipboard(decryptedText)"
                class="mt-2 w-full px-3 py-2 text-sm rounded transition"
                style="background: var(--bg-elevated); color: var(--text-primary); border: 1px solid var(--border-color);"
              >
                <span *ngIf="!copySuccess">📋 Copy to Clipboard</span>
                <span *ngIf="copySuccess">✓ Copied!</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="card mt-8" style="background: var(--bg-surface);">
          <h3 class="font-semibold mb-3" style="color: var(--text-primary);">How it works</h3>
          <ul class="text-sm space-y-2" style="color: var(--text-secondary);">
            <li>✓ Uses <strong>AES-256-CBC</strong> encryption from Web Crypto API</li>
            <li>✓ IV (Initialization Vector) is deterministically generated from today's date</li>
            <li>✓ Key must be 16, 24, or 32 characters (128, 192, or 256 bits)</li>
            <li>✓ All encryption/decryption happens in your browser - nothing is sent to servers</li>
            <li>✓ Results are Base64 encoded for easy sharing</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 100%;
    }

    textarea, input {
      transition: border-color 0.2s;
    }

    textarea:focus, input:focus {
      outline: none;
      border-color: #a855f7 !important;
    }

    button:disabled {
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EncryptDecryptComponent {
  sharedKey = '';
  plaintext = '';
  encryptedInput = '';
  encryptedBase64 = '';
  decryptedText = '';
  encryptError = '';
  decryptError = '';
  encryptLoading = false;
  decryptLoading = false;
  copySuccess = false;

  isValidKeyLength(): boolean {
    const length = this.sharedKey.trim().length;
    return length === 16 || length === 24 || length === 32;
  }

  generateRandomKey(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let key = '';
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.sharedKey = key;
  }

  private async generateIV(seed: string): Promise<Uint8Array> {
    const enc = new TextEncoder();
    const seedBytes = enc.encode(seed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', seedBytes);
    return new Uint8Array(hashBuffer).slice(0, 16);
  }

  private async importKey(keyString: string): Promise<CryptoKey> {
    const keyBytes = new TextEncoder().encode(keyString.trim());
    return crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-CBC' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(): Promise<void> {
    this.encryptError = '';
    this.encryptedBase64 = '';

    try {
      const plainText = this.plaintext.trim();
      const key = this.sharedKey.trim();

      if (!plainText) {
        this.encryptError = 'Please enter text to encrypt';
        return;
      }

      if (!key) {
        this.encryptError = 'Please enter an encryption key';
        return;
      }

      if (!this.isValidKeyLength()) {
        this.encryptError = 'Key must be 16, 24, or 32 characters';
        return;
      }

      this.encryptLoading = true;

      const date = new Date();
      const currentDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
      const iv = await this.generateIV(currentDate);

      const aesKey = await this.importKey(key);
      const textBuffer = new TextEncoder().encode(plainText);

      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv },
        aesKey,
        textBuffer
      );

      const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
      this.encryptedBase64 = btoa(String.fromCharCode(...encryptedArray));
    } catch (error: any) {
      this.encryptError = `Encryption failed: ${error.message || 'Unknown error'}`;
    } finally {
      this.encryptLoading = false;
    }
  }

  async decryptData(): Promise<void> {
    this.decryptError = '';
    this.decryptedText = '';

    try {
      const encryptedBase64 = this.encryptedInput.trim();
      const key = this.sharedKey.trim();

      if (!encryptedBase64) {
        this.decryptError = 'Please enter encrypted Base64 text';
        return;
      }

      if (!key) {
        this.decryptError = 'Please enter an encryption key';
        return;
      }

      if (!this.isValidKeyLength()) {
        this.decryptError = 'Key must be 16, 24, or 32 characters';
        return;
      }

      this.decryptLoading = true;

      // Decode Base64
      let binaryString: string;
      try {
        binaryString = atob(encryptedBase64);
      } catch {
        this.decryptError = 'Invalid Base64 input';
        this.decryptLoading = false;
        return;
      }

      const encryptedBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        encryptedBytes[i] = binaryString.charCodeAt(i);
      }

      const date = new Date();
      const currentDate = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`;
      const iv = await this.generateIV(currentDate);

      const aesKey = await this.importKey(key);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        aesKey,
        encryptedBytes
      );

      this.decryptedText = new TextDecoder().decode(decryptedBuffer);
    } catch (error: any) {
      this.decryptError = `Decryption failed: ${error.message || 'Wrong key or invalid data'}`;
    } finally {
      this.decryptLoading = false;
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.copySuccess = true;
      setTimeout(() => {
        this.copySuccess = false;
      }, 2000);
    });
  }
}
