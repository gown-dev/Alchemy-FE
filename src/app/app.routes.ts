import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/homepage/homepage.component';
import { ShopsComponent } from './pages/shops/shops.component';
import { AdminClothesComponent } from './admin/clothes/clothes.component';
import { AdminGenesComponent } from './admin/genes/genes.component';

export const routes: Routes = [
  // Redirect empty path to /home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Main routes
  { path: 'home', component: HomeComponent },
  //    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'shops', component: ShopsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Admin routes
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'admin/clothing',
    component: AdminClothesComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/genes',
    component: AdminGenesComponent,
    canActivate: [AdminGuard],
  },

  // Wildcard redirect
  { path: '**', redirectTo: 'home' },
];
