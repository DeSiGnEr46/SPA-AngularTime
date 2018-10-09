import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Categoria } from '../interfaces/categoria.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  apptime: string = "https://apitime.azurewebsites.net/api/";

  constructor( private _http:HttpClient ) { }

  ObtenerCategorias(): any{
    let cat:Categoria = {
      Id_user : +localStorage.getItem("Id")
    }
    let body = JSON.stringify(cat);
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}categorias/get`;

    return this._http.post(url, body, {headers, observe : 'response'}).pipe(
      map(
        resp => {
          if(resp.ok){
            return resp.body;
          }
        }
      ))
  }

  NuevaCategoria(datos:Categoria) : any{
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}categorias/save`;
    
    return this._http.post(url, body, {headers, observe : 'response'}).pipe(
      map(
        resp => {
          return resp;
        }
      )
    )
  }

  EliminarCategoria(cat:string) : any{
    let datos:Categoria = {
      Id_user : +localStorage.getItem("Id"),
      Nombre : cat
    }
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}categorias/del`;
    
    return this._http.post(url, body, {headers, observe : 'response'}).pipe(
      map(
        resp => {
          return resp;
        }
      )
    )
  }

  existeCategoria(cat:string) : any{
    let datos:Categoria = {
      Id_user : +localStorage.getItem("Id"),
      Nombre : cat
    }
    let body = JSON.stringify(datos);
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}categorias/existe`;
    
    return this._http.post(url, body, {headers, observe : 'response'}).pipe(
      map(
        resp => {
          return resp.body;
        }
      )
    )
  }
}
