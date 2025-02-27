import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AgrupacionControl } from 'src/app/core/model/agrupacionControl.model';
import { EdicionAgrupacionControlComponent } from '../edicion-agrupacion-control/edicion-agrupacion-control.component';
import { AgrupacionControlService } from 'src/app/core/data-access/configuracion/agrupacion-control.service';

@Component({
  selector: 'app-lista-agrupacion-control',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-agrupacion-control.component.html',
  styles: []
})
export default class ListaAgrupacionControlComponent implements OnInit, AfterViewInit, OnDestroy {
  agrupacionControlService = inject(AgrupacionControlService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  AgrupacionControl: AgrupacionControl[] = [];
  loading = true; 
  listadoAgrupacionControl: any;

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
    this.getListaAgrupacionControl(); 
  }

  getListaAgrupacionControl() {
    this.loading = true;
    this.agrupacionControlService.getListaAgrupacionControl().subscribe({
      next: (data) => {  
       this.listadoAgrupacionControl = data; 
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

  async editar(AgrupacionControl?: AgrupacionControl) { 
    const modalRef = this.modalService.open(EdicionAgrupacionControlComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.AgrupacionControl = AgrupacionControl;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.agrupacionControlService.getListaAgrupacionControl().subscribe({
      next: (data) => {  
       this.listadoAgrupacionControl = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Agrupación de control?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.agrupacionControlService.deleteAgrupacionControl(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Agrupación de control eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Agrupación de control: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
