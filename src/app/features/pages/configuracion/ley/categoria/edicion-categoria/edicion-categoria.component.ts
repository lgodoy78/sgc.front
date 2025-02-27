import { Component, Input, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/core/model/categoria.model';
import { CategoriaService } from 'src/app/core/data-access/configuracion/categoria.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-edicion-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-categoria.component.html',
  styles: []
})
export default class EdicionCategoriaComponent implements OnInit {
  @Input() categoria?: Categoria;
  @ViewChild('categoriaInput') categoriaInput!: ElementRef;

  private fb = inject(FormBuilder);
  private activeModal = inject(NgbActiveModal);
  private categoriaService = inject(CategoriaService);
  private toastService = inject(ToastService);

  form!: FormGroup;
  loading = false;
  isEdit = false;

  
  constructor() {
    this.form = this.fb.group({
      idCategoria: [null],
      categorias: ['', [Validators.required]],
      abreviado: ['', [Validators.required]],
    });
  }


  ngOnInit(): void { 
    if (this.categoria) {
      this.isEdit = true; 
      this.form.patchValue(this.categoria);
      this.form.controls['categorias'].disable();
    }
  } 

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    this.form.controls['categorias'].enable();
    const categoria: Categoria = this.form.value; 
    console.log(categoria)
    const request = this.isEdit
      ? this.categoriaService.updateCategoria(categoria)
      : this.categoriaService.createCategoria(categoria);

    request.subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.isEdit
            ? 'Categoria actualizada correctamente'
            : 'Categoria creada correctamente'
        );
        this.activeModal.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.form.controls['categorias'].disable();
        this.toastService.showError(
          'Error al ' +
            (this.isEdit ? 'actualizar' : 'crear') +
            ' la categoria: ' +
            error.error.mensaje
        );
      },
    });
  }

  revisaExiste(){  
    const categoria: Categoria = this.form.value;
    categoria.abreviado = '';
    this.categoriaService.getSearchCategoria(categoria).subscribe({
      next: (data) => {
        if (data.length != 0){
          this.toastService.showError('El código de categoria ya existe');
          this.form.controls['categorias'].setValue('');

            setTimeout(() => {
              this.categoriaInput.nativeElement.focus();
            }, 0);
        } 
      },
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
