import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  configService = inject(ConfigService);
  categoriesService = inject(CategoriesService);
  currentYear = new Date().getFullYear();

  getTopCategories() {
    return this.categoriesService.getTopLevelCategories().slice(0, 5);
  }
}
