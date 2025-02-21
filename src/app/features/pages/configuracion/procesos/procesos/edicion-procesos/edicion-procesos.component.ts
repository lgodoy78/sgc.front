import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { procesos } from 'src/app/core/model/procesos.model';
import { ProcesosService } from 'src/app/core/data-access/configuracion/procesos.service';
import { MacroProcesosService } from 'src/app/core/data-access/configuracion/macro-procesos.service';
import { macroProcesos } from 'src/app/core/model/macroProcesos.model';

@Component({
  selector: 'app-edicion-procesos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-procesos.component.html',
  styles: []
})
export class EdicionProcesosComponent {
  @Input() proceso?: procesos;
  @ViewChild('procesoInput') procesoInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  procesosService = inject(ProcesosService);
  macroProcesosService = inject(MacroProcesosService);

  form: FormGroup;
  loading = false;
  isEdit = false;
  listadoMacroProcesos: macroProcesos[] = [];

  constructor() {
    this.form = this.formBuilder.group({
      codMacroProceso: ['', [Validators.required]],
      codProceso: ['', [Validators.required]],
      procesos: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.cargarMacroProcesos();
    
    if (this.proceso) {
      this.isEdit = true;
      const formData = {
        codMacroProceso: this.proceso['codMacroProceso'],
        codProceso: this.proceso['codProceso'],
        procesos: this.proceso['procesos']
      };
      this.form.patchValue(formData);
      this.form.controls['codMacroProceso'].disable();
      this.form.controls['codProceso'].disable();
    }
  }

  cargarMacroProcesos() {
    this.macroProcesosService.getListaMacroProcesos().subscribe({
      next: (data) => {
        this.listadoMacroProcesos = data;
      },
      error: (e) => {
        this.toastService.showError('Error al cargar macro procesos: ' + e.error.mensaje);
      }
    });
  }

  revisaExiste(){
    const codMacroProceso = this.form.value['codMacroProceso'];
    const codProceso = this.form.value['codProceso'];
    if(codProceso.length > 0){
      const idProceso =  `${codMacroProceso}-${codProceso}`;
      this.procesosService.getProceso(idProceso).subscribe({
        next: (data) => { 
          if (data.codProceso != null){
            this.toastService.showError('El código de proceso ya existe');
            this.form.controls['codProceso'].setValue('');
 
              setTimeout(() => {
                this.procesoInput.nativeElement.focus();
              }, 100);
          }
        }
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const data: procesos = {
        codMacroProceso: this.form.get('codMacroProceso')?.value,
        codProceso: this.form.get('codProceso')?.value,
        procesos: this.form.get('procesos')?.value,
        actions: ''
      };

      if (this.isEdit) {
        this.procesosService.updateProceso(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Proceso actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar proceso: ' + e.error.mensaje + e.error.detalle);
          }
        });
      } else {
        this.procesosService.createProceso(data).subscribe({
          next: () => {
            this.toastService.showSuccess('Proceso creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear proceso: ' + e.error.mensaje + e.error.detalle);
          }
        });
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}
