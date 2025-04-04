import { SchedulingRoutingModule } from "./../../scheduling/scheduling-routing.module";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DashboardService } from "./dashboard.service";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  FilterModel,
  ResponseModel,
} from "../../../../super-admin-portal/core/modals/common-model";
import {
  EncounterModel,
  AuthorizationModel,
  DashboardModel,
  ClientStatusChartModel,
} from "./dashboard.model";
import { Metadata } from "../../core/modals/common-model";
import { NavigationExtras, Router } from "@angular/router";
import { CommonService } from "../../core/services";
import { DatePipe } from "@angular/common";
import { merge, Subscription, Subject } from "rxjs";

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { format, isSameDay, isSameMonth } from "date-fns";
import { AuthenticationService } from "../../../../super-admin-portal/auth/auth.service";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";
import { UsersService } from "../users/users.service";
import { StaffProfileModel } from "../users/users.model";
import { UrgentCareListingdialogComponent } from "src/app/shared/urgentcarelisting-dialog/urgentcarelisting-dialog.component";
import { RefundFilterModel } from "../../core/modals/common-model";
import { PaymentService } from "./../../agency-portal/Payments/payment.service";
import { ProviderMsgComponent } from "../provider-msg/provider-msg.component";
import { TranslateService } from "@ngx-translate/core";
import { MailboxService } from "../../mailing/mailbox.service";
import { MessageCountModel } from "../../mailing/mailbox.model";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit {
  encFilterModel: FilterModel;
  filterModel: RefundFilterModel;
  encounterList: Array<EncounterModel> = [];
  dashboardData: DashboardModel;
  clientStatusChartData: Array<ClientStatusChartModel> = [];
  encMeta: Metadata;
  subscription: Subscription = new Subscription;
  isAuth: boolean = true;
  refund: any = 0;
  currentDateRefund: any = 0;
  currentMonthRefund: any = 0;
  lastMonthRefund: any = 0;
  status: boolean = false;
  passwordExpiryColorCode: string = "";
  passwordExpiryMessage: string = "";
  showMessage: boolean = true;
  messageCounts: any;
  accessToken = "YOUR_ACCESS_TOKEN";
  message: Subject<any> = new Subject();
  pendingAppointmentMeta: Metadata| null = null;
  cancelledAppointmentMeta: Metadata| null = null;
  tentativeAppointmentMeta: Metadata = new Metadata;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  curDate: any;
  aprovedAppointmentsDisplayedColumns: Array<any>;
  aprovedAppointmentsActionButtons: Array<any>;
  pendingDisplayedColumns: Array<any>;
  pendingActionButtons: Array<any>;
  cancelledDisplayedColumns: Array<any>;
  cancelledActionButtons: Array<any>;
  pendingAptfilterModel: FilterModel;
  cancelledAptfilterModel: FilterModel;
  pendingPatientAppointment: Array<any> = [];
  cancelledPatientAppointment: Array<any> = [];
  selectedIndex: number = 0;
  //Charts
  lineChartData: Array<any> = [
    { data: [], label: "" },
    { data: [], label: "" },
  ];
  lineChartLabels: Array<any> = [];
  lineChartType: string = "line";
  headerText: string = "Authorization";
  userId!: string;
  staffId!: number;
  urgentcareapptid!: number;
  showurgentcarebtn: boolean = false;
  staffProfile: StaffProfileModel;
  allAppointmentsList: Array<any> = [];
  //allAppointmentsMeta: Metadata;
  allAppointmentsMeta: Metadata = new Metadata();
  selectedDate: Date = new Date();
  constructor(
    private dashoboardService: DashboardService,
    private mailboxService: MailboxService,
    private datePipe: DatePipe,
    private route: Router,
    private paymentService: PaymentService,
    private commonService: CommonService,
    private schedulerService: SchedulerService,
    private userService: UsersService,
    private dialogModal: MatDialog,
    private translate: TranslateService,
    private appointmentGraphService: AppointmentGraphService,
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.encFilterModel = new FilterModel();
    this.filterModel = new RefundFilterModel();
    this.encMeta = new Metadata();
    this.dashboardData = new DashboardModel();
    this.staffProfile = new StaffProfileModel();
    // this.encDisplayedColumns = [
    //   { displayName: 'Practitioner', key: 'staffName', class: '', width: '20%' },
    //   { displayName: 'Client Name', key: 'clientName', class: '', width: '20%' },
    //   { displayName: 'Day', key: 'day', width: '10%' },
    //   { displayName: 'DOS', key: 'dateOfService', width: '20%', type: 'date' },
    //   { displayName: 'Status', key: 'status', width: '20%' },
    //   { displayName: 'Actions', key: 'Actions', width: '10%' }
    // ];
    // this.encActionButtons = [
    //   { displayName: 'View', key: 'view', class: 'fa fa-eye' }
    // ];
    this.pendingAptfilterModel = new FilterModel();
    this.cancelledAptfilterModel = new FilterModel();
    this.pendingDisplayedColumns = [
      {
        displayName: "Care Manager",
        key: "staffName",
        width: "110px",
        sticky: true,
      },
      {
        displayName: "Member Name",
        key: "fullName",
        width: "120px",
        type: "link",
        url: "/web/member/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true,
      },
      { displayName: "Appt. Type", key: "appointmentType", width: "80px" },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        width: "250px",
        type: "link",
        url: "/web/member/scheduling",
        queryParamsColumn: "queryParamsObj",
      },
      { displayName: "Actions", key: "Actions", width: "80px", sticky: true },
    ];
    this.pendingActionButtons = [
      { displayName: "Approve", key: "approve", class: "fa fa-check" },
      { displayName: "Cancel", key: "cancel", class: "fa fa-ban" },
    ];

    this.cancelledDisplayedColumns = [
      {
        displayName: "Care Manager",
        key: "staffName",
        width: "100px",
        sticky: true,
      },
      {
        displayName: "Member Name",
        key: "fullName",
        width: "120px",
        type: "link",
        url: "/web/member/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true,
      },
      { displayName: "Appt. Type", key: "appointmentType", width: "80px" },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        width: "200px",
        type: "link",
        url: "/web/member/scheduling",
        queryParamsColumn: "queryParamsObj",
      },
      { displayName: "Cancel Type", kefy: "cancelType", width: "140px" },
      { displayName: "Cancel Reason", key: "cancelReason", width: "150px" },
      { displayName: "Actions", key: "Actions", width: "60px", sticky: true },
    ];
    this.cancelledActionButtons = [];

    this.aprovedAppointmentsDisplayedColumns = [
      {
        displayName: "Practitioner",
        key: "staffName",
        class: "",
        width: "20%",
      },
      {
        displayName: "Client Name",
        key: "clientName",
        class: "",
        width: "20%",
      },
      { displayName: "Day", key: "day", width: "10%" },
      { displayName: "DOS", key: "dateOfService", width: "20%", type: "date" },
      { displayName: "Status", key: "status", width: "20%" },
      { displayName: "Actions", key: "Actions", width: "10%" },
    ];
    this.aprovedAppointmentsActionButtons = [];
  }

  ngOnInit() {
    let isProviderApproved = this.dashoboardService.getIsProviderApproved()
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.staffId = user.data.staffLocation[0].staffId;
        this.userId = user.data.userID;
        if (isProviderApproved == false) {
          this.OpenWarningMsg(user.data);
        }
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "PROVIDER") {
          this.getLastUrgentCareCallStatus();
        }
      }
    });
    this.setPaginatorModel();
    this.getPayments(this.filterModel);
    this.getEncounterListForDashboard();
    this.getDashboardBasicInfo();
    this.getPasswordExpiryMessage();
    this.getStaffProfileData();
    this.getPendignPatientAppointmentList();
    this.getCancelledPatientAppointmentList();
    this.getAllPatientAppointmentList();
  }

  OpenWarningMsg = (userData:any) => {
    let dbModal;
    dbModal = this.dialogModal.open(ProviderMsgComponent, {
      hasBackdrop: true,
      width: "45%",
      data: userData
    });
    dbModal.afterClosed().subscribe((result: string) => {
      this.dashoboardService.setIsProviderApproved(true);
    });
  };
  getPayments(filterModel: RefundFilterModel) {
    this.paymentService
      .getAppointmentRefunds(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          //////debugger;
          var refund = 0;
          var currentDateRefund = 0;
          var lastMonthRefund = 0;
          var currentMonthRefund = 0;
          var date = new Date();
          var curDate = format(new Date(), 'MM/dd/yyyy');
          var firstDay = format(
            new Date(date.getFullYear(), date.getMonth(), 1),
            'MM/dd/yyyy'
          );
          var lastDay = format(
            new Date(date.getFullYear(), date.getMonth() + 1, 0),
            'MM/dd/yyyy'
          );
          var PreMonthLastDay = format(
            new Date(date.getFullYear(), date.getMonth(), 0),
            'MM/dd/yyyy'
          );
          var PreMonthFirstDay = format(
            new Date(
              date.getFullYear() - (date.getMonth() > 0 ? 0 : 1),
              (date.getMonth() - 1 + 12) % 12,
              1
            ),
            'MM/dd/yyyy'
          );
          response.data.forEach((a: { netAmount: any; }) => (this.refund += a.netAmount));
          response.data.forEach(function (item: any) {
            if (format(item.startDateTime, 'MM/dd/yyyy') == curDate) {
              currentDateRefund += item.netAmount;
            }
          });
          response.data.forEach(function (item: any) {
            if (
              format(item.startDateTime, 'MM/dd/yyyy') >= firstDay &&
              format(item.startDateTime, 'MM/dd/yyyy') <= lastDay
            ) {
              currentMonthRefund += item.netAmount;
            }
          });
          response.data.forEach(function (item: any) {
            if (
              format(item.startDateTime, 'MM/dd/yyyy') >= PreMonthFirstDay &&
              format(item.startDateTime, 'MM/dd/yyyy') <= PreMonthLastDay
            ) {
              lastMonthRefund += item.netAmount;
            }
          });

          this.refund = refund;
          this.lastMonthRefund = lastMonthRefund;
          this.currentMonthRefund = currentMonthRefund;
        }
      });
  }

  gotoscheduler(month: any, appttype: any, apptmode: any) {
    this.route.navigate(["/web/manage-users/availability"], {
      queryParams: {
        calendermonth: month,
        appttype: appttype,
        apptmode: apptmode,
      },
    });
  }
  gotopayments() {
    this.route.navigate(["/web/payment/payment-history"]);
  }

  gotoschedulermonth(month: any) {
    this.route.navigate(["/web/manage-users/availability"], {
      queryParams: { calendermonth: month },
    });
  }
  gotoschedulertoday(currentdayview: any) {
    this.route.navigate(["/web/manage-users/availability"], {
      queryParams: { currentdayview: currentdayview },
    });
  }
  gotoschedulerTotal() {
    this.route.navigate(["/web/manage-users/availability"]);
  }

  gotopaymentslastmonth(monthstatus: any) {
    this.route.navigate(["/web/payment/payment-history"], {
      queryParams: { monthstatus: monthstatus },
    });
  }
  gotopendingApproval() {
    this.route.navigate(["/web/my-appointments"]);
  }
  gotomyClient() {
    this.route.navigate(["/web/client"]);
  }
    gotowaitingRoom(id: number) {
      this.route.navigate(['/web/waiting-room'], {queryParams: { id: id }});
    }
    
  gotomyProfile(){
    this.route.navigate(["/web/manage-users/user-profile"]);
  }

  hideMessageClick() {
    this.showMessage = false;
  }
  changeWidget(value: string = "") {
    if (value == "authorization") {
      this.isAuth = true;
      this.headerText = "Authorization";
    } else if (value == "clientstatus") {
      this.getClientStatusChart();
    }
  }

  onTabChanged(event: any) {
    this.selectedIndex = event.value;
    if (event.index == 0) {
      // this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
      this.getEncounterListForDashboard();
    } else if (event.index == 1) {
      this.getPendignPatientAppointmentList();
    } else if (event.index == 2) {
      this.getCancelledPatientAppointmentList();
    }
    // else if (event.index == 3) {
    // } else if (event.index == 4) {
    //   this.getTentativePatientAppointmentList();
    // }
  }

  getEncounterListForDashboard() {
    this.dashoboardService
      .getEncounterListForDashboard(this.encFilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.encounterList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.encMeta = response.meta;
          this.encMeta.pageSizeOptions = [5, 10, 25, 50, 100];
        }
      });
  }

