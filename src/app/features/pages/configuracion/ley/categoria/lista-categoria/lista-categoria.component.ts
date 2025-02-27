import { Component, inject, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from 'src/app/core/model/categoria.model';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';  
import { ModalTypeService } from 'src/app/core/services/modal-type.service'
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs'; 
import { CategoriaService } from 'src/app/core/data-access/configuracion/categoria.service';
import EdicionCategoriaComponent from '../edicion-categoria/edicion-categoria.component';

@Component({
  selector: 'app-lista-categoria',
  standalone: true,
  imports: [NgbModule, CommonModule, DataTablesModule],
  templateUrl: './lista-categoria.component.html',
  styles: []
})
export default class ListaCategoriaComponent implements OnInit, AfterViewInit, OnDestroy {
  categoriaService = inject(CategoriaService);
  modalService = inject(NgbModal);
  toastService = inject(ToastService);
  modalTypeService = inject(ModalTypeService);
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  categorias: Categoria[] = [];
  loading = true; 
  listadoCategoria: any;

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
    this.getListaCategoriaes(); 
  }

  getListaCategoriaes() {
    this.loading = true;
    this.categoriaService.getListaCategoria().subscribe({
      next: (data) => {  
       this.listadoCategoria = data; 
      },
      error: (e) => {
        this.loading = false; 
        this.toastService.showError('Error al cargar las categorias: ' + e.error.mensaje);
      },
      complete: () => {
        this.loading = false;
        setTimeout(() => {
          this.dtTrigger.next(this.dtOptions);
         }, 1);
      }
    });
  }

  async editar(categoria?: Categoria) { 
    const modalRef = this.modalService.open(EdicionCategoriaComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.categoria = categoria;

    const result = await modalRef.result.catch(() => false);
    if (result) { 
      this.actualizarTabla(); 
    }
  }

  async eliminar(id: number) {
    const modalRef = this.modalTypeService.openConfirmModal('Confirmar eliminación','¿Estás seguro de eliminar esta categoria?')
  
    const result = await modalRef.result.catch(() => false);
    if (result) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.actualizarTabla(); 
          this.toastService.showSuccess('Categoria eliminada correctamente');
        },
        error: (e) => this.toastService.showError('Error al eliminar categoria : ' + e.error.mensaje),
      });
    }
  }

  actualizarTabla() {
    this.categoriaService.getListaCategoria().subscribe({
      next: (data) => {  
       this.listadoCategoria = data; 
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
