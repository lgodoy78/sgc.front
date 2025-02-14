import { Injectable } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  showSuccess(message: string) {
    this.toasts.push({
      type: 'success',
      message,
      classname: 'bg-success text-light custom-toast',
      icon: 'fa-solid fa-circle-check' // Icono de éxito
    });
  }

  showError(message: string) {
    this.toasts.push({
      type: 'danger',
      message,
      classname: 'bg-danger text-light custom-toast',
      icon: 'fa-solid fa-triangle-exclamation' // Icono de error
    });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}