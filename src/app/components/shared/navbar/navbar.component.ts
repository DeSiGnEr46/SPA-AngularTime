import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../services/log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor( private _logService:LogService, private _router:Router ) { }

  ngOnInit() {
  }

  sesionActiva():boolean{
    return this._logService.sesionValida();
  }

  esAdmin():boolean{
    return this._logService.esAdmin();
  }

  desconectarse(){
    this._logService.cerrarSesion();
    this._router.navigate(['/home']);
  }
}
