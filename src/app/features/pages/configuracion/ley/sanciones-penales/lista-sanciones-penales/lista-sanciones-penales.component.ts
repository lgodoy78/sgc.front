import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SancionesPenales } from 'src/app/core/model/sancionesPenales.model';
import { EdicionSancionesPenalesComponent } from '../edicion-sanciones-penales/edicion-sanciones-penales.component';
import { SancionesPenalesService } from 'src/app/core/data-access/configuracion/sanciones-penales.service';

@Component({
  selector: 'app-lista-sanciones-penales',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-sanciones-penales.component.html',
  styles: []
})
export default class ListaSancionesPenalesComponent implements OnInit, AfterViewInit, OnDestroy {
  SancionesPenalesService = inject(SancionesPenalesService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  SancionesPenales: SancionesPenales[] = [];
  loading = true; 
  listadoSancionesPenales: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 5, width: '150px', orderable: false},
      ],
      responsive: true
    };
  }

  ngAfterViewInit() { 
    this.getListaSancionesPenales(); 
  }

  getListaSancionesPenales() {
    this.loading = true;
    this.SancionesPenalesService.getListaSancionesPenales().subscribe({
      next: (data) => {  
       this.listadoSancionesPenales = data; 
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

  async editar(SancionesPenales?: SancionesPenales) { 
    const modalRef = this.modalService.open(EdicionSancionesPenalesComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.SancionesPenales = SancionesPenales;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.SancionesPenalesService.getListaSancionesPenales().subscribe({
      next: (data) => {  
       this.listadoSancionesPenales = data; 
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
   

  async eliminar(id: number) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Sanción Penal?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.SancionesPenalesService.deleteSancionesPenales(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Sanción Penal eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Sanción Penal: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
