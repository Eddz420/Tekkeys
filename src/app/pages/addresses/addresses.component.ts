import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { AddressFormComponent } from '../../components/address-form/address-form.component';
import type { Address } from '../../services/address.service';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, AddressFormComponent],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss'
})
export class AddressesComponent implements OnInit {
  addressService = inject(AddressService);
  showAddressForm = signal(false);

  ngOnInit(): void {
    this.addressService.loadAddresses();
  }

  toggleAddressForm(): void {
    this.showAddressForm.update(state => !state);
  }

  async saveAddress(address: Address): Promise<void> {
    await this.addressService.addAddress(address);
    this.showAddressForm.set(false);
  }

  cancelAddressForm(): void {
    this.showAddressForm.set(false);
  }

  async setDefaultAddress(id: string): Promise<void> {
    await this.addressService.setDefaultAddress(id);
  }

  async deleteAddress(id: string): Promise<void> {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      await this.addressService.deleteAddress(id);
    }
  }
}
