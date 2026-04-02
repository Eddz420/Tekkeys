import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppConfig, APP_CONFIG } from './config';
import { AuthenticationOdooService } from './auth.service';

export interface Category {
  id: number;
  display_name?:string;
  image?:string;
  name?:string;
  parent_id:any;
  productCount?: number; // Optionnel, à remplir si l'API le fournit
  description?: string; // Optionnel, à remplir si l'API le fournit
}


const CATEGORIES: Category[] = []

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private url = `${this.config.apiEndpoint}/api/call_kw/product.category`;

  readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  public readonly categories = this.categoriesSubject.asObservable();

  // Signal-based API for backward compatibility with components
  public categoriesSignal = signal<Category[]>(CATEGORIES);
  visibleCategoryCount = signal<number>(5);

  topLevelCategories = computed(() =>
    this.categoriesSignal().filter(cat => !cat.parent_id)
  );

  visibleCategories = computed(() =>
    this.topLevelCategories().slice(0, this.visibleCategoryCount())
  );

  moreCategories = computed(() =>
    this.topLevelCategories().slice(this.visibleCategoryCount())
  );

  hasMoreCategories = computed(() => this.moreCategories().length > 0);

  constructor() {
    this.getAllActivated().subscribe((response: Category[]) => {
      
      if (response) {

        this.categoriesSubject.next(response);
        
        this.categoriesSignal.set(response);
        console.log(this.categoriesSignal().filter(cat => true));
      }
    });
  }

  private mapOdooCategory(record: any): Category {
    return {
      id: record.id,
      name: record.name,
      parent_id: record.parent_id ? record.parent_id : undefined,
      image: record.image_1920 ? `data:image/png;base64,${record.image_1920}` : undefined,
      display_name: record.display_name,};
  }

  public getAllActivated(): Observable<Category[]> {
    this.categoriesSubject.next([]);

    const url = `${this.url}/web_search_read`;
    
    const payload = {

      params: {
        model: 'product.category',
        method: 'web_search_read',
        args: [],
        kwargs: {
          domain: [],
          specification: {

            display_name: {},
            image: {},
            name: {},
            parent_id: {},
          }
          
        },
      },
    };

    return this.http.post<{ result: { records: any[] } }>(url, payload, { withCredentials: true }).pipe(
      map((response: any) => {
        console.log(response);
        
        if (response?.result?.records) {
          return response.result.records.map((record: any) => this.mapOdooCategory(record));
        } else {
          return CATEGORIES;
        }
      }),
      catchError(() => {
        return of(CATEGORIES);
      })
    );
  }

  public getPopular(): Observable<Category[]> {
    const url = `${this.url}/popular`;
    return this.http.get<Category[]>(url).pipe(
      catchError(() => of(CATEGORIES))
    );
  }

  public getByConfigurationId(configurationId: number): Observable<Category> {
    const url = `${this.url}/configuration-category/${configurationId}`;
    return this.http.get<Category>(url).pipe(
      catchError(() => of(CATEGORIES[0]))
    );
  }

  public getAllCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  public getTopLevelCategories(): Category[] {
    return this.getAllCategories().filter(cat => !cat.parent_id);
  }

  public getCategoryChildren(parentId: number): Category[] {
    return this.getAllCategories().filter(cat => cat.parent_id === parentId);
  }

  public setVisibleCount(count: number): void {
    this.visibleCategoryCount.set(count);
  }


}
