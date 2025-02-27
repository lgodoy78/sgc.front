import { AfterViewInit, Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/core/services/toast.service';
import { Empresa } from 'src/app/core/model/empresa.model';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { ComunaService } from 'src/app/core/data-access/configuracion/comuna.service';
import { ActividadService } from 'src/app/core/data-access/configuracion/actividad.service';
import { FileUploadService } from 'src/app/core/data-access/configuracion/file-upload.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-edicion-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edicion-empresa.component.html',
  styles: []
})
export class EdicionEmpresaComponent implements AfterViewInit {
  @Input() empresa?: Empresa;
  @ViewChild('rutInput') rutInput!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  toastService = inject(ToastService);
  empresaService = inject(EmpresaService);
  comunaService = inject(ComunaService);
  actividadService = inject(ActividadService);
  fileUploadService = inject(FileUploadService);

  form: FormGroup;
  loading = false;
  isEdit = false;
  logoPreview: string | null = null;
  selectedFile: any;

  // Listas para los dropdowns
  listaPaises: any[] = [];
  listaRegiones: any[] = [];
  listaComunas: any[] = [];
  listaActividadesSii: any[] = [];
  listaActividadesCmf: any[] = [];
  listaSectoresFinancierosCmf: any[] = [];
  listaComponentesInstitucionalesCmf: any[] = [];

  codPais: string = '';
  codRegion: string = '';

  constructor() {
    this.cargarListas();
    this.form = this.formBuilder.group({
      rutEmpresa: [null, [Validators.required]],
      dvRutEmpresa: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      nombreFantasia: ['', [Validators.required]],
      paginaWeb: [''],
      email: ['', [Validators.email]],
      dirCallle: [''],
      dirNumero: [null],
      dirPiso: [null],
      dirOficina: [null],
      codComuna: [''],
      codRegion: [''],
      codPais: [''],
      descActividad: [''],
      codActividadSiiPri: [''],
      codActividadSiiSec: [''],
      aplicaCmf: [''],
      codigoCmf: [''],
      codActividadCmf: [''],
      codSectorFinanCmf: ['-1'],
      codCompInstitucionalCmf: ['-1'],
      logo: ['']
    });
  }

  ngAfterViewInit() {
    if (this.empresa) {
      this.isEdit = true;
      if (this.empresa.codPais) {
        this.codPais = this.empresa.codPais;
        this.getListaRegiones(this.codPais);
      }
      if (this.empresa.codRegion) {
        this.codRegion = this.empresa.codRegion;
        this.getListaComunas(this.codRegion);
      }
      
      this.empresa.codComuna = this.empresa.codComuna === null ? '' : this.empresa.codComuna;
      this.empresa.codRegion = this.empresa.codRegion === null ? '' : this.empresa.codRegion;
      this.empresa.codPais = this.empresa.codPais === null ? '' : this.empresa.codPais;
      this.empresa.codActividadSiiPri = this.empresa.codActividadSiiPri === null ? '' : this.empresa.codActividadSiiPri;
      this.empresa.codActividadSiiSec = this.empresa.codActividadSiiSec === null ? '' : this.empresa.codActividadSiiSec;
      this.empresa.codActividadCmf = this.empresa.codActividadCmf === null ? '' : this.empresa.codActividadCmf;
      this.empresa.codSectorFinanCmf = this.empresa.codSectorFinanCmf === null ? -1 : this.empresa.codSectorFinanCmf;
      this.empresa.codCompInstitucionalCmf = this.empresa.codCompInstitucionalCmf === null ? -1 : this.empresa.codCompInstitucionalCmf;
 
      this.form.patchValue(this.empresa);
      this.form.controls['rutEmpresa'].disable();

      // Mostrar logo si existe
      if (this.empresa.rutEmpresa) {
        this.logoPreview = this.fileUploadService.getLogoUrl(this.empresa.rutEmpresa);
        console.log(this.logoPreview )
        
      } 
    }
  }

  cargarListas() {
    this.getListaPaises();
    this.getListaActividadesSii(); 
    this.getListaActividadesCmf();
    this.getListaSectoresFinancierosCmf();
    this.getListaComponentesInstitucionalesCmf();
  }

  // Métodos para cargar las listas
  getListaPaises() {
    this.comunaService.getListaPaises().subscribe({
      next: (data) => this.listaPaises = data,
      error: (e) => this.toastService.showError('Error al cargar lista de países')
    });
  }

  getListaRegiones(codPais: string) {
    this.listaRegiones = [];
    this.listaComunas = [];
    this.comunaService.getListaRegiones(codPais).subscribe({
      next: (data) => {
        this.listaRegiones = data;
      },
      error: (e) => this.toastService.showError('Error al cargar lista de regiones')
    });
  }

  getListaComunas(codRegion: string) {
    this.comunaService.getListaComunas(this.codPais, codRegion).subscribe({
      next: (data) => {
        this.listaComunas = data;
      },
      error: (e) => this.toastService.showError('Error al cargar lista de comunas')
    });
  }

