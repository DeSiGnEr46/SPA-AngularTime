import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LogService } from './log.service';
import { map } from 'rxjs/operators';
import { Usuario } from '../interfaces/usuario.interface';
import { BehaviorSubject } from '../../../node_modules/rxjs';

@Injectable()
export class UsuariosService {

  apptime: string = "https://apitime.azurewebsites.net/api/";
  usuarios: Usuario[];
  editObservable:BehaviorSubject<boolean>; 
  passObservable:BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private logServ: LogService) {
    this.editObservable = new BehaviorSubject<boolean>(null);
    this.passObservable = new BehaviorSubject<boolean>(null);
  }

  editarDatos(datos: any): any {
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    });
    let url = `${this.apptime}usuarios/edit`;
    return this.http.post(url, body, { headers, observe: 'response' }).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      }))
  }

  eliminarUsuario(id: any): any {
    let datos = {
      Id: id
    }

    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    });
    let url = `${this.apptime}usuarios/del`;
    
    return this.http.post(url, body, { headers, observe: 'response'}).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      })
    )
  }

  cambiarPass(datos: any): any {
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    let url = `${this.apptime}usuarios/changep`;
    return this.http.post(url, body, { headers, observe: 'response' }).pipe(
      map(resp => {
        console.log(resp);
        return resp;
      }))
  }

  obtenerUsuarios(): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    let url = `${this.apptime}usuarios/get`;
    return this.http.get(url, { headers, observe: 'response' }).pipe(
      map(resp => {
        console.log(resp);
        if (resp.ok) {
          return resp.body;
        } 
      })
    )
  }

  buscarUsuario(texto: String): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    let url = `${this.apptime}usuarios/name/${texto}`;
    return this.http.get(url, { headers, observe: 'response'}).pipe(
      map(resp => {
        console.log(resp);
        if(resp.ok){
          return resp.body;
        }
      })
    )
  }

  buscarUsuarioId(id: String): any {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem("Token")}`
    });
    let url = `${this.apptime}usuarios/get/${id}`;
    return this.http.get(url, { headers, observe : 'response'}).pipe(
      map(resp => {
        console.log(resp);
        if(resp.ok){
          return resp.body;
        }
      })
    )
  }
}
