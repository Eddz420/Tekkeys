import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="snackbar-container">
      @for (msg of snackbarService.messages(); track msg.id) {
        <div class="snackbar" [class]="'snackbar-' + msg.type">
          <span class="snackbar-message">{{ msg.message }}</span>
          <div class="snackbar-actions">
            @if (msg.action) {
              <button class="snackbar-action" (click)="onAction(msg)">
                {{ msg.action.label }}
              </button>
            }
            <button class="snackbar-close" (click)="snackbarService.remove(msg.id)">✕</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .snackbar-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .snackbar {
      min-width: 300px;
      max-width: 500px;
      padding: 14px 18px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
      font-weight: 500;
    }

    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .snackbar-success {
      background: #10b981;
      color: white;
    }

    .snackbar-error {
      background: #ef4444;
      color: white;
    }

    .snackbar-info {
      background: #3b82f6;
      color: white;
    }

    .snackbar-message {
      flex: 1;
    }

    .snackbar-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .snackbar-action {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 4px;
      transition: background 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .snackbar-action:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .snackbar-close {
      background: none;
      border: none;
      color: inherit;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      opacity: 0.8;
      transition: opacity 0.2s, background 0.2s;
    }

    .snackbar-close:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 640px) {
      .snackbar-container {
        bottom: 16px;
        right: 16px;
        left: 16px;
      }

      .snackbar {
        min-width: auto;
        max-width: none;
      }
    }
  `]
})
export class SnackbarComponent {
  snackbarService = inject(SnackbarService);

  onAction(msg: any) {
    if (msg.action?.callback) {
      msg.action.callback();
      this.snackbarService.remove(msg.id);
    }
  }
}
