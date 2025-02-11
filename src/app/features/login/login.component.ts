import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { AuthService } from '../../auth.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule], // Agrega HttpClientModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService // Inyecta el servicio
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Llama al servicio de autenticación
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('token', response.token); // Si el backend devuelve un token
          localStorage.setItem('id', response.usuarioId);
          this.router.navigate(['/dashboard']); // Redirige al usuario
        },
        (error) => {
          console.error('Error de autenticación:', error);
        }
      );
    }
  }
}
