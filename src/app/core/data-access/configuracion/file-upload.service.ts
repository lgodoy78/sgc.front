import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { Utilities } from 'src/app/core/services/utilities'; 

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private utilities = inject(Utilities);
  private http = inject(HttpClient);
  private logicApiUrl = this.utilities.logicApiUrl(); 
  
  uploadLogo(base64Image: string, rutEmpresa: number): Observable<any> {
    return this.http.post(`${this.logicApiUrl}/api/empresa/upload-logo`, {
      base64Image,
      rutEmpresa
    });
  }

  getLogoUrl(rutEmpresa: number): string {
    return `${this.logicApiUrl}/api/empresa/logo/${rutEmpresa}`;
  }
}
