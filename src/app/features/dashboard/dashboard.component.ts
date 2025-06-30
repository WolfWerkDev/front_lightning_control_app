import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  usuarioName: string | null;
  usuarioLastName: string | null;
  usuarioId: string | null;
  token: string | null;
  usuarioFirstName: string | null;


  constructor(private router: Router, private http: HttpClient) {
    this.usuarioName = sessionStorage.getItem('nombres');
    this.usuarioFirstName = sessionStorage.getItem('nombres')?.split(' ')[0] || 'Usuario';
    this.usuarioLastName = sessionStorage.getItem('apellidos');
    this.usuarioId = sessionStorage.getItem('id'); // Asegúrate de que 'usuarioId' esté en sessionStorage
    this.token = sessionStorage.getItem('token'); // Obtén el token de sesión
  }

  returnLogin() {
    sessionStorage.clear(); // Limpia todos los datos de la sesión
    console.log("Sesión cerrada");
    this.router.navigate(['/login']); // Redirige al login
  }

  registerProduct() {
    this.router.navigate(['/register-product']);
  }
  greetByHour() {
    const horaActual = new Date().getHours();
    if (horaActual >= 0 && horaActual < 12) {
      return "Buenos días " + this.usuarioFirstName;
    } else if (horaActual >= 12 && horaActual < 18) {
      return "Buenas tardes " + this.usuarioFirstName;
    } else {
      return "Buenas noches " + this.usuarioFirstName;
    }
  }


  goControl() {
    if (this.usuarioId && this.token) {
      // Configurar los headers con el token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      // Consumimos el endpoint con el id del usuario
      this.http.get(`http://localhost:8080/product/my-products/${this.usuarioId}`, { headers }).subscribe(
        (productos) => {
          console.log('Productos obtenidos:', productos);
          // Guardamos los productos en sessionStorage para usar en la página siguiente
          sessionStorage.setItem('productos', JSON.stringify(productos));
          this.router.navigate(['/light-control']); // Redirige a la página de control
        },
        (error) => {
          console.error('Error obteniendo productos:', error);
        }
      );
    } else {
      console.error('Faltan datos para realizar la solicitud');
    }
  }
}
