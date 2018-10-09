import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { LogService } from '../../services/log.service';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  styles: [`
    .ng-invalid.ng-touched:not(form){
      color: red;
  }
`]
})
export class PerfilComponent implements OnInit {

  cambioDatos: FormGroup;
  cambioPass: FormGroup;

  editok:boolean = null;
  passok:boolean = null;

  editsusc:Subscription;
  passsusc:Subscription;

  ngOnInit() {
    this.editsusc = this._usuariosService.editObservable.subscribe( valor => {
      this.editok = valor;
    })
    this.passsusc = this._usuariosService.passObservable.subscribe( valor => {
      this.passok = valor;
    })
  }

  ngOnDestroy(){
    this._usuariosService.editObservable.next(null);
    this._usuariosService.passObservable.next(null);
    this.editsusc.unsubscribe();
    this.passsusc.unsubscribe();
  }

  constructor(private _usuariosService: UsuariosService, private _router:Router, private _logService:LogService ) {

    this.cambioDatos = new FormGroup({
      'nombre': new FormControl(
        localStorage.getItem("Nombre"), [
          Validators.required,
          Validators.minLength(3),
          this.noVacio
        ]),
      'correo': new FormControl(
        localStorage.getItem("Correo"), [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.{1}[a-z]{2,3}$"),
          this.noVacio
        ])
    });

    this.cambioPass = new FormGroup({
      'nuevaPass': new FormControl("", [
        Validators.required,
        this.noVacio,
        Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,}$")
      ]),
      'rePass': new FormControl()
    });

    this.cambioPass.controls['rePass'].setValidators([
      Validators.required,
      this.noVacio,
      this.coinciden.bind(this)
    ])
  }


  /*******************************
   Funciones funcionales extras
   *******************************/
  
  editarInfo() {
    let edit:Usuario = {
      Id: +localStorage.getItem("Id"),
      Nombre: this.cambioDatos.controls['nombre'].value.trim(),
      Correo: this.cambioDatos.controls['correo'].value.trim(),
      Permisos: localStorage.getItem("Permisos")
    }

    this._usuariosService.editarDatos(edit)
      .subscribe(respuesta => {
            this._logService.cerrarSesion();
            this._logService.crearSesion(respuesta.body);
            this._usuariosService.editObservable.next(true);
          },
          error => {
            console.log(error);
            this._usuariosService.editObservable.next(false);
          }
        )
  }

  cambiarPassword(){
    let nuevaPass = {
      Id: localStorage.getItem("Id"),
      Hash: this.cambioPass.controls['nuevaPass'].value.trim()
    }
    console.log(nuevaPass);

    this._usuariosService.cambiarPass(nuevaPass)
      .subscribe( respuesta => {
        this._usuariosService.passObservable.next(true);
      }, error => {
        this._usuariosService.passObservable.next(false);
        console.log(error);
      }
    )
  }

  /*******************************
  Funciones de validación extras
  ********************************/
  noVacio(control: FormControl): { [s: string]: boolean } { //Devuelve un string seguido de un valor booleano
    if (typeof control.value === 'string' && !control.value.trim()) {
      return {
        novacio: true
      }
    }
    return null;
  }


  coinciden(control: FormControl): { [s: string]: boolean } {
    if (control.value !== this.cambioPass.controls['nuevaPass'].value) {
      return {
        nocoinciden: true
      }
    }
    return null;
  }
}
