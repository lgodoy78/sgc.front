import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'; 
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user-data',
  standalone: true,
  imports: [CommonModule,NgxSkeletonLoaderModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent implements OnInit {
  
  public authService = inject(AuthService);

  public fichaPersonal = {};
  public datosPantalla = {};
  loadingFicha = true;
  mensajeError: any; 

  datosFoto = {};
  mostrarFoto: boolean = true;
  imagePath: any = '';
  tieneFoto: boolean = false;


  constructor() {
    this.tieneFoto = false;

    
  }

  ngOnInit(): void {
   // this.getFichaPersonal();
   // this.getDatosPantalla();
   // this.getFotoTrabajador();
   setTimeout(() => {
    this.loadingFicha=false;
  }, 500);
   
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

  getDatosPantalla() {
    this._fichaPersonal.obtenerDatosPantalla('trabajo')
      .subscribe((data: any) => {
          this.datosPantalla = data;
        },
        error => {
          console.log('error', error);
          this.mensajeError = error.statusText;
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
