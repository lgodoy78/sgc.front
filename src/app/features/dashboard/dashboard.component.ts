import { Component, computed, effect, inject, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export default class DashboardComponent {
  sidebar = inject(SidebarService);
  // Señal para controlar el estado del sidebar en móviles 
  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {
    effect(() => {
      document.documentElement.setAttribute(
        'data-bs-theme',
        this.themeService.currentTheme()
      );
    }); 
  }
  
 
  // Método para cerrar sesión (llamado desde el dropdown)
  onLogout() {
    this.authService.logout();
  }
}
