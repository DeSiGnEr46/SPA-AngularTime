import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { Subscription } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-editar',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
  styles: [`
    .ng-invalid.ng-touched:not(form){
      color: red;
  }
`]
})
export class EditarUsuarioComponent implements OnInit {

  cambioDatos: FormGroup;
  cambioPass: FormGroup;
  usuario: Usuario = null;

  editok: boolean = null;
  passok: boolean = null;

  editsusc: Subscription;
  passsusc: Subscription;

  ngOnInit() {
    //Inicialización de los parámetros del formulario con los valores del usuario
    this._activatedRoute.params.subscribe(datos => {
      this._usuariosService.buscarUsuarioId(datos['id']).subscribe(
        resp => {
          this.usuario = resp;
          console.log(resp);
          this.cambioDatos.controls['nombre'].setValue(resp.Nombre);
          this.cambioDatos.controls['correo'].setValue(resp.Correo);
          this.cambioDatos.controls['permisos'].setValue(resp.Permisos);
        }
      )
    })

    //Nos suscribimos a los observadores para poder controlar los cambios en los mensajes de confirmación/error
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

  constructor(private _usuariosService: UsuariosService, private _router: Router, private _activatedRoute: ActivatedRoute) {

    this.cambioDatos = new FormGroup({
      'nombre': new FormControl(
        "", [
          Validators.required,
          Validators.minLength(3),
          this.noVacio
        ]),
      'correo': new FormControl(
        "", [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.{1}[a-z]{2,3}$"),
          this.noVacio
        ]),
      'permisos': new FormControl(
        "", [
          Validators.required
        ]
      )
    });

    this.cambioPass = new FormGroup({
      'nuevaPass': new FormControl('', [
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
    let edit = {
      Id: this.usuario.Id,
      Nombre: this.cambioDatos.controls['nombre'].value.trim(),
      Correo: this.cambioDatos.controls['correo'].value.trim(),
      Permisos: this.cambioDatos.controls['permisos'].value.trim()
    }
    console.log(edit);

    this._usuariosService.editarDatos(edit)
      .subscribe(respuesta => {
        this._usuariosService.editObservable.next(true);
      },
      error => {
        this._usuariosService.editObservable.next(false);
        console.log(error);
      }
    )
  }

  cambiarPassword() {
    let nuevaPass = {
      Id: this.usuario.Id,
      Hash: this.cambioPass.controls['nuevaPass'].value.trim()
    }
    console.log(nuevaPass);

    this._usuariosService.cambiarPass(nuevaPass)
      .subscribe(respuesta => {
        this._usuariosService.passObservable.next(true);
      },
      error => {
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
