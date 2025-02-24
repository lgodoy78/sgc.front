import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubIdentidad } from 'src/app/core/model/subIdentidad.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service'
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs'; 
import { SubIdentidadService } from 'src/app/core/data-access/configuracion/subidentidad.service';
import EdicionSubIdentidadComponent from '../edicion-subidentidad/edicion-subidentidad.component';

@Component({
  selector: 'app-lista-subidentidad',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-subidentidad.component.html',
  styles: []
})
export default class ListaSubIdentidadComponent implements OnInit, AfterViewInit, OnDestroy {
  subIdentidadService = inject(SubIdentidadService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  subidentidades: SubIdentidad[] = [];
  loading = true; 
  listadoSubIdentidad: any;

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
    this.getListaSubIdentidades(); 
  }

  getListaSubIdentidades() {
    this.loading = true;
    this.subIdentidadService.getListaSubIdentidades().subscribe({
      next: (data) => {  
       this.listadoSubIdentidad = data; 
      },
      error: (e) => {
        this.loading = false; 
        this.toastService.showError('Error al cargar las subidentidades: ' + e.error.mensaje);
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => {
          this.dtTrigger.next(this.dtOptions);
         }, 1);
      }
    });
  }

  async editar(subIdentidad?: SubIdentidad) { 
    const modalRef = this.modalService.open(EdicionSubIdentidadComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.subIdentidad = subIdentidad;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }

  async eliminar(id: number) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar esta subidentidad?')
  
    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.subIdentidadService.deleteSubIdentidad(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('SubIdentidad eliminada correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar subidentidad : ' + e.error.mensaje),
      });
    }
  }

  actualizarTabla() {
    this.subIdentidadService.getListaSubIdentidades().subscribe({
      next: (data) => {  
       this.listadoSubIdentidad = data; 
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
