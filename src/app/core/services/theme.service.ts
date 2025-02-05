import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<'light' | 'dark'>('light');

  constructor() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    this.currentTheme.set(savedTheme);
  }

  toggleTheme() {
    this.currentTheme.update(theme => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }
}