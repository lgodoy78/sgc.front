import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/features/shared/modal.component';

@Injectable({ providedIn: 'root' })
export class ModalTypeService {
  constructor(private ngbModal: NgbModal) {}
 
  openErrorModalMessage(title:string, mensaje: string) {
    const modalRef = this.ngbModal.open(ModalComponent); 
    modalRef.componentInstance.setModalErrorMessage(title, mensaje, modalRef);
  }

  openWarningModalMessage(title:string, mensaje: string) {
    const modalRef = this.ngbModal.open(ModalComponent); 
    modalRef.componentInstance.setModalWarningMessage(title, mensaje, modalRef);
  }

  openSuccessModal(title:string, mensaje: string, boton?: string) {
    const modalRef = this.ngbModal.open(ModalComponent); 
    modalRef.componentInstance.setModalSuccess(title, mensaje, modalRef, boton);
  }

  openConfirmModal(title:string, mensaje: string, boton?: string) : any{
    const modalRef = this.ngbModal.open(ModalComponent); 
    modalRef.componentInstance.setModalConfirm(title, mensaje, modalRef, boton);
    return modalRef;
  }
 
}
