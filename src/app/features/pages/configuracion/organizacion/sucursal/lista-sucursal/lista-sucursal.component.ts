import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SucursalService } from 'src/app/core/data-access/configuracion/sucursal.service';
import { Sucursal } from 'src/app/core/model/sucursal.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { EdicionSucursalComponent } from 'src/app/features/pages/configuracion/organizacion/sucursal/edicion-sucursal/edicion-sucursal.component' 
import { ModalTypeService } from 'src/app/core/services/modal-type.service'
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs'; 

@Component({
  selector: 'app-lista-sucursal',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-sucursal.component.html',
  styles: []
})
export default class ListaSucursalComponent implements OnInit, AfterViewInit, OnDestroy {
  sucursalService = inject(SucursalService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  sucursales: Sucursal[] = [];
  loading = true; 
  listadoSucursal: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 7, orderable: false},
      ],
      responsive:true
    };
  }

  ngAfterViewInit() { 
    this.getListaEmpresas(); 
  }

  getListaEmpresas() {
    this.loading = true;
 
    this.sucursalService.getListaSucursales().subscribe({
      next: (data) => {  
       this.listadoSucursal = data; 
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

  async editar(sucursal?: Sucursal) { 
    const modalRef = this.modalService.open(EdicionSucursalComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.sucursal = sucursal;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
 

  async eliminar(id: string) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar esta sucursal?')
  

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.sucursalService.deleteSucursal(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Sucursal eliminada correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar sucursal : ' + e.error.mensaje	),
      });
    }
  } 



  actualizarTabla(){ 
    
    this.sucursalService.getListaSucursales().subscribe({
      next: (data) => {  
       this.listadoSucursal = data; 
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
   
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

   
}
