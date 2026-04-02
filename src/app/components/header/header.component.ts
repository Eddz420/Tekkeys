import { Component, inject, signal, HostListener, ElementRef, AfterViewInit, OnDestroy, OnInit, effect, Query } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { ConfigService } from '../../services/config.service';
import { CategoriesService } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthenticationOdooService } from '../../services/auth.service';
import { debounce, debounceTime, of, Subscription, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LoginModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit, OnInit, OnDestroy {
  themeService = inject(ThemeService);
  configService = inject(ConfigService);
  categoriesService = inject(CategoriesService);
  productService = inject(ProductsService);
  cartService = inject(CartService);
  elementRef = inject(ElementRef);
  router = inject(Router);
  snackbarService = inject(SnackbarService);
  private authService = inject(AuthenticationOdooService);
  private authSubscription?: Subscription;
  
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
  searchQuery = signal('');
  searchProductResults : any = null
  searchCategoriesResults : any = null
  searchResults : any = null
  private resizeObserver!: ResizeObserver;
  private resizeTimeout: any;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled.set(window.scrollY > 50);
      });
    }

    // ✅ React to signal changes properly
    effect(() => {
      const categories = this.categoriesService.visibleCategories();
      console.log("cat effect");

      if (!categories || categories.length === 0) return;

      requestAnimationFrame(() => this.calculateVisibleCategories());
    });

    effect(() => {
      const query = this.searchQuery();
      console.log('Search query changed:', query);
      if(query.length>=2){
        this.searchFunction(query);        
      }
    });
  }
  searchFunction(query: string) {
    const lowerQuery = query.toLowerCase();

    // 1️⃣ All categories
    const allCategories = this.categoriesService.categoriesSignal();

    // 2️⃣ Find categories that match the query
    const matchedCategories = allCategories
      .filter(cat => cat.name?.toLowerCase().includes(lowerQuery))
      .sort((a, b) => (b.name?.toLowerCase().indexOf(lowerQuery) ?? 0) -
                      (a.name?.toLowerCase().indexOf(lowerQuery) ?? 0));
    console.log(matchedCategories);
    
    // 3️⃣ Fetch products
    this.productService.getByFilter({ query }, []).subscribe((response: any) => {
      const products: any[] = response.result.records;
      console.log("Number of products ",products.length);
      
      // 4️⃣ Group products by category
      const productsByCategory: Map<number, any[]> = new Map();
      products.forEach(p => {
        if (!productsByCategory.has(p.categ_id.id)) {
          productsByCategory.set(p.categ_id.id, []);
        }
        productsByCategory.get(p.categ_id.id)!.push(p);
      });

      // 5️⃣ Build final grouped search result
      const groupedResults: any[] = [];

      // First, add matched categories if they have products
      matchedCategories.forEach(cat => {
        const prods = productsByCategory.get(cat.id) || [];
        if (prods.length) {
          groupedResults.push({ category: cat, products: prods });
          productsByCategory.delete(cat.id); // remove from map
        }
      });

      // Then, add remaining categories that have products (even if category didn't match)
      productsByCategory.forEach((prods, catId) => {
        const cat = allCategories.find(c => c.id === catId);
        if (cat) {
          groupedResults.push({ category: cat, products: prods });
        }
      });

      this.searchResults = groupedResults;
      console.log(this.searchResults);
      
    });
  }

  ngOnInit(): void {
    this.authService.checkSession().subscribe();

    this.authSubscription = this.authService.isAuthenticated$.subscribe(isConnected => {
      this.connected.set(isConnected);
    });
  
    
  }

  ngAfterViewInit(): void {
    const nav = this.elementRef.nativeElement.querySelector('.nav');
    if (!nav) return;

    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.calculateVisibleCategories();
      }, 100);
    });

    this.resizeObserver.observe(nav);

    // ✅ wait for full render (no more wrong widths)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.calculateVisibleCategories();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private calculateVisibleCategories(): void {
    const nav = this.elementRef.nativeElement.querySelector('.nav');
    if (!nav) return;

    const navWidth = nav.offsetWidth;
    const mainMenuItems = this.configService.config()?.navigation?.mainMenu || [];
    const topLevelCount = this.categoriesService.getTopLevelCategories().length;

    // Get actual widths of main menu items
    const mainMenuLinks = Array.from(nav.querySelectorAll('.nav-link:not(.more-link)'));
    const mainMenuActualWidth: number = mainMenuLinks
      .slice(0, mainMenuItems.length)
      .reduce((sum: number, el) => sum + (el as HTMLElement).offsetWidth, 0);

    const gapWidth = 32; // $spacing-lg
    const totalGaps = mainMenuItems.length > 0 ? mainMenuItems.length * gapWidth : 0;
    const moreButtonWidth = 80;
    const buffer = 60;

    // Available width for categories
    const availableForCategories = navWidth - mainMenuActualWidth - totalGaps - buffer;

    // Estimate category item width
    const estimatedCategoryWidth = 120;

    // Check if all categories fit without "More" button
    const allCategoriesWidth = topLevelCount * estimatedCategoryWidth + (topLevelCount - 1) * gapWidth;

    if (availableForCategories >= allCategoriesWidth) {
      // All categories fit
      this.categoriesService.setVisibleCount(topLevelCount);
    } else {
      // Need "More" button - calculate how many fit
      const availableWithMore = availableForCategories - moreButtonWidth;
      const maxCategories = Math.floor(availableWithMore / (estimatedCategoryWidth + gapWidth));
      const visibleCount = Math.max(0, Math.min(maxCategories, topLevelCount - 1));

      this.categoriesService.setVisibleCount(visibleCount);
    }
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
