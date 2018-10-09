import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  ruta: any;
  altura: any;

  constructor(private _router: Router, private _route: ActivatedRoute, private _location: Location) { }

  ngOnInit() {
    this._router.events.subscribe(c => {
      this.ruta = this._location.path().split("/")[1]; //Obtenemos el path, separamos utilizando el carácter "/". El primer 
      //resultado es una cadena vacía ya que la ruta siempre empieza por "/"
      this.altura = window.innerHeight;
    })
  }
}


