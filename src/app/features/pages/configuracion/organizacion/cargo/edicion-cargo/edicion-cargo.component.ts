import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CargoService } from 'src/app/core/data-access/configuracion/cargo.service'; 
import { ToastService } from 'src/app/core/services/toast.service';
import { Cargo } from 'src/app/core/model/cargo.model';
import { SubIdentidadService } from 'src/app/core/data-access/configuracion/subidentidad.service';
import { SubIdentidad } from 'src/app/core/model/subIdentidad.model';
import { SucursalService } from 'src/app/core/data-access/configuracion/sucursal.service';
import { Sucursal } from 'src/app/core/model/sucursal.model';

@Component({
  selector: 'app-edicion-cargo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-cargo.component.html',
  styles: []
})
export default class EdicionCargoComponent implements AfterViewInit {
  @Input() cargo?: Cargo;
  @ViewChild('nombreCargoInput') nombreCargoInput!: ElementRef;
  
  form: FormGroup;
  isEdit = false;
  cargoExiste = false;
  subidentidades: SubIdentidad[] = [];
  sucursales: Sucursal[] = [];
  loading = false; 

  cargoService = inject(CargoService);
  subIdentidadService = inject(SubIdentidadService);
  sucursalService = inject(SucursalService);
  activeModal = inject(NgbActiveModal);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  constructor() {
    this.loadSubIdentidades();
    this.loadSucursales();
    this.form = this.fb.group({
      idCargo: [null],
      nombreCargo: ['', [Validators.required]],
      codSucursal: [null],
      idGerencia1: [null],
      idGerencia2: [null],
      idGerencia3: [null],
      gerencia1: [''],
      gerencia2: [''],
      gerencia3: [''],
      funciones: [''],
      actions: ['']
    });
  }

  ngAfterViewInit(): void {
    if (this.cargo) {
      this.isEdit = true;
      
      this.cargo.codSucursal = this.cargo.codSucursal === null ? -1 : this.cargo.codSucursal; 
      this.cargo.idGerencia1 = this.cargo.idGerencia1 === null ? -1 : this.cargo.idGerencia1; 
      this.cargo.idGerencia2 = this.cargo.idGerencia2 === null ? -1 : this.cargo.idGerencia2; 
      this.cargo.idGerencia3 = this.cargo.idGerencia3 === null ? -1 : this.cargo.idGerencia3; 

      this.form.patchValue(this.cargo);
    }
  }

  loadSubIdentidades() {
    this.subIdentidadService.getListaSubIdentidades().subscribe({
      next: (data) => {
        this.subidentidades = data;
      },
      error: (e) => {
        this.toastService.showError('Error al cargar subidentidades: ' + e.error.mensaje);
      }
    });
  }

  loadSucursales() {
    this.sucursalService.getListaSucursales().subscribe({
      next: (data) => {
        this.sucursales = data;
      },
      error: (e) => {
        this.toastService.showError('Error al cargar sucursales: ' + e.error.mensaje);
      }
    });
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  onSubmit() {

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;

    const cargo: Cargo = this.form.value;
    cargo.codSucursal = cargo.codSucursal?.toString() === '-1' ? null : cargo.codSucursal;
    cargo.idGerencia1 = cargo.idGerencia1?.toString() === '-1' ? null : cargo.idGerencia1;
    cargo.idGerencia2 = cargo.idGerencia2?.toString() === '-1' ? null : cargo.idGerencia2;
    cargo.idGerencia3 = cargo.idGerencia3?.toString() === '-1' ? null : cargo.idGerencia3;

      if (this.isEdit) {
        this.cargoService.updateCargo(cargo).subscribe({
          next: () => {
            this.toastService.showSuccess('Cargo actualizado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al actualizar cargo: ' + e.error.mensaje);
          }
        });
      } else {
        this.cargoService.createCargo(cargo).subscribe({
          next: () => {
            this.toastService.showSuccess('Cargo creado correctamente');
            this.activeModal.close(true);
          },
          error: (e) => {
            this.loading = false;
            this.toastService.showError('Error al crear cargo: ' + e.error.mensaje);
          }
        });
      }
  } 

  
  revisaExiste(){ 
    const cargo: Cargo = this.form.value;
    this.cargoService.getSearchCargo(cargo).subscribe({
      next: (data) => {
        if (data.length != 0){
          this.toastService.showError('El código de cargo ya existe');
          this.form.controls['nombreCargo'].setValue('');

            setTimeout(() => {
              this.nombreCargoInput.nativeElement.focus();
            }, 0);
        } 
      },
    });
  }
}
