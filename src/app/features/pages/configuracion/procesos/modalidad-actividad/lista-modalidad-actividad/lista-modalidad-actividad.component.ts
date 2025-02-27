import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ModalidadActividad } from 'src/app/core/model/modalidadActividad.model';
import { EdicionModalidadActividadComponent } from '../edicion-modalidad-actividad/edicion-modalidad-actividad.component';
import { ModalidadActividadService } from 'src/app/core/data-access/configuracion/modalidad-actividad.service';

@Component({
  selector: 'app-lista-modalidad-actividad',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-modalidad-actividad.component.html',
  styles: []
})
export default class ListaModalidadActividadComponent implements OnInit, AfterViewInit, OnDestroy {
  modalidadActividadService = inject(ModalidadActividadService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  modalidadActividad: ModalidadActividad[] = [];
  loading = true; 
  listadoModalidadActividad: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 2, width: '150px', orderable: false},
      ],
      responsive: true
    };
  }

  ngAfterViewInit() { 
    this.getListaModalidadActividad(); 
  }

  getListaModalidadActividad() {
    this.loading = true;
    this.modalidadActividadService.getListaModalidadActividad().subscribe({
      next: (data) => {  
       this.listadoModalidadActividad = data; 
      },
      error: (e) => {
        this.loading = false; 
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => {
          this.dtTrigger.next(this.dtOptions);
         }, 1);
      }
    });
  }

  async editar(modalidadActividad?: ModalidadActividad) { 
    const modalRef = this.modalService.open(EdicionModalidadActividadComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.modalidadActividad = modalidadActividad;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    this.modalidadActividadService.getListaModalidadActividad().subscribe({
      next: (data) => {  
       this.listadoModalidadActividad = data; 
      },
      complete: () => { 
        this.rerender();
      }
    }); 
  }

  rerender(): void {
    this.dtElement.dtInstance.then(dtInstance => { 
      dtInstance.destroy();  
      this.loading = false;
      setTimeout(() => { 
       this.dtTrigger.next(this.dtOptions); 
     }, 12);
    })
  }

  async eliminar(id: string) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar esta Modalidad de actividad?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.modalidadActividadService.deleteModalidadActividad(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Modalidad de Actividad eliminada correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar tipo de actividad: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
