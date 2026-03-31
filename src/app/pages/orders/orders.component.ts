import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  order_number: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shipping_address: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  loading = signal(false);
  selectedOrder = signal<Order | null>(null);

  orders = signal<Order[]>([
    {
      id: '1',
      order_number: 'TKK-2024-001',
      date: '2024-03-15',
      status: 'delivered',
      total: 299.99,
      shipping_address: '123 Rue de la Paix, 75001 Paris',
      items: [
        {
          id: '1',
          name: 'Clavier Mécanique RGB',
          quantity: 1,
          price: 149.99,
          image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '2',
          name: 'Souris Gaming Pro',
          quantity: 2,
          price: 75.00,
          image: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ]
    },
    {
      id: '2',
      order_number: 'TKK-2024-002',
      date: '2024-03-20',
      status: 'shipped',
      total: 459.99,
      shipping_address: '123 Rue de la Paix, 75001 Paris',
      items: [
        {
          id: '3',
          name: 'Casque Audio Premium',
          quantity: 1,
          price: 459.99,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ]
    },
    {
      id: '3',
      order_number: 'TKK-2024-003',
      date: '2024-03-25',
      status: 'processing',
      total: 199.99,
      shipping_address: '123 Rue de la Paix, 75001 Paris',
      items: [
        {
          id: '4',
          name: 'Webcam HD 1080p',
          quantity: 1,
          price: 199.99,
          image: 'https://images.pexels.com/photos/4144179/pexels-photo-4144179.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ]
    }
  ]);

  getStatusLabel(status: Order['status']): string {
    const labels = {
      pending: 'En attente',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return labels[status];
  }

  getStatusColor(status: Order['status']): string {
    const colors = {
      pending: 'status-pending',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return colors[status];
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeOrderDetails(): void {
    this.selectedOrder.set(null);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
