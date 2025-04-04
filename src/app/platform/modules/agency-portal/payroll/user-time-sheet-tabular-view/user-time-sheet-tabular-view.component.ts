import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserTimesheetTabularViewModel } from '../user-time-sheet-sheet-view/timesheet-sheet-view.model';
import { UserTimeSheetTabularViewService } from './user-time-sheet-tablular.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { AddUserTimeSheetModalComponent } from './user-timesheet-table-modal/user-timesheet-table-modal.component';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { TranslateService } from '@ngx-translate/core';
interface DateObject {
  fromDate: string;
  toDate: string;
}
@Component({
  selector: 'app-user-time-sheet-tabular-view',
  templateUrl: './user-time-sheet-tabular-view.component.html',
  styleUrls: ['./user-time-sheet-tabular-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserTimeSheetTabularViewComponent implements OnInit {
  timesheetStatus: Array<any>;
  statusArray: UserTimesheetTabularViewModel[];
  userTimeSheetModel: UserTimesheetTabularViewModel =
    new UserTimesheetTabularViewModel();
  staffId!: number;
  loadingMasterData: boolean = false;
  currentWeekValue: number = 0;
  DateObject: DateObject = {
    fromDate: '',
    toDate: '',
  };
  usersTimesheetTabularData: UserTimesheetTabularViewModel[] = [];
  userTimeSheetFormGroup!: FormGroup;
  displayedColumns: string[] = [
    'dateOfService',
    'appointmentTypeName',
    'expectedTimeDuration',
    'actualTimeDuration',
    'status',
    'actions',
  ];
  constructor(
    private userTimeSheetTableService: UserTimeSheetTabularViewService,
    private userTimeSheetDailog: MatDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem('language') || 'en');
    translate.use(localStorage.getItem('language') || 'en');
    this.timesheetStatus = [];
    this.statusArray = [];
    this.DateObject = {
      fromDate: format(startOfWeek(new Date()), 'MM-DD-yyyy'),
      toDate: format(endOfWeek(new Date()), 'MM-DD-yyyy'),
    };
  }

  ngOnInit() {
    this.loadMasterData();
    if (this.staffId) {
      this.getUserTimesheetTabularViewData();
      this.setFilteredDateObject(this.currentWeekValue);
    }
  }
  loadMasterData() {
    // load master data
    this.loadingMasterData = true;
    const masterData = { masterdata: 'TIMESHEETSTATUS' };
    this.userTimeSheetTableService
      .getMasterData(masterData)
      .subscribe((response: any) => {
        this.loadingMasterData = false;
        this.timesheetStatus = response.timesheetStatus || [];
      });
  }
  getUserTimesheetTabularViewData() {
    this.userTimeSheetTableService
      .getAllUserTimeSheetTabularViewData(this.staffId, this.currentWeekValue)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.usersTimesheetTabularData = response.data.map((x: any) => {
            x.dateOfService = format(x.dateOfService, 'MM/dd/yyyy');
            return x;
          });
          this.statusArray = [];
        } else {
          this.usersTimesheetTabularData = [];
        }
      });
  }
  createModel(userTimeSheetModel: UserTimesheetTabularViewModel) {
    const modalPopup = this.userTimeSheetDailog.open(
      AddUserTimeSheetModalComponent,
      {
        data: {
          userTimeSheetModel:
            userTimeSheetModel || new UserTimesheetTabularViewModel(),
          staffId: this.staffId || null,
        },
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === 'SAVE') this.getUserTimesheetTabularViewData();
    });
  }
  openDialog(id?: number): void {
    this.userTimeSheetModel = new UserTimesheetTabularViewModel();
    if (!id) {
      this.createModel(this.userTimeSheetModel);
    } else {
      this.userTimeSheetTableService
        .getUserTimeSheetDataById(id)
        .subscribe((response) => {
          this.userTimeSheetModel = {
            ...response,
          };
          this.createModel(this.userTimeSheetModel);
        });
    }
  }
  editUserTimeSheet(id: number) {
    this.openDialog(id);
  }
  deleteUserTimeSheet(id: number) {
    this.dialogService
      .confirm('Are you sure you want to delete this service?')
      .subscribe((result: any) => {
        if (result == true) {
          this.userTimeSheetTableService
            .deleteUserTimeSheet(id)
            .subscribe((response: any) => {
              if (response.statusCode === 200) {
                this.notifier.notify('success', response.message);
                this.getUserTimesheetTabularViewData();
              } else if (response.statusCode === 401) {
                this.notifier.notify('warning', response.message);
              } else {
                this.notifier.notify('error', response.message);
              }
            });
        }
      });
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
    this.getUserTimesheetTabularViewData();
  }
  addStatus(userTimeSheetObj: UserTimesheetTabularViewModel, statusId: number) {
    let obj = {
      ...userTimeSheetObj,
      statusId: statusId,
    };
    this.statusArray.push(obj);
  }

  submitTimeSheetStatus() {
    if (this.statusArray.length > 0) {
      this.userTimeSheetTableService
        .submitTimeSheetStatus(this.statusArray)
        .subscribe((response: any) => {
          if (response.statusCode == 200) {
            this.notifier.notify('success', response.message);
            this.statusArray = [];
          } else {
            this.notifier.notify('error', response.message);
          }
        });
    } else {
      this.notifier.notify('warning', 'Please update status first!');
    }
  }
}
