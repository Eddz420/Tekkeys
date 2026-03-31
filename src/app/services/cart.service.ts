import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private cartItems = signal<CartItem[]>([]);

  items = computed(() => this.cartItems());
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));
  subtotal = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));
  tax = computed(() => this.subtotal() * 0.1);
  shipping = computed(() => this.cartItems().length > 0 ? 10 : 0);
  total = computed(() => this.subtotal() + this.tax() + this.shipping());

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        this.cartItems.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const current = this.cartItems();
    const existingIndex = current.findIndex(i => i.id === item.id);

    if (existingIndex >= 0) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
      this.cartItems.set(updated);
      this.snackbarService.success('Quantité mise à jour dans le panier', 3000, {
        label: 'Voir',
        callback: () => this.router.navigate(['/cart'])
      });
    } else {
      this.cartItems.set([...current, { ...item, quantity }]);
      this.snackbarService.success('Produit ajouté au panier', 3000, {
        label: 'Voir',
        callback: () => this.router.navigate(['/cart'])
      });
    }

    this.saveCart();
  }

  removeItem(id: string) {
    this.cartItems.set(this.cartItems().filter(item => item.id !== id));
    this.saveCart();
    this.snackbarService.error('Produit retiré du panier');
  }

  updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }

    const updated = this.cartItems().map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    this.cartItems.set(updated);
    this.saveCart();
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCart();
  }
}
