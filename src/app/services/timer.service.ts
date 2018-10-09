import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Timer } from '../interfaces/timer.interface';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  apptime: string = "https://apitime.azurewebsites.net/api/";

  constructor(private _http:HttpClient) { }

  nuevoTimer(timer:Timer):any {
    let body = JSON.stringify(timer);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}cronometros/save`;
    return this._http.post(url, body, {headers, observe: 'response'}).pipe(
      map( resp => {
        console.log(resp);
        return resp;
      })
    )
  }

  eliminarTimer(timer:Timer):any{
    let body = JSON.stringify(timer);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}cronometros/delete`;
    return this._http.post(url, body, {headers, observe: 'response'}).pipe(
      map( resp => {
        console.log(resp);
        return resp;
      })
    )
  }

  getTimer(timer:Timer):any{
    let body = JSON.stringify(timer);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}cronometros/get`;
    return this._http.post(url, body, {headers, observe: 'response'}).pipe(
      map( resp => {
        console.log(resp);
        return resp.body;
      })
    )
  }

  existeTimer(timer:Timer):any{
    let body = JSON.stringify(timer);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + localStorage.getItem("Token")
    })
    let url = `${this.apptime}cronometros/existe`;
    return this._http.post(url, body, {headers, observe: 'response'}).pipe(
      map( resp => {
        console.log(resp);
        return resp.body;
      })
    )
  }
}
