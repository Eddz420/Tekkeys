import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AppConfig, APP_CONFIG } from './config';
import { AuthenticationOdooService } from './auth.service';

export interface OrderRecord {
  id: number;
  name: string;
  date_order: string;
  amount_total: number;
  state: string;
  partner_id: {
    id: number;
    display_name: string;
  };
  user_id: {
    id: number;
    display_name: string;
  };
  currency_id: {
    id: number;
  };
}

export interface OrdersResponse {
  jsonrpc: string;
  id: number;
  result: {
    length: number;
    records: OrderRecord[];
  };
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private config = inject<AppConfig>(APP_CONFIG);
  private authService = inject(AuthenticationOdooService);

  private url = this.config.apiEndpoint;

  getMyOrders(): Observable<OrderRecord[]> {
    return this.authService.getSessionInfo().pipe(
      switchMap(session => {
            if (!session || typeof session.uid !== 'number') {
          return of([]);
        }

        const userId = session.uid;

        const payload = {
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'sale.order',
            method: 'web_search_read',
            args: [],
            kwargs: {
              domain: [['user_id', '=', userId]],
              limit: 80,
              offset: 0,
              order: 'date_order desc',
              count_limit: 10001,
              context: {
                lang: session.user_context?.lang ?? 'fr_FR',
                tz: session.user_context?.tz ?? 'Africa/Algiers',
                user_id: userId,
                allowed_company_ids: [session.user_companies?.current_company ?? 1],
                bin_size: true
              },
              specification: {
                name: {},
                date_order: {},
                amount_total: {},
                state: {},
                partner_id: { fields: { display_name: {} } },
                user_id: { fields: { display_name: {} } },
                currency_id: { fields: {} }
              }
            }
          },
          id: Date.now()
        };

        return this.http
          .post<OrdersResponse>(`${this.url}/api/call_kw/sale.order/web_search_read`, payload, { withCredentials: true })
          .pipe(
            map(response => response?.result?.records ?? []),
            catchError(() => of([]))
          );
      }),
      catchError(() => of([]))
    );
  }
}