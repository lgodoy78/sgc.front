import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs'; 
import { TipoNumeral } from 'src/app/core/model/tipoNumeral.model';
import { EdicionTipoNumeralComponent } from '../edicion-tipo-numeral/edicion-tipo-numeral.component';
import { TipoNumeralService } from 'src/app/core/data-access/configuracion/tipo-numeral.service';

@Component({
  selector: 'app-lista-tipo-numeral',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-tipo-numeral.component.html',
  styles: []
})
export default class ListaTipoNumeralComponent implements OnInit, AfterViewInit, OnDestroy {
  tipoNumeralService = inject(TipoNumeralService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  tipoNumeral: TipoNumeral[] = [];
  loading = true; 
  listadoTipoNumeral: any;

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
    this.getListaTipoNumeral(); 
  }

  getListaTipoNumeral() {
    this.loading = true;
    this.tipoNumeralService.getListaTipoNumeral().subscribe({
      next: (data) => {  
       this.listadoTipoNumeral = data; 
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

  async editar(tipoNumeral?: TipoNumeral) { 
    const modalRef = this.modalService.open(EdicionTipoNumeralComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.tipoNumeral = tipoNumeral;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }
  
  actualizarTabla(){ 
    
    this.tipoNumeralService.getListaTipoNumeral().subscribe({
      next: (data) => {  
       this.listadoTipoNumeral = data; 
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
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar este Tipo de Numeral?');

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.tipoNumeralService.deleteTipoNumeral(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Tipo de Numeral eliminado correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar Tipo de Numeral: ' + e.error.mensaje),
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
