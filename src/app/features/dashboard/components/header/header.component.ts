import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { UserComponent } from "../user/user.component";

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, UserComponent]
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