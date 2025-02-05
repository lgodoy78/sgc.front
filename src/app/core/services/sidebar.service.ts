import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService { 
  // Tamaños del sidebar
  sidebarWidth = 280;
  collapsedWidth = 80;

  menuState = signal({
    isCollapsed: false, // Estado del menú (colapsado o expandido)
    isMobileMenuOpen: false, // Estado del menú en móviles (visible o oculto)
  });
 
  // Obtener ancho actual
  get currentWidth() {
    return this.menuState().isCollapsed ? this.collapsedWidth : this.sidebarWidth;
  }
}