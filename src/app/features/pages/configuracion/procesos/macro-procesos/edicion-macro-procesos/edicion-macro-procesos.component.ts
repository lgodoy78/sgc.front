import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { macroProcesos } from 'src/app/core/model/macroProcesos.model';
import { MacroProcesosService } from 'src/app/core/data-access/configuracion/macro-procesos.service';

@Component({
  selector: 'app-edicion-macro-procesos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-macro-procesos.component.html',
  styles: []
})
export class EdicionMacroProcesosComponent {
  @Input() macroProceso?: macroProcesos;
  @ViewChild('macroProcesoInput') macroProcesoInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  macroProcesosService = inject(MacroProcesosService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codMacroProceso: ['', [Validators.required]],
      macroProcesos: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.macroProceso) {
      this.isEdit = true;
      const formData = {
        codMacroProceso: this.macroProceso['codMacroProceso'],
        macroProcesos: this.macroProceso['macroProcesos']
      };
      this.form.patchValue(formData);
      this.form.controls['codMacroProceso'].disable();
    }
  }

  revisaExiste(event: any){
    const codMacroProceso = event.target.value;
    if(codMacroProceso.length > 0){
      this.macroProcesosService.getMacroProceso(codMacroProceso).subscribe({
        next: (data) => {
          console.log(data.codMacroProceso)
          if (data.codMacroProceso != null){
            this.toastService.showError('El código de macro proceso ya existe');
            this.form.controls['codMacroProceso'].setValue('');
 
              setTimeout(() => {
                this.macroProcesoInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: macroProcesos = {
        codMacroProceso: this.form.get('codMacroProceso')?.value,
        macroProcesos: this.form.get('macroProcesos')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.macroProcesosService.updateMacroProceso(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Macro proceso actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar macro proceso: ' + e.error.mensaje);
          }
        });
      } else {
        this.macroProcesosService.createMacroProceso(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Macro proceso creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear macro proceso: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
