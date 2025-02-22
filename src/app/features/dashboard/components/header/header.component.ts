import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { UserComponent } from "../user/user.component";
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service'; 
import { FileUploadService } from 'src/app/core/data-access/configuracion/file-upload.service';
import { BreadcrumbComponent } from 'xng-breadcrumb';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, UserComponent, BreadcrumbComponent]
})
export class HeaderComponent { 
  sidebar = inject(SidebarService); 
  empresaService = inject(EmpresaService); 
  fileUploadService = inject(FileUploadService); 
  nombreFantasia: any;
  fotoEmpresa: any = '';
  fotoUsuario: any = 'assets/fotos/'+this.authService.getUsuarioState.idUsuario+'.png';

  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {

    this.getEmpresa();
    this.getLogo();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }

  toggleMobileMenu() {
    this.sidebar.menuState.update(state => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
      isCollapsed: false
    }));
  }

  getEmpresa() {
    
    this.empresaService.getEmpresa(this.authService.getUsuarioState.rutEmpresa).subscribe({
      next: (data) => {  
        this.nombreFantasia = data.nombreFantasia;
      },
      error: (e) => {
        console.log('error', e);
      }
    });
  }
  
  getLogo(){
    if (this.authService.getUsuarioState.rutEmpresa) {
      this.fotoEmpresa = this.fileUploadService.getLogoUrl(this.authService.getUsuarioState.rutEmpresa);
    } 
  }
}