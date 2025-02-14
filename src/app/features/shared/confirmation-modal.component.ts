import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    template: `
      <div class="modal-header">
        <h5 class="modal-title">{{ title }}</h5>
        <button type="button" class="btn-close" (click)="dismiss()"></button>
      </div>
      <div class="modal-body text-center">
        <i class="fad fa-exclamation-triangle fa-5x fa_custom  mb-10 ml-auto mr-auto" aria-hidden="true" style="color: orange; font-size: 80px;"> </i>
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" (click)="dismiss()">Cancelar</button>
        <button type="button" class="btn btn-primary" (click)="confirm()">Confirmar</button>
      </div>
    `
  })
  export class ConfirmationModalComponent {
    @Input() title = 'Confirmar acción';
    @Input() message = '¿Estás seguro?';
  
    constructor(public activeModal: NgbActiveModal) {}
  
    confirm() {
      this.activeModal.close(true);
    }
  
    dismiss() {
      this.activeModal.dismiss();
    }
  }