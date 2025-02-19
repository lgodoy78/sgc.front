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
      this.initializeSubmenuStates(this.menuItems);
    });
  }

  toggleTree(submenuKey: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submenuStates[submenuKey] = !this.submenuStates[submenuKey];
    if (this.isCollapsed()){
      this.toggleCollapse();
    }
    localStorage.setItem('submenuStates', JSON.stringify(this.submenuStates));
  }

  isSubmenuOpen(submenuKey: string): boolean {
    return this.submenuStates[submenuKey];
  }
 
  private initializeSubmenuStates(items: any) { 
    const submenuStates = localStorage.getItem('submenuStates');
    const storedStates: Record<string, boolean> = submenuStates ? JSON.parse(submenuStates) : {}; 
    const processItems = (items: any) => {
        items.forEach((item: { hijos: any; id: string | number }) => {
            if (item.hijos) {
                this.submenuStates[item.id] = storedStates[item.id.toString()] ?? false; 
                processItems(item.hijos);
            }
        });
    };

    processItems(items);

    localStorage.setItem('submenuStates', JSON.stringify(this.submenuStates));
}
}

