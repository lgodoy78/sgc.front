import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { tipoActividad } from 'src/app/core/model/tipoActividad.model';
import { EdicionTipoActividadComponent } from '../edicion-tipo-actividad/edicion-tipo-actividad.component';
import { TipoActividadService } from 'src/app/core/data-access/configuracion/tipo-actividad.service';

@Component({
  selector: 'app-lista-tipo-actividad',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-tipo-actividad.component.html',
  styles: []
})
export default class ListaTipoActividadComponent implements OnInit, AfterViewInit, OnDestroy {
  tipoActividadService = inject(TipoActividadService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  tipoActividad: tipoActividad[] = [];
  loading = true; 
  listadoTipoActividad: any;

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
    this.getListaTipoActividad(); 
  }

  getListaTipoActividad() {
    this.loading = true;
    this.tipoActividadService.getListaTipoActividad().subscribe({
      next: (data) => {  
       this.listadoTipoActividad = data; 
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

  async editar(tipoActividad?: tipoActividad) { 
    const modalRef = this.modalService.open(EdicionTipoActividadComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.tipoActividad = tipoActividad;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    this.tipoActividadService.getListaTipoActividad().subscribe({
      next: (data) => {  
       this.listadoTipoActividad = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este tipo de actividad?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.tipoActividadService.deleteTipoActividad(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Tipo de actividad eliminada correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar tipo de actividad: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
