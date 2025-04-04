import { TextChatModel } from "src/app/shared/text-chat/textChatModel";
import { TextChatService } from "./../../../../shared/text-chat/text-chat.service";
import { ChatInitModel } from "src/app/shared/models/chatModel";
import { AppService } from "./../../../../app-service.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ClientsService } from "../clients.service";
import { DatePipe } from "@angular/common";
import { AppointmentViewComponent } from "./../../scheduling/appointment-view/appointment-view.component";

import { ClientProfileModel } from "../client-profile.model";
import {
  ResponseModel,
  FilterModel,
  Metadata,
  ReportModel,
} from "../../core/modals/common-model";
import { ViewReportComponent } from "./../../../../shared/view-report/view-report.component";
import { merge, Subscription, Subject } from "rxjs";
import { ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { ClientDashboardService } from "./dashboard.service";
import { CommonService } from "../../core/services";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { format, addDays, addYears, isSameDay } from "date-fns";

import { ReviewRatingComponent } from "../review-rating/review-rating.component";
import { ReviewRatingModel } from "../review-rating/review-rating.model";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { CancelAppointmentDialogComponent } from "src/app/shared/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { StaffAppointmentComponent } from "src/app/shared/staff-appointment/staff-appointment.component";
import { map } from "rxjs/operators";
import { PatientVital } from "../../agency-portal/clients/client-profile.model";
import { VitalModel } from "../../agency-portal/clients/vitals/vitals.model";
import { TranslateService } from "@ngx-translate/core";
import { Console } from "console";
import { ContextMenuService } from "ngx-contextmenu";
import { ContextMenuComponent } from "ngx-contextmenu";
import { MessageCountModel } from "../../mailing/mailbox.model";
import { MailboxService } from "../../mailing/mailbox.service";
import * as moment from "moment";
import { MatMenuTrigger } from "@angular/material/menu";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientDashboardComponent implements OnInit {
  contextMenu!: ContextMenuComponent;
  CheckIstimeExpired: any;
  currentPatientId: number = 0;
  currentStafftId: number = 0;
  currentAppointmentId: number = 0;
  IstimeExpired = false;
  lineChartData: Array<any> = [
    { data: [10, 15, 25, 30], label: "Jan" },
    { data: [25, 51, 52, 51], label: "Feb" },
    { data: [22, 88, 55, 22], label: "Mar" },
    { data: [33, 15, 25, 25], label: "Apr" },
  ];
  lineChartLabels: Array<any> = ["Jan", "Feb", "Mar", "Apr"];
  lineChartType: string = "line";
  encFilterModel: FilterModel;
  clientProfileModel!: ClientProfileModel;
  // tasks
  tasksFilterModel: FilterModel;
  payment: any;
  taskMeta: Metadata;
  appointment: any;
  tasksList: Array<any> = [];
  // all appointments
  allAppointmentsFilterModel: FilterModel;
  allAppointmentsMeta: Metadata;
  todayAppointmentMeta: Metadata = new Metadata;

  allAppointmentsList: Array<any> = [];
  onDateSelectedApptList: Array<any> = [];
  pastAppointmentsList: Array<any> = [];
  allTodayAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns: Array<any>;
  allAppointmentsActionButtons: Array<any>;
  filterModel: FilterModel = new FilterModel;
  pendingAptfilterModel: FilterModel;
  CancelledAptfilterModel: FilterModel;
  ReportFilterModel: ReportModel;
  weightPercentage: any;
  TodayAptfilterModel: FilterModel;
  pastAptfilterModel: FilterModel;
  upcomingAptfilterModel: FilterModel;
  subscription: Subscription = new Subscription;
  status: boolean = false;
  passwordExpiryColorCode: string = "";
  passwordExpiryMessage: string = "";
  showMessage: boolean = true;
  message: Subject<any> = new Subject();
  currentLoginUserId!: number;
  currentLocationId!: number;
  userRoleName!: string;
  pendingAppointmentMeta: Metadata = new Metadata;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  pendingDisplayedColumns: Array<any>;
  cancelledDisplayedColumns: Array<any>;
  patientReportColumns: Array<any>;
  todayDisplayedColumns: Array<any>;
  todayActionButtons: Array<any>;
  pastAppointmentsDisplayedColumns: Array<any>;
  pastAppointmentsActionButtons: Array<any>;
  pendingActionButtons: Array<any>;
  urlSafe: any;
  imageBlobUrl!: string;
  userId!: string;
  urgentcareapptid!: number;
  showurgentcarebtn: boolean = false;
  patientDocumentData: any[] = [];
  pendingPatientAppointment: Array<any> = [];
  CancelledPatientAppointment: Array<any> = [];
  CancelledAppointmentMeta: Metadata = new Metadata;
  PatientReport: Array<any> = [];
  PatientReportMeta: Metadata = new Metadata;
  pastAppointmentMeta: Metadata = new Metadata;
  metaData: any;
  headerText!: string;
  MissedPatientAppointment: Array<any> = [];
  MissedAppointmentMeta: Metadata = new Metadata;
  MissedAptfilterModel: FilterModel;
  AttendedPatientAppointment: Array<any> = [];
  AttendedAppointmentMeta: Metadata = new Metadata;
  AttendedAptfilterModel: FilterModel;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  public menuPosition = { x: '0px', y: '0px' };
  HRADisplayedColumns: Array<any> = [
    {
      displayName: "Assigned By",
      key: "assignedBy",
      class: "",
      width: "140px",
    },
    {
      displayName: "STATUS",
      key: "status",
      class: "",
      width: "80px",
      type: ["Assigned", "Complete", "Past Due"],
    },
    {
      displayName: "COMPLETION DATE",
      key: "completionDate",
      class: "",
      width: "120px",
      type: "date",
    },
    {
      displayName: "Due Date",
      key: "expirationDate",
      class: "",
      width: "120px",
      type: "date",
    },
    {
      displayName: "Actions",
      key: "Actions",
      class: "",
      width: "100px",
      sticky: true,
      type: "memberportalhra",
    },
  ];

  HRAActionButtons: Array<any> = [
    {
      displayName: "Click to Start",
      key: "questionnaire",
      class: "font500",
      title: "Fill Assessment",
    },
    {
      displayName: "Download Individual Report",
      key: "viewreport",
      class: "bluefont",
      title: "Download Report",
    },
    {
      displayName: "Preview Individual Report",
      key: "previewreport",
      class: "bluefont",
      title: "Preview Report",
    },
  ];

  upcomingAppointmentsActionButtons = [
    {
      displayName: "Chat",
      key: "chat",
      class: "fa fa-comments",
    },
    {
      displayName: "Waiting-room info",
      key: "video",
      class: "fa fa-wpforms fa-custom",
    },
  ];

  pendingAppointmentsActionButtons = [
    {
      displayName: "Cancel",
      key: "cancel",
      class: "fa fa-window-close",
    },
  ];
  selectedIndex: number = 0;
  textChatModel: TextChatModel = new TextChatModel;
  vitalListingData: VitalModel[] = [];
  clientId!: number;
  isGrid: boolean = true;

  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  isClientLogin: boolean = false;
  userRole: any;
  clientModel: any;
  messageCounts: any;
  selectedDate: Date = new Date();

  constructor(
    private datePipe: DatePipe,
    private dashoboardService: ClientDashboardService,
    private commonService: CommonService,
    private clientService: ClientsService,
    public dialogModal: MatDialog,
    public router: Router,
    private appService: AppService,
    private schedulerService: SchedulerService,
    private contextMenuService: ContextMenuService,
    private textChatService: TextChatService,
    private appointmentDailog: MatDialog,
    private translate: TranslateService,
    private mailboxService: MailboxService,
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.encFilterModel = new FilterModel();
    this.tasksFilterModel = new FilterModel();
    this.pendingAptfilterModel = new FilterModel();
    this.CancelledAptfilterModel = new FilterModel();
    this.ReportFilterModel = new ReportModel();
    this.MissedAptfilterModel = new FilterModel();
    this.AttendedAptfilterModel = new FilterModel();
    this.upcomingAptfilterModel = new FilterModel();
    this.pastAptfilterModel = new FilterModel();
    this.TodayAptfilterModel = new FilterModel();
    this.taskMeta = new Metadata();
    this.allAppointmentsFilterModel = new FilterModel();
    this.allAppointmentsMeta = new Metadata();

    this.cancelledDisplayedColumns = [
      { displayName: "care_manager", key: "staffName", width: "140px" },
      {
        displayName: "appointment_type",
        key: "appointmentType",
        width: "100px",
      },
      { displayName: "date_time", key: "dateTimeOfService", width: "240px" },
      {
        displayName: "symptoms_ailments",
        key: "notes",
        width: "220px",
        type: "50",
        isInfo: true,
      },
      { displayName: "cancel_type", key: "cancelType", width: "150px" },
      { displayName: "cancel_reason", key: "cancelReason", width: "132px" },
      { displayName: "actions", key: "Actions", width: "80px", sticky: true },
    ];
    this.patientReportColumns = [
      { displayName: "Report Name", key: "reportName", width: "300px" },
      { displayName: "Report Date", key: "createdDate", width: "300px" },
    ];
    this.pendingDisplayedColumns = [
      { displayName: "care_manager", key: "staffName" },
      {
        displayName: "appointment_type",
        key: "appointmentType",
      },
      { displayName: "date_time", key: "dateTimeOfService" },
      {
        displayName: "symptoms_ailments",
        key: "notes",
        type: "50",
        isInfo: true,
      },
      { displayName: "actions", key: "Actions", width: "80px", sticky: true },
    ];
    this.pendingActionButtons = [];
    this.allAppointmentsDisplayedColumns = [
      {
        displayName: "care_manager",
        key: "staffName",
        class: "",
        sticky: true,
      },
      {
        displayName: "appointment_type",
        key: "appointmentTypeName",
      },
      {
        displayName: "appointment_mode",
        key: "bookingMode",
      },
      { displayName: "date_time", key: "dateTimeOfService" },
      {
        displayName: "time_remaining",
        key: "startDateTime",
        type: "count",
      },
      {
        displayName: "symptoms_ailments",
        key: "notes",
        type: "50",
        isInfo: true,
      },
      { displayName: "actions", key: "Actions" },
    ];

    this.allAppointmentsActionButtons = [
      {
        displayName: "Chat",
        key: "chat",
        class: "fa fa-comments",
      },
    ];
    this.pastAppointmentsDisplayedColumns = [
      {
        displayName: "care_manager",
        key: "staffName",
        class: "",
        sticky: true,
      },
      {
        displayName: "appointment_type",
        key: "appointmentTypeName",
      },
      {
        displayName: "appointment_mode",
        key: "bookingMode",
      },
      { displayName: "date_time", key: "dateTimeOfService" },
      {
        displayName: "time_remaining",
        key: "startDateTime",
        type: "count",
      },
      {
        displayName: "symptoms_ailments",
        key: "notes",
        type: "50",
        isInfo: true,
      },
      {
        displayName: "rating",
        key: "rating",
        type: "rating",
      },
      {
        displayName: "reviews",
        key: "review",
        isInfo: true,
        type: "50",
      },
      { displayName: "actions", key: "Actions", width: "150px" },
    ];

    this.pastAppointmentsActionButtons = [
      // {
      //   displayName: "view soap note",
      //   key: "soap",
      //   class: "fa fa-eye",
      //   type: "encounter",
      // },
      {
        displayName: "Review/Ratings",
        key: "review",
        class: "fa fa-star",
      },
    ];
    this.todayDisplayedColumns = [
      {
        displayName: "care_manager",
        key: "staffName",
        class: "",
        sticky: true,
      },
      {
        displayName: "appointment_type",
        key: "appointmentTypeName",
      },
      {
        displayName: "appointment_mode",
        key: "bookingMode",
      },
      { displayName: "date_time", key: "dateTimeOfService", type: "date" },
      {
        displayName: "time_remaining",
        key: "startDateTime",
        type: "count",
        color: "red"

      },
      {
        displayName: "symptoms_ailments",
        key: "notes",
        type: "50",
        isInfo: true,
      },


      { displayName: "actions", key: "Actions", width: "150px" },
    ];
    this.todayActionButtons = [
      {
        displayName: "go to waiting-room",
        key: "call",
        class: "fa fa-wpforms fa-custom",
        // type: "timeCheck",
      },
      // {
      //   displayName: "Reschedule",
      //   key: "reschedule",
      //   class: "fa fa-calendar",
      //   type: "timeCheck",
      // },
      {
        displayName: "Chat",
        key: "chat",
        class: "fa fa-comments",
        //type: "timeCheck",
      },
      // {
      //   displayName: "Cancel",
      //   key: "cancel",
      //   class: "fa fa-window-close",
      //   type: "timeCheck",
      // },
    ];

    this.displayedColumns = [
      { displayName: "Date", key: "vitalDate", isSort: true, width: "20%" },
      {
        displayName: "Height",
        key: "displayheight",
        isSort: true,
        width: "10%",
      },
      { displayName: "WEIGHT(LB)", key: "weightLbs", width: "10%" },
      { displayName: "H-Rate", key: "heartRate", width: "10%" },
      { displayName: "BMI", key: "bmi", isSort: true, width: "10%" },
      { displayName: "BP(H/L)", key: "displayBP", width: "10%" },
      { displayName: "Pulse", key: "pulse", width: "10%" },
      { displayName: "Resp", key: "respiration", width: "10%" },
      { displayName: "Temp(°F)", key: "temperature", width: "10%" },
      { displayName: "Actions", key: "Actions", width: "10%" },
    ];
    this.actionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
      { displayName: "Delete", key: "delete", class: "fa fa-times" },
    ];
  }

  ngOnInit() {
    this.textChatModel = new TextChatModel();
    this.filterModel = new FilterModel();
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          //////debugger;
          this.currentLoginUserId = user.id;
          this.userId = user.userID;
          this.currentLocationId = user.currentLocationId;
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType;
          //this.isClientLogin = this.userRole == "CLIENT";
          this.isClientLogin = this.userRoleName == "CLIENT" ? true : false;
          this.getVitalList(this.filterModel, "chart");
        }
      }
    );



    this.filterModel = new FilterModel();

    this.getPasswordExpiryMessage();
    this.getLastUrgentCareCallStatus();
    this.headerText = "Assessments";

    this.getTodayPatientAppointmentList();
    this.getClientProfileInfo();
    this.getPaymentInfo();
    this.getPastUpcomingAppointment();
    this.getMailCount();
    this.getAllPatientAppointmentList();
  }

  goToPayment(redirectType: any) {
    this.router.navigate(["/web/client/payment/payment-history"], {
      queryParams: {
        type: redirectType,
      },
    });
  }
  gotoCareLibrary() {
    this.router.navigate(["/web/client/my-care-library"]);
  }
  gotoFavourite() {
    this.router.navigate(["/web/client/favourite"]);
  }
  gotoHelpDesk() {
    this.router.navigate(["/web/client/raiseticket"]);
  }
  gotoBookAppt() {
    this.router.navigate(["/doctor-list"])
  }
  gotowaitingRoom(id: number) {
    this.router.navigate(['/web/waiting-room'], { queryParams: { id: id } });
  }


  getChangePercentage(type: any):any {
    if (this.clientProfileModel && this.clientProfileModel.patientVitals) {
      let sumCurrent: any = 0;
      let sumPrev: any = 0;
      var changePercentage: any = -1;
      var date = new Date();

      var firstdayCurrentMonth: any = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth(), 1),
        "yyyy-MM-dd"
      );
      var lastdayCurrentMonth: any = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
        "yyyy-MM-dd"
      );
      var firstdayPrevMonth: any = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth() - 1, 1),
        "yyyy-MM-dd"
      );
      var lastdayPrevMonth: any = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth(), 0),
        "yyyy-MM-dd"
      );
      // var previousMonthRecords: any =
      //   this.clientProfileModel.patientVitals.filter(
      //     (x) =>
      //       this.datePipe.transform(x.vitalDate, "yyyy-MM-dd")  >=
      //       firstdayPrevMonth &&
      //       this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") <=
      //       lastdayPrevMonth
      //   );
      // var currentMonthRecords: any =
      //   this.clientProfileModel.patientVitals.filter(
      //     (x) =>
      //       this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") >=
      //       firstdayCurrentMonth &&
      //       this.datePipe.transform(x.vitalDate, "yyyy-MM-dd") <=
      //       lastdayCurrentMonth
      //   );
      if (this.datePipe) {
        var previousMonthRecords: any =
          this.clientProfileModel.patientVitals.filter((x) => {
            const transformedDate = this.datePipe.transform(x.vitalDate, "yyyy-MM-dd")!;
            return transformedDate >= firstdayPrevMonth && transformedDate <= lastdayPrevMonth;
          });
      
        var currentMonthRecords: any =
          this.clientProfileModel.patientVitals.filter((x) => {
            const transformedDate = this.datePipe.transform(x.vitalDate, "yyyy-MM-dd")!;
            return transformedDate >= firstdayCurrentMonth && transformedDate <= lastdayCurrentMonth;
          });
      } else {
        var previousMonthRecords: any = [];
        var currentMonthRecords: any = [];
       
      }
      

      if (
        currentMonthRecords == undefined ||
        previousMonthRecords == undefined
      ) {
        return "";
      }
      var currentMonthCount =
        currentMonthRecords == null ? 0 : currentMonthRecords.length;
      var previousMonthCount =
        previousMonthRecords == null ? 0 : previousMonthRecords.length;

      if (currentMonthCount == 0 || previousMonthCount == 0) {
        return "";
      }

      switch (type) {
        case "weight":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.weightLbs));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.weightLbs));
          break;
        case "height":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.heightIn));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.heightIn));
          break;
        case "temperature":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.temperature));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.temperature));
          break;
        case "heartrate":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.heartRate));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.heartRate));
          break;
        case "bp":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.bpSystolic));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.bpSystolic));
          break;
        case "respiration":
          currentMonthRecords.forEach((a:any) => (sumCurrent += a.respiration));
          previousMonthRecords.forEach((a:any) => (sumPrev += a.respiration));
          break;
        default:
          break;
      }

      if (isNaN(sumCurrent) || isNaN(sumPrev)) {
        return "";
      }
      let finalValue: any = sumCurrent / currentMonthCount;
      let initialValue = sumPrev / previousMonthCount;
      changePercentage = (
        ((finalValue - initialValue) / initialValue) *
        100
      ).toFixed(0);

      if (changePercentage > 0) {
        return changePercentage + "% higher than last month";
      } else if (changePercentage < 0) {
        return -changePercentage + "% less than last month";
      } else if (changePercentage == 0) {
        return "same as last month";
      } else {
        return "";
      }
    }
    return
  }
  getPaymentInfo() {
    this.clientService
      .getClientNetAppointmentPayment(this.currentLoginUserId)
      .subscribe((response: ResponseModel) => {
        //////debugger;
        if (response != null) {
          this.payment = response.data;
        }
      });
  }
  getClientProfileInfo() {
    this.clientService
      .getClientProfileDashboardInfo(this.currentLoginUserId)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          //////debugger;

          this.clientProfileModel = response.data;
          // for (let index = response.data.patientVitals.length; index >0; index--) {
          //   this.clientProfileModel = response.data.patientVitals[index];

          // }
        }
      });
  }
  retValue(value: any, prefix: any, value2: any) {
    if (prefix.includes("IN") && value != undefined) {
      var feet = Math.floor(value / 12);
      var inches = Math.floor(value % 12);
      value = feet + "'" + inches + "''";
    }
    if (value2 != undefined && value2 != "") {
      return value == undefined ? "N/A" : value + "/" + value2;
    } else {
      return value == undefined ? "N/A" : value + prefix.replace("IN", "");
    }
  }
  editProfile(event: any) {
    this.router.navigate(["/web/client/client-profile"], {
      queryParams: {
        id:
          this.currentLoginUserId != null
            ? this.commonService.encryptValue(this.currentLoginUserId, true)
            : null,
      },
    });
  }
  goToVitals() {
    this.router.navigate(["/web/client/my-vitals"]);
  }
  onTabChanged(event: any) {
    this.selectedIndex = event.index;
    switch (event.index) {
      case 0:
        {
          this.getTodayPatientAppointmentList();
        }
        break;
      case 1:
        {
          this.getAllPatientAppointmentList();
        }
        break;
      case 2:
        {
          this.getPastPatientAppointmentList();
        }
        break;
      case 3:
        {
          // this.getPendignPatientAppointmentList();
          this.getCancelledPatientAppointmentList();
        }
        break;
      case 4:
        {
          this.getPatientReportList();
        }
        break;
    }
  }
  onPageChanges() {
    merge(this.paginator.page).subscribe(() => {
      const changeState = {
        pageNumber: this.paginator.pageIndex + 1,
        pageSize: this.paginator.pageSize,
      };
      this.setTasksPaginatorModel(changeState.pageNumber, changeState.pageSize);
      this.getTasksList();
    });
  }
  setTasksPaginatorModel(pageNumber: number, pageSize: number) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
  }
  hideMessageClick() {
    this.showMessage = false;
  }
  getTasksList() {
    this.tasksFilterModel.sortColumn = "Status";
    this.tasksFilterModel.sortOrder = "desc";
    this.dashoboardService
      .GetTasksList(this.tasksFilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.tasksList = (response.data || []).map((x:any) => {
            x["disableActionButtons"] = (x.status || "").toUpperCase() ==
              "CLOSED" && ["closed"];
            return x;
          });
          this.taskMeta = response.meta;
        } else {
          this.tasksList = [];
          this.taskMeta = new Metadata;
        }
      });
  }

  getPastUpcomingAppointment(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
    };
    this.dashoboardService
      .GetPastUpcomingAppointment(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null) {
          //////debugger;
          this.appointment = response.data;
        } else {
          this.appointment = [];
        }
      });
  }

  onDateSelected(event: any): void {
    this.selectedDate = event == undefined || event == null ? new Date() : event;
    const formattedDate = format(this.selectedDate, 'MM/dd/yyyy');
    //const currentDate = format(new Date(), 'MM/dd/yyyy');
    const currentDate = new Date();
    if (isSameDay(new Date(formattedDate), currentDate)) {
      const filters:any = {
        locationIds: this.currentLocationId,
        staffIds:
          !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
            (this.userRoleName || "").toUpperCase() == "STAFF"
            ? this.currentLoginUserId
            : "",
        patientIds:
          !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
            (this.userRoleName || "").toUpperCase() == "CLIENT"
            ? this.currentLoginUserId
            : "",
        fromDate: format(new Date(), "yyyy-MM-dd"),
        toDate: format(new Date(), "yyyy-MM-dd"),
        status: "Approved",
        pageNumber: null,
        pageSize: 100,
      };

      this.dashoboardService.GetOrganizationAppointments(filters)
        .subscribe((response: ResponseModel) => {
          if (response != null && response.statusCode == 200) {
            this.allTodayAppointmentsList = response.data || [];
            this.allTodayAppointmentsList = this.allTodayAppointmentsList.map(x => {
              const staffsArray = (x.appointmentStaffs || []).map((y: { staffName: any; }) => y.staffName);
              x.staffName = staffsArray.join(", ");
              x.dateTimeOfService = format(x.startDateTime, 'MM/dd/yyyy') +
                " (" +
                format(x.startDateTime, 'h:mm a') +
                " - " +
                format(x.endDateTime, 'h:mm a') +
                ")";
              return x;
            });
            this.onDateSelectedApptList = this.allTodayAppointmentsList.filter(appointment =>
              isSameDay(new Date(appointment.startDateTime), currentDate)
            )
          }
        });
    } else {
      const formattedDate = format(this.selectedDate, 'MM/dd/yyyy');
      var today = new Date();
      var tomorrowDate = new Date(today.setDate(today.getDate() + 1));

      const filters:any = {
        locationIds: this.currentLocationId,
        staffIds:
          !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
            (this.userRoleName || "").toUpperCase() == "STAFF"
            ? this.currentLoginUserId
            : "",
        patientIds:
          !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
            (this.userRoleName || "").toUpperCase() == "CLIENT"
            ? this.currentLoginUserId
            : "",
        fromDate: format(new Date(tomorrowDate), "yyyy-MM-dd"),
        toDate: format(addDays(new Date(), 720), "yyyy-MM-dd"),
        status: "Approved",
        pageNumber: null,
        pageSize: 100,
        date: formattedDate
      };
      this.dashoboardService
        .GetOrganizationAppointments(filters)
        .subscribe((response: ResponseModel) => {
          if (response != null && response.statusCode == 200) {
            this.allAppointmentsList =
              response.data != null && response.data.length > 0
                ? response.data
                : [];
            this.allAppointmentsList = (this.allAppointmentsList || []).map(
              (x) => {
                const staffsArray = (x.appointmentStaffs || []).map(
                  (y: { staffName: any; }) => y.staffName
                );
                const staffIds = (x.appointmentStaffs || []).map(
                  (y: { staffId: any; }) => y.staffId
                );
                x.staffName = staffsArray.join(", ");
                x.dateTimeOfService =
                  format(x.startDateTime, 'MM/dd/yyyy') +
                  " (" +
                  format(x.startDateTime, 'h:mm a') +
                  " - " +
                  format(x.endDateTime, 'h:mm a') +
                  ")";
                return x;
              });
            this.allAppointmentsMeta = response.meta;
            this.onDateSelectedApptList = this.allAppointmentsList.filter(appointment =>
              isSameDay(new Date(appointment.startDateTime), new Date(formattedDate))
            )
          }
        });
    }
  }

  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const formattedDate = format(this.selectedDate, 'MM/dd/yyyy');
    var today = new Date();
    var tomorrowDate = new Date(today.setDate(today.getDate() + 1));

    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(new Date(tomorrowDate), "yyyy-MM-dd"),
      toDate: format(addDays(new Date(), 720), "yyyy-MM-dd"),
      // status: "Approved",
      status: "Approved",
      pageNumber,
      pageSize,
      date: formattedDate
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(
            (x) => {
              const staffsArray = (x.appointmentStaffs || []).map(
                (y: { staffName: any; }) => y.staffName
              );
              const staffIds = (x.appointmentStaffs || []).map(
                (y: { staffId: any; }) => y.staffId
              );
              x.staffName = staffsArray.join(", ");
              x.dateTimeOfService =
                format(x.startDateTime, 'MM/dd/yyyy') +
                " (" +
                format(x.startDateTime, 'h:mm a') +
                " - " +
                format(x.endDateTime, 'h:mm a') +
                ")";
              return x;
            }
          );
          this.allAppointmentsMeta = response.meta;
        } else {
          this.allAppointmentsList = [];
          this.allAppointmentsMeta = new Metadata;
        }
        this.allAppointmentsMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  getPendignPatientAppointmentList() {
    const fromDate = moment().format("yyyy-MM-ddTHH:mm:ss"),
      toDate = '';
    this.dashoboardService
      .getPendingPatientAppointment(
        this.pendingAptfilterModel,
        fromDate,
        toDate
      )
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.pendingPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          // this.commonService.setPendingAppointment(this.pendingAppointmentMeta.totalRecords.toString());
          this.pendingPatientAppointment = (
            this.pendingPatientAppointment || []
          ).map((x) => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              (y: { staffId: any; }) => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.pendingAppointmentMeta = response.meta;
        } else {
          this.pendingPatientAppointment = [];
          this.pendingAppointmentMeta = new Metadata;
        }
      });
  }
  getPastPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));

    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(addDays(new Date(today), -720), "yyyy-MM-dd"),
      toDate: format(new Date(yesterday), "yyyy-MM-dd"),
      status: "",
      pageNumber,
      pageSize,
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          //////debugger;
          this.pastAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.pastAppointmentsList = (this.pastAppointmentsList || []).map(
            (x) => {
              const staffsArray = (x.appointmentStaffs || []).map(
                (y: { staffName: any; }) => y.staffName
              );
              const staffIds = (x.appointmentStaffs || []).map(
                (y: { staffId: any; }) => y.staffId
              );
              x.staffName = staffsArray.join(", ");
              x.dateTimeOfService =
                format(x.startDateTime, 'MM/dd/yyyy') +
                " (" +
                format(x.startDateTime, 'h:mm a') +
                " - " +
                format(x.endDateTime, 'h:mm a') +
                ")";
              return x;
            }
          );
          this.pastAppointmentMeta = response.meta;
        }
        this.pastAppointmentMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onTableRowClick(actionObj?: any) {
    //////debugger;
    const modalPopup = this.dialogModal.open(ViewReportComponent, {
      hasBackdrop: true,
      data: actionObj.data.reportId,
    });

    modalPopup.afterClosed().subscribe((result) => { });
  }
  getPatientReportList(pageNumber: number = 1, pageSize: number = 5) {
    const fromDate = '',
      patientId = this.currentLoginUserId,
      toDate = moment().format("yyyy-MM-ddTHH:mm:ss");

    this.dashoboardService
      .getReport(this.ReportFilterModel, fromDate, toDate, patientId)
      .pipe(
        map((x) => {
          return x;
        })
      )
      .subscribe((resp) => {
        this.PatientReport = (resp.data || []).map((x:any) => {
          x.createdDate =
            format(x.createdDate, 'MM/dd/yyyy') +
            " (" +
            format(x.createdDate, 'h:mm a') +
            " - " +
            format(x.createdDate, 'h:mm a') +
            ")";
          return x;
        });

        this.PatientReportMeta = resp.meta;
        this.PatientReportMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  getLastUrgentCareCallStatus() {
    //////debugger;
    this.schedulerService
      .getLastUrgentCareCallStatusForPatientPortal(this.userId)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          //////debugger;
          if (response.data != undefined) {
            this.urgentcareapptid = response.data.id;
            //this.hasPreviousNewMeeting = response.data ? true : false;
            this.showurgentcarebtn = true;
          } else {
            this.showurgentcarebtn = false;
          }
        }
      });
  }

  Redirect() {
    // this.router.navigate(["/web/encounter/soap"], {
    //   queryParams: {
    //     apptId: this.urgentcareapptid,
    //     encId: 0
    //   },
    // });
    this.router.navigate([
      "/web/waiting-room/check-in-video-call/" + this.urgentcareapptid,
    ]);
  }

  getCancelledPatientAppointmentList() {
    const fromDate = '',
      toDate = '';
    this.dashoboardService
      .getCancelledPatientAppointment(
        this.CancelledAptfilterModel,
        fromDate,
        toDate
      )
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.CancelledPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.CancelledPatientAppointment = (
            this.CancelledPatientAppointment || []
          ).map((x) => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              (y: { staffId: any; }) => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.CancelledAppointmentMeta = response.meta;
        } else {
          this.CancelledPatientAppointment = [];
          this.CancelledAppointmentMeta = new Metadata;;
        }
        this.CancelledAppointmentMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  getMissedPatientAppointmentList() {
    const fromDate = '',
      toDate = moment().format("yyyy-MM-ddTHH:mm:ss");
    this.dashoboardService
      .getPendingPatientAppointment(this.MissedAptfilterModel, fromDate, toDate)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.MissedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          // this.commonService.setPendingAppointment(this.pendingAppointmentMeta.totalRecords.toString());
          this.MissedPatientAppointment = (
            this.MissedPatientAppointment || []
          ).map((x) => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              (y: { staffId: any; }) => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.MissedAppointmentMeta = response.meta;
        } else {
          this.MissedPatientAppointment = [];
          this.MissedAppointmentMeta = new Metadata;
        }
      });
  }
  getAttendedPatientAppointmentList() {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(addYears(new Date(), -100), "yyyy-MM-dd"),
      toDate: format(new Date(), "yyyy-MM-dd"),
      status: "Approved",
      pageNumber: this.AttendedAptfilterModel.pageNumber,
      pageSize: this.AttendedAptfilterModel.pageSize,
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.AttendedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.AttendedPatientAppointment = (
            this.AttendedPatientAppointment || []
          ).map((x) => {
            const staffsArray = (x.appointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map((y: { staffId: any; }) => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.AttendedAppointmentMeta = response.meta;
        }
      });
  }
  getTodayPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(new Date(), "yyyy-MM-dd"),
      toDate: format(new Date(), "yyyy-MM-dd"),
      status: "Approved",
      pageNumber,
      pageSize,
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          console.log("myapp", response);
          this.allTodayAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allTodayAppointmentsList = (
            this.allTodayAppointmentsList || []
          ).map((x) => {
            const staffsArray = (x.appointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map((y: { staffId: any; }) => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.todayAppointmentMeta = response.meta;
          this.onDateSelected(null);
        }
        this.todayAppointmentMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  getPasswordExpiryMessage() {
    this.subscription = this.commonService.loginUser.subscribe(
      (user: LoginUser) => {
        if (user.passwordExpiryStatus) {
          this.passwordExpiryColorCode = user.passwordExpiryStatus.colorCode;
          this.passwordExpiryMessage = user.passwordExpiryStatus.message;
          this.status = user.passwordExpiryStatus.status;
        }
      }
    );
  }

  getMailCount() {
    this.mailboxService
      .getMessageCount(true)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.messageCounts =
            response.data == null ? new MessageCountModel() : response.data;
          this.commonService.setInboxCount(this.messageCounts.inboxCount.toString());
          localStorage.setItem("messageCount", this.messageCounts.inboxCount.toString());
        }
        else {
          this.messageCounts = 0;
          localStorage.setItem("messageCount", '0');

        }
      });
  }

  onPendingPageOrSortChange(changeState?: any) {
    this.setPendingPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPendignPatientAppointmentList();
  }
  onCancelledPageOrSortChange(changeState?: any) {
    this.setCancelledPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getCancelledPatientAppointmentList();
  }
  onReportPageOrSortChange(changeState?: any) {
    this.setReportPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPatientReportList(changeState.pageIndex + 1, changeState.pageSize);
  }
  onTodayPageOrSortChange(changeState?: any) {
    this.setTodayPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getTodayPatientAppointmentList(
      changeState.pageIndex + 1,
      changeState.pageSize
    );
  }
  onMissedPageOrSortChange(changeState?: any) {
    this.setMissedPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getMissedPatientAppointmentList();
  }
  onAttendedPageOrSortChange(changeState?: any) {
    this.setAttendedPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getAttendedPatientAppointmentList();
  }
  onUpcomingAptPageOrSortChange(changeState?: any) {
    this.setUpcomingPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getAllPatientAppointmentList(
      changeState.pageIndex + 1,
      changeState.pageSize
    );
  }
  onPastPageOrSortChange(changeState?: any) {
    this.setPastPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getPastPatientAppointmentList(
      changeState.pageIndex + 1,
      changeState.pageSize
    );
  }
  setPastPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.pastAptfilterModel.pageNumber = pageNumber;
    this.pastAptfilterModel.pageSize = pageSize;
    this.pastAptfilterModel.sortOrder = sortOrder;
    this.pastAptfilterModel.sortColumn = sortColumn;
  }
  setPendingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.pendingAptfilterModel.pageNumber = pageNumber;
    this.pendingAptfilterModel.pageSize = pageSize;
    this.pendingAptfilterModel.sortOrder = sortOrder;
    this.pendingAptfilterModel.sortColumn = sortColumn;
  }
  setCancelledPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.CancelledAptfilterModel.pageNumber = pageNumber;
    this.CancelledAptfilterModel.pageSize = pageSize;
    this.CancelledAptfilterModel.sortOrder = sortOrder;
    this.CancelledAptfilterModel.sortColumn = sortColumn;
  }
  setReportPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.ReportFilterModel.pageNumber = pageNumber;
    this.ReportFilterModel.pageSize = pageSize;
    this.ReportFilterModel.sortOrder = sortOrder;
    this.ReportFilterModel.sortColumn = sortColumn;
  }
  setTodayPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.TodayAptfilterModel.pageNumber = pageNumber;
    this.TodayAptfilterModel.pageSize = pageSize;
    this.TodayAptfilterModel.sortOrder = sortOrder;
    this.TodayAptfilterModel.sortColumn = sortColumn;
  }
  setMissedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.MissedAptfilterModel.pageNumber = pageNumber;
    this.MissedAptfilterModel.pageSize = pageSize;
    this.MissedAptfilterModel.sortOrder = sortOrder;
    this.MissedAptfilterModel.sortColumn = sortColumn;
  }
  setAttendedPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.AttendedAptfilterModel.pageNumber = pageNumber;
    this.AttendedAptfilterModel.pageSize = pageSize;
    this.AttendedAptfilterModel.sortOrder = sortOrder;
    this.AttendedAptfilterModel.sortColumn = sortColumn;
  }
  setUpcomingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.upcomingAptfilterModel.pageNumber = pageNumber;
    this.upcomingAptfilterModel.pageSize = pageSize;
    this.upcomingAptfilterModel.sortOrder = sortOrder;
    this.upcomingAptfilterModel.sortColumn = sortColumn;
  }

  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  onTableActionClick(actionObj?: any) {
    debugger
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    this.currentAppointmentId = actionObj.data.patientAppointmentId;
    this.currentPatientId = actionObj.data.patientID;
    if (actionObj.data.appointmentStaffs != undefined) {
      this.currentStafftId = actionObj.data.appointmentStaffs[0].staffId;
      localStorage.setItem("apptId", id);
      if (actionObj.action == "bookingMode") {
        if (
          this.selectedIndex == 0 &&
          actionObj.action != "reschedule" &&
          actionObj.action != "chat" &&
          actionObj.action != "cancel" &&
          actionObj.action != "video"
        ) {
          console.log("ContextMenu", actionObj);
          this.onContextMenu(actionObj.action);
        }

      }
      else {

        switch ((actionObj.action || "").toUpperCase()) {
          case "CALL":
            // this.router.navigate(["/web/encounter/video-call"], {
            //   queryParams: { apptId: id }
            // });
            this.router.navigate(["/web/waiting-room/" + id]);
            break;
          case "CHAT":
            this.commonService.loginUser.subscribe((response: any) => {
              if (response.access_token) {
                var chatInitModel = new ChatInitModel();
                chatInitModel.isActive = true;
                chatInitModel.AppointmentId = id;
                chatInitModel.UserId = response.data.userID;
                if (this.isClientLogin) {
                  chatInitModel.UserRole = response.data.users3.userRoles.userType;
                } else {
                  chatInitModel.UserRole = response.data.userRoles.userType;
                }
                //chatInitModel.UserRole = response.data.users3.userRoles.userType;
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
          case "CANCEL":
            this.createCancelAppointmentModel(id);
            break;
          case "RESCHEDULE":
            this.OpenrReschedule(actionObj.data);
            break;
          default:
            break;
        }
        // this.onContextMenu(actionObj.action);
      }
    }
    else {
      this.onContextMenu(actionObj.action);
    }

  }

  viewAppointment(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(AppointmentViewComponent, {
      hasBackdrop: true,
      data: appointmentId,
      width: "80%",
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

  async OpenrReschedule(actionObj: any) {
    console.log(actionObj);
    this.clientModel = await this.getClientInfo(actionObj.patientID);
    let dbModal;
    dbModal = this.appointmentDailog.open(StaffAppointmentComponent, {
      hasBackdrop: true,
      minWidth: "70%",
      maxWidth: "70%",
      data: {
        staffId:
          actionObj.appointmentStaffs.length > 0
            ? actionObj.appointmentStaffs[0].staffId
            : 0,
        userInfo: null,
        providerId:
          actionObj.appointmentStaffs.length > 0
            ? actionObj.appointmentStaffs[0].staffId
            : 0,
        locationId: actionObj.serviceLocationID || 0,
        isNewAppointment: false,
        appointmentId: actionObj.patientAppointmentId,
        patientId: actionObj.patientID,
        age:
          this.clientModel && this.clientModel.age != 0
            ? this.clientModel.age
            : 1,
      },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      this.getTodayPatientAppointmentList();
    });
  }
  onUpcomingTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    this.currentAppointmentId = actionObj.data.patientAppointmentId;
    this.currentPatientId = actionObj.data.patientID;
    this.currentStafftId = actionObj.data.appointmentStaffs[0].staffId;
    // this.IstimeExpired = this.CheckTime(actionObj.data);
    localStorage.setItem("apptId", id);
    if (
      this.selectedIndex == 1 &&
      actionObj.action != "chat" &&
      actionObj.action != "cancel" &&
      actionObj.action != "video"
    ) {
      console.log("ContextMenu", actionObj);
      this.onContextMenu(actionObj.action);
    }
    switch ((actionObj.action || "").toUpperCase()) {
      case "CHAT":
        this.commonService.loginUser.subscribe((response: any) => {
          if (response.access_token) {
            var chatInitModel = new ChatInitModel();
            chatInitModel.isActive = true;
            chatInitModel.AppointmentId = id;
            chatInitModel.UserId = response.data.userID;
            //chatInitModel.UserRole = response.data.users3.userRoles.userType;
            if (this.isClientLogin) {
              chatInitModel.UserRole = response.data.users3.userRoles.userType;
            } else {
              chatInitModel.UserRole = response.data.userRoles.userType;
            }
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
      case "CANCEL":
        this.createCancelAppointmentModel(id);
        break;
      case "VIDEO":
        this.router.navigate([
          "/web/waiting-room/" + this.currentAppointmentId,
        ]);
        break;
      default:
        break;
    }
  }
  onContextMenu($event: MouseEvent) {
    debugger
    const target = $event.target as Element | null;
    if (target) {
    //   this.contextMenuService.show.next({
    //   anchorElement: target,
    //   contextMenu: this.contextMenu,
    //   event: <any>$event,
    //   item: 2,
    // });
    this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';
    this.menuTrigger.menuData={event: <any>$event}
   this.menuTrigger.openMenu();
    $event.preventDefault();
    $event.stopPropagation();
  }
}
  async addEvent(event: any, type: any): Promise<void> {
    switch (type) {
      case "0":
        this.viewAppointment(this.currentAppointmentId);
        break;
      case "1":
        console.log("profile", event);
        console.log("Staff", this.currentStafftId);
        this.router.navigate(["web/client/doctor/" + this.currentStafftId]);
    }
  }
  // getAppointmentInfo(appointmentId: number, userRole: string) {
  //   this.schedulerService
  //     .getAppointmentDetails(appointmentId)
  //     .subscribe(response => {
  //       var appointmentDetail = response.data;
  //       if (response.statusCode == 200) {
  //         var staff = appointmentDetail.appointmentStaffs[0];
  //         if (userRole.toUpperCase() == "CLIENT") {
  //           this.textChatModel.Callee = "Dr. " + staff.staffName;
  //           this.textChatModel.CalleeImage = staff.photoThumbnail;
  //           this.textChatModel.Caller = appointmentDetail.patientName;
  //           this.textChatModel.CallerImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         } else {
  //           this.textChatModel.Caller = "Dr. " + staff.staffName;
  //           this.textChatModel.CallerImage = staff.photoThumbnail;
  //           this.textChatModel.Callee = appointmentDetail.patientName;
  //           this.textChatModel.CalleeImage =
  //             appointmentDetail.patientPhotoThumbnailPath;
  //         }
  //       }
  //       this.appService.ChatUserInit(this.textChatModel);
  //     });
  // }

  onPendingTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;

    switch ((actionObj.action || "").toUpperCase()) {
      case "CANCEL":
        this.createCancelAppointmentModel(id);
        break;
      default:
        break;
    }
  }

  onPastTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.patientAppointmentId;
    const encId = actionObj.data && actionObj.data.patientEncounterId;
    const revId = actionObj.data && actionObj.data.reviewRatingId;
    // this.currentStafftId = actionObj.data.appointmentStaffs[0].staffId;
    this.router.navigate(["web/client/doctor/" + actionObj.data.appointmentStaffs[0].staffId]);

    switch ((actionObj.action || "").toUpperCase()) {
      case "SOAP":
      // this.router.navigate(["/web/client/soap-note"], {
      //   queryParams: { apptId: id, encId: encId },
      // });
      case "REVIEW":
        this.createDialogReviewRating(actionObj.data);
        break;
      // this.router.navigate(["/web/client/review-rating"], {
      //     queryParams: { apptId: id, revId: revId }
      //  });
      default:
        break;
    }
  }

  createDialogReviewRating(data: any) {
    var reviewRatingModel = new ReviewRatingModel();
    reviewRatingModel.id = data.reviewRatingId;
    reviewRatingModel.patientAppointmentId = data.patientAppointmentId;
    reviewRatingModel.rating = data.rating;
    reviewRatingModel.review = data.review;
    reviewRatingModel.staffId =
      data.appointmentStaffs != null ? data.appointmentStaffs[0].staffId : 0;
    let dbModal;
    dbModal = this.dialogModal.open(ReviewRatingComponent, {
      data: { reviewRatingModel },
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "save")
        this.getPastPatientAppointmentList(
          this.pastAptfilterModel.pageNumber,
          this.pastAptfilterModel.pageSize
        );
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.dialogModal.open(CancelAppointmentDialogComponent, {
      hasBackdrop: true,
      data: appointmentId,
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        this.onTabChanged({ index: this.selectedIndex });
      }
    });
  }
  onDateSelectGetAppt() {

  }

  toggleView(value: string = "") {
    //////debugger
    if (value == "grid") {
      this.filterModel.pageSize = 5; //This will be a fixed valeu as we need all the parameters
      this.getVitalList(this.filterModel, "grid");
    } else {
      this.filterModel.pageSize = 100; //This will be changed later
      this.getVitalList(this.filterModel, "chart");
    }
  }

  getVitalList(filterModel:any, type: string = "") {
    // if(type == "chart")
    // {
    //   this.vitalsChartData=[];
    //   this.lineChartLabels=[];
    // }
    this.vitalListingData = [];
    this.clientService
      .getVitalList(this.currentLoginUserId, this.filterModel)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.vitalListingData = response.data;
          this.vitalListingData = (response.data || []).map((obj: any) => {
            obj.vitalDate = obj.vitalDate
              ? format(obj.vitalDate, 'MM/dd/yyyy')
              : "-";
            obj.displayheight = obj.heightIn
              ? this.convertInches(obj.heightIn)
              : "-";
            obj.displayBP =
              obj.bpDiastolic && obj.bpSystolic
                ? this.convertBP(obj.bpDiastolic, obj.bpSystolic)
                : "-";
            obj.heartRate = obj.heartRate || "-";
            obj.weightLbs = obj.weightLbs || "-";
            obj.bmi = obj.bmi || "-";
            obj.pulse = obj.pulse || "-";
            obj.respiration = obj.respiration || "-";
            obj.temperature = obj.temperature || "-";
            return obj;
          });
          this.isGrid = type == "grid" ? true : false;
          if (type == "chart") {
            //this.vitalListingData = response.data != null ? response.data : {};
            if (this.vitalListingData.length > 0) {
              this.lineChartLabels = this.vitalListingData.map(
                ({ vitalDate }) => format(vitalDate, 'MM/dd/yyyy')
              );
              this.lineChartData = [
                {
                  data: this.vitalListingData.map(({ bmi }) => bmi),
                  label: this.translate.instant('bmi'),
                },
                {
                  data: this.vitalListingData.map(
                    ({ bpDiastolic }) => bpDiastolic
                  ),
                  label: this.translate.instant('diastolic_bp'),
                },
                {
                  data: this.vitalListingData.map(
                    ({ bpSystolic }) => bpSystolic
                  ),
                  label: this.translate.instant('systolic_bp'),
                },
                {
                  data: this.vitalListingData.map(({ heartRate }) => heartRate),
                  label: this.translate.instant('heart_rate'),
                },
                {
                  data: this.vitalListingData.map(({ heightIn }) => heightIn),
                  label: "Height(In)",
                },
                {
                  data: this.vitalListingData.map(({ pulse }) => pulse),
                  label: this.translate.instant('pulse'),
                },
                {
                  data: this.vitalListingData.map(
                    ({ respiration }) => respiration
                  ),
                  label: this.translate.instant('respiration'),
                },
                {
                  data: this.vitalListingData.map(
                    ({ temperature }) => temperature
                  ),
                  label: "Temperature(c)",
                },
                {
                  data: this.vitalListingData.map(({ weightLbs }) => weightLbs),
                  label: "Weight(Lb)",
                },
              ];
            }
          }
          this.metaData = response.meta;
          console.log(this.vitalListingData, "vitalListingData")
          console.log(this.currentLoginUserId, "currentLoginUserId")
        } else {
          this.vitalListingData = [];
          this.metaData = {};
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  clearVitalsData() {
    this.getVitalList(this.filterModel, "chart");
  }

  vitalsTile(event: any) {
    switch (event) {
      case 'bp':
        this.lineChartData = [
          {
            data: this.vitalListingData.map(data => data.bpDiastolic),
            label: 'Diastolic BP',
          },
          {
            data: this.vitalListingData.map(data => data.bpSystolic),
            label: 'Systolic BP',
          },
        ];
        break;
      case 'heartrate':
        this.lineChartData = [{
          data: this.vitalListingData.map(({ heartRate }) => heartRate),
          label: 'Heart Rate',
        },]
        break;
      case 'temperature':
        this.lineChartData = [{
          data: this.vitalListingData.map(({ temperature }) => temperature),
          label: "Temperature(c)",
        },]
        break;
      case 'height':
        this.lineChartData = [{
          data: this.vitalListingData.map(({ heightIn }) => heightIn),
          label: "Height(In)",
        },]
        break;
      case 'weight':
        this.lineChartData = [{
          data: this.vitalListingData.map(({ weightLbs }) => weightLbs),
          label: "Weight(Lb)",
        },]
        break;
      case 'respiration':
        this.lineChartData = [{
          data: this.vitalListingData.map(({ respiration }) => respiration),
          label: 'Respiration',
        },]
        break;
      default:
        console.warn("Unknown tile clicked:");
    }
  }


  convertInches(inches:any) {
    try {
      if (inches && inches > 0) {
        let feetFromInches = Math.floor(inches / 12); //There are 12 inches in a foot
        let inchesRemainder = inches % 12;
        let result = feetFromInches + "'" + inchesRemainder + '"';
        return result;
      } else {
        return "0";
      }
    } catch (error) {
      return "0";
    }
  }
  convertBP(D:any, S:any) {
    try {
      let systolic = "0";
      let diastolic = "0";
      if (D && D > 0) {
        diastolic = D;
      }
      if (S && S > 0) {
        systolic = S;
      }
      return S + "/" + D;
    } catch (error) {
      return "0/0";
    }
  }
}
function translateColumns() {
  throw new Error("Function not implemented.");
}


