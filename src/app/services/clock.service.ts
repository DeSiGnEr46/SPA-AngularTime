import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from '../../../node_modules/rxjs';
import { Tiempos } from '../interfaces/tiempos.interface';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  apptime: string = "https://apitime.azurewebsites.net/api/";

  //Observables para el cronómetro
  segObs:BehaviorSubject<number>;
  activoObs:BehaviorSubject<boolean>;
  manObservable:BehaviorSubject<boolean>; 
  autoObservable:BehaviorSubject<boolean>;

  //Variables
  dias:number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  meses:String[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  years:number[] = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  constructor(private _http:HttpClient ) {
    this.segObs = new BehaviorSubject<number>(0);
    this.activoObs = new BehaviorSubject<boolean>(false);
    this.manObservable = new BehaviorSubject<boolean>(null);
    this.autoObservable = new BehaviorSubject<boolean>(null);
   }

   nuevoTiempo(tiempo:Tiempos): any{
    let body = JSON.stringify(tiempo);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}tiempo/save`;
    return this._http.post(url, body, { headers, observe : 'response'}).pipe(
      map( resp => {
        return resp;
      })
    )}

    obtenerYears(): any{
      let datos = {
        Id_user: +localStorage.getItem("Id")
      }
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/getyears`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }
    
    obtenerMeses(year:number): any{
      let datos = {
        Id_user: +localStorage.getItem("Id"),
        Year: year
      }
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/getmeses`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }

    obtenerDias(datos:any): any{
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/getdias`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }

    obtenerPeriodo(datos:any): any{
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/getperiodos`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }

    filtroTemporal(datos:any): any{
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/filtrar`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }

    obtenerDiario(datos:any): any{
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/getdiario`;
      return this._http.post(url, body, {headers, observe: 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }

    graficoBarras(){
      let datos = {
        Id_user: +localStorage.getItem("Id")
      }
      let body = JSON.stringify(datos);
      let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': "Bearer " + localStorage.getItem("Token")
      })
      let url = `${this.apptime}tiempo/bars`;
      return this._http.post(url, body, {headers, observe : 'response'}).pipe(
        map( resp => {
          return resp.body;
        })
      )
    }
}
