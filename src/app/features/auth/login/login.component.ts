import { Component, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/core/services/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent { 
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
 
  isLoading = signal(false);
  errorMessage = signal<string>('');
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    effect(() => {
      document.documentElement.setAttribute(
        'data-bs-theme',
        this.themeService.currentTheme()
      );
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const email = this.form.value.email?.trim() || '';
      const password = this.form.value.password?.trim() || '';
      
      if (!this.validateCredentials(email, password)) return;
  
      var response = await this.authService.login(email, password); 
      if (!response){
        this.errorMessage.set("Credenciales inválidas");
        return;
      }
      if (response.codigoError > 0){
        this.errorMessage.set(response.mensajeError);
        return;
      }
 
      await this.router.navigate(['/perfil']);
      
    } catch (error: unknown) {
      this.handleError(error);
      
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateCredentials(email: string, password: string): boolean {
    if (!email || !password) {
      this.errorMessage.set('Por favor complete todos los campos');
      return false;
    } 
    
    return true;
  }
  
  private handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      this.errorMessage.set(
        error.status === 401 
          ? 'Credenciales inválidas' 
          : `Error del servidor (${error.status})`
      );
    } else if (error instanceof Error) {
      this.errorMessage.set('Error del servidor');
    } else {
      this.errorMessage.set('Error desconocido');
    }
  }

  // Helper para acceder a los controles
  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
