import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
}

@Component({
  selector: 'app-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  cartService = inject(CartService);
  productsService = inject(ProductsService);

  products = computed(() => {
    return this.productsService.featuredProducts().map(p => ({
      id: p.id,
      name: p.name,
      category: 'Tech',
      price: p.price_original,
      originalPrice: undefined,
      image: p.image_url,
      badge: 'Featured',
      rating: 4.5
    }));
  });


  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  hasDiscount(product: Product): boolean {
    return !!product.originalPrice && product.originalPrice > product.price;
  }

  getDiscountPercent(product: Product): number {
    if (!product.originalPrice) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  }

  addToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();

    this.cartService.addItem({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  }
}
