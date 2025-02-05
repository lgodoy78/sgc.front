
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  sidebar = inject(SidebarService);
  
  isCollapsed = computed(() => this.sidebar.menuState().isCollapsed);
  isMobileMenuOpen = computed(() => this.sidebar.menuState().isMobileMenuOpen);

  isTreeOpen = false;  
 
  

  toggleCollapse() {
    this.sidebar.menuState.update(state => ({
      ...state,
      isCollapsed: !state.isCollapsed,
    }));
  } 
  toggleMobileMenu() {
    this.sidebar.menuState.update(state => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  }

  // Objeto para controlar el estado de cada submenú
  submenuStates: { [key: string]: boolean } = {
    estructura: false,
    metodologias: false,
    ley: false,
    procesos: false
  };

  toggleTree(submenuKey: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submenuStates[submenuKey] = !this.submenuStates[submenuKey];
  }

  isSubmenuOpen(submenuKey: string): boolean {
    return this.submenuStates[submenuKey];
  }

}