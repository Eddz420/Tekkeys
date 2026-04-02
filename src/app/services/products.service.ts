import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig, APP_CONFIG } from './config';
import { toSignal } from '@angular/core/rxjs-interop';
import { FeaturedProduct, createProductTemplateParams, Page } from '../models/generic.models';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  categoryId: number;
  stock: number;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}




const PRODUCTS: Product[] = []
const FEATURED_PRODUCTS: FeaturedProduct[] = [];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  
  private allProducts = signal<Product[]>(PRODUCTS);
  private selectedCategoryId = signal<number | null>(null);
  private searchQuery = signal<string>('');
  private sortBy = signal<'price-asc' | 'price-desc' | 'name' | 'rating'>('name');
  private priceRange = signal<{ min: number; max: number }>({ min: 0, max: 10000 });

  // Featured products - BehaviorSubject for Observable pattern
  readonly featuredProductsSubject = new BehaviorSubject<FeaturedProduct[]>([]);
  public readonly featuredProducts$ = this.featuredProductsSubject.asObservable();
  
  // Signal-based API for backward compatibility
  private featuredProductsSignal = signal<FeaturedProduct[]>(FEATURED_PRODUCTS);
  public readonly featuredProducts = toSignal(this.featuredProducts$, { initialValue: [] });

  products = computed(() => {
    let filtered = this.allProducts();

    if (this.selectedCategoryId()) {
      filtered = filtered.filter(p => p.categoryId === this.selectedCategoryId());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    const range = this.priceRange();
    filtered = filtered.filter(p => {
      const price = p.salePrice || p.price;
      return price >= range.min && price <= range.max;
    });

    const sorted = [...filtered];
    switch (this.sortBy()) {
      case 'price-asc':
        sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return sorted;
  });

  constructor() {
    this.loadFeaturedProducts().subscribe((products: FeaturedProduct[]) => {
      if (products) {
        this.featuredProductsSubject.next(products);
        this.featuredProductsSignal.set(products);
      }
    });
  }

  public loadFeaturedProducts(): Observable<FeaturedProduct[]> {
    this.featuredProductsSubject.next([]);
    const url = `${this.config.apiEndpoint}/wsl/new-products`;
    const payload = { params: {} };
    
    return this.http.post<{ result: FeaturedProduct[] }>(url, payload, { withCredentials: true }).pipe(
      map((response: any) => {
        if (response?.result) {
          return response.result;
        }
        return [];
      })
    );
  }

  public getByFilter(
    filter: {
      id?: number;
      minPrice?: string;
      maxPrice?: string;
      brands?: string[];
      orderBy?: string;
      query?: string;
      inStock?: string;
    },
    selectedCategories : number[]
  ): Observable<any> {
    const domain: any[] = [];
     if (selectedCategories?.length) {
    domain.push(["categ_id", "child_of", selectedCategories[0]]);
  }

  if (filter?.brands?.length) {
    domain.push(["brand_id.id", "in", filter.brands.map(Number)]);
  }

  if (filter?.minPrice) {
    domain.push(["list_price", ">=", Number(filter.minPrice)]);
  }

  if (filter?.maxPrice) {
    domain.push(["list_price", "<=", Number(filter.maxPrice)]);
  }

  if (filter?.query) {
    domain.push("|", "|",["name", "ilike", filter.query],["default_code", "ilike", filter.query], ["barcode", "ilike", filter.query]);
  }
     const params = createProductTemplateParams({
          args : [],
          kwargs: {
            specification: { "categ_id" : {"fields":{"display_name": {}}},"currency_id" : {"fields":{"display_name": {}}},"image_1920":
    {}, "display_name":{}, "default_code":{}, "description": {},"name" :{}, "list_price" :{}, "product_status": {}, "image_512":{}, "brand_id" : {"fields":{"display_name": {}, "id": {}}}},
            context : {"active_id" :selectedCategories[0]},
            domain
          },
          method: "web_search_read"
        });
    const url = `${this.config.apiEndpoint}/api/call_kw/product.template/web_search_read`;
    return this.http.post<Page<any>>(url, { params });
  }
  setCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  setSearch(query: string): void {
    this.searchQuery.set(query);
  }

  setSort(sort: 'price-asc' | 'price-desc' | 'name' | 'rating'): void {
    this.sortBy.set(sort);
  }

  setPriceRange(min: number, max: number): void {
    this.priceRange.set({ min, max });
  }

  getProduct(id: number): Product | undefined {
    return this.allProducts().find(p => p.id === id);
  }

  getCurrentFilters() {
    return {
      categoryId: this.selectedCategoryId(),
      searchQuery: this.searchQuery(),
      sortBy: this.sortBy(),
      priceRange: this.priceRange()
    };
  }

  clearFilters(): void {
    this.selectedCategoryId.set(null);
    this.searchQuery.set('');
    this.sortBy.set('name');
    this.priceRange.set({ min: 0, max: 10000 });
  }
}
