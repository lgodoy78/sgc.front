import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { AgrupacionRiesgoService } from 'src/app/core/data-access/configuracion/agrupacion-riesgo.service';
import { AgrupacionRiesgo } from 'src/app/core/model/agrupacionRiesgo.model';

@Component({
  selector: 'app-edicion-agrupacion-riesgo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-agrupacion-riesgo.component.html',
  styles: []
})
export class EdicionAgrupacionRiesgoComponent {
  @Input() agrupacionRiesgo?: AgrupacionRiesgo;
  @ViewChild('agrupacionRiesgoInput') agrupacionRiesgoInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  agrupacionRiesgoService = inject(AgrupacionRiesgoService);

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
    if (this.agrupacionRiesgo) {
      this.isEdit = true;
      const formData = {
        codAgrupador: this.agrupacionRiesgo['codAgrupador'],
        agrupador: this.agrupacionRiesgo['agrupador']
      };
      this.form.patchValue(formData);
      this.form.controls['codAgrupador'].disable();
    }
  }

  revisaExiste(event: any){
    const codAgrupador = event.target.value;
    if(codAgrupador.length > 0){
      this.agrupacionRiesgoService.getAgrupacionRiesgo(codAgrupador).subscribe({
        next: (data) => {
          if (data.codAgrupador != null){
            this.toastService.showError('El código de Agrupación de riesgo ya existe');
            this.form.controls['codAgrupador'].setValue('');
 
              setTimeout(() => {
                this.agrupacionRiesgoInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: AgrupacionRiesgo = {
        codAgrupador: this.form.get('codAgrupador')?.value,
        agrupador: this.form.get('agrupador')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.agrupacionRiesgoService.updateAgrupacionRiesgo(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Agrupación de riesgo actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar agrupación de control: ' + e.error.mensaje);
          }
        });
      } else {
        this.agrupacionRiesgoService.createAgrupacionRiesgo(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Agrupación de riesgo creado correctamente');
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
