import { Component, OnInit } from '@angular/core';
import { UserTimesheetTabularViewModel } from '../user-time-sheet-sheet-view/timesheet-sheet-view.model';
import { UserTimeSheetTabularViewService } from './user-time-sheet-tablular.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";

interface DateObject {
  fromDate: string,
  toDate: string
}
@Component({
  selector: 'app-user-time-sheet-tabular-view',
  templateUrl: './user-time-sheet-tabular-view.component.html',
  styleUrls: ['./user-time-sheet-tabular-view.component.css']
})
export class UserTimeSheetTabularViewComponent implements OnInit {
  timesheetStatus: Array<any>;
  userTimeSheetModel: UserTimesheetTabularViewModel = new UserTimesheetTabularViewModel;
  staffId!: number;
  loadingMasterData: boolean = false;
  currentWeekValue: number = 0;
  ChkAllSubmitStatus: boolean = false;
  timeSheetIdArray: Array<any> = [];
  submitTimeSheetCheck: any  = false;
  isActionChecked: boolean = false;
  statusArray: Array<any> = [];
  DateObject: DateObject = {
    fromDate: '',
    toDate: '',
  };
  public usersTimesheetTabularData: UserTimesheetTabularViewModel[] = [];
  private userTimeSheetFormGroup!: FormGroup;
  public displayedColumns: string[] = ['submitStatus', 'dateOfService', 'appointmentTypeName', 'expectedTimeDuration', 'actualTimeDuration', 'status'];
  constructor(private userTimeSheetTableService: UserTimeSheetTabularViewService, private userTimeSheetDailog: MatDialog, private formBuilder: FormBuilder, private router: Router, private notifier: NotifierService,private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.timesheetStatus = [];
    this.DateObject = {
      fromDate: format(startOfWeek(new Date()), 'MM-DD-yyyy'),
      toDate: format(endOfWeek(new Date()), 'MM-DD-yyyy')
    }
  }


  ngOnInit() {
    if (this.staffId) {
      this.getUserTimesheetTabularViewData();
      this.setFilteredDateObject(this.currentWeekValue);
    }
  }
  getUserTimesheetTabularViewData() {
    this.userTimeSheetTableService.getAllUserTimeSheetTabularViewData(this.staffId, this.currentWeekValue)
      .subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.usersTimesheetTabularData = response.data.map((x:any) => {
              x.dateOfService = format(x.dateOfService, 'MM/dd/yyyy');
              return x;
            })
            this.statusArray = this.usersTimesheetTabularData.filter((x:any) => x.status.toLowerCase() == 'pending');

          } else {
            this.usersTimesheetTabularData = [];
          }
        });
  }
  setWeekValue(weekValue: number) {
    this.currentWeekValue = weekValue;
    this.setFilteredDateObject(weekValue);
  }
  setFilteredDateObject(weekToAdd: number) {
    const fromDate = this.DateObject.fromDate ? new Date(this.DateObject.fromDate) : new Date();
    const toDate = this.DateObject.toDate ? new Date(this.DateObject.toDate) : new Date();
    const weekStartDate = addWeeks(fromDate, weekToAdd);
    const weekEndDate = addWeeks(toDate, weekToAdd);
    this.DateObject = {
      fromDate: format(weekStartDate, 'MM-dd-yyyy'),
      toDate: format(weekEndDate, 'MM-dd-yyyy'),
    };
  }
  changeWeekValue(changeValue: any) {
    this.currentWeekValue = (this.currentWeekValue) + (changeValue),
      this.setWeekValue(this.currentWeekValue);
    this.getUserTimesheetTabularViewData();
  }
  submitTimeSheetStatusCheck(e: { checked: any; }, id: any) {
    let timeSheetIdArray = this.timeSheetIdArray;
    if (e.checked) {
      timeSheetIdArray.push(id);
    } else {
      let index = timeSheetIdArray.indexOf(id);
      timeSheetIdArray.splice(index, 1);
    }
    this.timeSheetIdArray = timeSheetIdArray;
    if (!(timeSheetIdArray.length)) {
      this.ChkAllSubmitStatus = false;
      this.isActionChecked = false;
    } else {
      this.isActionChecked = true;
    }
  }
  checkAllForSubmitTimeSheet(e: { checked: any; }) {
    let timeSheetDataArray = [], timeSheetIdArray: any[] = [];
    timeSheetDataArray = this.usersTimesheetTabularData;
    timeSheetDataArray.forEach((obj) => {
      if (obj.status === 'Pending') {
        if (e.checked) {
          this.isActionChecked = true,
            timeSheetIdArray.push(obj.id);
          this.submitTimeSheetCheck = true;
        } else {
          this.isActionChecked = false,
            timeSheetIdArray = [];
          this.submitTimeSheetCheck = false;
        }
      }
    });
    this.timeSheetIdArray = timeSheetIdArray;
  }
  submitTimeSheetStatus() {
    if (this.timeSheetIdArray.length > 0) {
      this.userTimeSheetTableService.submitTimeSheetStatus(this.timeSheetIdArray).subscribe((response: any) => {
        if (response.statusCode == 200) {
          this.notifier.notify('success', response.message);
          this.timeSheetIdArray = [];
            this.getUserTimesheetTabularViewData();
        } else {
          this.notifier.notify('error', response.message);
        }
      });
    }
    else {
      this.notifier.notify('warning', "Please update status first!");
    }
  }
}