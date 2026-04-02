import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, OrderRecord } from '../../services/orders.service';

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
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);

  loading = signal(false);
  selectedOrder = signal<Order | null>(null);

  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.ordersService.getMyOrders().subscribe({
      next: (records) => {
        const mappedOrders = records.map(record => this.mapRecordToOrder(record));
        this.orders.set(mappedOrders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        // Handle error, maybe show a message
      }
    });
  }

  private mapRecordToOrder(record: OrderRecord): Order {
    return {
      id: record.id.toString(),
      order_number: record.name,
      date: record.date_order,
      status: this.mapStateToStatus(record.state),
      items: [], // No items in this API response
      total: record.amount_total,
      shipping_address: '' // Not provided
    };
  }

  private mapStateToStatus(state: string): Order['status'] {
    switch (state) {
      case 'draft':
        return 'pending';
      case 'sent':
        return 'processing';
      case 'sale':
        return 'shipped';
      case 'done':
        return 'delivered';
      case 'cancel':
        return 'cancelled';
      default:
        return 'pending';
    }
  }

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
