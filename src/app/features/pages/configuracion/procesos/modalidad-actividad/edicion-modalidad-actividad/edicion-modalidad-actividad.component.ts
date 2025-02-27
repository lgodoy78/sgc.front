import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { ModalidadActividad } from 'src/app/core/model/modalidadActividad.model';
import { ModalidadActividadService } from 'src/app/core/data-access/configuracion/modalidad-actividad.service';

@Component({
  selector: 'app-edicion-modalidad-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-modalidad-actividad.component.html',
  styles: []
})
export class EdicionModalidadActividadComponent {
  @Input() modalidadActividad?: ModalidadActividad;
  @ViewChild('codModalidadInput') codModalidadInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  modalidadActividadService = inject(ModalidadActividadService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codModalidad: ['', [Validators.required]],
      modalidad: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.modalidadActividad) {
      this.isEdit = true;
      const formData = {
        codModalidad: this.modalidadActividad['codModalidad'],
        modalidad: this.modalidadActividad['modalidad']
      };
      this.form.patchValue(formData);
      this.form.controls['codModalidad'].disable();
    }
  }

  revisaExiste(event: any){
    const codModalidad = event.target.value;
    if(codModalidad.length > 0){
      this.modalidadActividadService.getModalidadActividad(codModalidad).subscribe({
        next: (data) => {
          if (data.codModalidad != null){
            this.toastService.showError('El código de modalidad de actividad ya existe');
            this.form.controls['codModalidad'].setValue('');
 
              setTimeout(() => {
                this.codModalidadInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: ModalidadActividad = {
        codModalidad: this.form.get('codModalidad')?.value,
        modalidad: this.form.get('modalidad')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.modalidadActividadService.updateModalidadActividad(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Modalidad de Actividad actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar tipo de actividad: ' + e.error.mensaje);
          }
        });
      } else {
        this.modalidadActividadService.createModalidadActividad(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Modalidad de Actividad creado correctamente');
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
