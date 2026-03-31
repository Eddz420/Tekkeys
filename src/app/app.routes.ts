import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddressesComponent } from './pages/addresses/addresses.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { TermsComponent } from './pages/terms/terms.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'browse',
        component: BrowseComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      },
      {
        path: 'cart',
        component: CartComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'addresses',
        component: AddressesComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'confidentialite',
        component: PrivacyComponent
      },
      {
        path: 'conditions',
        component: TermsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