  getListaActividadesSii() {
    this.actividadService.getListaActividadesSii().subscribe({
      next: (data) => this.listaActividadesSii = data,
      error: (e) => this.toastService.showError('Error al cargar lista de actividades SII principales')
    });
  }
 

  getListaActividadesCmf() {
    this.actividadService.getListaActividadesCmf().subscribe({
      next: (data) => this.listaActividadesCmf = data,
      error: (e) => this.toastService.showError('Error al cargar lista de actividades CMF')
    });
  }

  getListaSectoresFinancierosCmf() {
    this.actividadService.getListaSectoresFinancierosCmf().subscribe({
      next: (data) => this.listaSectoresFinancierosCmf = data,
      error: (e) => this.toastService.showError('Error al cargar lista de sectores financieros CMF')
    });
  }

  getListaComponentesInstitucionalesCmf() {
    this.actividadService.getListaComponentesInstitucionalesCmf().subscribe({
      next: (data) => this.listaComponentesInstitucionalesCmf = data,
      error: (e) => this.toastService.showError('Error al cargar lista de componentes institucionales CMF')
    });
  }

  // Event handlers para los cambios en los dropdowns
  clickPais(event: any) {
    this.codPais = event.target.value;
    this.getListaRegiones(this.codPais);
  }

  clickRegion(event: any) {
    this.codRegion = event.target.value;
    this.getListaComunas(this.codRegion);
  }

  revisaExiste(event: any) {
    const rut = event.target.value;
    if (rut) {
      this.empresaService.getEmpresa(rut).subscribe({
        next: (data) => {
          if (data.rutEmpresa != 0) {
            this.toastService.showError('El RUT de empresa ya existe');
            this.form.controls['rutEmpresa'].setValue(null);
            setTimeout(() => {
              this.rutInput.nativeElement.focus();
            }, 0);
          }
        },
      });
    }
  }

  soloNumeros(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea un archivo PNG
      if (file.type !== 'image/png') {
        this.toastService.showError('Solo se permiten archivos PNG');
        this.fileInput.nativeElement.value = '';
        return;
      }

      // Validar tamaño (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        this.toastService.showError('El archivo no debe superar los 2MB');
        this.fileInput.nativeElement.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  clearLogo() {
    this.logoPreview = null;
    this.form.patchValue({ logo: '' });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  private async saveLogoFile(file: File): Promise<string> {
    const rutEmpresa = this.form.get('rutEmpresa')?.value;
    if (!rutEmpresa) {
      this.toastService.showError('Error: No se ha especificado el RUT de la empresa');
      throw new Error('RUT de empresa no especificado');
    }

    try {
      const base64Image = await this.fileToBase64(file);
      await lastValueFrom(this.fileUploadService.uploadLogo(base64Image, rutEmpresa));
      return `${rutEmpresa}.png`;
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.error || 'Error al guardar el logo';
      this.toastService.showError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Removemos el prefijo "data:image/png;base64," para enviar solo el contenido base64
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      try {
        // Manejar el archivo de logo si existe
        if (this.fileInput?.nativeElement?.files?.length > 0) {
          const file = this.fileInput.nativeElement.files[0];
          const fileName = await this.saveLogoFile(file);
          this.form.patchValue({ logo: fileName });
        }
 
        const data: Empresa = {
          ...this.form.value,
          rutEmpresa: this.form.get('rutEmpresa')?.value,
          actions: ''
        }; 

        data.codComuna = data.codComuna === '' ? null : data.codComuna;
        data.codRegion = data.codRegion === '' ? null : data.codRegion;
        data.codPais = data.codPais === '' ? null : data.codPais;
        data.codActividadSiiPri = data.codActividadSiiPri === '' ? null : data.codActividadSiiPri;
        data.codActividadSiiSec = data.codActividadSiiSec === '' ? null : data.codActividadSiiSec;
        data.codActividadCmf = data.codActividadCmf === '' ? null : data.codActividadCmf;
        data.codSectorFinanCmf = data.codSectorFinanCmf?.toString() === '-1' ? null : data.codSectorFinanCmf;
        data.codCompInstitucionalCmf = data.codCompInstitucionalCmf?.toString() === '-1' ? null : data.codCompInstitucionalCmf;
 

        if (this.isEdit) {
          this.empresaService.updateEmpresa(data).subscribe({
            next: () => {
              this.toastService.showSuccess('Empresa actualizado correctamente');
              this.activeModal.close(true);
            },
            error: (e) => {
              this.loading = false;
              this.toastService.showError('Error al actualizar Empresa: ' + e.error.mensaje);
            }
          });
        } else {
          this.empresaService.createEmpresa(data).subscribe({
            next: () => {
              this.toastService.showSuccess('Empresa creado correctamente');
              this.activeModal.close(true);
            },
            error: (e) => {
              this.loading = false;
              this.toastService.showError('Error al crear Empresa: ' + e.error.mensaje);
            }
          });
        }

      } catch (e: any) {
        this.loading = false;
        this.toastService.showError('Error al guardar empresa: ' + e.error?.mensaje || e.message);
      }
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}