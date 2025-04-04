import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserTimeSheetViewService } from './user-time-sheet-sheet.service';
import { UserTimesheetSheetViewModel } from './timesheet-sheet-view.model';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { TranslateService } from '@ngx-translate/core';
interface DateObject {
  fromDate: string;
  toDate: string;
}

@Component({
  selector: 'app-user-time-sheet-sheet-view',
  templateUrl: './user-time-sheet-sheet-view.component.html',
  styleUrls: ['./user-time-sheet-sheet-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserTimeSheetSheetViewComponent implements OnInit {
  staffId!: number;
  currentWeekValue: number = 0;
  private userTimesheetViewModel: UserTimesheetSheetViewModel;
  userTimesheetViewData: UserTimesheetSheetViewModel[] | any = [];
  DateObject: DateObject = {
    fromDate: '',
    toDate: '',
  };
  private displayedColumns: string[] = [
    'appointmentTypeName',
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'total',
  ];
  constructor(
    private userTimeSheetViewService: UserTimeSheetViewService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
    this.userTimesheetViewModel = new UserTimesheetSheetViewModel();
    this.DateObject = {
      fromDate: format(startOfWeek(new Date()), 'MM-DD-yyyy'),
      toDate: format(endOfWeek(new Date()), 'MM-DD-yyyy'),
    };
  }

  ngOnInit() {
    if (this.staffId) {
      this.getUserTimesheetViewData();
      this.setFilteredDateObject(this.currentWeekValue);
    }
  }

  getUserTimesheetViewData() {
    this.userTimeSheetViewService
      .getAllUserTimeSheetViewData(this.staffId, this.currentWeekValue)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.userTimesheetViewData = this.renderTotalData(response.data);
        } else {
          this.userTimesheetViewData = [];
        }
      });
  }
  renderTotalData(responseArray: any): any {
    let appointmentTypeName = 'Total',
      total = 0,
      totalTime = 0,
      sunday = 0,
      monday = 0,
      tuesday = 0,
      wednesday = 0,
      thursday = 0,
      friday = 0,
      saturday = 0;
    if (responseArray && responseArray.length) {
      responseArray.map(
        (Obj: {
          sunday: number;
          monday: number;
          tuesday: number;
          wednesday: number;
          thursday: number;
          friday: number;
          saturday: number;
          total: number;
        }) => {
          sunday = sunday + Obj.sunday;
          monday = monday + Obj.monday;
          tuesday = tuesday + Obj.tuesday;
          wednesday = wednesday + Obj.wednesday;
          thursday = thursday + Obj.thursday;
          friday = friday + Obj.friday;
          saturday = saturday + Obj.saturday;
          total =
            Obj.monday +
            Obj.tuesday +
            Obj.wednesday +
            Obj.thursday +
            Obj.friday +
            Obj.saturday +
            Obj.sunday;
          totalTime = totalTime + total;
          Obj.total = total;
          return Obj;
        }
      );
      responseArray.push({
        appointmentTypeName,
        sunday,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        total: totalTime,
      });
      return responseArray;
    }
  }
  setWeekValue(weekValue: number) {
    this.currentWeekValue = weekValue;
    this.setFilteredDateObject(weekValue);
  }
  setFilteredDateObject(weekToAdd: number) {
    //let weekStartDate = addWeeks(this.DateObject.fromDate, weekToAdd);
    //let weekEndDate = addWeeks(this.DateObject.toDate, weekToAdd);
    const fromDate = this.DateObject.fromDate
      ? new Date(this.DateObject.fromDate)
      : new Date();
    const toDate = this.DateObject.toDate
      ? new Date(this.DateObject.toDate)
      : new Date();
    const weekStartDate = addWeeks(fromDate, weekToAdd);
    const weekEndDate = addWeeks(toDate, weekToAdd);
    this.DateObject = {
      fromDate: format(weekStartDate, 'MM-DD-yyyy'),
      toDate: format(weekEndDate, 'MM-DD-yyyy'),
    };
  }
  changeWeekValue(changeValue: any) {
    (this.currentWeekValue = this.currentWeekValue + changeValue),
      this.setWeekValue(this.currentWeekValue);
    this.getUserTimesheetViewData();
  }
}
