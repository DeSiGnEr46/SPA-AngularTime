import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/log/login/login.component';
import { SignupComponent } from './components/log/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PanelAdministracionComponent } from './components/panel-administracion/panel-administracion.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { HerramientasComponent } from './components/herramientas/herramientas.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { EliminarUsuarioComponent } from './components/eliminar-usuario/eliminar-usuario.component';
import { EliminarCategoriaComponent } from './components/eliminar-categoria/eliminar-categoria.component';

const app_routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'panelAdmin', component: PanelAdministracionComponent, canActivate: [AuthGuardService, AdminGuardService] },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuardService] },
  { path: 'herramientas', component: HerramientasComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'editar/:id', component: EditarUsuarioComponent, canActivate: [AuthGuardService, AdminGuardService] },
  { path: 'eluser/:id', component: EliminarUsuarioComponent, canActivate: [AuthGuardService, AdminGuardService] },
  { path: 'elcat/:nombre', component: EliminarCategoriaComponent, canActivate: [AuthGuardService]},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(app_routes);