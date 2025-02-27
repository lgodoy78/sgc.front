import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import { GrupoDelito } from 'src/app/core/model/grupoDelito.model';
import { EdicionGrupoDelitoComponent } from '../edicion-grupo-delito/edicion-grupo-delito.component';
import { GrupoDelitoService } from 'src/app/core/data-access/configuracion/grupo-delito.service';

@Component({
  selector: 'app-lista-grupo-delito',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-grupo-delito.component.html',
  styles: []
})
export default class ListaGrupoDelitoComponent implements OnInit, AfterViewInit, OnDestroy {
  GrupoDelitoService = inject(GrupoDelitoService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  GrupoDelito: GrupoDelito[] = [];
  loading = true; 
  listadoGrupoDelito: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 1, width: '150px', orderable: false},
      ],
      responsive: true
    };
  }

  ngAfterViewInit() { 
    this.getListaGrupoDelito(); 
  }

  getListaGrupoDelito() {
    this.loading = true;
    this.GrupoDelitoService.getListaGrupoDelito().subscribe({
      next: (data) => {  
       this.listadoGrupoDelito = data; 
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

  async editar(GrupoDelito?: GrupoDelito) { 
    const modalRef = this.modalService.open(EdicionGrupoDelitoComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.GrupoDelito = GrupoDelito;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.GrupoDelitoService.getListaGrupoDelito().subscribe({
      next: (data) => {  
       this.listadoGrupoDelito = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Grupo de Delito?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.GrupoDelitoService.deleteGrupoDelito(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Grupo de Delito eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Tipo de Norma: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
