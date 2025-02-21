import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { macroProcesos } from 'src/app/core/model/macroProcesos.model';
import { EdicionMacroProcesosComponent } from '../edicion-macro-procesos/edicion-macro-procesos.component';
import { MacroProcesosService } from 'src/app/core/data-access/configuracion/macro-procesos.service';

@Component({
  selector: 'app-lista-macro-procesos',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-macro-procesos.component.html',
  styles: []
})
export default class ListaMacroProcesosComponent implements OnInit, AfterViewInit, OnDestroy {
  macroProcesosService = inject(MacroProcesosService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  macroProcesos: macroProcesos[] = [];
  loading = true; 
  listadoMacroProcesos: any;

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
    this.getListaMacroProcesos(); 
  }

  getListaMacroProcesos() {
    this.loading = true;
    this.macroProcesosService.getListaMacroProcesos().subscribe({
      next: (data) => {  
       this.listadoMacroProcesos = data; 
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

  async editar(macroProceso?: macroProcesos) { 
    const modalRef = this.modalService.open(EdicionMacroProcesosComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.macroProceso = macroProceso;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.macroProcesosService.getListaMacroProcesos().subscribe({
      next: (data) => {  
       this.listadoMacroProcesos = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este macro proceso?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.macroProcesosService.deleteMacroProceso(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Macro proceso eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar macro proceso: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
