import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.css']
})
export class DoughnutChartComponent implements OnInit {

  @Input() doughnutChartData!: any[];
  @Input() doughnutChartLabels!: any[];
  @Output() doughnutchartClicked: EventEmitter<any> = new EventEmitter<any>();

  public chartType: string | any='';
  backgrounColors :any [] = [];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false }
  };
 
  constructor() {}

  ngOnInit(): void {
    debugger
  this.chartType = 'doughnut';
  }

  // onChartClicked({ event, active }: { event: MouseEvent; active: {}[] }): void {
  //   this.doughnutchartClicked.emit({ event, active });
  // }

  onChartClicked({ event, active }: { event: any; active: {}[] } | any): void {
    this.doughnutchartClicked.emit({ event, active });
  }

}
