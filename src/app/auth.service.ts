import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/login'; // URL del backend

  constructor(private http: HttpClient) { }

  // Método de login
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
  
    return this.http.post<{ tokenService: string, id: number, nombres: string, apellidos: string }>(this.apiUrl, body).pipe(
      tap(response => {
        console.log('Respuesta completa del backend:', response); // Depuración
    
        if (response.tokenService && response.id !== undefined) {
          sessionStorage.setItem('token', response.tokenService);
          sessionStorage.setItem('id', response.id.toString()); // Guardar en sessionStorage
          sessionStorage.setItem('nombres', response.nombres);
          sessionStorage.setItem('apellidos', response.apellidos);
    
          console.log('ID almacenado en sessionStorage:', sessionStorage.getItem('id')); // Confirmación
        } else {
          console.error('Error: La respuesta no contiene tokenService o id.');
        }
      })
    );
    
    
  }
  

  // Método para obtener el token
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getId(): string | null {
    return sessionStorage.getItem('id');
  }
  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    sessionStorage.removeItem('token');
  }
}
