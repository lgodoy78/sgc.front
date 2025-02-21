import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { procesos } from 'src/app/core/model/procesos.model';
import { EdicionProcesosComponent } from '../edicion-procesos/edicion-procesos.component';
import { ProcesosService } from 'src/app/core/data-access/configuracion/procesos.service';

@Component({
  selector: 'app-lista-procesos',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-procesos.component.html',
  styles: []
})
export default class ListaProcesosComponent implements OnInit, AfterViewInit, OnDestroy {
  procesosService = inject(ProcesosService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  procesos: procesos[] = [];
  loading = true; 
  listadoProcesos: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 1, width: '200px'},
        {targets: 3, width: '150px',  orderable: false},
      ],
      responsive: true
    };
  }

  ngAfterViewInit() { 
    this.getListaProcesos(); 
  }

  getListaProcesos() {
    this.loading = true;
    this.procesosService.getListaProcesos().subscribe({
      next: (data) => {  
       this.listadoProcesos = data; 
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

  async editar(proceso?: procesos) { 
    const modalRef = this.modalService.open(EdicionProcesosComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.proceso = proceso;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }

  actualizarTabla(){ 
    this.procesosService.getListaProcesos().subscribe({
      next: (data) => {  
       this.listadoProcesos = data; 
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

  async eliminar(proceso: procesos) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este proceso?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      var id = `${proceso.codMacroProceso}-${proceso.codProceso}`;
      this.procesosService.deleteProceso(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Proceso eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar proceso: ' + e.error.mensaje + e.error.detalle),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
