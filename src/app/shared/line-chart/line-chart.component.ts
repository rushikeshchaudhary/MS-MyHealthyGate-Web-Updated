import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  @Input() lineChartData: any[];
  @Input() lineChartLabels: any[];
  @Output() clearAllChange:EventEmitter<null> =new EventEmitter();

  public lineChartType: any = 'line';
  constructor() {
    this.lineChartData= [];
    this.lineChartLabels= [];
   }
  ngOnInit() {

  }

  removeVitealFilter=()=>{
    this.clearAllChange.emit();
  }
}
