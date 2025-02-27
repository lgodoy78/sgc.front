import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { TipoNormaService } from 'src/app/core/data-access/configuracion/tipo-norma.service';
import { TipoNorma } from 'src/app/core/model/tipoNorma.model';

@Component({
  selector: 'app-edicion-tipo-norma',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-tipo-norma.component.html',
  styles: []
})
export class EdicionTipoNormaComponent {
  @Input() tipoNorma?: TipoNorma;
  @ViewChild('tipoNormaInput') tipoNormaInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  tipoNormaService = inject(TipoNormaService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codTipoNorma: ['', [Validators.required]],
      norma: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.tipoNorma) {
      this.isEdit = true;
      const formData = {
        codTipoNorma: this.tipoNorma['codTipoNorma'],
        norma: this.tipoNorma['norma']
      };
      this.form.patchValue(formData);
      this.form.controls['codTipoNorma'].disable();
    }
  }

  revisaExiste(event: any){
    const codTipoNorma = event.target.value;
    if(codTipoNorma.length > 0){
      this.tipoNormaService.getTipoNorma(codTipoNorma).subscribe({
        next: (data) => {
          if (data.codTipoNorma != null){ 
            this.toastService.showError('La Sigla ya existe');
            this.form.controls['codTipoNorma'].setValue('');
 
              setTimeout(() => {
                this.tipoNormaInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: TipoNorma = {
        codTipoNorma: this.form.get('codTipoNorma')?.value,
        norma: this.form.get('norma')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.tipoNormaService.updateTipoNorma(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de Norma actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar Tipo de Norma: ' + e.error.mensaje);
          }
        });
      } else {
        this.tipoNormaService.createTipoNorma(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de Norma creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear Tipo de Norma: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
