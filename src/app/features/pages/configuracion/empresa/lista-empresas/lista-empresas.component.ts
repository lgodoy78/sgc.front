import { Component, inject, AfterViewInit, TemplateRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { Empresa } from 'src/app/core/model/empresa.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { EdicionEmpresaComponent } from '../edicion-empresa/edicion-empresa.component';
import { ConfirmationModalComponent } from 'src/app/features/shared/confirmation-modal.component'
import { DatatableComponent, NgxDatatableModule, ColumnMode  } from '@swimlane/ngx-datatable'; 

@Component({
  selector: 'app-lista-empresas',
  standalone: true,
  imports: [NgbModule, CommonModule, NgxDatatableModule],
  templateUrl: './lista-empresas.component.html',
  styleUrl: './lista-empresas.component.scss',
})
export default class ListaEmpresasComponent implements AfterViewInit {
  empresaService = inject(EmpresaService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
    
  @ViewChild(DatatableComponent, { static: false }) table!: DatatableComponent; 
  @ViewChild('actionTemplate', { static: false }) actionTemplate!: TemplateRef<any>;
  companies: Empresa[] = [];
  loading = true;
  listadoEmpresas: any;
  ColumnMode = ColumnMode;


  rows: Empresa[] = [];
  temp: Empresa[] = [];   
  
  columns: any[] = []; 
 
  message = '';

  ngAfterViewInit() { 
   this.getListaEmpresas();

   setTimeout(() => {
    if (this.table) {
      this.table.recalculate(); // Ajusta la tabla al iniciar
    }
  }, 500);
 
  }

  getListaEmpresas() {
    this.loading = true;
 
    this.empresaService.getListaEmpresas().subscribe({
      next: (data) => {
        this.temp = [...data]
        this.rows = data; 

        this.columns = [
          { name: 'RUT Empresa', prop: 'rutEmpresa', sortable: true, width:'10%'  },
          { name: 'DV', prop: 'dvRutEmpresa', sortable: true },
          { name: 'Razón Social', prop: 'razonSocial', sortable: true   },
          { name: 'Nombre Fantasía', prop: 'nombreFantasia', sortable: true   },
          { name: 'E-Mail', prop: 'email', sortable: true },
          { 
            name: 'Acción', 
            prop: 'actions', 
            sortable: false,     
            cellTemplate: this.actionTemplate
          }
        ]; 
      },
      error: (e) => {
        this.loading = false; 
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  editar(company?: Empresa) {
    this.getListaEmpresas(); 
    console.log(company);
    const modalRef = this.modalService.open(EdicionEmpresaComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.company = company;
  }

  async eliminar(id: number) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.title = 'Confirmar eliminación';
    modalRef.componentInstance.message =
      '¿Estás seguro de eliminar esta empresa?';

    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.empresaService.deleteCompany(id).subscribe({
        next: () => {
          this.getListaEmpresas(); 
          this.toastService.showSuccess('Empresa eliminada correctamente');
        },
        error: () => this.toastService.showError('Error al eliminar empresa'),
      });
    }
  }

  onSearchChange(event: any) {
    const val = event.target.value.toLowerCase();
  
    this.rows = this.temp.filter((d) => {
      return (Object.keys(d) as (keyof Empresa)[]).some((key) => {
        // Excluir la columna "actions"
        if (key !== "actions") {
          return String(d[key] ?? "").toLowerCase().includes(val);
        }
        return false;
      });
    });
  
    // Volver a la primera página después de la búsqueda
    this.table.offset = 0;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.table) { 
      setTimeout(() => {
        console.log('hila')
        this.table.recalculate();
        this.table.recalculateColumns();
      }, 300);
    
  }}
 
}
