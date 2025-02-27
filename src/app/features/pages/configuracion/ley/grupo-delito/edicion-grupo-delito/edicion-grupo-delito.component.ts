import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { GrupoDelitoService } from 'src/app/core/data-access/configuracion/grupo-delito.service';
import { GrupoDelito } from 'src/app/core/model/grupoDelito.model';

@Component({
  selector: 'app-edicion-grupo-delito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-grupo-delito.component.html',
  styles: []
})
export class EdicionGrupoDelitoComponent {
  @Input() GrupoDelito?: GrupoDelito;
  @ViewChild('GrupoDelitoInput') GrupoDelitoInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  GrupoDelitoService = inject(GrupoDelitoService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      idGrupoDelito: [0],
      grupoDelitos: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.GrupoDelito) {
      this.isEdit = true;
      const formData = {
        idGrupoDelito: this.GrupoDelito['idGrupoDelito'],
        grupoDelitos: this.GrupoDelito['grupoDelitos']
      };
      this.form.patchValue(formData);
      this.form.controls['idGrupoDelito'].disable();
    }
  }

  revisaExiste(){ 
    const grupoDelito: GrupoDelito = this.form.value;
    this.GrupoDelitoService.getSearchGrupoDelito(grupoDelito).subscribe({
      next: (data) => {
        if (data.length != 0){
          this.toastService.showError('El código de Grupo de Delito ya existe');
          this.form.controls['idGrupoDelito'].setValue('');

            setTimeout(() => {
              this.GrupoDelitoInput.nativeElement.focus();
            }, 0);
        } 
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: GrupoDelito = {
        idGrupoDelito: this.form.get('idGrupoDelito')?.value,
        grupoDelitos: this.form.get('grupoDelitos')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.GrupoDelitoService.updateGrupoDelito(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Grupo de Delito actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar Grupo de Delito: ' + e.error.mensaje);
          }
        });
      } else {
        this.GrupoDelitoService.createGrupoDelito(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Grupo de Delito creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear Grupo de Delito: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
