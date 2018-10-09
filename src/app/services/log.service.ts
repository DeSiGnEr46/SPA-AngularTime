import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario.interface';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LogService {

  apptime: string = "https://apitime.azurewebsites.net/api/";
  logObservable: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    this.logObservable = new BehaviorSubject<boolean>(true);
  }

  //Función que envía la información del usuario para registrarlo
  nuevoUsuario(usuario: Usuario): any {
    let body = JSON.stringify(usuario);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = this.apptime + "usuarios/save";
    return this.http.post(url, body, { headers, observe: 'response' }).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      }))
  }

  //Función que envía las credenciales para iniciar sesión
  conectarse(datos: Usuario): any {
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = `${this.apptime}usuarios/log`;

    return this.http.post(url, body, { headers, observe: 'response' })
      .pipe(
        map(resp => {
          if (resp.ok) {
            this.crearSesion(resp.body);
          }
          return resp;
        })
      )
  }

  //Función que comprueba si existe un email dado
  existeEmail(email: String): any {
    let datos = {
      Correo: email
    };

    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = `${this.apptime}usuarios/existe`;

    return this.http.post(url, body, { headers, observe: 'response'})
      .pipe(
        map(resp => {
          return resp.body;
        })
      )
  }

  //Función que crea la sesión del usuario en el navegador
  crearSesion(token: any): void {
    let tokenJson = JSON.parse(atob(token.split('.')[1])); //atob es una función que decodifica un string en base64
    let tokenString = token.toString();

    //Almacenamos la información en el almacenamiento local
    localStorage.setItem("Token", tokenString);
    localStorage.setItem("Nombre", tokenJson.Nombre);
    localStorage.setItem("Correo", tokenJson.Correo);
    localStorage.setItem("Id", tokenJson.Id);
    localStorage.setItem("Permisos", tokenJson.Permisos);
    localStorage.setItem("Exp", tokenJson.exp);
  }

  //Función que borra la información del usuario del almacenamiento local
  cerrarSesion(): void {
    localStorage.removeItem("Token");
    localStorage.removeItem("Nombre");
    localStorage.removeItem("Correo");
    localStorage.removeItem("Id");
    localStorage.removeItem("Permisos");
    localStorage.removeItem("Exp");
  }

  //Función que comprueba si el usuario es administrador
  esAdmin(): boolean {
    return localStorage.getItem("Permisos") != null && localStorage.getItem("Permisos") == "admin";
  }

  //Función que comprueba si el token no ha expirado
  sesionValida(): boolean {
    return +localStorage.getItem("Exp") * 1000 > new Date().getTime(); //El signo + convierte de string a number
    // Se multiplica por 1000 para pasar de segundos a milisegundos
  }
}
