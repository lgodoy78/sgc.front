import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AgrupacionRiesgo } from 'src/app/core/model/agrupacionRiesgo.model';
import { EdicionAgrupacionRiesgoComponent } from '../edicion-agrupacion-riesgo/edicion-agrupacion-riesgo.component';
import { AgrupacionRiesgoService } from 'src/app/core/data-access/configuracion/agrupacion-riesgo.service';

@Component({
  selector: 'app-lista-agrupacion-riesgo',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-agrupacion-riesgo.component.html',
  styles: []
})
export default class ListaAgrupacionRiesgoComponent implements OnInit, AfterViewInit, OnDestroy {
  agrupacionRiesgoService = inject(AgrupacionRiesgoService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  agrupacionRiesgo: AgrupacionRiesgo[] = [];
  loading = true; 
  listadoAgrupacionRiesgo: any;

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
    this.getListaAgrupacionRiesgo(); 
  }

  getListaAgrupacionRiesgo() {
    this.loading = true;
    this.agrupacionRiesgoService.getListaAgrupacionRiesgo().subscribe({
      next: (data) => {  
       this.listadoAgrupacionRiesgo = data; 
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

  async editar(agrupacionRiesgo?: AgrupacionRiesgo) { 
    const modalRef = this.modalService.open(EdicionAgrupacionRiesgoComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.agrupacionRiesgo = agrupacionRiesgo;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.agrupacionRiesgoService.getListaAgrupacionRiesgo().subscribe({
      next: (data) => {  
       this.listadoAgrupacionRiesgo = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Agrupación de riesgo?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.agrupacionRiesgoService.deleteAgrupacionRiesgo(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Agrupación de riesgo eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Agrupación de riesgo: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
