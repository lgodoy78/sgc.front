import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from "./logout/logout.component";
import { UserPasswordComponent } from "./user-password/user-password.component";
import { UserDataComponent } from "./user-data/user-data.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, LogoutComponent, UserPasswordComponent, UserDataComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  verPerfilUser = false; 
  showButtons: boolean = true; 


  toggleVerPerfilUser() {
    this.verPerfilUser = !this.verPerfilUser;
    this.showButtons = true;
    this.changeVisibility();
 
  }

  changeVisibility() {
    setTimeout(() => {
      this.showButtons = false;
    }, 300);
  }


}
