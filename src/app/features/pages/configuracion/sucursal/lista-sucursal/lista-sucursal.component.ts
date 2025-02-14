import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { Empresa } from 'src/app/core/model/empresa.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { EdicionEmpresaComponent } from 'src/app/features/pages/configuracion/empresa/edicion-empresa/edicion-empresa.component'
import { ConfirmationModalComponent } from 'src/app/features/shared/confirmation-modal.component' 
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';  
import { Config } from 'datatables.net';

@Component({
  selector: 'app-lista-empresas',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-sucursal.component.html',
  styleUrl: './lista-sucursal.component.scss'
})
export default class ListaSucursalComponent implements OnInit, AfterViewInit, OnDestroy {
  empresaService = inject(EmpresaService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  companies: Empresa[] = [];
  loading = true; 
  listadoEmpresas: any[] = [
    { rutEmpresa: 1, dvRutEmpresa: 'a', razonSocial: 'Empresa A', nombreFantasia: 'Empresa A', email: 'empresaA@email.com' },
    { rutEmpresa: 2, dvRutEmpresa: 'a', razonSocial: 'Empresa B', nombreFantasia: 'Empresa A', email: 'empresaB@email.com' },
    { rutEmpresa: 3, dvRutEmpresa: 'a', razonSocial: 'Empresa C', nombreFantasia: 'Empresa A',  email: 'empresaC@email.com' },
  ];
   
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject();
 
 
  message = '';

  ngOnInit(): void {
    this.dtOptions = {
      destroy: true, 
      order: [],
      columnDefs: [
        {targets: 4, orderable: false},
      ]
    };
  //  this.getListaEmpresas();
    this.loading = false;
  }

  ngAfterViewInit() {
     
    setTimeout(() => {
      this.dtTrigger.next(this.dtOptions);
     }, 1);
 
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
      }
    });
  }

  editar(company?: Empresa) { 
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
          this.rerender3(); 
          this.toastService.showSuccess('Empresa eliminada correctamente');
        },
        error: () => this.toastService.showError('Error al eliminar empresa'),
      });
    }
  } 
  actualizarTabla(){
    this.listadoEmpresas = [
      { rutEmpresa: 1, dvRutEmpresa: 'a', razonSocial: 'Empresa A', nombreFantasia: 'Empresa A', email: 'empresaA@email.com' },
      { rutEmpresa: 2, dvRutEmpresa: 'a', razonSocial: 'Empresa B', nombreFantasia: 'Empresa A', email: 'empresaB@email.com' },
      { rutEmpresa: 3, dvRutEmpresa: 'a', razonSocial: 'Empresa C', nombreFantasia: 'Empresa A',  email: 'empresaC@email.com' },
    ];
  
    this.rerender3();
    
  }
  
  rerender(): void {
   
    
    this.dtElement.dtInstance.then(dtInstance => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again 
     
      setTimeout(() => {
      // this.dtTrigger.next(this.dtOptions); 
     }, 12);
    })

  }
 

  rerender3(): void {
     
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance) => {
       // dtInstance.destroy(); // 🔴 Destruye la tabla para evitar duplicados
        dtInstance.clear();
        setTimeout(() => {
          this.dtTrigger.next(null); 
       }, 12);
      });
    }
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

   
}
