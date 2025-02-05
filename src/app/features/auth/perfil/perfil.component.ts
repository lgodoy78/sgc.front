import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
}) 
export default class PerfilComponent { 
  form = this.fb.group({
    empresa: ['', [Validators.required]] 
  });
 
  isLoading = signal(false);
  errorMessage = signal<string>('');
  showPassword = false;
  empresas: any[] = [];

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

    this.loadEmpresas();
  }

  loadEmpresas() {
    this.empresas = [
      { id: 1, nombre: 'Empresa 1' },
      { id: 2, nombre: 'Empresa 2' },
      { id: 3, nombre: 'Empresa 3' },
    ];
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const empresa = this.form.value.empresa?.trim() || ''; 
      
      if (!this.validateForm(empresa)) return; 
  
      var response = await this.authService.Auth(empresa); 
      if (!response){
        this.errorMessage.set("Credenciales inválidas");
        return;
      }
      if (response.codigoError > 0){
        this.errorMessage.set(response.mensajeError);
        return;
      }
 
      this.isLoading.set(false);
      await this.router.navigate(['/dashboard']);
  }

  private validateForm(empresa: string): boolean {
    if (!empresa) {
      this.errorMessage.set('Por favor complete todos los campos');
      return false;
    } 
    
    return true;
  }
   
 
  get empresa() {
    return this.form.get('empresa');
  } 
 
}
