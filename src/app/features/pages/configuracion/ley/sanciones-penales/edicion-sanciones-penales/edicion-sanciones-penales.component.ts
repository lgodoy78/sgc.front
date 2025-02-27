import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service'; 
import { SancionesPenalesService } from 'src/app/core/data-access/configuracion/sanciones-penales.service';
import { SancionesPenales } from 'src/app/core/model/sancionesPenales.model';

@Component({
  selector: 'app-edicion-sanciones-penales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-sanciones-penales.component.html',
  styles: []
})
export class EdicionSancionesPenalesComponent {
  @Input() SancionesPenales?: SancionesPenales;
  @ViewChild('SancionesPenalesInput') SancionesPenalesInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  SancionesPenalesService = inject(SancionesPenalesService);

  form: FormGroup;
  loading = false;
  isEdit = false;

  constructor() {
    this.form = this.formBuilder.group({
      idSancion: [0],
      clasePena: ['', [Validators.required]],
      pena: ['', [Validators.required]],
      grado: ['', [Validators.required]],
      anosPena: ['', [Validators.required]],
      implicancia: ['', [Validators.required]],
      colorImplicancia: ['', [Validators.required]],
    });
  }
 

  ngOnInit() {
    if (this.SancionesPenales) {
      this.isEdit = true;
      const formData = {
        idSancion: this.SancionesPenales['idSancion'],
        clasePena: this.SancionesPenales['clasePena'],
        pena: this.SancionesPenales['pena'],
        grado: this.SancionesPenales['grado'],
        anosPena: this.SancionesPenales['anosPena'],
        implicancia: this.SancionesPenales['implicancia'],
        colorImplicancia: this.SancionesPenales['colorImplicancia'],
      };
      this.form.patchValue(formData); 
    }
  }

  revisaExiste(){ 
    if (this.form.get('clasePena')?.value == '' || this.form.get('pena')?.value == '' || this.form.get('grado')?.value == ''){
      return;
    }

    const sancionesPenales: SancionesPenales = this.form.value;
    this.SancionesPenalesService.getSearchSancionesPenales(sancionesPenales).subscribe({
      next: (data) => {
        console.log(data);
        if (data.length != 0){
          this.toastService.showError('Clase Pena - Pena - Grado ya existe');
          this.form.controls['clasePena'].setValue('');
          this.form.controls['pena'].setValue('');
          this.form.controls['grado'].setValue('');

            setTimeout(() => {
              this.SancionesPenalesInput.nativeElement.focus();
            }, 0);
        } 
      },
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: SancionesPenales = {
        idSancion: this.form.get('idSancion')?.value,
        clasePena: this.form.get('clasePena')?.value,
        pena: this.form.get('pena')?.value,
        grado: this.form.get('grado')?.value,
        anosPena: this.form.get('anosPena')?.value,
        implicancia: this.form.get('implicancia')?.value,
        colorImplicancia: this.form.get('colorImplicancia')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.SancionesPenalesService.updateSancionesPenales(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Sanciones Penales actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar Sanciones Penales: ' + e.error.mensaje);
          }
        });
      } else {
        this.SancionesPenalesService.createSancionesPenales(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Sanciones Penales creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear Sanciones Penales: ' + e.error.mensaje);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
