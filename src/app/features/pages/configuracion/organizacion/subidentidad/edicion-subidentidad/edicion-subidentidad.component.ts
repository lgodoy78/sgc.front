import { Component, Input, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubIdentidad } from 'src/app/core/model/subIdentidad.model';
import { SubIdentidadService } from 'src/app/core/data-access/configuracion/subidentidad.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-edicion-subidentidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-subidentidad.component.html',
  styles: []
})
export default class EdicionSubIdentidadComponent implements OnInit {
  @Input() subIdentidad?: SubIdentidad;
  @ViewChild('subIdentidadInput') subIdentidadInput!: ElementRef;

  private fb = inject(FormBuilder);
  private activeModal = inject(NgbActiveModal);
  private subIdentidadService = inject(SubIdentidadService);
  private toastService = inject(ToastService);

  form!: FormGroup;
  loading = false;
  isEdit = false;

  
  constructor() {
    this.form = this.fb.group({
      idGerencia: [null],
      nombreGerencia: ['', [Validators.required]],
      subidentidad: ['', [Validators.required]],
    });
  }


  ngOnInit(): void { 
    if (this.subIdentidad) {
      this.isEdit = true; 
      this.form.patchValue(this.subIdentidad);
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
    const subIdentidad: SubIdentidad = this.form.value;

    const request = this.isEdit
      ? this.subIdentidadService.updateSubIdentidad(subIdentidad)
      : this.subIdentidadService.createSubIdentidad(subIdentidad);

    request.subscribe({
      next: () => {
        this.toastService.showSuccess(
          this.isEdit
            ? 'SubIdentidad actualizada correctamente'
            : 'SubIdentidad creada correctamente'
        );
        this.activeModal.close(true);
      },
      error: (error) => {
        this.loading = false;
        this.toastService.showError(
          'Error al ' +
            (this.isEdit ? 'actualizar' : 'crear') +
            ' la subidentidad: ' +
            error.error.mensaje
        );
      },
    });
  }

  revisaExiste(){  
    const subIdentidad: SubIdentidad = this.form.value;
    this.subIdentidadService.getSearchSubIdentidad(subIdentidad).subscribe({
      next: (data) => {
        if (data.length != 0){
          this.toastService.showError('El código de subidentidad ya existe');
          this.form.controls['subidentidad'].setValue('');

            setTimeout(() => {
              this.subIdentidadInput.nativeElement.focus();
            }, 0);
        } 
      },
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
