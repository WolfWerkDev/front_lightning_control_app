import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-product.component.html',
  styleUrl: './register-product.component.scss'
})
export class RegisterProductComponent {
  codigoValidacion: string = '';
  apiUrl = 'http://localhost:8080/product/validation'; // Reemplázalo por tu API real

  constructor(private router: Router, private http: HttpClient) {}

  returnLogin() {
    this.router.navigate(['/dashboard']);
  }

  verificarProducto() {
    if (this.codigoValidacion.length !== 9) {
      alert('El código debe tener 9 dígitos.');
      return;
    }

    const usuarioId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token'); // Obtiene el token del almacenamiento local

    if (!usuarioId || !token) {
      alert('Usuario no identificado o sesión expirada.');
      return;
    } 

    const payload = {
      id: parseInt(usuarioId, 10),
      codigoValidacion: this.codigoValidacion
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Añade el token en el header
    });

    this.http.post(this.apiUrl, payload, { headers }).subscribe({
      next: (response) => {
        alert('Producto registrado con éxito.');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        alert(error.error.message || 'Error al registrar el producto.');
      }
    });
  }
}
