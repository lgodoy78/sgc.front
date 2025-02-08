import { Component, inject, TemplateRef } from '@angular/core'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss',
})
export class LogoutComponent {
  authService = inject(AuthService); 
  modalService = inject(BsModalService); 
  cerrarSesionRef?: BsModalRef;
 
  cierreSesion() {
    this.cerrarSesionRef?.hide();
    this.authService.logout();
  }

  hideModal() {
    this.cerrarSesionRef?.hide();
  }

  openModal(cerrarSesion: TemplateRef<any>) {
    this.cerrarSesionRef = this.modalService.show(
      cerrarSesion,
      Object.assign({}, { class: 'modal-dialog-centered' })
    );
  }
}
