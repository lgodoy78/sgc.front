import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { tipoActividad } from 'src/app/core/model/tipoActividad.model';
import { TipoActividadService } from 'src/app/core/data-access/configuracion/tipo-actividad.service';

@Component({
  selector: 'app-edicion-tipo-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-tipo-actividad.component.html',
  styles: []
})
export class EdicionTipoActividadComponent {
  @Input() tipoActividad?: tipoActividad;
  @ViewChild('tipoActividadInput') tipoActividadInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  tipoActividadService = inject(TipoActividadService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codTipoActividad: ['', [Validators.required]],
      desTipoActividad: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.tipoActividad) {
      this.isEdit = true;
      const formData = {
        codTipoActividad: this.tipoActividad['codTipoActividad'],
        desTipoActividad: this.tipoActividad['desTipoActividad']
      };
      this.form.patchValue(formData);
      this.form.controls['codTipoActividad'].disable();
    }
  }

  revisaExiste(event: any){
    const codTipoActividad = event.target.value;
    if(codTipoActividad.length > 0){
      this.tipoActividadService.getTipoActividad(codTipoActividad).subscribe({
        next: (data) => {
          if (data.codTipoActividad != null){
            this.toastService.showError('El código de tipo de actividad ya existe');
            this.form.controls['codTipoActividad'].setValue('');
 
              setTimeout(() => {
                this.tipoActividadInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: tipoActividad = {
        codTipoActividad: this.form.get('codTipoActividad')?.value,
        desTipoActividad: this.form.get('desTipoActividad')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.tipoActividadService.updateTipoActividad(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de actividad actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar tipo de actividad: ' + e.error.mensaje);
          }
        });
      } else {
        this.tipoActividadService.createTipoActividad(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de actividad creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear tipo de actividad: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
