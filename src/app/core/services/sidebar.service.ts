import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs'; 
import { Utilities } from './utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Tamaños del sidebar
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  sidebarWidth = 280;
  collapsedWidth = 80;

  logicApiUrl = this.utilities.logicApiUrl();
  

  menuState = signal({
    isCollapsed: false, // Estado del menú (colapsado o expandido)
    isMobileMenuOpen: false, // Estado del menú en móviles (visible o oculto)
  }); 

  // Obtener ancho actual
  get currentWidth() {
    return this.menuState().isCollapsed
      ? this.collapsedWidth
      : this.sidebarWidth;
  }

  listaMenu(): Observable<any> { 
    return this.http.get(
      `${this.logicApiUrl}/api/rolacceso/menu`
    );
  }
}
