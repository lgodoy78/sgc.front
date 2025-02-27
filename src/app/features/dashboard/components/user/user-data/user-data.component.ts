import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'; 
import { AuthService } from 'src/app/core/services/auth.service';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { ModalTypeService } from 'src/app/core/services/modal-type.service'

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule,NgxSkeletonLoaderModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent implements OnInit {
  
  authService = inject(AuthService);
  empresaService = inject(EmpresaService);
  modalTypeService = inject(ModalTypeService);

  public fichaPersonal = {};
  datosEmpresa: any;
  loadingFicha = true;
  mensajeError: any; 
  fotoUsuario: any = 'assets/fotos/'+this.authService.getUsuarioState.idUsuario+'.png';

  datosFoto = {};
  mostrarFoto: boolean = true;
  imagePath: any = '';
  tieneFoto: boolean = false;


  constructor() {
    this.tieneFoto = false;

    
  }

  ngOnInit(): void {
    this.getEmpresa();
   // this.getFichaPersonal();
   // this.getFotoTrabajador();
   setTimeout(() => {
    this.loadingFicha=false;
  }, 500);
   
  }

  getEmpresa() {
    
    this.empresaService.getEmpresa(this.authService.getUsuarioState.rutEmpresa).subscribe({
      next: (data) => {   
        this.datosEmpresa = data;
      },
      error: (e) => {
        console.log('error', e);
        this.mensajeError = e.statusText;
        this.modalTypeService.openWarningModalMessage('Error', this.mensajeError);
      }
    });
  }

  /*getFichaPersonal() {
    this._fichaPersonal.obtenerDatosTrabajadorConectado()
      .subscribe((data: any) => {
          this.fichaPersonal = data;
          setTimeout(() => {
            this.loadingFicha = false;
          }, 300);
        },
        error => {
          console.log('error', error);
          this.mensajeError = error.statusText;
          this.loadingFicha = false;
          this._modalTypeService.openWarningModalMessage(this.mensajeError);
        });
  }



  getFotoTrabajador() {
    this._fichaPersonal.obtenerFotografiaTrabajador()
      .subscribe((data: any) => {
          this.datosFoto = data;
          this.mostrarFoto = data.mostrarFotografia;
          if (data.fotografiaBase64 !== '') {
            this.tieneFoto = true;
          }
        },
        error => {
          this.mensajeError = error.statusText;
          this._modalTypeService.openWarningModalMessage(this.mensajeError);
        });
  }*/

}
