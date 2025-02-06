import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RegisterProductComponent } from './features/register-product/register-product.component';
import { LightControlComponent } from './features/light-control/light-control.component';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la raíz a login
  { path: 'login', component: LoginComponent }, // Ruta de login
  { path: 'register', component: RegisterComponent }, // Ruta de registro
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'register-product', component: RegisterProductComponent, canActivate: [AuthGuard] }, // Protegida
  { path: 'light-control', component: LightControlComponent, canActivate: [AuthGuard] }, // Protegida
  { path: '**', redirectTo: '/login', pathMatch: 'full' } // Redirige rutas no existentes a login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
