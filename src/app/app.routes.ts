import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { AdminClothesComponent } from './admin/clothes/clothes.component';
import { AdminGenesComponent } from './admin/genes/genes.component';

export const routes: Routes = [
  // redirect empty path to /home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazy-load standalone HomeComponent
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/homepage/homepage.component').then(
        (m) => m.HomeComponent
      ),
  },

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  { path: 'admin/clothing', component: AdminClothesComponent, canActivate: [AdminGuard] },
  { path: 'admin/genes', component: AdminGenesComponent, canActivate: [AdminGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' },
];
