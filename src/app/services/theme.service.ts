import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';

  theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.applyTheme(theme);
    });
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
      if (savedTheme) {
        return savedTheme;
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  }

  private applyTheme(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  toggleTheme(): void {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  isDark(): boolean {
    return this.theme() === 'dark';
  }
}
