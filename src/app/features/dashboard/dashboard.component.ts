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
  constructor(private router: Router) {}

  returnLogin() {
    localStorage.removeItem('token'); // Elimina el token de autenticación
    console.log("Token borrado");
    this.router.navigate(['/login']); // Redirige al login
  }

  registerProduct() {
    this.router.navigate(['/register-product']);
  }

  goControl() {
    this.router.navigate(['/light-control']);
  }
}
