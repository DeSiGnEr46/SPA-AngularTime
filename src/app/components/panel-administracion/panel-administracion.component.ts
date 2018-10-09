import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-administracion',
  templateUrl: './panel-administracion.component.html',
  styleUrls: ['./panel-administracion.component.scss']
})
export class PanelAdministracionComponent implements OnInit {

  searchText: String;
  usuarios: Usuario[];

  constructor(private _usuariosService: UsuariosService, private _router: Router) {
    _usuariosService.obtenerUsuarios().subscribe((datos) => {
      this.usuarios = datos;
      console.log(datos);
    })
  }

  ngOnInit() {
  }

  buscar(): any {
    this._usuariosService.buscarUsuario(this.searchText).subscribe((datos) => {
      this.usuarios = datos;
      console.log(datos);
    })
  }

  todos(): any {
    this._usuariosService.obtenerUsuarios().subscribe( datos => {
      this.usuarios = datos;
    })
  }
}
