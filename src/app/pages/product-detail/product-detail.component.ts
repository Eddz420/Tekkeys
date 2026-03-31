import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService, Product } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  selectedImage = signal<string>('');
  quantity = signal<number>(1);

  currentPrice = computed(() => {
    const p = this.product();
    if (!p) return 0;
    return p.salePrice || p.price;
  });

  hasDiscount = computed(() => {
    const p = this.product();
    return p?.salePrice !== undefined;
  });

  discountPercent = computed(() => {
    const p = this.product();
    if (!p || !p.salePrice) return 0;
    return Math.round(((p.price - p.salePrice) / p.price) * 100);
  });

  inStock = computed(() => {
    const p = this.product();
    return p ? p.stock > 0 : false;
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      const foundProduct = this.productsService.getProduct(id);

      if (!foundProduct) {
        this.router.navigate(['/browse']);
        return;
      }

      this.product.set(foundProduct);
      this.selectedImage.set(foundProduct.image);
    });
  }

  incrementQuantity() {
    const p = this.product();
    if (p && this.quantity() < p.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  decrementQuantity() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    this.cartService.addItem({
      id: p.id.toString(),
      name: p.name,
      price: p.salePrice || p.price,
      image: p.image,
      category: 'Tech'
    }, this.quantity());

    this.quantity.set(1);
  }

  changeImage(image: string) {
    this.selectedImage.set(image);
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.round(rating));
  }
}
