import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 0;

  public readonly toasts$ = this.toasts.asReadonly();

  public show(type: Toast['type'], title: string, message: string, duration: number = 5000) {
    const toast: Toast = {
      id: this.nextId++,
      type,
      title,
      message,
      duration,
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  public success(title: string, message: string, duration?: number) {
    this.show('success', title, message, duration);
  }

  public error(title: string, message: string, duration?: number) {
    this.show('error', title, message, duration);
  }

  public warning(title: string, message: string, duration?: number) {
    this.show('warning', title, message, duration);
  }

  public info(title: string, message: string, duration?: number) {
    this.show('info', title, message, duration);
  }

  public remove(id: number) {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  public clear() {
    this.toasts.set([]);
  }
}
