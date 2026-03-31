import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Address {
  id?: string;
  user_id?: string;
  label: string;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses = signal<Address[]>([]);
  loading = signal(false);

  constructor() {

  }

  async loadAddresses(): Promise<void> {

  }

  async addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {

  }

  async updateAddress(id: string, updates: Partial<Address>){

  }

  async deleteAddress(id: string){

  }

  async setDefaultAddress(id: string) {
    return this.updateAddress(id, { is_default: true });
  }

  getDefaultAddress(): Address | undefined {
    return this.addresses().find(addr => addr.is_default);
  }
}
