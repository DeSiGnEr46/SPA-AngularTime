import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-eliminar-usuario',
  templateUrl: './eliminar-usuario.component.html',
  styleUrls: ['./eliminar-usuario.component.scss']
})
export class EliminarUsuarioComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute, private _router:Router,
    private _usuariosService: UsuariosService, private _location:Location) { }

  ngOnInit() {
  }

  eliminar(){
    let id = this._location.path().split("/")[2];
    this._usuariosService.eliminarUsuario(id).subscribe( resp => {
      if(resp.ok){
        this._router.navigate(['/panelAdmin']);
      }
    });
  }
}
