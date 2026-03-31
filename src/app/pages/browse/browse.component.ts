import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CategoriesService, Category } from '../../services/categories.service';
import { CartService } from '../../services/cart.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit {
  productsService = inject(ProductsService);
  categoriesService = inject(CategoriesService);
  cartService = inject(CartService);
  configService = inject(ConfigService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  showFilters = false;
  selectedSubcategories = new Set<number>();

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const categoryId = params['category'];
      if (categoryId) {
        this.productsService.setCategory(+categoryId);
      } else {
        this.productsService.setCategory(null);
      }
    });
  }

  getSelectedCategory(): Category | undefined {
    const categoryId = this.productsService.getCurrentFilters().categoryId;
    if (!categoryId) return undefined;
    return this.categoriesService.getAllCategories().find(c => c.id === categoryId);
  }

  getSubcategories(): Category[] {
    const selectedCategory = this.getSelectedCategory();
    if (!selectedCategory) return [];
    return this.categoriesService.getCategoryChildren(selectedCategory.id);
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  selectCategory(categoryId: number | null) {
    if (categoryId) {
      this.router.navigate(['/browse'], { queryParams: { category: categoryId } });
    } else {
      this.router.navigate(['/browse']);
    }
  }

  toggleSubcategory(subcategoryId: number) {
    if (this.selectedSubcategories.has(subcategoryId)) {
      this.selectedSubcategories.delete(subcategoryId);
    } else {
      this.selectedSubcategories.add(subcategoryId);
    }
  }

  setSortBy(sort: 'price-asc' | 'price-desc' | 'name' | 'rating') {
    this.productsService.setSort(sort);
  }

  clearFilters() {
    this.productsService.clearFilters();
    this.selectedSubcategories.clear();
    this.router.navigate(['/browse']);
  }

  addToCart(productId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const product = this.productsService.getProduct(productId);
    if (product) {
      this.cartService.addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image,
        category: 'Tech'
      });
    }
  }

  getDiscountPercentage(price: number, salePrice: number): number {
    return Math.round(((price - salePrice) / price) * 100);
  }
}
