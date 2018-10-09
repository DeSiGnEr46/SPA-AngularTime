import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriasService } from '../../services/categorias.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-eliminar-categoria',
  templateUrl: './eliminar-categoria.component.html',
  styleUrls: ['./eliminar-categoria.component.scss']
})
export class EliminarCategoriaComponent implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute, private _router:Router,
    private _catService: CategoriasService, private _location:Location) { }

  ngOnInit() {
  }

  eliminar(){
    let nombre = this._location.path().split("/")[2];
    this._catService.EliminarCategoria(nombre).subscribe( resp => {
      if(resp.ok){
        this._router.navigate(['/herramientas']);
      }
    });
  }
}
