import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { Empresa } from 'src/app/core/model/empresa.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { EdicionEmpresaComponent } from 'src/app/features/pages/configuracion/organizacion/empresa/edicion-empresa/edicion-empresa.component' 
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { ModalTypeService } from 'src/app/core/services/modal-type.service'
import { Subject } from 'rxjs'; 

@Component({
  selector: 'app-lista-empresas',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-empresas.component.html',
  styleUrl: './lista-empresas.component.scss'
})
export default class ListaEmpresasComponent implements OnInit, AfterViewInit, OnDestroy {
  empresaService = inject(EmpresaService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  companies: Empresa[] = [];
  loading = true; 
  listadoEmpresas: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
 
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [0, 'asc'],
      columnDefs: [
        {targets: 5, orderable: false},
      ],
      responsive:true
    };
  }

  ngAfterViewInit() { 
    this.getListaEmpresas(); 
  }

  getListaEmpresas() {
    this.loading = true;
 
    this.empresaService.getListaEmpresas().subscribe({
      next: (data) => {  
       this.listadoEmpresas = data; 
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
  
  async editar(empresa?: Empresa) { 
    const modalRef = this.modalService.open(EdicionEmpresaComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.empresa = empresa;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }

  async eliminar(id: number) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar esta empresa?')
  

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.empresaService.deleteEmpresa(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Empresa eliminada correctamente');
        },
        error: () => this.toastService.showError('Error al eliminar empresa'),
      });
    }
  } 

 
  
  actualizarTabla(){ 
    
    this.empresaService.getListaEmpresas().subscribe({
      next: (data) => {  
       this.listadoEmpresas = data; 
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
