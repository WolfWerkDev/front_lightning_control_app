import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  usuarioName: string | null;
  usuarioLastName: string | null;

  constructor(private router: Router) {
    this.usuarioName = sessionStorage.getItem('nombres');
    this.usuarioLastName = sessionStorage.getItem('apellidos');
  }

  returnLogin() {
    sessionStorage.clear(); // Limpia todos los datos de la sesión
    console.log("Sesión cerrada");
    this.router.navigate(['/login']); // Redirige al login
  }

  registerProduct() {
    this.router.navigate(['/register-product']);
  }

  goControl() {
    this.router.navigate(['/light-control']);
  }
}
