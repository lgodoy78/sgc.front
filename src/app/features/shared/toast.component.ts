import { Component } from "@angular/core";
import { ToastService } from "src/app/core/services/toast.service"; 
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
 
  @Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule, NgbToast],
    template: `
      <div class="toast-container position-fixed top-0 end-0 p-3">
        <ngb-toast *ngFor="let toast of toastService.toasts" 
          [class]="toast.classname" 
          [autohide]="true" 
          [delay]="5000"
          (hidden)="toastService.remove(toast)">
          <div class="d-flex align-items-center">
            <i class="fas {{ toast.icon }} me-2 fs-2"></i>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </ngb-toast>
      </div>
    `,
    styles: [`
      .custom-toast {
        min-width: 300px;
        max-width: 350px;
        font-size: 0.9rem;
        padding: 0.75rem 1rem;
        border-radius: 8px;
      }
      
      .toast-message {
        flex: 1;
        word-break: break-word;
      }
      
      .fas {
        min-width: 24px;
        color:white;
      }
    `]
  })
  export default class ToastComponent {
    constructor(public toastService: ToastService) {}
  }