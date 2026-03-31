import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  categoriesService = inject(CategoriesService);
  categories = this.categoriesService.topLevelCategories;
  private animationFrameId: number | null = null;

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    if (this.animationFrameId !== null) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      const parallaxX = ((x - centerX) / centerX) * 10;
      const parallaxY = ((y - centerY) / centerY) * 10;

      card.style.setProperty('--rotate-x', `${rotateX}deg`);
      card.style.setProperty('--rotate-y', `${rotateY}deg`);
      card.style.setProperty('--parallax-x', `${parallaxX}px`);
      card.style.setProperty('--parallax-y', `${parallaxY}px`);

      this.animationFrameId = null;
    });
  }

  onMouseLeave(card: HTMLElement) {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--parallax-x', '0px');
    card.style.setProperty('--parallax-y', '0px');
  }
}
