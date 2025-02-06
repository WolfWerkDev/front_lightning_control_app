import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-product',
  standalone: true,
  imports: [],
  templateUrl: './register-product.component.html',
  styleUrl: './register-product.component.scss'
})
export class RegisterProductComponent {
  constructor(private router: Router) {}

  returnLogin(){
    this.router.navigate(['/dashboard']); // Navega al login
  }
}
