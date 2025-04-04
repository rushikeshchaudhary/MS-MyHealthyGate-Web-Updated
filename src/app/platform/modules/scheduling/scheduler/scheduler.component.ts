import { TextChatService } from "./../../../../shared/text-chat/text-chat.service";
import { AppService } from "./../../../../app-service.service";
import { EncounterService } from "./../../agency-portal/encounter/encounter.service";
import { AddNewCallerService } from "./../../../../shared/add-new-caller/add-new-caller.service";
import { AddNewCallerComponent } from "./../../../../shared/add-new-caller/add-new-caller.component";
import { ContextMenuService } from "ngx-contextmenu";
import { ContextMenuComponent } from "ngx-contextmenu";
import { SetReminderComponent } from "./../../../../shared/set-reminder/set-reminder.component";
// import { BookAppointmentComponent } from "./../../../../front/book-appointment/book-appointment.component";
import { StaffAppointmentComponent } from "../../../../shared/staff-appointment/staff-appointment.component";

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {
  CalendarEvent,
  CalendarView,
  CalendarDateFormatter,
  CalendarEventAction,
  CalendarWeekViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarDayViewBeforeRenderEvent,
  CalendarEventTimesChangedEvent,
} from "angular-calendar";
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  addMinutes,
} from "date-fns";
import { Observable, Subscription, Subject } from "rxjs";
import { SchedulerService } from "./scheduler.service";
import { CommonService } from "../../core/services";
import { MatDialog } from "@angular/material/dialog";
import { MatSelect } from '@angular/material/select';
import { AppointmentModel, AppointmentStaff } from "./scheduler.model";
import { SchedulerDialogComponent } from "./scheduler-dialog/scheduler-dialog.component";
import { CustomDateFormatter } from "./custom-date-formatter.provider";
import { NotifierService } from "angular-notifier";
import { CancelAppointmentDialogComponent } from "./cancel-appointment-dialog/cancel-appointment-dialog.component";
import { DialogService } from "../../../../shared/layout/dialog/dialog.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { AppointmentViewComponent } from "../appointment-view/appointment-view.component";
import { DatePipe } from "@angular/common";
import { AppointmentReschedulingDialogComponent } from "src/app/shared/appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { isNullOrUndefined } from "util";
import { ClientsService } from "../../agency-portal/clients/clients.service";
import { ReviewRatingModel } from "../../client-portal/review-rating/review-rating.model";
import { ReviewRatingComponent } from "../../client-portal/review-rating/review-rating.component";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";

interface Appointment {
  patientAppointmentId: number;
  bookingMode: string;
  patientName?: string;
  color: string;
  fontColor: string ;
  startDateTime: string;
  endDateTime: string;
  cancelTypeId?: number;
  claimId?: number;
  canEdit?: boolean;
  patientEncounterId: number;
  statusName?: string;
  appointmentStaffs?: any;
  isBillable?: boolean;
  isTelehealthAppointment?: boolean;
  patientID: number;
  invitationAppointentId: number;
  invitedStaffs?: any;

  // patientAppointmentId: 4094,
  // "startDateTime":"2018-09-19T12:00:50",
  // "endDateTime":"2018-09-19T13:00:50",
  // "appointmentTypeName":"Appointment Type Test1",
  // "appointmentTypeID":122,
  // "color":"#3e89cf",
  // "fontColor":"#575757",
  // "defaultDuration":0.0,
  // "isBillable":true,
  // "patientName":"Rose Warren",
  // "patientID":733,
  // "patientEncounterId":899,
  // "claimId":555,
  // "canEdit":false,
  // "patientAddressID":764,
  // "serviceLocationID":1,
  // "appointmentStaffs":[{"staffId":170,"staffName":"Stephen Baker","isDeleted":false}],
  // "isClientRequired":true,
  // "isRecurrence":false,
  // "offSet":0,
  // "allowMultipleStaff":false,
  // "cancelTypeId":0,
  // "isExcludedFromMileage":false,
  // "isDirectService":true,
  // "patientPhotoThumbnailPath":"",
  // "statusId":358372,
  // "statusName":"Approved",
  // "address":"4468 Broadway  #55 New York NY US 10040",
  // "latitude":40.857074,
  // "longitude":-73.932058999999981,
  // "isTelehealthAppointment":false
}

interface OfficeTime {
  dayStartHour: string;
  dayStartMinute: string;
  dayEndHour: string;
  dayEndMinute: string;
}

function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, "0");
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, "0");
  const direction = timezoneOffset > 0 ? "-" : "+";
  return `T00:00:00${direction}${hoursOffset}${minutesOffset}`;
}

const colors: any = {
  red: {
    primary: '#3BC7FB',
    secondary: '#3bc7fbd6'
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: '#EF8B00',
    secondary: '#fa9f55de'
  },
  green: {
    primary: '#00e900',
    secondary: '#00e900'
  }
};

