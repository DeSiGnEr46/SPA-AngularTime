import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LogService } from '../../services/log.service';
import { ClockService } from '../../services/clock.service';
import { TimerService } from '../../services/timer.service';
import { Timer } from '../../interfaces/timer.interface';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  //Variables globales
  actividades: String[]; //Lista de actividades diarias
  horas: number[]; //Lista con el total de horas dedicadas a cada actividad diaria
  minutos: number[]; //Lista con el total de minutos dedicados a cada actividad diaria
  totalh: number; //Total de horas añadidas en ese día
  totalm: number; //Total de minutos añadidos en ese día

  actividadActiva: String; //Variables para el modal
  horasActiva: number;
  minActiva: number;
  cronActivo: boolean = false;

  activoObs: BehaviorSubject<boolean>;

  constructor(private _logService: LogService, private _clockService: ClockService, private _timerServ: TimerService) {
    this.activoObs = new BehaviorSubject<boolean>(false);
  }

  /*******************************
  Gráfico lineal - categorías
  ********************************/
  public lineChartData: Array<any> = [
    { data: [100], label: 'Tiempo dedicado a cada actividad' }
  ];
  public lineChartLabels: Array<any> = ['Actualizando...'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // 
      backgroundColor: '#b9f6ca',
      borderColor: '#007E33',
      pointBackgroundColor: '#ff4444',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  /*******************
   * NgOnInit
   *******************/
  ngOnInit() {

    //Inicializamos la suscripción
    this.activoObs.subscribe(valor => {
      this.cronActivo = valor;
    })

    //Comprobamos si la sesión del usuario está activa
    if (this.sesionActiva()) {
      let datos = {
        Id_user: +localStorage.getItem("Id"),
        Year: new Date().getFullYear(),
        Mes: this._clockService.meses[new Date().getMonth()],
        Dia: new Date().getDate()
      }

      //Actualización de la gráfica
      this._clockService.obtenerPeriodo(datos).subscribe(resp => {

        //Actualización de la gráfica
        let _lineChartData: Array<any> = new Array(this.lineChartData.length);

        this.lineChartLabels.length = 0; //Ponemos a 0 el número de etiquetas para poder actualizarlas correctamente

        for (let i = 0; i < this.lineChartData.length; i++) {
          //Inicializamos correctamente cada posición del array del gráfico lineal
          _lineChartData[i] = { data: new Array(resp[0].length), label: this.lineChartData[i].label };

          for (let j = 0; j < resp[0].length; j++) {
            //Añadimos las nuevas etiquetas con el método push
            this.lineChartLabels.push(resp[0][j]);

            //Añadimos los nuevos valores 
            _lineChartData[i].data[j] = +resp[1][j];
          }
        }

        this.lineChartData = _lineChartData;
      })

      //Actualización de la lista de actividades diaria
      this._clockService.obtenerDiario(datos).subscribe(resp => {
        this.actividades = resp[0];
        this.horas = resp[1];
        this.minutos = resp[2];
        this.totalh = this.totalm = 0;

        //Para mostrar el tiempo total primero sumamos los minutos
        for(let m of resp[2]){
          this.totalm += +m;
        }
        //Ahora calculamos el total de horas
        for(let d of resp[1]){
          this.totalh += +d;
        }
        //Si el total de minutos supera la hora, la añadimos
        this.totalh += Math.floor(this.totalm / 60);
        this.totalm = this.totalm % 60;
      })

      this.cronometroActivo();
    }
  }

  sesionActiva(): boolean {
    return this._logService.sesionValida();
  }

  cronometroActivo() {
    let timer: Timer = {
      Id_user: +localStorage.getItem("Id")
    };

    this._timerServ.existeTimer(timer).subscribe(resp => {

      if (resp != 0) {
        //Cambiamos el valor de la variable para mostrar el div
        this.activoObs.next(true);

        //Obtenemos el tiempo transcurrido y la actividad
        let timer: Timer = {
          Id_user: +localStorage.getItem("Id")
        }

        this._timerServ.getTimer(timer).subscribe(resp => {
          this.actividadActiva = resp.Actividad;
          let intervalo = (new Date().getTime() / 1000) - +resp.Inicio;
          this.horasActiva = Math.floor(intervalo / 3600);
          this.minActiva = Math.floor(intervalo % 3600 / 60);
        });
      } else {
        this.activoObs.next(false);
      }
    })
  }
}
