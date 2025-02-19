import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="dismiss()"></button>
    </div>
    <div class="modal-body text-center">
      <div *ngIf="modalType === 'success'" class="text-center">
        <i
          class="fad fa-circle-check"
          style="color: #690; font-size: 80px;"
          aria-hidden="true"
        >
        </i>
      </div>
      <div *ngIf="modalType === 'warning'" class="text-center">
        <i
          class="fad fa-exclamation-triangle fa-5x fa_custom  mb-10 ml-auto mr-auto"
          aria-hidden="true"
          style="color: orange; font-size: 80px;"
        >
        </i>
      </div> 
      <div *ngIf="modalType === 'error'" class="text-center">
        <i
          class="fad fa-exclamation-triangle fa-5x fa_custom  mb-10 ml-auto mr-auto"
          aria-hidden="true"
          style="color: red; font-size: 80px;"
        >
        </i>
      </div>
      <div *ngIf="modalType === 'confirm'" class="text-center">
        <i
          class="fad fa-exclamation-triangle fa-5x fa_custom  mb-10 ml-auto mr-auto"
          aria-hidden="true"
          style="color: orange; font-size: 80px;"
        >
        </i>
      </div>
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="dismiss()">
        {{ btnCerrar }}
      </button>
      <button
        *ngIf="modalType == 'confirm'"
        type="button"
        class="btn btn-primary"
        (click)="confirm()"
      >
        Confirmar
      </button>
    </div>
  `,
})
export class ModalComponent {
  public modalType: string = '';
  public title: string = 'Confirmar acción';
  public message: string = '¿Estás seguro?';
  public submensaje: string = '';
  public btnCerrar = 'Cerrar';
  private modalInstance: any;

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  public setModalErrorDefault(modal: any) {
    this.modalType = 'error';
    this.title = 'Error';
    this.message =
      'El servidor se encuentra ocupado, por favor reintente la acción.';
    this.modalInstance = modal;
  }

  setModalErrorMessage(title: string, mensaje: string, modal: any) {
    this.modalType = 'error';
    this.title = title;
    this.message = mensaje;
    this.btnCerrar = 'Cerrar';
    this.modalInstance = modal;
  }
  
  setModalWarningMessage(title: string, mensaje: string, modal: any) {
    this.modalType = 'warning';
    this.title = title;
    this.message = mensaje;
    this.btnCerrar = 'Cerrar';
    this.modalInstance = modal;
  } 

  setModalSuccess(title: string, mensaje: string, modal: any, boton?: string) {
    this.modalType = 'success';
    this.title = title;
    this.message = mensaje;
    this.btnCerrar = boton || 'Cerrar';
    this.modalInstance = modal;
  }

  setModalConfirm(title: string, mensaje: string, modal: any, boton?: string) {
    this.modalType = 'confirm';
    this.title = title;
    this.message = mensaje;
    this.btnCerrar = boton || 'Cancelar';
    this.modalInstance = modal; 
  }
}
