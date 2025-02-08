import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarService } from 'src/app/core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  sidebar = inject(SidebarService);

  isCollapsed = computed(() => this.sidebar.menuState().isCollapsed);
  isMobileMenuOpen = computed(() => this.sidebar.menuState().isMobileMenuOpen);

  isTreeOpen = false;
  submenuStates: Record<string, boolean> = {};
  menuItems: any;

  constructor() {
    this.loadMenuItems();
    //this.initializeSubmenuStates(this.menuItems);
  }

  toggleCollapse() {
    this.sidebar.menuState.update((state) => ({
      ...state,
      isCollapsed: !state.isCollapsed,
    }));
  }
  toggleMobileMenu() {
    this.sidebar.menuState.update((state) => ({
      ...state,
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  }

  loadMenuItems() {
    this.sidebar.listaMenu().subscribe((response) => {
      this.menuItems = response;
    });
  }

  toggleTree(submenuKey: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submenuStates[submenuKey] = !this.submenuStates[submenuKey];
    if (this.isCollapsed()){
      this.toggleCollapse();
    }
  }

  isSubmenuOpen(submenuKey: string): boolean {
    return this.submenuStates[submenuKey];
  }

  // Inicializa todos los submenús como cerrados
  private initializeSubmenuStates(items: any) {
    items.forEach((item: { children: any; id: string | number }) => {
      if (item.children) {
        this.submenuStates[item.id] = false;
        this.initializeSubmenuStates(item.children);
      }
    });
  }
}

