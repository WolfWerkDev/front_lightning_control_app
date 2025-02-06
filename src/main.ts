import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Proporciona las rutas
    provideHttpClient(), // Proporciona el cliente HTTP
    importProvidersFrom(FormsModule) // Importa FormsModule para usar [(ngModel)]
  ]
}).catch(err => console.error(err));
