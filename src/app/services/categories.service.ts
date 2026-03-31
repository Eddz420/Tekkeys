import { Injectable, signal, computed } from '@angular/core';

export interface Category {
  id: number;
  name: string;
  active: boolean;
  parentId?: number;
  description?: string;
  image?: string;
  productCount?: number;
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Computers",
    active: true,
    description: "Complete desktop and laptop systems",
    image: "https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    productCount: 487
  },

  { id: 2, name: "Laptops", active: true, parentId: 1 },
  { id: 3, name: "Desktop PCs", active: true, parentId: 1 },
  { id: 4, name: "All-in-One PCs", active: true, parentId: 1 },

  {
    id: 5,
    name: "Computer Components",
    active: true,
    description: "Build your dream PC",
    image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
    productCount: 1243
  },
  { id: 6, name: "Processors (CPU)", active: true },
  { id: 7, name: "Graphics Cards (GPU)", active: true },
  { id: 8, name: "Motherboards", active: true, parentId: 5 },
  { id: 9, name: "RAM (Memory)", active: true, parentId: 5 },
  { id: 10, name: "Storage (SSD / HDD)", active: true, parentId: 5 },
  { id: 11, name: "Power Supplies", active: true, parentId: 5 },
  { id: 12, name: "PC Cases", active: true, parentId: 5 },
  { id: 13, name: "Cooling Systems", active: true, parentId: 5 },

  {
    id: 14,
    name: "Peripherals",
    active: true,
    description: "Enhance your setup",
    image: "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800",
    productCount: 892
  },
  { id: 15, name: "Monitors", active: true, parentId: 14 },
  { id: 16, name: "Keyboards", active: true, parentId: 14 },
  { id: 17, name: "Mice", active: true, parentId: 14 },
  { id: 18, name: "Headsets", active: true, parentId: 14 },
  { id: 19, name: "Webcams", active: true, parentId: 14 },
  { id: 20, name: "Speakers", active: true, parentId: 14 },

  {
    id: 21,
    name: "Networking",
    active: true,
    description: "Stay connected",
    image: "https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=800",
    productCount: 324
  },
  { id: 22, name: "Routers", active: true, parentId: 21 },
  { id: 23, name: "Switches", active: true, parentId: 21 },
  { id: 24, name: "Network Cards", active: true, parentId: 21 },
  { id: 25, name: "WiFi Adapters", active: true, parentId: 21 },
  { id: 26, name: "Modems", active: true, parentId: 21 },
  { id: 27, name: "Ethernet Cables", active: true, parentId: 21 },
];

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  visibleCategoryCount = signal<number>(5);

  categories = signal<Category[]>(CATEGORIES);

  topLevelCategories = computed(() =>
    this.categories().filter(cat => !cat.parentId && cat.active)
  );

  visibleCategories = computed(() =>
    this.topLevelCategories().slice(0, this.visibleCategoryCount())
  );

  moreCategories = computed(() =>
    this.topLevelCategories().slice(this.visibleCategoryCount())
  );

  hasMoreCategories = computed(() =>
    this.moreCategories().length > 0
  );

  setVisibleCount(count: number): void {
    this.visibleCategoryCount.set(count);
  }

  getAllCategories(): Category[] {
    return this.categories();
  }

  getTopLevelCategories(): Category[] {
    return this.topLevelCategories();
  }

  getCategoryChildren(parentId: number): Category[] {
    return this.categories().filter(cat => cat.parentId === parentId && cat.active);
  }
}
