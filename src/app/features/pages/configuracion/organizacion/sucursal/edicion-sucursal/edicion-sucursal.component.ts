import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { SucursalService } from 'src/app/core/data-access/configuracion/sucursal.service';
import { ComunaService } from 'src/app/core/data-access/configuracion/comuna.service';
import { ToastService } from 'src/app/core/services/toast.service';  
import { Sucursal } from 'src/app/core/model/sucursal.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edicion-sucursal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-sucursal.component.html',
  styles: []
})
export class EdicionSucursalComponent implements AfterViewInit {
  @Input() sucursal?: Sucursal;
  @ViewChild('codSucursalInput') codSucursalInput!: ElementRef;

  sucursalService = inject(SucursalService);
  comunaService = inject(ComunaService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);
  listaPaises: any;
  listaRegiones: any;
  listaComunas: any;
  codPais: any;

  form = this.fb.group({
    codSucursal: ['', [Validators.required, Validators.maxLength(10)]],
    sucursal: ['', [Validators.required, Validators.maxLength(100)]],
    dirCallle: ['', [Validators.maxLength(100)]],
    dirNumero: [null as number | null, [Validators.pattern('^[0-9]+$')]], 
    dirPiso: [null as number | null, [Validators.pattern('^[0-9]+$')]],   
    dirOficina: [null as number | null, [Validators.pattern('^[0-9]+$')]], 
    codComuna: ['', Validators.required],
    codRegion: ['', Validators.required],
    codPais: ['', Validators.required],
  });
  

  isSubmitting = false;

  constructor(public activeModal: NgbActiveModal) {
    this.getListaPaises();
  }

  ngAfterViewInit() {
    if (this.sucursal) {
      if (this.sucursal.codPais) {
        this.codPais = this.sucursal.codPais;
        this.getListaRegiones(this.codPais);
      }
      if (this.sucursal.codRegion) {
        this.getListaComunas(this.sucursal.codRegion);
      }
  
      this.form.patchValue({
        ...this.sucursal, // Convertir a '' si está vacío
        dirNumero: this.sucursal.dirNumero ?? null, 
        dirPiso: this.sucursal.dirPiso ?? null,
        dirOficina: this.sucursal.dirOficina ?? null,
      })

      this.form.controls.codSucursal.disable();
    }
  }
  
  revisaExiste(event: any){
    const codSucursal = event.target.value;
    if(codSucursal.length > 0){
      this.sucursalService.getSucursal(codSucursal).subscribe({
        next: (data) => {
          if (data.codSucursal != 0){
            this.toastService.showError('El código de sucursal ya existe');
            this.form.controls.codSucursal.setValue('');
 
              setTimeout(() => {
                this.codSucursalInput.nativeElement.focus();
              }, 0);
          } 
        },
      });
    }
  }

  clickPais(event: any) {
    this.codPais = event.target.value;
    this.getListaRegiones(this.codPais);
  }

  clickRegion(event: any) {
    const codRegion = event.target.value;
    this.getListaComunas(codRegion);
  }

  getListaPaises() {
    this.comunaService.getListaPaises().subscribe({
      next: (data) => {
        this.listaPaises = data;
      },
    });
  }

  getListaRegiones(codPais: any) {
    this.listaComunas = [];
    this.comunaService.getListaRegiones(codPais).subscribe({
      next: (data) => {
        this.listaRegiones = data;
      },
    });
  }

  getListaComunas(codRegion: any) {
    this.comunaService.getListaComunas(this.codPais, codRegion).subscribe({
      next: (data) => {
        this.listaComunas = data;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const sucursalData = this.form.value as Sucursal;

    const operation = this.sucursal
      ? this.sucursalService
          .updateSucursal({ ...this.sucursal, ...sucursalData })
          .pipe()
      : this.sucursalService.createSucursal(sucursalData).pipe();

    operation.subscribe({
      next: () => {
        this.activeModal.close(true);
        this.isSubmitting = false;
      },
      error: (e) => {
        this.isSubmitting = false;
        this.toastService.showError('Error al actualizar sucursal : ' + e.error.mensaje	);
      },
    });
  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // Permitir teclas especiales (Backspace, Tab, Enter, Delete, Flechas)
    if (
      charCode === 8 ||
      charCode === 9 ||
      charCode === 13 ||
      charCode === 46 ||
      (charCode >= 37 && charCode <= 40)
    ) {
      return;
    }

    // Permite solo números (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
