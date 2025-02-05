import { Component, inject, signal } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent { 
  sidebar = inject(SidebarService); 

  constructor(
    public themeService: ThemeService,
    public authService: AuthService
  ) {}

 

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

}