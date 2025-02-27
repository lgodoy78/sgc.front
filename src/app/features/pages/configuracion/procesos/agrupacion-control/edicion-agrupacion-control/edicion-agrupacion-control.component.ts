import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { AgrupacionControlService } from 'src/app/core/data-access/configuracion/agrupacion-control.service';
import { AgrupacionControl } from 'src/app/core/model/agrupacionControl.model';

@Component({
  selector: 'app-edicion-agrupacion-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-agrupacion-control.component.html',
  styles: []
})
export class EdicionAgrupacionControlComponent {
  @Input() AgrupacionControl?: AgrupacionControl;
  @ViewChild('agrupacionControlInput') agrupacionControlInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  AgrupacionControlService = inject(AgrupacionControlService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codAgrupador: ['', [Validators.required]],
      agrupador: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.AgrupacionControl) {
      this.isEdit = true;
      const formData = {
        codAgrupador: this.AgrupacionControl['codAgrupador'],
        agrupador: this.AgrupacionControl['agrupador']
      };
      this.form.patchValue(formData);
      this.form.controls['codAgrupador'].disable();
    }
  }

  revisaExiste(event: any){
    const codAgrupador = event.target.value;
    if(codAgrupador.length > 0){
      this.AgrupacionControlService.getAgrupacionControl(codAgrupador).subscribe({
        next: (data) => {
          if (data.codAgrupador != null){
            this.toastService.showError('El código de Agrupación de control ya existe');
            this.form.controls['codAgrupador'].setValue('');
 
              setTimeout(() => {
                this.agrupacionControlInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: AgrupacionControl = {
        codAgrupador: this.form.get('codAgrupador')?.value,
        agrupador: this.form.get('agrupador')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.AgrupacionControlService.updateAgrupacionControl(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Agrupación de control actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar agrupación de control: ' + e.error.mensaje);
          }
        });
      } else {
        this.AgrupacionControlService.createAgrupacionControl(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Agrupación de control creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear agrupación de control: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
