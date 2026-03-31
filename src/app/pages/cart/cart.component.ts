import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AddressService, Address } from '../../services/address.service';
import { AddressFormComponent } from '../../components/address-form/address-form.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartService = inject(CartService);
  addressService = inject(AddressService);
  router = inject(Router);

  currentStep = signal<'cart' | 'delivery'>('cart');
  selectedAddress = signal<Address | null>(null);
  showAddressForm = signal(false);

  ngOnInit() {
    this.addressService.loadAddresses();
  }

  updateQuantity(id: string, change: number) {
    const item = this.cartService.items().find(i => i.id === id);
    if (item) {
      this.cartService.updateQuantity(id, item.quantity + change);
    }
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  continueShopping() {
    this.router.navigate(['/']);
  }

  proceedToDelivery() {
    this.currentStep.set('delivery');
    const defaultAddr = this.addressService.getDefaultAddress();
    if (defaultAddr) {
      this.selectedAddress.set(defaultAddr);
    }
  }

  backToCart() {
    this.currentStep.set('cart');
  }

  selectAddress(address: Address) {
    this.selectedAddress.set(address);
  }

  toggleAddressForm() {
    this.showAddressForm.set(!this.showAddressForm());
  }

  async saveAddress(address: Address) {
    await this.addressService.addAddress(address);
    this.showAddressForm.set(false);
  }

  cancelAddressForm() {
    this.showAddressForm.set(false);
  }

  async deleteAddress(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      await this.addressService.deleteAddress(id);
      if (this.selectedAddress()?.id === id) {
        this.selectedAddress.set(null);
      }
    }
  }

  async setDefaultAddress(id: string) {
    await this.addressService.setDefaultAddress(id);
  }

  proceedToPayment() {
    if (!this.selectedAddress()) {
      alert('Veuillez sélectionner une adresse de livraison');
      return;
    }
    alert('Procéder au paiement avec l\'adresse : ' + this.selectedAddress()?.label);
  }
}