@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./scheduler.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class SchedulerComponent implements OnInit, OnDestroy {
  // @ViewChild(MatMenuTrigger)
  contextMenu!: ContextMenuComponent;
  appointId: number = 0;
  currentAppointmentId: number = 0;
  currentPatientId: number = 0;
  currentStaff: number|undefined = 0;
  currentNotes!: "";
  userRole: any;
  contextMenuPosition = { x: "0", y: "0" };
  
  openContextMenu: boolean = true;
  apptObj: any;
  calendarObj: any;

  private subscription!: Subscription;

  view: CalendarView = CalendarView.Week;

  CalendarView;

  viewDate: Date = new Date();

  events$!: Observable<Array<CalendarEvent<{ appointment: Appointment; }>>>;
  events1: CalendarEvent[] = [];
  activeDayIsOpen: boolean = false;

  refresh: Subject<any> = new Subject();

  isPatientScheduler: boolean = false;
  patientSchedulerId!: number | null;
  // scheduler data
  officeTime: OfficeTime;
  officeLocations: Array<any>;
  officeStaffs: Array<any>;
  officeClients: Array<any>;
  selectedOfficeLocations: Array<any>;
  selectedOfficeStaffs: Array<any>;
  selectedOfficeClients: Array<any> = [];
  currentLocationId!: string;
  currentLoginUserId!: string;
  staffsAvailibility: any;
  isCheckedValidate: boolean = false;
  isCheckedAuthorization: boolean = false;
  isRequestFromPatientPortal: boolean = false;
  isAdminLogin: boolean = false;
  isClientLogin: boolean = false;
  public menuPosition = { x: '0px', y: '0px' };
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  colors: any = {
    red: {
      primary: '#3BC7FB',
      secondary: '#3bc7fbd6'
    },
    blue: {
      primary: "#1e90ff",
      secondary: "#D1E8FF",
    },
    yellow: {
      primary: '#FA9F55',
      secondary: '#fa9f55de'
    },
    green: {
      primary: '#00e900',
      secondary: '#00e900'
    }
  };

  appointmentType: any = [
    "View Appointment",
    "Reshedule",
    "Cancel Appointment",
    "Set Reminder",
    "Set Availability",
    "New/followup Appointment",
    "Invite",
  ];
  schedulerPermissions: any;
  statusColors: Array<any>;
  EVENT_LIMIT = 3;
  showAllEventDaysArray: number[] = [];
  defaultState: String = "";
  sub: Subscription = new Subscription;
  isWaitingRoomScreen = false;
  waitingRoomApptId!: number;
  isFirstLoad = true;
  waitingRoomApptPatientId!: number;
  waitingRoomApptStaffId!: number;
  bookingAvailableDates: string[] = [];
  isRescheduleShow = false;
  appttype!: string;
  apptmode!: string;
  currentdayview!: string;
  isvalidDate: boolean = true;
  hideNewappointment: boolean = false;
  isMonthView: boolean = false;
  isWeekView: boolean = false;
  isDayView: boolean = false;
  isPending: boolean = false;
  clientModel: any;
  reviewRatingModel: ReviewRatingModel = new ReviewRatingModel;
  filterString:any;
  filteredProvider:any;
  searchProviderForm!: FormGroup;
  filterMasterSearchProvider: any = [];
  providerList: any[] = [];


  constructor(
    private http: HttpClient,
    private appointmentDailog: MatDialog,
    private schedulerService: SchedulerService,
    private commonService: CommonService,
    private notifierService: NotifierService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private addNewCallerService: AddNewCallerService,
    private encounterService: EncounterService,
    private appService: AppService,
    private textChatService: TextChatService,
    private contextMenuService: ContextMenuService,
    private date: DatePipe,
    private cdr: ChangeDetectorRef,
    private clientService: ClientsService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private el: ElementRef
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");

    this.activatedRoute.queryParams.subscribe((params) => {
      if (this.router.url.includes("/web/client/scheduling") && params["id"]) {
        const decrptId = this.commonService.encryptValue(params["id"], false),
          patientId = parseInt(decrptId, 10);
        this.isPatientScheduler = true;
        this.selectedOfficeClients = [patientId];
        this.patientSchedulerId = patientId;
      } else {
        this.isPatientScheduler = false;
        this.selectedOfficeClients = [];
        this.patientSchedulerId = null;

        this.isWaitingRoomScreen =
          this.activatedRoute.snapshot.url[0] &&
            this.activatedRoute.snapshot.url[0].path == "reshedule"
            ? true
            : false;
        if (this.isWaitingRoomScreen) {
          const apptStr = this.activatedRoute.snapshot.paramMap.get("id");
          this.waitingRoomApptId = Number(apptStr);
          this.currentAppointmentId = this.waitingRoomApptId;
        }
      }
    });

    this.CalendarView = CalendarView;

    this.officeLocations = [];
    this.officeStaffs = [];
    this.officeClients = [];
    this.selectedOfficeLocations = [];
    this.selectedOfficeStaffs = [];
    this.staffsAvailibility = null;
    this.statusColors = [
      { name: "pending", color: "#74d9ff" },
      { name: "approved", color: "#93ee93" },
      { name: "cancelled", color: "#ff8484" },
      { name: "Accepted", color: "rgb(179, 236, 203)" },
      { name: "Tentative", color: "rgb(253, 209, 100)" },
    ];
    this.officeTime = {
      dayStartHour: "00",
      dayStartMinute: "00",
      dayEndHour: "23",
      dayEndMinute: "59",
    };
  }
  contextmenu = false;
  contextmenuX = 0;
  contextmenuY = 0;

  onCreated() { }
  public onContextMenu(
    $event: any,
    selectedEvent: CalendarEvent | null = null,
    rescheduleDate: null | Date = null
  ): void {
    //////debugger;
    if (rescheduleDate && this.isWaitingRoomScreen) {
      this.isRescheduleShow = this.isBoolingDateAvailable(rescheduleDate);
    }

    // To enable or disable the new appointment option from menu.
    if (!isNullOrUndefined(rescheduleDate)) {
      if (this.IsPreviousDate(rescheduleDate)) this.hideNewappointment = true;
      else this.hideNewappointment = false;
    } else if (this.isDayView || this.isWeekView) {
      if (this.IsPreviousDate(this.apptObj.startDateTime))
        this.hideNewappointment = true;
      else this.hideNewappointment = false;
    } else {
      this.hideNewappointment = false;
    }
    //////debugger;
    this.appointId =
      $event.target.className.toLowerCase().indexOf("cal-event") == 0 ||
        $event.target.className.toLowerCase().indexOf("appt-blk") == 0 ||
        $event.target.className.toLowerCase().indexOf("month-event-txt-s") == 0
        ? 1
        : 0;
    if (
      $event.target.className.indexOf("material-icons") != 0 &&
      $event.target.className.indexOf("cal-event-title") != 0
    ) {
      // this.contextMenuService.show.next({
      //   anchorElement: $event.target,
      //   // Optional - if unspecified, all context menu components will open
      //   contextMenu: this.contextMenu,
      //   event: <any>$event,
      //   item: 5,
      // });
      //$event.preventDefault();
      this.menuPosition.x = $event.clientX + 'px';
      this.menuPosition.y = $event.clientY + 'px';
      console.log('Context menu triggered', $event.clientX, $event.clientY);
      this.menuTrigger.openMenu();
      if (selectedEvent && selectedEvent.meta) {
        localStorage.setItem("apptId", selectedEvent.meta.patientAppointmentId);
        this.currentAppointmentId = selectedEvent.meta.patientAppointmentId;
        this.currentStaff =
          selectedEvent.meta.appointmentStaffs != null
            ? selectedEvent.meta.appointmentStaffs[0].staffId
            : 0;
        this.currentNotes = selectedEvent.meta.notes;
        if (selectedEvent.meta.statusName.toLowerCase() == "pending") {
          this.isPending = true;
        } else {  
          this.isPending = false;
        }

        this.reviewRatingModel = new ReviewRatingModel();
        this.reviewRatingModel.id = selectedEvent.meta.reviewRatingId;
        this.reviewRatingModel.patientAppointmentId = this.currentAppointmentId;
        this.reviewRatingModel.rating = selectedEvent.meta.rating;
        this.reviewRatingModel.review = selectedEvent.meta.review;
        this.reviewRatingModel.staffId = this.isClientLogin
          ? selectedEvent.meta.appointmentStaffs[0].staffId
          : 0;
      }
      //////debugger
      if (selectedEvent && selectedEvent.end) {
        //////debugger;
        var curDate = this.date.transform(new Date(), "yyyy-MM-dd HH:mm:ss a");
        var selDate = this.date.transform(
          selectedEvent.start,
          "yyyy-MM-dd HH:mm:ss a"
        );
        if(selDate && curDate){
          if (selDate < curDate) {
            this.isvalidDate = false;
          } else {
            this.isvalidDate = true;
          }
        }
        
      }

      // $event.preventDefault();
      //$event.stopPropagation();
    }
  }
  openDialogBookAppointment(
    staffId: number,
    providerId: string,
    type: boolean
  ) {
    if (this.isWaitingRoomScreen) {
      this.currentAppointmentId = this.waitingRoomApptId;
      staffId = this.waitingRoomApptStaffId;
      providerId = this.waitingRoomApptStaffId + "";
    }
    let dbModal;
    dbModal = this.appointmentDailog.open(StaffAppointmentComponent, {
      hasBackdrop: true,
      minWidth: "70%",
      maxWidth: "70%",
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.currentLocationId || 0,
        isNewAppointment: type,
        appointmentId: type ? 0 : this.currentAppointmentId,
        patientId: type ? 0 : this.currentPatientId,
        currentNotes: type ? "" : this.currentNotes,
        age:
          this.clientModel && this.clientModel.age != 0
            ? this.clientModel.age
            : 1,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      } else {
        this.fetchEvents();
      }
    });
  }

  openDialogRecheduleAppointment(
    staffId: number | undefined,
    providerId: string | undefined,
    type: boolean | undefined
  ) {
    if (this.isWaitingRoomScreen) {
      this.currentAppointmentId = this.waitingRoomApptId;
      staffId = this.waitingRoomApptStaffId;
      providerId = this.waitingRoomApptStaffId + "";
    }
    let dbModal;
    dbModal = this.appointmentDailog.open(
      AppointmentReschedulingDialogComponent,
      {
        hasBackdrop: true,
        minWidth: "50%",
        maxWidth: "50%",
        data: {
          staffId: staffId,
          userInfo: null,
          providerId: providerId,
          locationId: this.currentLocationId || 0,
          isNewAppointment: type,
          appointmentId: type ? 0 : this.currentAppointmentId,
          patientId: type ? 0 : this.currentPatientId,
          currentNotes: type ? "" : this.currentNotes,
        },
      }
    );
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      } else {
        this.fetchEvents();
      }
    });
  }

  addEvent(event: any, type: any): void {
    let id = this.currentAppointmentId;
    var appStaff = this.isClientLogin
      ? this.currentStaff
      : parseInt(this.currentLoginUserId);

    switch (type) {
      case "1":
        this.openDialogBookAppointment(
          parseInt(this.currentLoginUserId),
          this.currentLoginUserId,
          true
        );
        break;

      case "2":
        this.createViewAppointmentModel(id);
        break;
      case "3":
        this.openDialogRecheduleAppointment(
          appStaff,
          `${appStaff}`,
          false
        );
        break;
      case "4":
        // this.createCancelAppointmentModel(id);
        this.schedulerService
          .checkfollowupAppointment(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.createCancelAppointmentModel(id);
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        //this.createCancelAppointmentModel(id);
        break;
      case "5":
        const modalPopup = this.appointmentDailog.open(SetReminderComponent, {
          hasBackdrop: true,
          data: { appointmentId: id },
        });

        modalPopup.afterClosed().subscribe((result) => {
          if (result === "save") this.fetchEvents();
        });
        break;

      case "6":
        if (this.userRole == "ADMIN") {
          // this.router.navigate(["/web/manage-users/users"]);
          this.router.navigate(["/web/availability"]);
        } else if (this.userRole == "PROVIDER" || this.userRole == "STAFF") {
          //localStorage.setItem('tabToLoad', "User Info");
          // this.router.navigate(["/web/manage-users/user"], {
          //   queryParams: {
          //     id: this.commonService.encryptValue(this.currentLoginUserId),
          //   },
          // });
          this.router.navigate(["/web/availability"]);
        }
        break;
      case "7":
        this.addNewCallerService
          .getOTSessionByAppointmentId(id)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(id, response.data.id);
            }
          });
        break;
    }
  }

  disableContextMenu() {
    this.contextmenu = false;
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
    
  }

  ngOnInit(): void {
    this.searchProviderForm = this.formBuilder.group({
      searchProvider: []
    });

    this.events1 = [];
    this.route.queryParams.subscribe((params) => {
      this.defaultState = params["calendermonth"];
      this.appttype = params["appttype"];
      this.apptmode = params["apptmode"];
      this.currentdayview = params["currentdayview"];
      //////debugger;
      if (this.defaultState == "currentmonth") {
        this.view = CalendarView.Month;
        if (this.appttype != null && this.apptmode != null) {
          this.fetchfilteredappt();
        } else {
          this.fetchEvents();
        }
      } else if (this.defaultState == "previousmonth") {
        this.view = CalendarView.Month;
        this.viewDate = new Date();
        this.viewDate.setDate(1);
        this.viewDate.setMonth(this.viewDate.getMonth() - 1);
        this.fetchEvents();
      } else if (this.currentdayview != null) {
        this.view = CalendarView.Day;
      }
    });

    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;

          if (user.users3 && user.users3.userRoles) {
            this.userRole = (
              user.users3.userRoles.userType || ""
            ).toUpperCase();
          }

          this.isAdminLogin =
            user.users3 &&
            user.users3.userRoles &&
            (user.users3.userRoles.userType || "").toUpperCase() == "ADMIN";
          this.isClientLogin = this.userRole == "CLIENT";

          if (this.isClientLogin) {
            this.isRequestFromPatientPortal = true;
            this.currentLocationId = user.locationID;
            const patientId = user.id;
            this.isPatientScheduler = true;
            this.selectedOfficeClients = [patientId];
            this.patientSchedulerId = patientId;
            this.selectedOfficeLocations.push(this.currentLocationId);
          } else {
            this.isRequestFromPatientPortal = false;
            this.selectedOfficeStaffs = !this.isPatientScheduler
              ? [user.id]
              : [];
            this.currentLocationId = user.currentLocationId;
            this.officeLocations = (user.userLocations || []).map(
              (obj: any) => {
                if (obj.id === this.currentLocationId)
                  this.selectedOfficeLocations.push(obj.id);
                return {
                  id: obj.id,
                  value: obj.locationName,
                };
              }
            );
          }
          this.getUserPermissions(this.isRequestFromPatientPortal);
          // this.fetchOfficeTimming();
          //this.fetchEvents();
          //////debugger;
          if (this.appttype != null && this.apptmode != null) {
            this.fetchfilteredappt();
          } else {
            this.fetchEvents();
          }
          if (!this.isPatientScheduler) {
            this.fetchStaffsAndPatients();
          }
        }
      }
    );
    this.getProviderList();
  }

  ngAfterViewInit() {
    setTimeout(function () {
      if(document.getElementsByClassName('cal-time-events')[0])
      document.getElementsByClassName('cal-time-events')[0].scrollTop = 800;
    }, 5000);
  }

  onDateChange(event: any) {
    this.viewDate = event.value;
    this.fetchEvents();
  }

  onDropdownSelectionChange(event: any): void {
    const source: MatSelect = event.source,
      value: any = event.value;
    if (source.id === "officeLocations") {
      // this.fetchOfficeTimming();
      this.fetchStaffsAndPatients();
    }


    this.fetchEvents();
  }

  onSelectOrDeselectChange(instanceName: string, type: string): void {
    switch (instanceName) {
      case "Locations":
        if (type == "SelectAll")
          this.selectedOfficeLocations = (this.officeLocations || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeLocations = [];

        // if (this.selectedOfficeLocations.length) this.fetchOfficeTimming();
        this.fetchStaffsAndPatients();
        break;
      case "Staffs":
        if (type == "SelectAll")
          this.selectedOfficeStaffs = (this.officeStaffs || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeStaffs = [];
        break;
      case "Clients":
        if (type == "SelectAll")
          this.selectedOfficeClients = (this.officeClients || []).map(
            (obj) => obj.id
          );
        else this.selectedOfficeClients = [];
        break;
      default:
        break;
    }
    this.fetchEvents();
  }

  fetchOfficeTimming(locationId?: string): void {
    locationId = locationId || (this.selectedOfficeLocations || []).join(",");
    this.schedulerService
      .getMinMaxOfficeTime(locationId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          let startDateTime = response.data.startTime;
          let endDateTime = response.data.endTime;

          this.officeTime = {
            dayStartHour: startDateTime.substring(0, 2),
            dayStartMinute: startDateTime.substring(3, 5),
            dayEndHour: endDateTime.substring(0, 2),
            dayEndMinute: endDateTime.substring(3, 5),
          };
        }
      });
  }

  createDialogReviewRating(data: any) {
    let dbModal;
    dbModal = this.appointmentDailog.open(ReviewRatingComponent, {
      data: { reviewRatingModel: this.reviewRatingModel },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save") {
      }
    });
  }

  fetchStaffsAndPatients(locationId?: string): void {
    locationId = locationId || (this.selectedOfficeLocations || []).join(",");

    let permissionKey = "";
    if (this.schedulerPermissions) {
      permissionKey = this.schedulerPermissions
        .SCHEDULING_LIST_VIEW_TEAM_SCHEDULES
        ? "SCHEDULING_LIST_VIEW_TEAM_SCHEDULES"
        : "";
      permissionKey = this.schedulerPermissions
        .SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES
        ? "SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES"
        : "";
    }

    this.schedulerService
      .getStaffAndPatientByLocation(locationId, permissionKey)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          (this.officeStaffs = []), (this.officeClients = []);
        } else {
          this.officeStaffs = response.data.staff || [];
          this.officeClients = response.data.patients || [];
        }
      });
  }

  fetchEvents(): void {
    this.showAllEventDaysArray = [];
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    if (!this.isWaitingRoomScreen) {
      const filterModal = {
        locationIds: (this.selectedOfficeLocations || []).join(","),
        fromDate: format(getStart(this.viewDate), "yyyy-MM-dd"),
        toDate: format(getEnd(this.viewDate), "yyyy-MM-dd"),
        staffIds: (this.selectedOfficeStaffs || []).join(","),
        patientIds: (this.selectedOfficeClients || []).join(","),
      };
      this.fetchAppointments(filterModal).subscribe();

      this.refresh.next("");
    } else {
      this.fetchSingleAppointment().subscribe();
      this.refresh.next("");
    }
  }

  fetchSingleAppointment(): Observable<any> {
    return (this.events$ = this.schedulerService
      .getAppointmentDetailsAsList(this.waitingRoomApptId)
      .pipe(
        map((response: any) => {
          if (response.statusCode !== 200) return [];
          else {
            if (response.data && response.data.length > 0 && this.isFirstLoad) {
              this.viewDate = response.data[0].startDateTime;
              const staffs = response.data[0]
                .appointmentStaffs as AppointmentStaff[];
              this.waitingRoomApptPatientId = response.data[0]
                .patientID as number;
              this.waitingRoomApptStaffId = response.data[0]
                .appointmentStaffs[0].staffId as number;
              this.isFirstLoad = false;

            } else if (this.waitingRoomApptStaffId) {

            }
            let data = response.data;
            data = data.filter((s:any) => !s.cancelTypeId || s.cancelTypeId === 0);
            if (this.isRequestFromPatientPortal) {
              data = data.filter(
                (s:any) =>
                  s.invitationAppointentId == undefined ||
                  s.invitationAppointentId == null ||
                  s.invitatioppointentId == 0
              );
            }
            return (data || []).map((appointmentObj: Appointment) => {
              let timeRange:any;
              if (appointmentObj.startDateTime && appointmentObj.endDateTime) {
               timeRange = `${format(new Date(appointmentObj.startDateTime), 'h:mm a')} - ${format(new Date(appointmentObj.endDateTime), 'h:mm a')}`;
              }
              const actions = this.getCalendarActions(appointmentObj);
              const bgColor = (this.statusColors || []).find(
                (x) =>
                  (x.name || "").toUpperCase() ==
                  (appointmentObj.statusName || "").toUpperCase()
              );
              let appointmentTitle =
                timeRange + (appointmentObj.patientName || "");
              if (
                appointmentObj.invitedStaffs &&
                appointmentObj.invitedStaffs.length > 0
              ) {
                appointmentTitle += "<ul class='list-invited-staff'>";
                appointmentObj.invitedStaffs.forEach((element:any) => {
                  appointmentTitle +=
                    "<li><span class='sp-large'>" +
                    element.name +
                    "</span><br/><span  class='sp-small'>" +
                    element.email +
                    "</span></li>";
                });
                appointmentTitle += "</ul>";
              }
              if (this.isRequestFromPatientPortal) {
                appointmentTitle =
                  timeRange +
                  (appointmentObj.appointmentStaffs || [])
                    .map((x:any) => x.staffName)
                    .join(",");
                if (
                  (appointmentObj.statusName || "").toUpperCase() == "PENDING" || (appointmentObj.statusName || "").toUpperCase() == "INVITED"
                ) {
                  appointmentTitle =
                    appointmentTitle + " Waiting For Provider Approval";
                } else if (
                  (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
                ) {
                  appointmentTitle =
                    appointmentTitle + " Appointement Cancelled";
                } else if ((appointmentObj.statusName || "").toUpperCase() == "APPROVED") {
                  appointmentTitle = appointmentTitle + " Appointment Has Been Approved";
                }
              }
              //let setCssClass = appointmentObj.statusName != "Approved" ? "CustomEventAptNotApproved" : "CustomEvent";
              let setCssClass = appointmentObj.statusName == "Approved"
                ? "CustomEvent"
                : appointmentObj.statusName !== "Cancelled"
                  ? "CustomEventAptNotApproved"
                  : "CustomEventAptCancelled";
              const eventObj: CalendarEvent<Appointment> = {
                title: appointmentTitle, //timeRange + appointmentObj.patientName,
                start: new Date(appointmentObj.startDateTime),
                end: new Date(appointmentObj.endDateTime),
                color: {
                  primary: appointmentObj.fontColor,
                  secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
                },
                // cssClass: "CustomEvent",
                cssClass: setCssClass,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
                draggable: true,
                actions: actions,
                meta: {
                  ...appointmentObj,
                },
              };
              return eventObj;
            });
          }
        })
      ));
  }

  fetchAppointments(filterModal: any): Observable<any> {
    return (this.events$ = this.schedulerService.getListData(filterModal).pipe(
      map((response: any) => {
        if (response.statusCode !== 200) return [];
        else {
          var data = response.data;
          data = data.filter((s:any) => s.cancelTypeId == 0);
          if (this.isRequestFromPatientPortal) {
            data = data.filter(
              (s:any) =>
                s.invitationAppointentId == undefined ||
                s.invitationAppointentId == null ||
                s.invitationAppointentId == 0
            );
          }
          
          if(this.filteredProvider != null ){
            if(this.filteredProvider.staffID!=null){

              data = data.filter((x:any) => x.appointmentStaffs[0].staffId == this.filteredProvider.staffID);
            }
          }

          return (data || []).map((appointmentObj: Appointment) => {
            // const timeRange = `${format(
            //   appointmentObj.startDateTime,
            //   'h:mm a'
            // )} - ${format(appointmentObj.endDateTime, 'h:mm a')} `;
            let timeRange:any;
            if (appointmentObj.startDateTime && appointmentObj.endDateTime) {
              timeRange = `${format(new Date(appointmentObj.startDateTime), 'h:mm a')} - ${format(new Date(appointmentObj.endDateTime), 'h:mm a')}`;
            }
            
            const actions = this.getCalendarActions(appointmentObj);
            const bgColor = (this.statusColors || []).find(
              (x) =>
                (x.name || "").toUpperCase() ==
                (appointmentObj.statusName || "").toUpperCase()
            );
            let appointmentTitle =
              timeRange + (appointmentObj.patientName || "");
            if (
              appointmentObj.invitedStaffs &&
              appointmentObj.invitedStaffs.length > 0
            ) {
              appointmentTitle += "<ul class='list-invited-staff'>";
              appointmentObj.invitedStaffs.forEach((element:any) => {
                appointmentTitle +=
                  "<li><span class='sp-large'>" +
                  element.name +
                  "</span><br/><span  class='sp-small'>" +
                  element.email +
                  "</span></li>";
              });
              appointmentTitle += "</ul>";
            }
            if (this.isRequestFromPatientPortal) {
              appointmentTitle =
                timeRange +
                (appointmentObj.appointmentStaffs || [])
                  .map((x:any) => x.staffName)
                  .join(",");
              if (
                (appointmentObj.statusName || "").toUpperCase() == "PENDING" || (appointmentObj.statusName || "").toUpperCase() == "INVITED"
              ) {
                appointmentTitle =
                  appointmentTitle + " Waiting For Provider Approval";
              } else if (
                (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
              ) {
                appointmentTitle = appointmentTitle + " Appointement Cancelled";
              } else if ((appointmentObj.statusName || "").toUpperCase() == "APPROVED") {
                appointmentTitle = appointmentTitle + " Appointment Has Been Approved";
              }
            }
            if (appointmentObj.bookingMode == "Online") {
              appointmentObj.fontColor = '#3BC7FB';
              appointmentObj.color = '#3bc7fbd6';
            }
            console.log('appointmentObj called', appointmentObj);
            //let setCssClass = appointmentObj.statusName != "Approved" ? "CustomEventAptNotApproved" : "CustomEvent";
            let setCssClass = appointmentObj.statusName == "Approved"
                ? "CustomEvent"
                : appointmentObj.statusName !== "Cancelled"
                  ? "CustomEventAptNotApproved"
                  : "CustomEventAptCancelled";
            const eventObj: CalendarEvent<Appointment> = {
              title: appointmentTitle, //timeRange + appointmentObj.patientName,
              start: new Date(appointmentObj.startDateTime),
              end: new Date(appointmentObj.endDateTime),
              color: {
                primary: appointmentObj.fontColor,
                secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
              },
              //color: this.colors.yellow,

              // cssClass: "CustomEvent",
              cssClass: setCssClass,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
              draggable: true,
              actions: actions,
              meta: {
                ...appointmentObj,
              },
            };

            //  this.events1.push(eventObj);
            // this.refresh.next();
            return eventObj;
          });
        }
      })
     
    ));
  }



  checkIsValidAppointment(appointmentObj: AppointmentModel) {
    const appointmentData = [
      {
        PatientAppointmentId: appointmentObj.patientAppointmentId,
        AppointmentTypeID: appointmentObj.appointmentTypeID,
        AppointmentStaffs: appointmentObj.appointmentStaffs,
        PatientID: appointmentObj.patientID,
        LocationId: appointmentObj.serviceLocationID,
        StartDateTime: format(
          appointmentObj.startDateTime,
          "yyyy-MM-ddTHH:mm:ss"
        ),
        EndDateTime: format(appointmentObj.endDateTime, "yyyy-MM-ddTHH:mm:ss"),
      },
    ];

    this.schedulerService
      .checkIsValidAppointment(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.notifierService.notify("error", response.message);
        } else {
          let data = response.data;
          let messagesArray = [];
          let isValidAppointment = true;
          if (data && data.length) {
            messagesArray = data.map((obj:any) => {
              if (!obj.valid) {
                isValidAppointment = obj.valid;
                return obj.message;
              } else {
                return null;
              }
            });
          }
          let availabilityMessage = messagesArray.join(", ");
          if (isValidAppointment) {
            this.isCheckedValidate = true;
            if (this.isCheckedValidate && this.isCheckedAuthorization) {
              this.createAppointment(appointmentObj);
              this.isCheckedValidate = false;
              this.isCheckedAuthorization = false;
            }
          } else this.notifierService.notify("warning", availabilityMessage);
        }
      });
  }

  checkAuthorizationDetails(appointmentObj: AppointmentModel): void {
    const appointmentData:any = {
      appointmentId: appointmentObj.patientAppointmentId,
      patientId: appointmentObj.patientID,
      appointmentTypeId: appointmentObj.appointmentTypeID,
      startDate: format(appointmentObj.startDateTime, "yyyy-MM-ddTHH:mm:ss"),
      endDate: format(appointmentObj.endDateTime, "yyyy-MM-ddTHH:mm:ss"),
      isAdmin: true,
      patientInsuranceId: null,
      authorizationId: null,
    };

    this.schedulerService
      .checkAuthorizationDetails(appointmentData)
      .subscribe((response: any) => {
        if (response.statusCode !== 200) {
          this.notifierService.notify("error", response.message);
        } else {
          const authorization = response.data;
          let authMessage = "",
            isValid = true;
          if (authorization && authorization.length) {
            let message = authorization[0].authorizationMessage;
            if (message.toLowerCase() === "valid") {
              isValid = true;
              authMessage = "";
            } else {
              isValid = false;
              authMessage = message;
            }
          }
          let authorizationMessage = authMessage;
          if (isValid) {
            this.isCheckedAuthorization = true;
            if (this.isCheckedValidate && this.isCheckedAuthorization) {
              this.createAppointment(appointmentObj);
              this.isCheckedValidate = false;
              this.isCheckedAuthorization = false;
            }
          } else this.notifierService.notify("warning", authorizationMessage);
        }
      });
  }

  createAppointment(appointmentData: any) {
    const queryParams = {
      IsFinish: true,
      isAdmin: false,
    };
    appointmentData = [
      {
        ...appointmentData,
        startDateTime: format(
          appointmentData.startDateTime,
          "yyyy-MM-ddTHH:mm:ss"
        ),
        endDateTime: format(appointmentData.endDateTime, "yyyy-MM-ddTHH:mm:ss"),
      },
    ];
    this.schedulerService
      .createAppointment(appointmentData, queryParams)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          this.notifierService.notify("success", response.message);
          this.fetchEvents();
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }

  handleMoveAppointmentClick(appointment: any) {
    let isAdminUpdateAfterRendered = appointment.claimId ? true : false;
    let appointmentData = {
      ...appointment,
    };
    this.isCheckedValidate = false;
    this.checkIsValidAppointment(appointmentData);
    if (appointmentData.isBillable) {
      this.isCheckedAuthorization = false;
      this.checkAuthorizationDetails(appointmentData);
    } else {
      this.isCheckedAuthorization = true;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): any {
    if (this.isRequestFromPatientPortal) {
      return null;
    }

    const appointmentObj: AppointmentModel = {
      ...event.meta,
      startDateTime: newStart,
      endDateTime: newEnd,
    };
    this.notifierService.notify(
      "error",
      "You can not edit timing once payment done."
    );
    // this.dialogService
    //   .confirm("Are you sure you want to move appointment?")
    //   .subscribe((result: any) => {
    //     if (result == true) {
    //       //this.handleMoveAppointmentClick(appointmentObj);
    //     }
    //   });
  }

  getCalendarActions(appointmentObj: Appointment): Array<CalendarEventAction> {
    let actions:any = [];
    var todayDateTime = new Date();
    var year = todayDateTime.getFullYear();
    var month = todayDateTime.getMonth();
    var date = todayDateTime.getDate();
    var todayDate = new Date(year, month, date);
    //old code
   // var apptStartDateTime:any = new Date(appointmentObj.startDateTime);
   //new code
   var apptStartDateTime:any = appointmentObj.startDateTime ? new Date(appointmentObj.startDateTime) : new Date();
    var yearAppt = apptStartDateTime.getFullYear();
    var monthAppt = apptStartDateTime.getMonth();
    var dateAppt = apptStartDateTime.getDate();
    var apptStartDate = new Date(yearAppt, monthAppt, dateAppt);

    if (this.isWaitingRoomScreen) {
      return actions;
    }
    if (
      (appointmentObj.statusName || "").toUpperCase() == "PENDING" ||
      (appointmentObj.cancelTypeId && appointmentObj.cancelTypeId > 0)
    ) {
      actions = [
        {
          //   icon: '<i class="fa fa-fw fa-pencil" title="Edit"></i>',
          //   name: 'Edited'
          // },
          //{
          icon: '<span class="material-icons material-icons-delete" title="Delete" style="color:#d00;">delete_forever</span>', // '<i class="fa fa-fw fa-trash" title="Delete"></i>',
          name: "Deleted",
        },
      ];
    }
    if (appointmentObj.patientEncounterId) {
      actions.push({
        icon: '<span class="material-icons material-icons-view-soap" title="View Soap Note" style="color:#3b4da5">pageview</span>',
        //'<i class="fa fa-fw fa-pencil-square" title="View Soap Note"></i>',
        name: "ViewSoapNote",
      });
    } else if (
      // appointmentObj.cancelTypeId > 0 &&
      // new Date(appointmentObj.startDateTime) < new Date()
      appointmentObj.patientID > 0 &&
      !(appointmentObj.cancelTypeId && appointmentObj.cancelTypeId > 0) &&
      (appointmentObj.statusName || "").toUpperCase() != "PENDING"
    ) {
      actions.push({
        icon: '<span class="material-icons material-icons-outlined"  title="go to waiting-room" style="color:#90962f">fact_check</span>',
        //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        name: "CreateSoapNote",

        // });
        // actions.push({
        //   icon:
        //     '<span class="material-icons-create-soap material-icons" title="Edit" style="color:#217971">mode_edit</span>',
        //   //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        //   name: "Edited",
        //todayss
      });
      if (
        !this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING" &&
        appointmentObj.isTelehealthAppointment
      ) {
        let invitedBadge = "";
        if (
          appointmentObj.invitedStaffs &&
          appointmentObj.invitedStaffs.length > 0
        ) {
          invitedBadge =
            '<span class="invited-badge invited-badge-' +
            appointmentObj.patientAppointmentId +
            '">' +
            appointmentObj.invitedStaffs.length +
            "</span>";
        }
        actions.push({
          icon: '<span class="material-icons material-icons-chat" title="Chat" style="color:#513671">chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
          name: "Chat",
        });
        // actions.push({
        //   icon:
        //     '<span class="material-icons material-icons-add-person" title="Invite" style="color:#217971">person_add</span>' +
        //     invitedBadge, //<i class="fa fa-video-camera" title="Join Video Call"></i>',
        //   name: "AddNewPerson",
        // });
      }
      if (
        appointmentObj.invitedStaffs &&
        appointmentObj.invitedStaffs.length > 0
      ) {
        actions.push({
          icon: '<span class="material-icons material-icons-users" title="Chat" >supervisor_account</span>',
          name: "invitees",
        });
      }

      if (
        this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() == "APPROVED" &&
        appointmentObj.isTelehealthAppointment
      ) {
        if (todayDate <= apptStartDate) {
          actions.push({
            icon: '<span class="material-icons material-symbols-outlined" title="Go to waiting-room " style="color:#513671">local_hospital</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
            name: "VideoCall",
          });
        }
        // actions.push({
        //   icon:
        //     '<span class="material-icons-create-soap material-icons" title="Edit" style="color:#217971">mode_edit</span>',
        //   //'<i class="fa fa-fw fa-pencil-square-o" title="Create Soap Note"></i>',
        //   name: "Edited",

        // });
      }
    }

    // check for appointment is cancelled or not
    if (appointmentObj.cancelTypeId && appointmentObj.cancelTypeId > 0) {
      actions = actions.filter(
        (obj:any) => obj.name !== "Edited" && obj.name !== "Deleted"
      );
      !this.isRequestFromPatientPortal;
      // && actions.push({
      //   icon: '<i class="fa fa-undo" title="Undo Cancel"></i>',
      //   name: 'UndoCancel'
      // })
    } else {
      if (
        (appointmentObj.statusName || "").toUpperCase() == "PENDING" ||
        (appointmentObj.statusName || "").toUpperCase() == "APPROVED"
      ) {
        // actions.push({
        //   icon:
        //     '<span class="material-icons material-icons-cancel" title="Cancel" style="color:#ce7930">clear</span>', //<i class="fa fa-ban" title="Cancel"></i>',
        //   name: "Cancel",
        // });
      }
    }
    // check wheater claim is generated or not
    if (appointmentObj.claimId && appointmentObj.claimId > 0) {
      actions = actions.filter((obj:any) => obj.name !== "Cancel");
      actions = appointmentObj.canEdit
        ? actions
        : actions.filter(
          (obj:any) => obj.name !== "Edited" && obj.name !== "Deleted"
        );
    }
    if (this.schedulerPermissions) {
      !this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP &&
        (actions = actions.filter((obj:any) => obj.name !== "CreateSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_VIEWSOAP &&
        (actions = actions.filter((obj:any) => obj.name !== "ViewSoapNote"));
      !this.schedulerPermissions.SCHEDULING_LIST_UPDATE &&
        (actions = actions.filter((obj:any) => obj.name !== "Edited"));
      !this.schedulerPermissions.SCHEDULING_LIST_DELETE &&
        (actions = actions.filter((obj:any) => obj.name !== "Deleted"));
      !this.schedulerPermissions.SCHEDULING_LIST_CANCEL_APPOINTMENT &&
        (actions = actions.filter((obj:any) => obj.name !== "Cancel"));
      // this.schedulerPermissions.SCHEDULING_LIST_CREATESOAP && actions.filter(obj => obj.name !== 'SoapNote')

      if (
        !this.isAdminLogin &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING"
      ) {
        const staffId =
          appointmentObj.appointmentStaffs &&
            appointmentObj.appointmentStaffs.length
            ? appointmentObj.appointmentStaffs[0].staffId
            : null;
        if (this.schedulerPermissions.SCHEDULING_LIST_CREATEOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj:any) => obj.name !== "CreateSoapNote");
        }
        if (this.schedulerPermissions.SCHEDULING_LIST_VIEWOWNSOAP_ONLY) {
          if (staffId != this.currentLoginUserId)
            actions = actions.filter((obj:any) => obj.name !== "ViewSoapNote");
        }
      }
     
      if (
        !this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() == "PENDING" &&
        todayDate <= apptStartDate
      ) {
        actions = actions.filter(
          (obj:any) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote"
          //(obj) => obj.name !== "CreateSoapNote" && obj.name !== "ViewSoapNote" && obj.name !== "Edited",
          //todayss
        );
        actions.push({
          icon: '<span class="material-icons material-icons-approv" title="Approve" style="color:#50ce30">check_circle_outline</span>', //'<i class="fa fa-check" title="Approve"></i>',
          name: "Approve",
        });
      } else if (
        this.isRequestFromPatientPortal &&
        (appointmentObj.statusName || "").toUpperCase() != "PENDING"
      ) {
        actions = actions.filter(
          (obj:any) => obj.name !== "Edited" && obj.name !== "Deleted"
          //(obj) => obj.name !== "Deleted"
          //todayss
        );
      }
    }
    if (appointmentObj.invitationAppointentId) {
      this.commonService.userRole.subscribe((role) => {
        if (role.toLowerCase() == "provider") {
          actions = [];
          actions.push({
            icon: '<span class="material-icons material-icons-video" title="Join Invited Video Call" style="color:#90962f">voice_chat</span>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
            name: "OnlyVideoCall",
          });
        }
      });
    }
    // actions.push({
    //   icon: '<div class="appt-blk"><span class="cal-event" title="appt" style="color:#513671"></span></div>', //<i class="fa fa-video-camera" title="Join Video Call"></i>',
    //   name: "APPT",
    // });
    return actions.map((obj:any) => {
      const icn = obj.icon as string;
      const [s1, ...s2Array] = icn.split(" ");
      const iconStr = [s1, 'value="' + obj.name + '"', s2Array].join(" ");
      obj.icon = iconStr.split(",").join(" ");

      return {
        label: obj.icon,
        onClick: ({ event }: { event: CalendarEvent }): void => {
          this.handleEvent(obj.name, event.meta);
        },
      };
    });
  }

  getClientInfo(patientId:any): Promise<any> {
    return this.clientService.getClientById(patientId).toPromise();
    // .subscribe((response: any) => {
    //   if (response != null) {
    //     this.clientModel = response.data;
    //   }
    // });
  }
  async handleEvent(type: string, event: AppointmentModel) {
    //////debugger;
    let appointmentObj = {
      appointmentId: event.patientAppointmentId,
      isRecurrence: event.isRecurrence,
      parentAppointmentId: event.parentAppointmentId,
      deleteSeries: false,
      claimId: event.claimId,
      patientEncounterId: event.patientEncounterId || 0,
      isBillable: event.isBillable,
      patientId: event.patientID,
      currentStaffid: this.isClientLogin
        ? event.appointmentStaffs[0].staffId
        : 0,
    };
    // localStorage.removeItem('apptId');
    if (appointmentObj.patientId && appointmentObj.patientId != 0) {
      this.clientModel = await this.getClientInfo(appointmentObj.patientId);
    }
    // localStorage.setItem('apptId',appointmentObj.appointmentId.toString());
    this.currentAppointmentId = appointmentObj.appointmentId;
    this.currentPatientId = appointmentObj.patientId;
    this.isClientLogin;
    {
      this.currentStaff = appointmentObj.currentStaffid;
    }

    this.reviewRatingModel = new ReviewRatingModel();
    this.reviewRatingModel.id = event.reviewRatingId;
    this.reviewRatingModel.patientAppointmentId = this.currentAppointmentId;
    this.reviewRatingModel.rating = event.rating;
    this.reviewRatingModel.review = event.review;
    this.reviewRatingModel.staffId = this.isClientLogin
      ? event.appointmentStaffs[0].staffId
      : 0;

    switch (type.toUpperCase()) {
      case "EDITED":
        this.schedulerService
          .getAppointmentDetails(appointmentObj.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              const appointmentObj: AppointmentModel = response.data;
              this.createModel(appointmentObj, true);
            } else {
              this.createModel(null, true);
            }
          });
        break;
      case "DELETED":
        this.handleDeleteAppoitnment(appointmentObj);
        break;
      case "APPT":
        break;

      case "CANCEL":
        this.createCancelAppointmentModel(appointmentObj.appointmentId);
        break;
      case "ADDNEWPERSON":
        this.addNewCallerService
          .getOTSessionByAppointmentId(appointmentObj.appointmentId)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                appointmentObj.appointmentId,
                response.data.id
              );
            }
          });
        break;
      case "UNDOCANCEL":
        this.schedulerService
          .unCancelAppointment(appointmentObj.appointmentId)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify("success", response.message);
              this.fetchEvents();
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      case "CREATESOAPNOTE":
        this.router.navigate([
          "/web/waiting-room/" + appointmentObj.appointmentId,
        ]);
        break;
      case "VIEWSOAPNOTE":
        // if (appointmentObj.isBillable)
        // this.router.navigate(["/web/encounter/soap"], {
        //   queryParams: {
        //     apptId: appointmentObj.appointmentId,
        //     encId: appointmentObj.patientEncounterId,
        //   },
        // });
        this.createViewAppointmentModel(appointmentObj.appointmentId);
        // else
        //   this.router.navigate(["/web/encounter/non-billable-soap"], {
        // queryParams: {
        //   apptId: appointmentObj.appointmentId,
        //   encId: appointmentObj.patientEncounterId
        // }
        // });
        break;
      case "APPROVE":
        const appointmentData = {
          id: appointmentObj.appointmentId,
          status: "APPROVED",
        };
        this.schedulerService
          .updateAppointmentStatus(appointmentData)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifierService.notify("success", response.message);
              this.fetchEvents();
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      case "VIDEOCALL":
        this.router.navigate([
          "/web/waiting-room/" + appointmentObj.appointmentId,
        ]);
        break;
      // this.router.navigate(["/web/encounter/video-call"], {
      //   queryParams: {
      //     apptId: appointmentObj.appointmentId,
      //   },
      // });
      case "ONLYVIDEOCALL":
        this.encounterService
          .getTelehealthSessionForInvitedAppointmentId(
            appointmentObj.appointmentId
          )
          .subscribe((response) => {
            if (response.statusCode == 200) {
              var otSession = this.commonService.encryptValue(
                JSON.stringify(response.data)
              );
              localStorage.setItem("otSession", otSession);
              this.commonService.videoSession(true);
            }
          });
          break;
      case "CHAT":
        //////debugger;
        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = appointmentObj.appointmentId;
            chatInitModel.UserId = response.data.userID;
            if (this.isClientLogin) {
              chatInitModel.UserRole = response.data.users3.userRoles.userType;
            } else {
              chatInitModel.UserRole = response.data.userRoles.userType;
            }
            //chatInitModel.UserRole = response.data.userRoles.userType;
            this.appService.CheckChatActivated(chatInitModel);
            // this.getAppointmentInfo(
            //   chatInitModel.AppointmentId,
            //   chatInitModel.UserRole
            // );
            this.textChatService.setAppointmentDetail(
              chatInitModel.AppointmentId,
              chatInitModel.UserRole
            );
            this.textChatService.setRoomDetail(
              chatInitModel.UserId,
              chatInitModel.AppointmentId
            );
          }
        });
        break;
      default:
        break;
    }
  }

  handleDeleteAppoitnment(appointmentObj: any) {
    if (appointmentObj.isRecurrence) {
      this.dialogService
        .confirm("Do you want to delete whole series or this one?", [
          {
            name: "Delete Series",
            value: true,
          },
          {
            name: "Delete One",
            value: false,
          },
        ])
        .subscribe((result: any) => {
          if (result == true) {
            appointmentObj.deleteSeries = true;
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          } else if (result == false) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    } else {
      this.dialogService
        .confirm("Are you sure you want to delete appointment?")
        .subscribe((result: any) => {
          if (result == true) {
            this.schedulerService
              .deleteAppointmentDetails(
                appointmentObj.appointmentId,
                appointmentObj.parentAppointmentId,
                appointmentObj.deleteSeries,
                false
              )
              .subscribe((response: any) => {
                if (response.statusCode === 200) {
                  this.notifierService.notify("success", response.message);
                  this.fetchEvents();
                } else {
                  this.notifierService.notify("error", response.message);
                }
              });
          }
        });
    }
  }

  dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: Array<CalendarEvent<{ appointment: Appointment }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  IsPreviousDate(selected_date:any) {
    //////debugger
    var now = new Date();
    if (this.isMonthView) now.setHours(0, 0, 0, 0);
    if (selected_date < now) {
      console.log("Selected date is in the past");
      return true;
    } else {
      console.log("Selected date is NOT in the past");
      return false;
    }
  }

  eventClicked(event: CalendarEvent<{ appointment: Appointment }>): void { }

  hourSegmentClicked(event: any): any {
    //////debugger
    if (!this.schedulerPermissions.SCHEDULING_LIST_ADD) {
      return null;
    }

    const slotInfo = {
      start: event.date,
      end: addMinutes(event.date, 59),
    };
    // if (!this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
    //   this.notifierService.notify(
    //     "warning",
    //     "Selected staff(s) is not available at this date, time."
    //   );
    //   return null;
    // }
    this.notifierService.hideAll();
    this.apptObj = new AppointmentModel();
    this.apptObj.startDateTime = slotInfo.start;
    this.apptObj.endDateTime = addMinutes(slotInfo.start, 60);
  }

  createModel(appointmentModal: AppointmentModel | null, type: any) {
    const selectedOfficeClients = !this.isPatientScheduler //todayss
      ? this.officeClients.filter((obj) =>
        this.selectedOfficeClients.includes(obj.id)
      )
      : [{ id: this.patientSchedulerId, value: "" }];
    const selectedOfficeLocations = !this.isPatientScheduler
      ? this.officeLocations.filter((obj) =>
        this.selectedOfficeLocations.includes(obj.id)
      )
      : [{ id: this.currentLocationId, value: "" }];
    const modalPopup = this.appointmentDailog.open(SchedulerDialogComponent, {
      hasBackdrop: true,
      data: {
        appointmentData: appointmentModal || new AppointmentModel(),
        selectedOfficeLocations: selectedOfficeLocations,
        selectedOfficeStaffs: this.officeStaffs.filter((obj) =>
          this.selectedOfficeStaffs.includes(obj.id)
        ),
        selectedOfficeClients,
        isPatientScheduler: this.isPatientScheduler,
        isRequestFromPatientPortal: this.isRequestFromPatientPortal,
        isNew: type,
      },
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") this.fetchEvents();
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(
      CancelAppointmentDialogComponent,
      {
        hasBackdrop: true,
        data: appointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") this.fetchEvents();
    });
  }
  createAddPersonModel(appointmentId: number, sessionId: number) {
    const modalPopup = this.appointmentDailog.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "save") this.fetchEvents();
    });
  }
  // before render of the Calendar events ...
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    this.isDayView = false;
    this.isWeekView = false;
    this.isMonthView = true;
    body.forEach((day) => {
      const slotInfo = {
        start: day.date,
        end: day.date,
      };
      if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
        day.cssClass = "available-bg-color";
      }
    });
  }
  beforeWeekViewRender(e: CalendarWeekViewBeforeRenderEvent) {
    this.isDayView = false;
    this.isWeekView = true;
    this.isMonthView = false;
    e.hourColumns.forEach((obj) => {
      obj.hours.forEach((h) => {
        h.segments.forEach((s) => {
          const slotInfo = {
            start: s.date,
            end: addMinutes(s.date, 59),
          };
          // const isAvailableForWRResche = this.isBoolingDateAvailable(slotInfo.start);

          let cssClass = "";
          if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
            cssClass = "available-bg-color";
          }
          // if(isAvailableForWRResche){
          //   cssClass = cssClass + " is-available-cell-week-re";
          // }
          s.cssClass = cssClass;
        });
      });
    });
  }

