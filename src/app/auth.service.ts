import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define la URL de la API de login
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/login'; // Cambia esta URL a la de tu backend

  constructor(private http: HttpClient) { }

  // Método de login que hace una petición POST con los datos del usuario
  login(email: string, password: string): Observable<any> {
    const body = { email, password }; // Los datos que enviamos al backend
    return this.http.post(this.apiUrl, body); // Realiza la petición HTTP POST
  }

  // Otras funciones relacionadas con la autenticación pueden ir aquí (por ejemplo, logout)
}