getPendignPatientAppointmentList() {
    this.dashoboardService
      .getPendingPatientAppointment(this.pendingAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.pendingPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.pendingAppointmentMeta = response.meta;
        
         this.commonService.setPendingAppointment(this.pendingAppointmentMeta.totalRecords.toString());
         localStorage.setItem("pendingAppointment", this.pendingAppointmentMeta.totalRecords.toString());
        } else {
          this.pendingPatientAppointment = [];
          this.pendingAppointmentMeta = null;
         
          localStorage.setItem("pendingAppointment", '0');
        }
      });
    
      this.mailboxService
      .getMessageCount(true)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.messageCounts =
            response.data == null ? new MessageCountModel() : response.data;
            this.commonService.setInboxCount(this.messageCounts.inboxCount.toString());
            localStorage.setItem("messageCount", this.messageCounts.inboxCount.toString());
          }
      else{
         this.messageCounts =0;
        localStorage.setItem("messageCount", '0');
         
      }});
      
  }



  // async getPendignPatientAppointmentList() {
  //   try {
  //     const pendingPatientResponse: ResponseModel = await this.dashoboardService
  //       .getPendingPatientAppointment(this.pendingAptfilterModel)
  //       .toPromise();

  //     if (pendingPatientResponse && pendingPatientResponse.statusCode === 200) {
  //       this.pendingPatientAppointment =
  //         pendingPatientResponse.data && pendingPatientResponse.data.length > 0
  //           ? pendingPatientResponse.data
  //           : [];
  //       this.pendingAppointmentMeta = pendingPatientResponse.meta;

  //       this.commonService.setPendingAppointment(this.pendingAppointmentMeta.totalRecords.toString());
  //     } else {
  //       this.pendingPatientAppointment = [];
  //       this.pendingAppointmentMeta = null;
  //     }

  //     const messageCountResponse: ResponseModel = await this.mailboxService
  //       .getMessageCount(true)
  //       .toPromise();

  //     if (messageCountResponse && messageCountResponse.statusCode === 200) {
  //       this.messageCounts =
  //         messageCountResponse.data == null
  //           ? new MessageCountModel()
  //           : messageCountResponse.data;

  //       this.commonService.setInboxCount(this.messageCounts.inboxCount.toString());
  //     } else {
  //       // this.messageCounts = new MessageCountModel();
  //       //  localStorage.setItem('messageCount', '0');
  //      // this.commonService.setInboxCount('0');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     this.pendingPatientAppointment = [];
  //     this.pendingAppointmentMeta = null;
  //     this.messageCounts = new MessageCountModel();
  //     localStorage.setItem('messageCount', '0');
  //   }
  // }


  getLastUrgentCareCallStatus() {
    //////debugger;
    this.schedulerService
      .getLastUrgentCareCallStatus(this.userId)
      .subscribe((response) => {
        if (response.statusCode === 200) {
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
    this.route.navigate(["/web/encounter/soap"], {
      queryParams: {
        apptId: this.urgentcareapptid,
        encId: 0,
      },
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
    this.cancelledAptfilterModel.pageNumber = pageNumber;
    this.cancelledAptfilterModel.pageSize = pageSize;
    this.cancelledAptfilterModel.sortOrder = sortOrder;
    this.cancelledAptfilterModel.sortColumn = sortColumn;
  }
  getCancelledPatientAppointmentList() {
    this.dashoboardService
      .getCancelledPatientAppointment(this.cancelledAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.cancelledPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.cancelledAppointmentMeta = response.meta;
        } else {
          this.cancelledPatientAppointment = [];
          this.cancelledAppointmentMeta = null;
        }
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

  getDashboardBasicInfo() {
    this.dashoboardService
      .getDashboardBasicInfo()
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.dashboardData =
            response.data != null ? response.data : new DashboardModel();
        }
      });
      // var onlineAppointments = this.allAppointmentsList.filter(function(appointment) {
      //   return appointment.appointmentMode === "online";
      // });
      // var onlineAppointmentsCount = onlineAppointments.length;

  }
  getClientStatusChart() {
    this.dashoboardService
      .getClientStatusChart()
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.isAuth = false;
          this.headerText = "Client Status";
          this.clientStatusChartData =
            response.data != null
              ? response.data
              : new ClientStatusChartModel();
          if (this.clientStatusChartData.length > 0) {
            this.lineChartLabels = this.clientStatusChartData.map(
              ({ registeredDate }) => format(new Date(registeredDate), 'MM/dd/yyyy'));
            this.lineChartData = [
              {
                data: this.clientStatusChartData.map(({ active }) => active),
                label: "Active",
              },
              {
                data: this.clientStatusChartData.map(
                  ({ inactive }) => inactive
                ),
                label: "Inactive",
              },
            ];
          }
        }
      });
  }
  onEncPageOrSortChange(changeState?: any) {
    this.setEncPaginatorModel(
      changeState.pageIndex + 1,
      this.encFilterModel.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getEncounterListForDashboard();
  }

  onEncTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name,
      appointmentId = actionObj.data && actionObj.data.patientAppointmentId,
      patientEncounterId = actionObj.data && actionObj.data.id,
      isBillableEncounter =
        actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || "").toUpperCase()) {
      case "VIEW":
        const redirectUrl = isBillableEncounter
          ? "/web/waiting-room/"
          : "/web/encounter/non-billable-soap";
        if (isBillableEncounter) {
          this.route.navigate(["/web/waiting-room/" + appointmentId]);
        } else {
          this.route.navigate([redirectUrl], {
            queryParams: {
              apptId: appointmentId,
              encId: patientEncounterId,
            },
          });
        }
        break;
      default:
        break;
    }
  }

  onDateSelected(event: any): void {
    this.selectedDate = event;
    this.getAllPatientAppointmentList();
  }

  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 100) {
    const formattedDate = format(this.selectedDate, 'MM/dd/yyyy');
    const filters = {
      pageNumber,
      pageSize,
      date: formattedDate 
    };
    this.appointmentGraphService
      .getAcceptedOrApprovedAppointmentList(filters)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(
            (x) => {
              const staffsArray = (x.pendingAppointmentStaffs || []).map(
                (y: { staffName: any; }) => y.staffName
              );
              const staffIds = (x.pendingAppointmentStaffs || []).map(
                (y: { staffId: any; }) => y.staffId
              );
              x.staffName = staffsArray.join(", ");
              (x["queryParamsPatientObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
              }),
                (x["queryParamsObj"] = {
                  id:
                    x.patientID > 0
                      ? this.commonService.encryptValue(x.patientID, true)
                      : null,
                  staffId: staffIds.join(","),
                  date: format(x.startDateTime, 'MM/dd/yyyy'),
                });
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
          this.filterAppointmentsByDate();
          // this.allAppointmentsMeta = response.meta as Metadata; 
          //   this.allAppointmentsMeta.pageSizeOptions = [5, 10, 25, 50, 100]; 
          } else {
            this.allAppointmentsList = [];
          }
        },
        (error: any) => {
          console.error('Error fetching appointments:', error);
          this.allAppointmentsList = []; 
        }
      );  
  }
  private filterAppointmentsByDate(): void {
    const formattedDate = format(this.selectedDate, 'MM/dd/yyyy');
    this.allAppointmentsList = this.allAppointmentsList.filter(appointment =>
      isSameDay(new Date(appointment.startDateTime), new Date(formattedDate))
    );
  }

  setEncPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.encFilterModel.pageNumber = pageNumber;
    this.encFilterModel.pageSize = pageSize;
    this.encFilterModel.sortOrder = sortOrder;
    this.encFilterModel.sortColumn = sortColumn;
  }

  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          this.staffProfile = response.data;
        }
      });
  }

  opentermconditionmodal() {
    let dbModal;
    dbModal = this.dialogModal.open(UrgentCareListingdialogComponent, {
      hasBackdrop: true,
      width: "60%",
    });
    dbModal.afterClosed().subscribe((result: string) => {
      //
      if (result != null && result != "close") {
      }
      //this.show=true;
    });
  }
  setPaginatorModel() {
    this.filterModel.pageNumber = 1;
    this.filterModel.pageSize = 1000;
    this.filterModel.sortOrder = "";
    this.filterModel.sortColumn = "";
    this.filterModel.PatientName = "";
    this.filterModel.RefundDate = "";
    this.filterModel.AppDate = "";
  }
}
