import { Injectable, signal } from '@angular/core';

export interface SnackbarAction {
  label: string;
  callback: () => void;
}

export interface SnackbarMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  action?: SnackbarAction;
}

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  messages = signal<SnackbarMessage[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000, action?: SnackbarAction) {
    const id = this.nextId++;
    const snackbar: SnackbarMessage = { id, message, type, action };

    this.messages.update(msgs => [...msgs, snackbar]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.messages.update(msgs => msgs.filter(msg => msg.id !== id));
  }

  success(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'success', duration, action);
  }

  error(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'error', duration, action);
  }

  info(message: string, duration?: number, action?: SnackbarAction) {
    this.show(message, 'info', duration, action);
  }
}
