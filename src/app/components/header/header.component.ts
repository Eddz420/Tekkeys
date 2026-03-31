import { Component, inject, signal, HostListener, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ConfigService } from '../../services/config.service';
import { CategoriesService } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements  OnDestroy {
  themeService = inject(ThemeService);
  configService = inject(ConfigService);
  categoriesService = inject(CategoriesService);
  cartService = inject(CartService);
  elementRef = inject(ElementRef);
  router = inject(Router);
  snackbarService = inject(SnackbarService);

  isMenuOpen = signal(false);
  isScrolled = signal(false);
  isCategoriesMenuOpen = signal(false);
  hoveredCategoryId = signal<number | null>(null);
  isLoginModalOpen = signal(false);
  connected = signal(false);
  isUserMenuOpen = signal(false);
  isSearchOpen = signal(false);

  visibleCategories = this.categoriesService.visibleCategories;
  moreCategories = this.categoriesService.moreCategories;
  hasMoreCategories = this.categoriesService.hasMoreCategories;
  private resizeObserver!: ResizeObserver;
  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }
  }
  ngAfterViewInit(): void {
    const nav = this.elementRef.nativeElement.querySelector('.nav');
    if (!nav) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.calculateVisibleCategories();
    });

    this.resizeObserver.observe(nav);

    // initial run
    setTimeout(() => this.calculateVisibleCategories());
  }
  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private calculateVisibleCategories(): void {
    const nav = this.elementRef.nativeElement.querySelector('.nav');
    if (!nav) return;

    const elements = Array.from(
      nav.querySelectorAll('.nav-link-wrapper')
    ) as HTMLElement[];

    const moreButton = nav.querySelector('.more-link')?.parentElement as HTMLElement;

    const navWidth = nav.offsetWidth;

    let usedWidth = 0;
    let visibleCount = 0;
    const gap = 16;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];

      // skip "More"
      if (moreButton && el === moreButton) continue;

      // ❗ IMPORTANT: temporarily ensure it's measurable
      el.style.display = 'flex';

      const elWidth = el.offsetWidth;

      const remaining = elements.length - (visibleCount + 1);
      const reserveMore = remaining > 0 && moreButton ? moreButton.offsetWidth : 0;

      if (usedWidth + elWidth + gap + reserveMore > navWidth) {
        break;
      }

      usedWidth += elWidth + gap;
      visibleCount++;
    }

    this.categoriesService.setVisibleCount(visibleCount);
  }

  private recalculate(nav: HTMLElement, totalCategories: number): void {
    const allElements = Array.from(
      nav.querySelectorAll('.nav-link-wrapper')
    ) as HTMLElement[];

    const moreButton = nav.querySelector('.more-link')?.parentElement as HTMLElement;

    const navWidth = nav.offsetWidth;

    let usedWidth = 0;
    let visibleCount = 0;
    const gap = 16;

    for (let i = 0; i < allElements.length; i++) {
      const el = allElements[i];

      // ❗ skip "More" button
      if (moreButton && el === moreButton) continue;

      const elWidth = el.offsetWidth;

      const remainingItems = totalCategories - (visibleCount + 1);
      const reserveMore = remainingItems > 0 && moreButton ? moreButton.offsetWidth : 0;

      if (usedWidth + elWidth + gap + reserveMore > navWidth) {
        break;
      }

      usedWidth += elWidth + gap;
      visibleCount++;
    }

    this.categoriesService.setVisibleCount(visibleCount);
  }
  getCategoryChildren(categoryId: number) {
    return this.categoriesService.getCategoryChildren(categoryId);
  }

  onCategoryHover(categoryId: number): void {
    this.hoveredCategoryId.set(categoryId);
  }

  onCategoryLeave(): void {
    this.hoveredCategoryId.set(null);
  }

  onMoreHover(): void {
    this.isCategoriesMenuOpen.set(true);
  }

  onMoreLeave(): void {
    this.isCategoriesMenuOpen.set(false);
  }



  toggleMenu(): void {
    this.isMenuOpen.update(state => !state);
    this.isCategoriesMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openLoginModal(): void {
    this.isLoginModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isLoginModalOpen.set(false);
  }

  toggleUserMenu(): void {
    if (this.connected()) {
      this.isUserMenuOpen.update(state => !state);
    } else {
      this.openLoginModal();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const userMenuContainer = this.elementRef.nativeElement.querySelector('.user-menu-wrapper');
    if (userMenuContainer && !userMenuContainer.contains(target)) {
      this.isUserMenuOpen.set(false);
    }
  }

  logout(): void {
    this.connected.set(false);
    this.isUserMenuOpen.set(false);
    this.snackbarService.error('Vous avez été déconnecté');
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  toggleSearch(): void {
    this.isSearchOpen.update(state => !state);
  }

  navigateToCategory(categoryId: number, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/browse'], { queryParams: { category: categoryId } });
    this.isMenuOpen.set(false);
  }
}
