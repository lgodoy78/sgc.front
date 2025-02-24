import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DataTablesModule, DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CargoService } from 'src/app/core/data-access/configuracion/cargo.service'; 
import { ToastService } from 'src/app/core/services/toast.service'; 
import { ModalTypeService } from 'src/app/core/services/modal-type.service'
import { Cargo } from 'src/app/core/model/cargo.model'; 
import EdicionCargoComponent from '../edicion-cargo/edicion-cargo.component';

@Component({
  selector: 'app-lista-cargo',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-cargo.component.html',
  styles: []
})
export default class ListaCargoComponent implements OnInit, AfterViewInit, OnDestroy {
  cargoService = inject(CargoService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  cargos: Cargo[] = [];
  loading = true; 
  listadoCargo: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 0, width: '150px'},
        {targets: 5, width: '150px', orderable: false},
      ],
      responsive: true
    };
  }

  ngAfterViewInit() { 
    this.getListaCargos(); 
  }

  getListaCargos() {
    this.loading = true;
    this.cargoService.getListaCargos().subscribe({
      next: (data) => {  
       this.listadoCargo = data; 
      },
      error: (e) => {
        this.loading = false; 
        this.toastService.showError('Error al cargar los cargos: ' + e.error.mensaje);
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => {
          this.dtTrigger.next(this.dtOptions);
         }, 1);
      }
    });
  }

  async editar(cargo?: Cargo) { 
    const modalRef = this.modalService.open(EdicionCargoComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.cargo = cargo;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }

  async eliminar(id: number) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este cargo?')
  
    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.cargoService.deleteCargo(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Cargo eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar cargo: ' + e.error.mensaje),
      });
    }
  }

  actualizarTabla() {
    this.cargoService.getListaCargos().subscribe({
      next: (data) => {  
       this.listadoCargo = data; 
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