// old code e.body is not working

  // beforeDayViewRender(e: CalendarDayViewBeforeRenderEvent) {
  //   this.isDayView = true;
  //   this.isWeekView = false;
  //   this.isMonthView = false;
  //   e.body.hourGrid.forEach((h:any) => {
  //     h.segments.forEach((s:any) => {
  //       const slotInfo = {
  //         start: s.date,
  //         end: addMinutes(s.date, 59),
  //       };
  //       let cssClass = "";
  //       if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
  //         cssClass = "available-bg-color";
  //       }
  //       s.cssClass = cssClass;
  //     });
  //   });
  // }

  //new code 
  beforeDayViewRender(e: any) {
    this.isDayView = true;
    this.isWeekView = false;
    this.isMonthView = false;
    e.body.hourGrid.forEach((h:any) => {
      h.segments.forEach((s:any) => {
        const slotInfo = {
          start: s.date,
          end: addMinutes(s.date, 59),
        };
        let cssClass = "";
        if (this.checkAvailability(slotInfo) && !this.isPatientScheduler) {
          cssClass = "available-bg-color";
        }
        s.cssClass = cssClass;
      });
    });
  }

  // staff availability check
  checkAvailability = (slotInfo:any) => {
    let isAvailable = false;
    let isUnavailable = false;
    if (this.staffsAvailibility) {
      let availableArray = this.staffsAvailibility;
      if (availableArray.unavailable && availableArray.unavailable.length) {
        let isDayAvailibility = false,
          isMonthView = (this.view || "").toLowerCase() === "month";
        isUnavailable = this.isAvailableDateTime(
          availableArray.unavailable,
          slotInfo,
          isDayAvailibility,

          isMonthView
        );
      }

      if (isUnavailable) {
        isAvailable = false;
      } else {
        if (availableArray.available && availableArray.available.length) {
          let isDayAvailibility = false,
            isMonthView = (this.view || "").toLowerCase() === "month";
          isAvailable = this.isAvailableDateTime(
            availableArray.available,
            slotInfo,
            isDayAvailibility,
            isMonthView
          );
        }

        if (!isAvailable && availableArray.days && availableArray.days.length) {
          let isDayAvailibility = true,
            isMonthView = (this.view || "").toLowerCase() === "month";
          isAvailable = this.isAvailableDateTime(
            availableArray.days,
            slotInfo,
            isDayAvailibility,
            isMonthView
          );
        }
      }
    }
    return isAvailable;
  };

  isAvailableDateTime(
    availibilityArray:any,
    slotInfo:any,
    isDayAvailibility:any,
    isMonthView:any
  ) {
    let isValidDateTime = false,
      tempArray = availibilityArray;

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let SlotStartDate = new Date(slotInfo.start).toDateString(),
      nowDate = new Date(),
      year = nowDate.getFullYear(),
      month = nowDate.getMonth(),
      date = nowDate.getDate(),
      slotStart = new Date(slotInfo.start),
      slotEnd = new Date(slotInfo.end),
      slotStartTime = new Date(
        year,
        month,
        date,
        slotStart.getHours(),
        slotStart.getMinutes()
      ),
      slotEndTime = new Date(
        year,
        month,
        date,
        slotEnd.getHours(),
        slotEnd.getMinutes()
      ),
      SlotDayName = days[new Date(slotInfo.start).getDay()];

    for (let index = 0; index < tempArray.length; index++) {
      let isValidDay = false;
      if (isDayAvailibility) {
        let availableDayName = tempArray[index].dayName || "";
        isValidDay =
          SlotDayName.toLowerCase() === availableDayName.toLowerCase();
      } else {
        let availableDate = new Date(tempArray[index].date).toDateString();
        isValidDay = availableDate === SlotStartDate;
      }
      let availStartTime = new Date(tempArray[index].startTime),
        avialEndTime = new Date(tempArray[index].endTime),
        startTime = new Date(
          year,
          month,
          date,
          availStartTime.getHours(),
          availStartTime.getMinutes()
        ),
        endTime = new Date(
          year,
          month,
          date,
          avialEndTime.getHours(),
          avialEndTime.getMinutes()
        );

      let isValidTime = startTime <= slotStartTime && endTime >= slotEndTime;
      let isResourceId = slotInfo.resourceId
        ? slotInfo.resourceId === tempArray[index].staffID || ""
        : true;

      if (isResourceId && isValidDay && (isMonthView || isValidTime)) {
        isValidDateTime = true;
        break;
      }
    }
    return isValidDateTime;
  }

  getUserPermissions(isRequestFromPatientPortal: boolean) {
    const actionPermissions =
      this.schedulerService.getUserScreenActionPermissions(
        "SCHEDULING",
        "SCHEDULING_LIST"
      );

    const {
      SCHEDULING_LIST_ADD,
      SCHEDULING_LIST_UPDATE,
      SCHEDULING_LIST_DELETE,
      SCHEDULING_LIST_CREATESOAP,
      SCHEDULING_LIST_VIEWSOAP,
      SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
      SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
      SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
      SCHEDULING_LIST_CANCEL_APPOINTMENT,
      SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
      SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
      SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
      SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
    } = actionPermissions;
    if (isRequestFromPatientPortal) {
      this.schedulerPermissions = {
        SCHEDULING_LIST_ADD: true,
        SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES: true,
        SCHEDULING_LIST_UPDATE: true,
        SCHEDULING_LIST_VIEWSOAP: false,
        SCHEDULING_LIST_CANCEL_APPOINTMENT: true,
      };
    } else {
      this.schedulerPermissions = {
        SCHEDULING_LIST_ADD,
        SCHEDULING_LIST_UPDATE,
        SCHEDULING_LIST_DELETE,
        SCHEDULING_LIST_CREATESOAP,
        SCHEDULING_LIST_VIEWSOAP,
        SCHEDULING_LIST_VIEW_CLIENT_SCHEDULES,
        SCHEDULING_LIST_VIEW_TEAM_SCHEDULES,
        SCHEDULING_LIST_VIEW_OTHERSTAFF_SCHEDULES,
        SCHEDULING_LIST_CANCEL_APPOINTMENT,
        SCHEDULING_LIST_MODIFYAPPOINTMENT_AFTER_RENDERING,
        SCHEDULING_EDIT_APPOINTMENT_TIME_ONLY,
        SCHEDULING_LIST_CREATEOWNSOAP_ONLY,
        SCHEDULING_LIST_VIEWOWNSOAP_ONLY,
      };
    }
  }

  createViewAppointmentModel(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(AppointmentViewComponent, {
      hasBackdrop: true,
      data: appointmentId,
      width: "80%",
    });

    modalPopup.afterClosed().subscribe((result) => {
      // if (result === "SAVE") this.fetchEvents();
    });
  }

  // test(e){
  //   console.log(e);
  //
  // }

  toDateString(date:any) {
    return this.date.transform(new Date(date), "dd");
  }
  // getBgColor(appointmentStatus): string{

  //   //return this.statusColors.find(x => x.name.toLowerCase() == appointmentStatus.toLowerCase()).color;
  // }

  getBgClass(index: number, a: any): string {
    // console.log("Set background color to cell", a);
    let mode = a.meta.bookingMode || a.meta.mode || "";
    if (mode) {
      return mode.toLowerCase() == "online" ? "yellowCellColor" : mode.toLowerCase() == "face to face" ? "redCellColor" : mode.toLowerCase() == "home visit" ? "blueCellColor" : "greenCellColor";
    }
    else {
      return index % 2 == 0 ? "evenCellColor" : "oddCellColor";
    }
    // : a.meta.bookingMode.toLowerCase() == "face to face" ? "redCellColor" : "blueCellColor";

  }

  monthViewActionCliked(action:any, event: CalendarEvent) {
    const actionEl = this.commonService.parseStringToHTML(
      action.label
    ) as HTMLElement;
    const actionName = actionEl.getAttribute("value") as string;
    this.handleEvent(actionName, event.meta);
  }
  //  countColor=0;
  // getBgClassForWeek(): string{
  //   this.countColor = this.countColor+ 1;
  //  return this.getBgClass(this.countColor)
  // }

  openShowAllEvents(day: number) {
    if (!this.showAllEventDaysArray.includes(day))
      this.showAllEventDaysArray.push(day);
  }

  closeShowAllEvents(day: number) {
    const index: number = this.showAllEventDaysArray.indexOf(day);
    if (index !== -1) {
      this.showAllEventDaysArray.splice(index, 1);
    }
  }

  isDayOpened(day: number): boolean {
    return this.showAllEventDaysArray.includes(day) ? true : false;
  }

  monthEvntsToolTip(appointmentTitle:any) {
    console.log('Month-Tool-Tip:', appointmentTitle);
    return '<div class="month-title-tip-view"> ' + appointmentTitle + " </div>";
  }

  getStartEndTime(obj: any) {
    let startDate: Date = new Date(obj.startTime),
      endDate: Date = new Date(obj.endTime);

    let slotStartHr = startDate.getHours(),
      slotStartMin = startDate.getMinutes(),
      slotEndHr = endDate.getHours(),
      slotEndMin = endDate.getMinutes(),
      startTime = this.parseTime(slotStartHr + ":" + slotStartMin),
      endTime = this.parseTime(slotEndHr + ":" + slotEndMin);
    return { startTime: startTime, endTime: endTime };
  }

  parseTime(s:any) {
    let c = s.split(":");
    return parseInt(c[0]) * 60 + parseInt(c[1]);
  }

  convertHours(mins: number) {
    let hour = Math.floor(mins / 60);
    mins = mins % 60;
    let time = "";
    if (this.pad(hour, 2) < 12) {
      time = this.pad(hour, 2) + ":" + this.pad(mins, 2) + " AM";
    } else {
      time =
        this.pad(hour, 2) == 12
          ? this.pad(hour, 2) + ":" + this.pad(mins, 2) + " PM"
          : this.pad(hour, 2) - 12 + ":" + this.pad(mins, 2) + " PM";
    }
    //let converted = this.pad(hour, 2)+':'+this.pad(mins, 2);
    return time;
  }

  pad(str:any, max:any):any {
    str = str.toString();
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  calculateTimeSlotRange(
    start_time: number,
    end_time: number,
    interval: number = 30
  ) {
    let i, formattedStarttime, formattedEndtime;
    let time_slots: Array<any> = [];
    for (let i = start_time; i <= end_time - interval; i = i + interval) {
      formattedStarttime = this.convertHours(i);
      formattedEndtime = this.convertHours(i + interval);
      time_slots.push({
        startTime: formattedStarttime,
        endTime: formattedEndtime,
      });
    }
    return time_slots;
  }

  staffAvailability: any;
  providerAvailableDates: any = [];
  providerNotAvailableDates: any = [];

  getProviderAvailabilityForReschedule() {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    //  const fromDate = getStart(this.viewDate);
    const fromDate = new Date();
    const toDate = getEnd(this.viewDate);
    var currentDate = fromDate;
    while (currentDate <= toDate) {
      const newDate = currentDate.setDate(currentDate.getDate() + 1);
      currentDate = new Date(newDate);
      this.checkAvailabilityForDate(
        currentDate,
        this.waitingRoomApptStaffId,
        30
      );
    }
  }

  checkAvailabilityForDate(reqDate: Date, staffId:any, interval:any) {
    let currentAvailabilityDay: any;
    let currentAvailableDates: Array<any> = [];
    let currentUnAvailableDates: Array<any> = [];
    let clientAppointments: Array<any> = [];

    // let days = [
    //   "Sunday",
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    // ];

    const filterModal = {
      locationIds: this.currentLocationId,
      fromDate: format(reqDate, "yyyy-MM-dd"),
      toDate: format(reqDate, "yyyy-MM-dd"),
      staffIds: staffId,
      patientIds: ([]).join(","),
    };

    // let dayName = days[reqDate.getDay()];
    // currentAvailabilityDay = this.staffAvailability.filter(
    //   (x) => x.dayName === dayName
    // );

    // //Find date wise availability
    // if (
    //   this.providerAvailableDates != null &&
    //   this.providerAvailableDates.length > 0
    // ) {
    //   currentAvailableDates = this.providerAvailableDates.filter(
    //     (x) =>
    //       this.date.transform(new Date(x.date), "yyyyMMdd") ===
    //       this.date.transform(reqDate, "yyyyMMdd")
    //   );
    // }

    // //find datewise unavailabilty
    // if (
    //   this.providerNotAvailableDates != null &&
    //   this.providerNotAvailableDates.length > 0
    // ) {
    //   currentUnAvailableDates = this.providerNotAvailableDates.filter(
    //     (x) =>
    //       this.date.transform(new Date(x.date), "yyyyMMdd") ===
    //       this.date.transform(reqDate, "yyyyMMdd")
    //   );
    // }

    this.schedulerService
      .getListData(filterModal)
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          let patientAppointments = response.data;

          patientAppointments.forEach((app:any) => {
            let obj = {
              startTime: app.startDateTime,
              endTime: app.endDateTime,
            };
            let timeObj = this.getStartEndTime(obj),
              startTime = timeObj.startTime,
              endTime = timeObj.endTime;
            if (
              !app.cancelTypeId ||
              (app.cancelTypeId == null && app.cancelTypeId == 0)
            ) {
              this.calculateTimeSlotRange(startTime, endTime, interval).forEach(
                (x) => {
                  clientAppointments.push({
                    startTime: x.startTime,
                    endTime: x.endTime,
                    statusName: app.statusName,
                  });
                }
              );
            }
          });

          let slots: Array<any> = [];
          let availDaySlots: Array<any> = [];
          let availDateSlots: Array<any> = [];
          let unAvailDateSlots: Array<any> = [];
          let providerAvailiabilitySlots: Array<any> = [];

          // if (
          //   currentAvailabilityDay != null &&
          //   currentAvailabilityDay.length > 0
          // ) {
          //   currentAvailabilityDay.forEach((currentDay) => {
          //     let timeObj = this.getStartEndTime(currentDay),
          //       startTime = timeObj.startTime,
          //       endTime = timeObj.endTime;

          //     this.calculateTimeSlotRange(startTime, endTime, interval).forEach(
          //       (x) => {
          //         availDaySlots.push(x);
          //       }
          //     );
          //   });
          // }

          // if (
          //   currentAvailableDates != null &&
          //   currentAvailableDates.length > 0
          // ) {
          //   currentAvailableDates.forEach((avail) => {
          //     let timeObj = this.getStartEndTime(avail),
          //       startTime = timeObj.startTime,
          //       endTime = timeObj.endTime;

          //     this.calculateTimeSlotRange(startTime, endTime, interval).forEach(
          //       (x) => {
          //         availDateSlots.push(x);
          //       }
          //     );
          //   });
          // }

          // if (
          //   currentUnAvailableDates != null &&
          //   currentUnAvailableDates.length > 0
          // ) {
          //   currentUnAvailableDates.forEach((avail) => {
          //     let timeObj = this.getStartEndTime(avail),
          //       startTime = timeObj.startTime,
          //       endTime = timeObj.endTime;

          //     this.calculateTimeSlotRange(startTime, endTime, interval).forEach(
          //       (x) => {
          //         unAvailDateSlots.push(x);
          //       }
          //     );
          //   });
          // }

          // if (availDateSlots.length == 0) {
          //   if (availDaySlots.length > 0) {
          //     if (unAvailDateSlots.length > 0) {
          //       unAvailDateSlots.forEach((slot) => {
          //         const foundIndex = availDaySlots.findIndex(
          //           (x) =>
          //             x.startTime == slot.startTime && x.endTime == slot.endTime
          //         );
          //         if (foundIndex != -1) {
          //           availDaySlots = availDaySlots.filter(
          //             (_, index) => index !== foundIndex
          //           );
          //         }
          //       });
          //     }
          //     slots = availDaySlots;
          //   }
          // } else {
          //   if (unAvailDateSlots.length > 0) {
          //     unAvailDateSlots.forEach((slot) => {
          //       const foundIndex = availDateSlots.findIndex(
          //         (x) =>
          //           x.startTime == slot.startTime && x.endTime == slot.endTime
          //       );
          //       if (foundIndex != -1) {
          //         availDateSlots = availDateSlots.filter(
          //           (_, index) => index !== foundIndex
          //         );
          //       }
          //     });
          //   }
          //   slots = availDateSlots;
          // }

          // if (slots.length > 0) {
          //   slots.forEach((x) => {
          //     providerAvailiabilitySlots.push({
          //       startTime: x.startTime,
          //       endTime: x.endTime,
          //       location: "Max Hospital, Mohali",
          //       isAvailable: true,
          //       isSelected: false,
          //       isPassed: false,
          //       isReserved: false,
          //     });
          //   });
          // }

          if (clientAppointments.length > 0) {
            clientAppointments.forEach((slot) => {
              if ((slot.statusName as string).toLowerCase() != "cancel") {
                const foundIndex = this.providerAvailableDates.findIndex(
                  (x:any) =>
                    x.startTime == slot.startTime && x.endTime == slot.endTime
                );
                if (foundIndex != -1) {
                  providerAvailiabilitySlots[foundIndex].isAvailable = false;
                  providerAvailiabilitySlots[foundIndex].isReserved = true;
                }
              }
            });
          }

          if (
            providerAvailiabilitySlots &&
            providerAvailiabilitySlots.length > 0
          ) {
            const isAvailable = providerAvailiabilitySlots.some(
              (slot) => slot.isAvailable == true
            );
            if (isAvailable) {
              this.bookingAvailableDates.push(format(reqDate, "yyyy-MM-dd"));
              this.cdr.detectChanges();
            }
          }
        }
      });
  }

  isBoolingDateAvailable(reqDate: Date): boolean {
    if (this.bookingAvailableDates && this.bookingAvailableDates.length > 0) {
      const dateStr = format(reqDate, "yyyy-MM-dd");
      return this.bookingAvailableDates.some((x) => x == dateStr)
        ? true
        : false;
    } else {
      return false;
    }
  }

  fetchfilteredappt(): void {
    this.showAllEventDaysArray = [];
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];

    if (!this.isWaitingRoomScreen) {
      const filterModal = {
        locationIds: (this.selectedOfficeLocations || []).join(","),
        fromDate: format(getStart(this.viewDate), "yyyy-MM-dd"),
        toDate: format(getEnd(this.viewDate), "yyyy-MM-dd"),
        staffIds: (this.selectedOfficeStaffs || []).join(","),
        patientIds: (this.selectedOfficeClients || []).join(","),
        appttype: this.appttype,
        apptmode: this.apptmode,
      };
      this.fetchfilteredAppointments(filterModal).subscribe();

      this.refresh.next("");
    } else {
      this.fetchSingleAppointment().subscribe();
      this.refresh.next("");
    }
  }

  fetchfilteredAppointments(filterModal: any): Observable<any> {
    //////debugger;
    return (this.events$ = this.schedulerService
      .getfilteredAppointmentListData(filterModal)
      .pipe(
        map((response: any) => {
          if (response.statusCode !== 200) return [];
          else {
            var data = response.data;
            data = data.filter((s:any) => s.cancelTypeId == 0);
            if (this.isRequestFromPatientPortal) {
              data = data.filter(
                (s:any) =>
                  s.invitationAppointentId == undefined ||
                  s.invitationAppointentId == null ||
                  s.invitationAppointentId == 0
              );
            }

            if(this.filteredProvider != null){
              data = data.filter((x:any) => x.appointmentStaffs[0].staffId == this.filteredProvider.staffID);
            }

            return (data || []).map((appointmentObj: Appointment) => {
              let timeRange:any;
              // const timeRange = `${format(
              //   appointmentObj.startDateTime,
              //   'h:mm a'
              // )} - ${format(appointmentObj.endDateTime, 'h:mm a')} `;
              if (appointmentObj.startDateTime && appointmentObj.endDateTime) {
              timeRange = `${format(new Date(appointmentObj.startDateTime), 'h:mm a')} - ${format(new Date(appointmentObj.endDateTime), 'h:mm a')}`;
              }
              const actions = this.getCalendarActions(appointmentObj);
              const bgColor = (this.statusColors || []).find(
                (x) =>
                  (x.name || "").toUpperCase() ==
                  (appointmentObj.statusName || "").toUpperCase()
              );
              let appointmentTitle =
                timeRange + (appointmentObj.patientName || "");
              if (
                appointmentObj.invitedStaffs &&
                appointmentObj.invitedStaffs.length > 0
              ) {
                appointmentTitle += "<ul class='list-invited-staff'>";
                appointmentObj.invitedStaffs.forEach((element: { name: string; email: string; }) => {
                  appointmentTitle +=
                    "<li><span class='sp-large'>" +
                    element.name +
                    "</span><br/><span  class='sp-small'>" +
                    element.email +
                    "</span></li>";
                });
                appointmentTitle += "</ul>";
              }
              if (this.isRequestFromPatientPortal) {
                appointmentTitle =
                  timeRange +
                  (appointmentObj.appointmentStaffs || [])
                    .map((x:any) => x.staffName)
                    .join(",");
                if (
                  (appointmentObj.statusName || "").toUpperCase() == "PENDING" || (appointmentObj.statusName || "").toUpperCase() == "INVITED"
                ) {
                  appointmentTitle =
                    appointmentTitle + " Waiting For Provider Approval";
                } else if (
                  (appointmentObj.statusName || "").toUpperCase() == "CANCELLED"
                ) {
                  appointmentTitle =
                    appointmentTitle + " Appointement Cancelled";
                } else if ((appointmentObj.statusName || "").toUpperCase() == "APPROVED") {
                  appointmentTitle = appointmentTitle + "Appointment Has Been Approved";
                }
              }
              //let setCssClass = appointmentObj.statusName != "Approved" ? "CustomEventAptNotApproved" : "CustomEvent";
              let setCssClass = appointmentObj.statusName == "Approved"
                ? "CustomEvent"
                : appointmentObj.statusName !== "Cancelled"
                  ? "CustomEventAptNotApproved"
                  : "CustomEventAptCancelled";
                  //old code
              // const eventObj: CalendarEvent<Appointment> = {
              //   title: appointmentTitle, //timeRange + appointmentObj.patientName,
              //   start: new Date(appointmentObj.startDateTime),
              //   end: new Date(appointmentObj.endDateTime),
              //   color: {
              //     primary: appointmentObj.fontColor,
              //     secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
              //   },
              //   // cssClass: "CustomEvent",
              //   cssClass: setCssClass,
              //   resizable: {
              //     beforeStart: true,
              //     afterEnd: true,
              //   },
              //   draggable: true,
              //   actions: actions,
              //   meta: {
              //     ...appointmentObj,
              //   },
              // };


              //new code
              const eventObj: CalendarEvent<Appointment> = {
                title: appointmentTitle, //timeRange + appointmentObj.patientName,
                start: appointmentObj.startDateTime ? new Date(appointmentObj.startDateTime) : new Date(),
                end: appointmentObj.endDateTime ? new Date(appointmentObj.endDateTime) : new Date(),
                color: {
                  primary: appointmentObj.fontColor,
                  secondary: appointmentObj.color, // (bgColor && bgColor.color) || "#93ee93" //appointmentObj.color
                },
                // cssClass: "CustomEvent",
                cssClass: setCssClass,
                resizable: {
                  beforeStart: true,
                  afterEnd: true,
                },
                draggable: true,
                actions: actions,
                meta: {
                  ...appointmentObj,
                },
              };
              return eventObj;
            });
          }
        })
      ));
  }

  //setting slot color based on visit type 
  getColor(mycolor: number): any {
    switch (mycolor) {
      case 1: return colors.yellow.primary;
      case 2: return colors.red.primary;
      case 3: return colors.blue.primary;
      case 4: return colors.green.primary;
      case 5: return colors.green.primary;
    }
  }

  setView(view: CalendarView) {
    debugger
     this.view = view;
   
   
    // if (view != CalendarView.Month) {
    //   setTimeout(function () {
    //     if (view == CalendarView.Week) {
    //       debugger
    //       var element = document.getElementsByClassName("cal-time-events")[0];
    //       if (typeof element != "undefined" && element != null) {
    //         document.getElementsByClassName(
    //           "cal-time-events"
    //         )[0].scrollTop = 800;
    //       }
    //     } else {
    //       var element = document.getElementsByClassName("cal-hour-rows")[0];
    //       if (typeof element != "undefined" && element != null) {
    //         document.getElementsByClassName("cal-hour-rows")[0].scrollTop = 800;
    //       }
    //     }
    //   }, 16000);
    // }

    if (view != CalendarView.Month) {
     
      if (view == CalendarView.Week) {
        setTimeout(() => {
          const weekElement = document.getElementsByClassName('cal-time-events')[0];
          if (typeof weekElement != 'undefined' && weekElement != null) {
            weekElement.scrollTop = 800;
          }
        }, 5000);  
      } else {
      
        setTimeout(() => {
          const otherElement = document.getElementsByClassName('cal-hour-rows')[0];
          if (typeof otherElement != 'undefined' && otherElement != null) {
            otherElement.scrollTop = 800;
          }
        }, 3000);  
      }
    }
  }

  documentTypeHandler = (e:any) => {
    if (e !== "") {
      this.filterMasterSearchProvider = this.providerList.filter(
        (doc) => doc.name.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterSearchProvider = [];
      this.filteredProvider = null;
      if (this.appttype != null && this.apptmode != null) {
        this.fetchfilteredappt();
      } else {
        this.fetchEvents();
      }
    }
  };

  //Clear all filters such as dashboard filter and patient search filter  
  clearFilter() {
    // this.router.navigate(["/web/manage-users/availability"]);
    this.searchProviderForm.reset();
    this.filterMasterSearchProvider = [];
    this.filteredProvider = null;
    if (this.appttype != null && this.apptmode != null) {
      this.fetchfilteredappt();
    } else {
      this.fetchEvents();
    }
  }

  statusChangeHandler = (e:any) => {
    this.filteredProvider = e;
    if (this.appttype != null && this.apptmode != null) {
      this.fetchfilteredappt();
    } else {
      this.fetchEvents();
    }
  }

  getProviderList() {
    this.schedulerService.getAllProviders().subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.providerList = response.data;
        }
    });
  }
}
