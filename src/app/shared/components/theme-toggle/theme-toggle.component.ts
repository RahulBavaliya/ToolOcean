import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService,Theme } from '../../../core/services/theme.service';
//import { ThemeService, Theme } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <button 
      mat-icon-button 
      (click)="toggleTheme()"
      [matTooltip]="getTooltipText()"
      class="theme-toggle-btn"
      [attr.aria-label]="getAriaLabel()"
      [attr.aria-pressed]="isDarkMode">
      
      <!-- Light mode icon -->
      <mat-icon 
        *ngIf="!isDarkMode" 
        class="theme-icon light-icon"
        aria-hidden="true">
        light_mode
      </mat-icon>
      
      <!-- Dark mode icon -->
      <mat-icon 
        *ngIf="isDarkMode" 
        class="theme-icon dark-icon"
        aria-hidden="true">
        dark_mode
      </mat-icon>
    </button>
  `,
  styles: [`
    .theme-toggle-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .theme-toggle-btn:hover {
      transform: scale(1.1);
    }

    .theme-icon {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .light-icon {
      color: #fbbf24;
      animation: rotate 2s linear infinite;
    }

    .dark-icon {
      color: #60a5fa;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .theme-toggle-btn {
        border: 2px solid currentColor;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .theme-toggle-btn,
      .theme-icon {
        transition: none;
        animation: none;
      }
    }
  `]
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: Theme) => {
        this.isDarkMode = theme === 'dark';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
    
    // Announce theme change to screen readers
    this.announceThemeChange();
  }

  /**
   * Get tooltip text based on current theme
   */
  getTooltipText(): string {
    return this.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode';
  }

  /**
   * Get aria-label for accessibility
   */
  getAriaLabel(): string {
    return `Toggle theme. Current theme: ${this.isDarkMode ? 'dark' : 'light'} mode`;
  }

  /**
   * Announce theme change to screen readers
   */
  private announceThemeChange(): void {
    const announcement = `Switched to ${this.isDarkMode ? 'light' : 'dark'} mode`;
    
    // Create temporary element for screen reader announcement
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = announcement;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
}