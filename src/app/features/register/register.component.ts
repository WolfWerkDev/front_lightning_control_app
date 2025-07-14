import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = {
    nombres: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Mostrar el objeto user en la consola para verificar su formato
    // console.log('Datos enviados:', JSON.stringify(this.user)); // Usamos stringify para ver el formato exacto

    // No es necesario agregar 'Content-Type' manualmente en este caso, Angular lo hace automáticamente
    this.http.post('http://localhost:8080/register', this.user).subscribe(
      (response) => {
        // console.log('Usuario registrado con éxito', response);
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error en el registro', error);
        
        // Verifica si hay un mensaje de error en la respuesta del backend
        if (error.error) {
          alert('Error en el registro: ' + error.error);
        } else {
          alert('Error en el registro');
        }
      }
    );
  }

  returnLogin() {
    this.router.navigate(['/login']);
  }
}
