import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from 'src/app/core/data-access/configuracion/empresa.service';
import { Empresa } from 'src/app/core/model/empresa.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edicion-empresa',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edicion-empresa.component.html',
  styleUrl: './edicion-empresa.component.scss'
})
export class EdicionEmpresaComponent {
  @Input() company?: Empresa;
  
  empresaService = inject(EmpresaService);
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    website: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
    taxId: ['', Validators.required],
    description: ['']
  });

  isSubmitting = false;

  constructor(
    public activeModal: NgbActiveModal
  ) {
    if (this.company) {
      this.form.patchValue(this.company);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    this.isSubmitting = true;
    const companyData = this.form.value as Empresa;

    const operation = this.company 
      ? this.empresaService.updateCompany({ ...this.company, ...companyData }).pipe()
      : this.empresaService.createCompany(companyData).pipe();

   /* operation.subscribe({
      next: () => {
        this.activeModal.close();
        this.isSubmitting = false;
      },
      error: () => this.isSubmitting = false
    });*/
  }
}