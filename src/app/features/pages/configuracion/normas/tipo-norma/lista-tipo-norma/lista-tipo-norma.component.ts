import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { TipoNorma } from 'src/app/core/model/tipoNorma.model';
import { EdicionTipoNormaComponent } from '../edicion-tipo-norma/edicion-tipo-norma.component';
import { TipoNormaService } from 'src/app/core/data-access/configuracion/tipo-norma.service';

@Component({
  selector: 'app-lista-tipo-norma',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-tipo-norma.component.html',
  styles: []
})
export default class ListaTipoNormaComponent implements OnInit, AfterViewInit, OnDestroy {
  tipoNormaService = inject(TipoNormaService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  tipoNorma: TipoNorma[] = [];
  loading = true; 
  listadoTipoNorma: any;

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
    this.getListaTipoNorma(); 
  }

  getListaTipoNorma() {
    this.loading = true;
    this.tipoNormaService.getListaTipoNorma().subscribe({
      next: (data) => {  
       this.listadoTipoNorma = data; 
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

  async editar(tipoNorma?: TipoNorma) { 
    const modalRef = this.modalService.open(EdicionTipoNormaComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.tipoNorma = tipoNorma;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.tipoNormaService.getListaTipoNorma().subscribe({
      next: (data) => {  
       this.listadoTipoNorma = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Tipo de Norma?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.tipoNormaService.deleteTipoNorma(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Tipo de Norma eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Tipo de Norma: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
