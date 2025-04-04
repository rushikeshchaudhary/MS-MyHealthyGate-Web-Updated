import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {

  @Output() dateChangeEvent = new EventEmitter();
  rangeStartDate1: any;
  constructor() { }

  ngOnInit() {
  }
  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.dateChangeEvent.emit(event.value);
    this.rangeStartDate1 = event.value;
    console.log('selected value from date picker shared module', event.value);
  }
}
