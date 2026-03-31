import { Injectable, signal, computed } from '@angular/core';

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

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Keychron Q1 Pro",
    description: "Premium 75% wireless mechanical keyboard with hot-swappable switches and RGB",
    price: 189.99,
    image: "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 16,
    stock: 45,
    featured: true,
    rating: 4.8,
    reviewCount: 234
  },
  {
    id: 2,
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with ultra-precise 8K DPI sensor and MagSpeed scroll",
    price: 99.99,
    salePrice: 79.99,
    image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 17,
    stock: 120,
    featured: true,
    rating: 4.9,
    reviewCount: 567
  },
  {
    id: 3,
    name: "AMD Ryzen 9 7950X",
    description: "16-core, 32-thread desktop processor with 5.7 GHz boost clock",
    price: 549.99,
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 6,
    stock: 28,
    featured: true,
    rating: 4.7,
    reviewCount: 189
  },
  {
    id: 4,
    name: "NVIDIA RTX 4080",
    description: "High-performance graphics card with 16GB GDDR6X memory",
    price: 1199.99,
    image: "https://images.pexels.com/photos/1662159/pexels-photo-1662159.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 7,
    stock: 12,
    featured: true,
    rating: 4.9,
    reviewCount: 432
  },
  {
    id: 5,
    name: "LG 27\" 4K Monitor",
    description: "27-inch UHD display with HDR10 and USB-C connectivity",
    price: 449.99,
    salePrice: 399.99,
    image: "https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 15,
    stock: 67,
    featured: true,
    rating: 4.6,
    reviewCount: 321
  },
  {
    id: 6,
    name: "Corsair Vengeance RGB 32GB",
    description: "DDR5 RAM kit (2x16GB) 6000MHz with RGB lighting",
    price: 159.99,
    image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 9,
    stock: 89,
    rating: 4.7,
    reviewCount: 278
  },
  {
    id: 7,
    name: "Samsung 990 Pro 2TB",
    description: "PCIe 4.0 NVMe M.2 SSD with 7,450 MB/s read speeds",
    price: 179.99,
    salePrice: 149.99,
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 10,
    stock: 156,
    rating: 4.8,
    reviewCount: 512
  },
  {
    id: 8,
    name: "ASUS ROG Strix B650",
    description: "AMD B650 ATX motherboard with PCIe 5.0 and WiFi 6E",
    price: 289.99,
    image: "https://images.pexels.com/photos/2582938/pexels-photo-2582938.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 8,
    stock: 34,
    rating: 4.6,
    reviewCount: 145
  },
  {
    id: 9,
    name: "NZXT H7 Flow",
    description: "Mid-tower ATX case with high airflow mesh panels",
    price: 129.99,
    image: "https://images.pexels.com/photos/2582930/pexels-photo-2582930.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 12,
    stock: 45,
    rating: 4.5,
    reviewCount: 98
  },
  {
    id: 10,
    name: "Corsair RM850x",
    description: "850W 80+ Gold fully modular power supply",
    price: 139.99,
    image: "https://images.pexels.com/photos/163100/circuit-board-print-plate-via-contact-163100.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 11,
    stock: 78,
    rating: 4.8,
    reviewCount: 267
  },
  {
    id: 11,
    name: "Razer BlackShark V2 Pro",
    description: "Wireless gaming headset with THX Spatial Audio",
    price: 179.99,
    salePrice: 149.99,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 18,
    stock: 92,
    rating: 4.7,
    reviewCount: 423
  },
  {
    id: 12,
    name: "TP-Link WiFi 6E Router",
    description: "AXE5400 tri-band wireless router with advanced security",
    price: 249.99,
    image: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 22,
    stock: 56,
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: 13,
    name: "Dell XPS 15",
    description: "15.6\" laptop with Intel i7, 16GB RAM, 512GB SSD",
    price: 1499.99,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 2,
    stock: 23,
    featured: true,
    rating: 4.8,
    reviewCount: 612
  },
  {
    id: 14,
    name: "Logitech C920 HD Pro",
    description: "1080p webcam with auto-focus and dual stereo mics",
    price: 79.99,
    image: "https://images.pexels.com/photos/4009409/pexels-photo-4009409.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 19,
    stock: 134,
    rating: 4.5,
    reviewCount: 891
  },
  {
    id: 15,
    name: "Ducky One 3 Matcha",
    description: "Full-size mechanical keyboard with Cherry MX switches",
    price: 129.99,
    image: "https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 16,
    stock: 67,
    rating: 4.9,
    reviewCount: 345
  },
  {
    id: 16,
    name: "Arctic Liquid Freezer II",
    description: "280mm AIO CPU cooler with dual 140mm fans",
    price: 119.99,
    salePrice: 99.99,
    image: "https://images.pexels.com/photos/3825517/pexels-photo-3825517.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 13,
    stock: 41,
    rating: 4.7,
    reviewCount: 234
  },
  {
    id: 17,
    name: "Elgato Stream Deck",
    description: "15-key customizable LCD control pad for content creators",
    price: 149.99,
    image: "https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 14,
    stock: 88,
    rating: 4.8,
    reviewCount: 567
  },
  {
    id: 18,
    name: "Audioengine A2+ Speakers",
    description: "Powered desktop speakers with built-in DAC",
    price: 269.99,
    image: "https://images.pexels.com/photos/1279406/pexels-photo-1279406.jpeg?auto=compress&cs=tinysrgb&w=800",
    categoryId: 20,
    stock: 52,
    rating: 4.6,
    reviewCount: 178
  }
];

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private allProducts = signal<Product[]>(PRODUCTS);
  private selectedCategoryId = signal<number | null>(null);
  private searchQuery = signal<string>('');
  private sortBy = signal<'price-asc' | 'price-desc' | 'name' | 'rating'>('name');
  private priceRange = signal<{ min: number; max: number }>({ min: 0, max: 10000 });

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

  featuredProducts = computed(() =>
    this.allProducts().filter(p => p.featured).slice(0, 8)
  );

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
