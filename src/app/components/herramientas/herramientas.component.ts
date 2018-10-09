import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '../../../../node_modules/@angular/forms';
import { Subscription } from '../../../../node_modules/rxjs';
import { ClockService } from '../../services/clock.service';
import { CategoriasService } from '../../services/categorias.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { Tiempos } from '../../interfaces/tiempos.interface';
import { Timer } from '../../interfaces/timer.interface';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-herramientas',
  templateUrl: './herramientas.component.html',
  styleUrls: ['./herramientas.component.scss'],
  styles: [`
  .ng-invalid.ng-touched:not(form){
    color: red;
}
`]
})
export class HerramientasComponent implements OnInit {

  //Variables enlazadas a los formularios
  formTime: FormGroup;
  formCat: FormGroup;
  formMan: FormGroup;

  //Variables para mostrar el tiempo transcurrido
  horas: number = 0; //Variables para mostrar el tiempo actualizado
  minutos: number = 0;
  segundos: number = 0;

  actual: String = null; //Variable para mostrar la categoría elegida para cronometrar
  activo: boolean; //Variable que controla qué botones mostrar. Si false iniciar/guardar. Si true actualizar/cancelar/guardar

  timeObs: Subscription; //Suscripción para controlar el cambio de botones y lo que ello conlleva
  segsObs: Subscription; //Suscripción para controlar el tiempo mostrado en el formulario
  manObs: Subscription; //Suscripción para controlar los mensajes de error del tiempo añadido manualmetne
  autoObs: Subscription; //Suscripción para controlar los mensajes de error del tiempo cronometrado

  autoOk: boolean; //Variable para los mensajes de error o confirmación del formulario del cronómetro
  manOk: boolean;  //Variable para los mensajes de error o confirmación del formulario manual

  //Variable para almacenar las categorías del usuario
  categorias: Categoria[];

  //Variable para añadir tiempos manualmente
  dias = this._clockServ.dias;
  meses = this._clockServ.meses;
  years = this._clockServ.years;

  constructor(private _clockServ: ClockService, private _catServ: CategoriasService, private _timerServ: TimerService) {

    //Inicializamos los formularios
    this.formCat = new FormGroup({
      'categoria': new FormControl(
        "", [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.noVacio
        ],
        [
          this.existeCategoria.bind(this)
        ]
      )
    });

    this.formTime = new FormGroup({
      'categoria': new FormControl(
        "", [
          Validators.required
        ]
      )
    });

    this.formMan = new FormGroup({
      'categoria': new FormControl(
        "", [
          Validators.required
        ]
      ),
      'horas': new FormControl(
        "", [
          Validators.required,
          Validators.pattern("^[0-9]{1,2}$")
        ]
      ),
      'min': new FormControl(
        "", [
          Validators.required,
          Validators.pattern("^(?:59|[1-5]?[0-9])$")
        ]
      ),
      'segs': new FormControl(
        "", [
          Validators.required,
          Validators.pattern("^(?:100|[1-9]?[0-9])$")
        ]
      ),
      'dia': new FormControl(
        "", [
          Validators.required
        ]
      ),
      'mes': new FormControl(
        "", [
          Validators.required
        ]
      ),
      'year': new FormControl(
        "", [
          Validators.required
        ]
      )
    })

    //Obtenemos la lista de categorias del usuario
    _catServ.ObtenerCategorias().subscribe(datos => {
      this.categorias = datos;
    })
  }

  ngOnInit() {
    //Nos suscribimos al observable encargado de actualizar la variable "activo" 
    this.timeObs = this._clockServ.activoObs.subscribe(valor => {
      this.activo = valor;
    })

    //Nos suscribimos al observable encargado de actualizar la cuenta
    this.segsObs = this._clockServ.segObs.subscribe(valor => {
      this.horas = Math.floor(valor / 3600);
      let resto = valor % 3600;
      this.minutos = Math.floor(resto / 60);
      this.segundos = Math.floor(resto % 60);
    })

    //Comprobamos si hay un temporizador activo
    this.cronometroActivo();

    //Nos suscribimos a los observables
    this.autoObs = this._clockServ.autoObservable.subscribe(valor => {
      this.autoOk = valor;
    })

    this.manObs = this._clockServ.manObservable.subscribe(valor => {
      this.manOk = valor;
    })
  }

  ngOnDestroy() {
    this.timeObs.unsubscribe();
    this.segsObs.unsubscribe();

    this._clockServ.manObservable.next(null);
    this._clockServ.autoObservable.next(null);
    this.manObs.unsubscribe();
    this.autoObs.unsubscribe();
  }

