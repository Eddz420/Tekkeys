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
      price: p.salePrice || p.price,
      originalPrice: p.salePrice ? p.price : undefined,
      image: p.image,
      badge: p.salePrice ? 'Sale' : p.featured ? 'Featured' : undefined,
      rating: p.rating || 4.5
    }));
  });

  oldProducts = [
    {
      id: 1,
      name: 'Minimalist Watch',
      category: 'Accessories',
      price: 299,
      originalPrice: 399,
      image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=600',
      badge: 'Sale',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Leather Handbag',
      category: 'Bags',
      price: 189,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      badge: 'New',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Premium Sunglasses',
      category: 'Eyewear',
      price: 149,
      image: 'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Designer Sneakers',
      category: 'Footwear',
      price: 229,
      originalPrice: 279,
      image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
      badge: 'Sale',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Wool Scarf',
      category: 'Accessories',
      price: 79,
      image: 'https://images.pexels.com/photos/1050641/pexels-photo-1050641.jpeg?auto=compress&cs=tinysrgb&w=600',
      rating: 4.5
    },
    {
      id: 6,
      name: 'Classic Belt',
      category: 'Accessories',
      price: 89,
      image: 'https://images.pexels.com/photos/1294220/pexels-photo-1294220.jpeg?auto=compress&cs=tinysrgb&w=600',
      badge: 'Trending',
      rating: 4.8
    }
  ];

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
