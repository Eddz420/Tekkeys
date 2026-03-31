import { Component } from '@angular/core';
import { FeaturedProductsComponent } from '../../components/featured-products/featured-products.component';
import { CategoriesComponent } from '../../components/categories/categories.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FeaturedProductsComponent,
    CategoriesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