  addcat() {
    let cat: Categoria = {
      Id_user: +localStorage.getItem("Id"),
      Nombre: this.formCat.controls['categoria'].value.trim()
    }
    this._catServ.NuevaCategoria(cat).subscribe(
      resp => {
        console.log(resp);
        this._catServ.ObtenerCategorias().subscribe(datos => {
          this.categorias = datos;
        })
      },
      error => {
        console.log(error);
      }
    )
  }

  iniciar() {
    //Cuando iniciamos el cronómetro lo almacenamos en la base de datos
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id"),
      Inicio: (new Date().getTime() / 1000).toString(),
      Actividad: this.formTime.controls['categoria'].value
    }

    //Almacenamos en la base de datos
    this._timerServ.nuevoTimer(timer).subscribe(resp => {
      this._clockServ.autoObservable.next(null);
      this.actualizar();
    },
      error => {
        this._clockServ.autoObservable.next(false);
      }
    );
    //Actualizamos la variable periodo a true para que el botón actualizar aparezca y el parar esté activo
    this._clockServ.activoObs.next(true);
  }

  cancelar() {
    //Eliminamos de la base de datos el cronómetro 
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id")
    }
    this._timerServ.eliminarTimer(timer).subscribe(resp => {
      this._clockServ.autoObservable.next(null);
    },
      error => {
        this._clockServ.autoObservable.next(false);
      })

    //Actualizamos la variable período a falso para rotar los botones y reseteamos los segundos
    this._clockServ.activoObs.next(false);
    this._clockServ.segObs.next(0);
  }

  guardar() {
    //Obtenemos el momento del inicio de la base de datos
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id")
    }

    //Guardamos el intervalo en la base de datos
    this._timerServ.getTimer(timer).subscribe(resp => {
      let intervalo = ((new Date().getTime() / 1000) - (resp.Inicio)) / 3600; //Intervalo en horas
      //Guardamos el tiempo en la base de datos
      let tiempo : Tiempos = {
        Id_user: +localStorage.getItem("Id"),
        Tiempo: intervalo,
        Dia: new Date().getDate(),
        Mes: this.meses[new Date().getMonth()],
        Year: new Date().getFullYear(),
        Categoria: resp.Actividad
      }

      this._clockServ.nuevoTiempo(tiempo).subscribe(resp => {
        console.log(resp);
        this._clockServ.autoObservable.next(true);
      },
        error => {
          console.log(error);
          this._clockServ.autoObservable.next(false);
        })
    })

    //Eliminamos de la base de datos el momento de inicio y la categoría
    this._timerServ.eliminarTimer(timer).subscribe(resp => {
      this._clockServ.autoObservable.next(null);
    },
      error => {
        this._clockServ.autoObservable.next(false);
      })

    //Actualizamos la variable período a falso 
    this._clockServ.activoObs.next(false);
    this._clockServ.segObs.next(0);
  }

  actualizar() {
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id")
    };
    let respuesta: Timer;
    this._timerServ.getTimer(timer).subscribe(resp => {
      respuesta = resp;
      let segundos = (new Date().getTime() / 1000) - +respuesta.Inicio;

      this.actual = respuesta.Actividad;
      this._clockServ.segObs.next(segundos);
    });
  }

  addtime() {
    let intervalo = this.formMan.controls['horas'].value + (this.formMan.controls['min'].value / 60) + (this.formMan.controls['segs'].value / 3600); //Intervalo en horas
    let tiempo: Tiempos = {
      Id_user: +localStorage.getItem("Id"),
      Tiempo: intervalo,
      Dia: this.formMan.controls['dia'].value,
      Mes: this.formMan.controls['mes'].value,
      Year: this.formMan.controls['year'].value,
      Categoria: this.formMan.controls['categoria'].value
    }

    this._clockServ.nuevoTiempo(tiempo).subscribe(resp => {
      console.log(resp)
      this._clockServ.manObservable.next(true);
    },
      error => {
        console.log(error)
        this._clockServ.manObservable.next(true);
      })
  }

  cronometroActivo() {
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id")
    };
    this._timerServ.existeTimer(timer).subscribe(resp => {
      if (resp != 0) {
        this._clockServ.activoObs.next(true);
        this.actualizar();
      }
    })
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

  existeCategoria(control: FormControl): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {

      setTimeout(() => {
        this._catServ.existeCategoria(control.value).subscribe(respuesta => {
          if (respuesta == 0) {
            resolve(null);
          } else {
            resolve({ existe: true });
          }
        },
          error => {
            console.log(error);
            reject();
          })
      })

    })
  }

}


