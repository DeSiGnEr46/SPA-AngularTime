import { Component, OnInit, ViewChild } from '@angular/core';
import { ClockService } from '../../services/clock.service'
import { BehaviorSubject } from '../../../../node_modules/rxjs';
import { FormGroup, FormControl, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  filtroForm: FormGroup;

  years: number[] = this._clockServ.years;
  meses: String[] = this._clockServ.meses;
  dias: number[] = this._clockServ.dias;

  constructor(private _clockServ: ClockService) {
    this.filtroForm = new FormGroup({
      'year': new FormControl(
        "", [
          Validators.required
        ]
      ),

      'mes': new FormControl(
        "", [
          Validators.required
        ]
      ),

      'dia': new FormControl(
        "", [
          Validators.required
        ]
      ),

      'year2': new FormControl(
        "", [
          Validators.required
        ]
      ),

      'mes2': new FormControl(
        "", [
          Validators.required
        ]
      ),

      'dia2': new FormControl(
        "", [
          Validators.required
        ]
      )
    });
  }

  ngOnInit() {
    this.ActualizarGrafsCats();
  }

  /*******************************
  Gráfico de barras - categorías
  ********************************/
  public barChartData: Array<any> = [{ data: [100], label: 'Total de horas invertidas en cada categoría' }];
  public barChartLabels: Array<any> = ['Pulsa para actualizar'];

  public barChartOptions: any = {
    responsive: true
  };
  public barChartColors: Array<any> = [
    { // Purple
      backgroundColor: '#ce93d8'
    }
  ];
  public barChartLegend: boolean = true;
  public barChartType: string = 'bar';

  /***************************
   Gráfico donut - Categorías
   ***************************/
  // Doughnut
  public doughnutChartLabels: string[] = ['Porcentaje de realización por categoría'];
  public doughnutChartData: number[] = [100];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartColors: any[] = [
    {
      backgroundColor: ['#ff4444', '#FF8800', '#ffbb33', '#00C851', '#33b5e5', '#aa66cc', '#3F729B', '#2E2E2E', '#212121']
    }
  ];

  /*******************************
  Gráfico lineal - categorías
  ********************************/
  public lineChartData: Array<any> = [
    { data: [100], label: 'Tiempo dedicado a cada actividad' }
  ];
  public lineChartLabels: Array<any> = ['Elija fecha'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
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

  /*********************************************************
   Función que actualiza la gráfica de barras y la circular
   ********************************************************/
  public ActualizarGrafsCats(): void {
    this._clockServ.graficoBarras().subscribe(resultados => {

      let _barChartData: Array<any> = new Array(resultados[0].length);
      let _doughnutChartData: number[] = new Array(resultados[0].length);

      this.barChartLabels.length = this.doughnutChartLabels.length = 0; //Ponemos a 0 el número de etiquetas para poder actualizarlas correctamente
      let total = this.CalcularTotal(resultados[1]);

      for (let i = 0; i < this.barChartData.length; i++) {
        //Inicializamos correctamente cada posición del array del gráfico de barras
        _barChartData[i] = { data: new Array(this.barChartData[i].data.length), label: this.barChartData[i].label };

        for (let j = 0; j < resultados[0].length; j++) {
          //Añadimos las nuevas etiquetas con el método push
          this.barChartLabels.push(resultados[0][j]);
          this.doughnutChartLabels.push(resultados[0][j]);
          //Añadimos los nuevos valores 
          _barChartData[i].data[j] = +resultados[1][j];
          _doughnutChartData[j] = (+resultados[1][j] * 100) / total;
        }
      }

      this.barChartData = _barChartData;
      this.doughnutChartData = _doughnutChartData;
    })
  }

  /*********************************************************
   Función que actualiza la gráfica de barras y la circular
  ********************************************************/
  public filtrar(): void {
    let datos = [
      {
        Id_user: +localStorage.getItem("Id"),
        Year: this.filtroForm.controls['year'].value,
        Mes: this.filtroForm.controls['mes'].value,
        Dia: +this.filtroForm.controls['dia'].value
      },
      {
        Id_user: +localStorage.getItem("Id"),
        Year: this.filtroForm.controls['year2'].value,
        Mes: this.filtroForm.controls['mes2'].value,
        Dia: +this.filtroForm.controls['dia2'].value
      }
    ]

    console.log(datos);
    this._clockServ.filtroTemporal(datos).subscribe(datos => {
      console.log(datos);
      let _lineChartData: Array<any> = new Array(this.lineChartData.length);

      this.lineChartLabels.length = 0; //Ponemos a 0 el número de etiquetas para poder actualizarlas correctamente

      for (let i = 0; i < this.lineChartData.length; i++) {
        //Inicializamos correctamente cada posición del array del gráfico lineal
        _lineChartData[i] = { data: new Array(datos[0].length), label: this.lineChartData[i].label };

        for (let j = 0; j < datos[0].length; j++) {
          //Añadimos las nuevas etiquetas con el método push
          this.lineChartLabels.push(datos[0][j]);

          //Añadimos los nuevos valores 
          _lineChartData[i].data[j] = +datos[1][j];
        }
      }

      this.lineChartData = _lineChartData;
    })
  }

  public CalcularTotal(valores: number[]): number {
    let total = 0;
    for (let i = 0; i < valores.length; i++) {
      total += +valores[i];
    }
    return total;
  }
}
