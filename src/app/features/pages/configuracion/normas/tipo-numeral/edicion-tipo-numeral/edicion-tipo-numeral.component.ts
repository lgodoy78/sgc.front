import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { TipoNumeralService } from 'src/app/core/data-access/configuracion/tipo-numeral.service';
import { TipoNumeral } from 'src/app/core/model/tipoNumeral.model';

@Component({
  selector: 'app-edicion-tipo-numeral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-tipo-numeral.component.html',
  styles: []
})
export class EdicionTipoNumeralComponent {
  @Input() tipoNumeral?: TipoNumeral;
  @ViewChild('tipoNormaInput') tipoNormaInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  tipoNumeralService = inject(TipoNumeralService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      codTipo: ['', [Validators.required]],
      desTipoNumeral: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.tipoNumeral) {
      this.isEdit = true;
      const formData = {
        codTipo: this.tipoNumeral['codTipo'],
        desTipoNumeral: this.tipoNumeral['desTipoNumeral']
      };
      this.form.patchValue(formData);
      this.form.controls['codTipo'].disable();
    }
  }

  revisaExiste(event: any){
    const codTipo = event.target.value;
    if(codTipo.length > 0){
      this.tipoNumeralService.getTipoNumeral(codTipo).subscribe({
        next: (data) => {
          if (data.codTipo != null){
            this.toastService.showError('La Sigla ya existe');
            this.form.controls['codTipo'].setValue('');
 
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
      const data: TipoNumeral = {
        codTipo: this.form.get('codTipo')?.value,
        desTipoNumeral: this.form.get('desTipoNumeral')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.tipoNumeralService.updateTipoNumeral(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de Numeral actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar Tipo de Numeral: ' + e.error.mensaje);
          }
        });
      } else {
        this.tipoNumeralService.createTipoNumeral(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Tipo de Numeral creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear Tipo de Numeral: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
