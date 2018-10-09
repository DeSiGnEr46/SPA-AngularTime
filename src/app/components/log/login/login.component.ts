import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService } from '../../../services/log.service';
import { Usuario } from '../../../interfaces/usuario.interface';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  styles: [`
    .ng-invalid.ng-touched:not(form){
      color: red;
    }
  `]
})
export class LoginComponent implements OnInit {

  //Variables
  forma: FormGroup;
  correcto: boolean;
  subscription: Subscription;

  datos: Usuario = {
    Nombre: null,
    Correo: null,
    Hash: null
  }

  ngOnInit() {
    if (this._logService.sesionValida()) {
      this._router.navigate(['/home']);
    }
    this.subscription = this._logService.logObservable.subscribe(valor => {
      this.correcto = valor;
    });
  }

  ngOnDestroy() {
    this._logService.logObservable.next(true);
    this.subscription.unsubscribe();
  }

  constructor(private _logService: LogService, private _router: Router, private ref: ChangeDetectorRef) {

    this.forma = new FormGroup({
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"),
        this.noVacio
      ]),

      'password': new FormControl('', [
        Validators.required,
        this.noVacio
      ])
    });
  }

  logearse() {
    this.datos = {
      Nombre: null,
      Correo: this.forma.controls['email'].value,
      Hash: this.forma.controls['password'].value
    }

    console.log(this.datos);

    this._logService.conectarse(this.datos)
      .subscribe(resp => {
        this._router.navigate(['/home']);
      },
        error => {
          this._logService.logObservable.next(false);
          console.log(error);
        }
      );
  }

  //Validaciones
  noVacio(control: FormControl): { [s: string]: boolean } { //Devuelve un string que es de tipo booleano
    if (typeof control.value === 'string' && !control.value.trim()) {
      return {
        novacio: true
      }
    }
    return null;
  }
}
