import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

//Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/log/login/login.component';
import { SignupComponent } from './components/log/signup/signup.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { PanelAdministracionComponent } from './components/panel-administracion/panel-administracion.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HerramientasComponent } from './components/herramientas/herramientas.component';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { EliminarUsuarioComponent } from './components/eliminar-usuario/eliminar-usuario.component';
import { EliminarCategoriaComponent } from './components/eliminar-categoria/eliminar-categoria.component';

//Rutas
import { APP_ROUTING } from './app.routes';

//Servicios
import { UsuariosService } from './services/usuarios.service';
import { LogService } from './services/log.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AdminGuardService } from './services/admin-guard.service';
import { ClockService } from './services/clock.service';
import { CategoriasService } from './services/categorias.service';
import { TimerService } from './services/timer.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    PerfilComponent,
    PanelAdministracionComponent,
    DashboardComponent,
    HerramientasComponent,
    EditarUsuarioComponent,
    EliminarUsuarioComponent,
    EliminarCategoriaComponent
  ],
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    UsuariosService,
    LogService,
    AuthGuardService,
    AdminGuardService,
    ClockService,
    CategoriasService,
    TimerService
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule { }
