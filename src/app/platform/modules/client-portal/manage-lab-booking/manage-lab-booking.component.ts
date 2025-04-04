import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { addDays, format } from "date-fns";
import { AcceptRejectAppointmentInvitationComponent } from "src/app/shared/accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { CommonService } from "../../core/services";
import { CancelAppointmentDialogComponent } from "../../scheduling/scheduler/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";
import { Metadata } from "../client-profile.model";
import { ClientsService } from "../clients.service";
import { CancelLabAppointmentPatientComponent } from "./cancel-lab-appointment-patient/cancel-lab-appointment-patient.component";
import { ViewLabAppointmentPatientComponent } from "./view-lab-appointment-patient/view-lab-appointment-patient.component";
import { AppointmentViewComponent } from "../../scheduling/appointment-view/appointment-view.component";
import { Subscription } from "rxjs";
import { AppointmentReschedulingDialogComponent } from "src/app/shared/appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { NotifierService } from "angular-notifier";
import { AddNewCallerService } from "src/app/shared/add-new-caller/add-new-caller.service";
import { AddNewCallerComponent } from "src/app/shared/add-new-caller/add-new-caller.component";
import { ContextMenuComponent, ContextMenuService } from "ngx-contextmenu";
import { TranslateService } from "@ngx-translate/core";
import { MatMenuTrigger } from "@angular/material/menu";


@Component({
  selector: "app-manage-lab-booking",
  templateUrl: "./manage-lab-booking.component.html",
  styleUrls: ["./manage-lab-booking.component.css"],
})
export class ManageLabBookingComponent implements OnInit {
  contextMenu!: ContextMenuComponent;
  userData: any;
  providerList: any[] = [];
  relist: any[] = [];
  filteredPatient : any;
  approvedAppointmentDetails: any;
  cancelledAppointmentDetails: any;
  penddingAppointmentDetails: any;
  filterMasterSearchPatients: any = [];
  selectedIndex: number = 0;
  selected!: "All";
  filterString:any;
  pastAppointmentList: Array<any> = [];
  todaysAppointmentList: Array<any> = [];
  UpcomingAppointmentList: Array<any> = [];
  cancelAppointmentList: Array<any> = [];

  appointmentModes: Array<any> = ["Online", "Face to Face", "Home visit"];
  appointmentTypes: Array<any> = ["New", "Follow-up"];

  staffId: any;
  selectedTab = 0;
  requestData: any;
  searchWithText: string = "";
  appointmenType: any = ["New", "Follow-up"];
  appointmentMode: any = ["Online", "Face to Face", "Home Visit"];
  confirmation: any = { type: "New", mode: "Online" };

  selectedType: any = 3;
  metaData: Metadata;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];
  appointmentList: Array<any> = [];
  appointmentStatus: any = [
    "All",
    "Approved",
    "Completed",
    "Cancelled",
    "Pending",
    "Invited",
  ];

  displayCancelledLabAppointmentColoumn: string[] = [
    "lab_Name",
    "Appt_Type",
    "appointmentStartTime",
    "cancel_Type",
    "cancel_Reason",
  ];
  displayTodayLabAppointmentColoumn: string[] = [
    "lab_Name",
    "Appt_Type",
    "appointmentStartTime",
    "action",
  ];
  displayUpcomingLabAppointmentColoumn: string[] = [
    "lab_Name",
    "Appt_Type",
    "appointmentStartTime",
    "action",
  ];
  displayPastLabAppointmentColoumn: string[] = [
    "lab_Name",
    "Appt_Type",
    "appointmentStartTime",
  ];

  displayedColumns: Array<any> = [
    {
      displayName: "provider_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },

    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointment_type",
      key: "appointmentType",
      class: "",
      isSort: true,
    },
    {
      displayName: "time_remaining",
      key: "remainTime",
      type: "count",
      url: "/web/member/scheduling",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "symptoms_ailments",
      key: "notes",
      class: "",
      isSort: true,
    },
    { displayName: "cancel_type", key: "cancelTypeName" },
    { displayName: "messages", key: "cancelReason" },
    { displayName: "actions", key: "Actions", width: "20%" },
  ];
  displayedCancelledColumns: Array<any> = [
    {
      displayName: "provider_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },
    { displayName: "cancel_type", key: "cancelTypeName" },
    { displayName: "cancel_reason", key: "cancelReason" },
  ];
  displayedPenddingColumns: Array<any> = [
    {
      displayName: "provider_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },

    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },
    //{ displayName: "Actions", key: "Actions", width: "80px", sticky: true },
  ];

  displayedColumnsRadio: Array<any> = [
    {
      displayName: "radiology_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },

    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },

    {
      displayName: "appointment_type",
      key: "appointmentType",
      class: "",
      isSort: true,
    },
    { displayName: "actions", key: "Actions", width: "20%" },
  ];

  displayedCancelledColumnsRadio: Array<any> = [
    {
      displayName: "radiology_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },
    { displayName: "cancel_type", key: "cancelTypeName" },
    { displayName: "cancel_reason", key: "cancelReason" },
  ];

  displayedPenddingColumnsRadio: Array<any> = [
    {
      displayName: "radiology_name",
      key: "providerName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: "date",
    },
    {
      displayName: "status",
      key: "status",
      class: "",
      isSort: true,
      type: "statusstring",
    },
    {
      displayName: "start_date_time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: "time",
    },

    {
      displayName: "end_date_time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: "time",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
      class: "",
      isSort: true,
    },
    //{ displayName: "Actions", key: "Actions", width: "80px", sticky: true },
  ];

  // pendingActionButtons = [
  //   { displayName: "Approve", key: "approve", class: "fa fa-check" },
  //   { displayName: "Cancel", key: "cancel", class: "fa fa-ban" },
  // ];
  actionButtons: Array<any> = [
    {
      displayName: "actions",
      key: "bookingMode-patient",
      class: "Go to waiting room",
    },
  ];
  totalNetAmount!: number;
  monthstatus!: string;
  currentAppointmentId: number = 0;
  currentStafftId: number = 0;
  IstimeExpired = false;
  currentLocationId!: number;
  currentLoginUserId!: number;
  subscription!: Subscription;
  userRoleName!: string;
  currentNotes!: "";
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  public menuPosition = { x: '0px', y: '0px' };
  constructor(
    private commonService: CommonService,
    private clientService: ClientsService,
    public dialogModal: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private paymentService: SchedulerService,
    private datePipe: DatePipe,
    private routeer: Router,
    private dailog: MatDialog,
    private appointmentDailog: MatDialog,
    public router: Router,
    private schedulerService: SchedulerService,
    private notifierService: NotifierService,
    private addNewCallerService: AddNewCallerService,
    private contextMenuService: ContextMenuService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.metaData = new Metadata();
    this.requestData = {
      locationIds: 0,
      staffIds: 0,
      fromDate: "",
      toDate: "",
      bookingModes: "",
      status: "",
      searchText: "",
      pageNumber: 1,
      pageSize: 5,
      sortColumn: "",
      sortOrder: "",
      staffIdss: 0,
    };
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.userData = user;
      console.log(user);
    });

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {
        this.staffId = user.data.id;

        this.route.queryParams.subscribe((params) => {
          this.monthstatus = params["monthstatus"];
        });

        this.paymentFormGroup = this.formBuilder.group({
          appStatus: "",
          rangeStartDate: "",
          rangeEndDate: "",
          appType: "",
          searchPatient: [],
        });
        this.setIntialValues();
        this.selectedType = 3;
        // this.applyFilter();
        // this.getMasterData();
        //this.getPayments(this.requestData);
      }
    });

    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.currentLocationId = user.currentLocationId;
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType;
        }
      }
    );
  }

  setIntialValues() {
    this.requestData.staffIds = this.staffId;
    this.requestData.locationIds = 101;
    this.requestData.status = "Approved,Cancelled,Pending,Invited";
    this.requestData.staffIdss = 0;
    // if (this.monthstatus != null) {
    //   var date = new Date();
    //   this.f.rangeStartDate.setValue(
    //     new Date(date.getFullYear(), date.getMonth() - 1, 1)
    //   );
    //   this.f.rangeEndDate.setValue(
    //     new Date(date.getFullYear(), date.getMonth(), 0)
    //   );
    //   // this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
    //   this.f.appStatus.setValue(this.appointmentMode);
    //   this.f.appType.setValue(this.appointmenType);
    //   this.requestData.fromDate = new Date(
    //     date.getFullYear(),
    //     date.getMonth() - 1,
    //     1
    //   ).toString();
    //   this.requestData.toDate = new Date(
    //     new Date(date.getFullYear(), date.getMonth(), 0)
    //   ).toString();
    // } else {
    //   var date = new Date();
    //   this.f.rangeStartDate.setValue(
    //     new Date(date.getFullYear(), date.getMonth(), 1)
    //   );
    //   this.f.rangeEndDate.setValue(
    //     new Date(date.getFullYear(), date.getMonth() + 1, 0)
    //   );
    //   //this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
    //   this.f.appStatus.setValue(this.appointmentMode);
    //   this.f.appType.setValue(this.appointmenType);

    //   this.requestData.fromDate = new Date(
    //     date.getFullYear(),
    //     date.getMonth(),
    //     1
    //   ).toString();

    //   this.requestData.toDate = new Date(
    //     new Date(date.getFullYear(), date.getMonth() + 1, 0)
    //   ).toString();
    // }

    this.applyFilter();
  }
  get f() {
    return this.paymentFormGroup.controls;
  }

  statusChangeHandler = (status:any) => {
    if (status == "All") {
      this.requestData.status = "Approved,Cancelled,Pending,Invited";
      this.getAppointmentListOfPatients(this.userData.id);
    } else {
      // status = (status == "Pending") ? `${status}` : status;
      this.requestData.status = status;
      this.getAppointmentListOfPatients(this.userData.id);
    }
  };
  exportPaymentPdf(){

  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f["appStatus"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value,
      this.searchWithText,
      this.f["appType"].value
    );
    this.getAppointmentListOfPatients(this.userData.id);
    // this.getPayments();
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["payDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["appDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  onDropDownClose(event:any) {
    console.log(event.value);
    this.selectedType = event.value;
    this.applyFilter();

    //if (!event) this.applyFilter();
    // if (this.selectedType == 1) {
    //   this.getTodayPatientAppointmentList();
    // } else if (this.selectedType == 3 || this.selectedType == 4) {
    //   this.applyFilter();
    // }
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }

  applyFilter() {
    this.setPaginatorModel(
      this.requestData.pageNumber,
      this.requestData.pageSize,
      this.requestData.sortColumn,
      this.requestData.sortOrder,
      this.f["appStatus"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value,
      this.requestData.searchText,
      this.f["appType"].value
      // this.f.searchPatient.value
    );
    // this.getPayments();
    this.getAppointmentListOfPatients(this.userData.id);
    // this.getPayments();
  }

  getPayments() {
    let data = {
      locationIds: 101,
      staffIds: this.staffId,
      fromDate: this.requestData.fromDate,
      toDate: this.requestData.toDate,
      bookingModes: this.requestData.bookingModes,
      status: this.requestData.status,
      searchText: this.requestData.searchText,
      pageNumber: this.requestData.pageNumber,
      pageSize: this.requestData.pageSize,
      sortColumn: this.requestData.sortColumn,
      sortOrder: this.requestData.sortOrder,
      appType: this.requestData.appType,
    };
    console.log(data);

    this.paymentService.getMyAppointment(data).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.metaData = response.meta;
        this.payments = response.data;
        if (this.payments && this.payments.length > 0) {
          //////debugger;
          this.payments = this.payments.map((x) => {
            x.netAmount = "JOD " + x.netAmount;
            return x;
          });
          this.totalNetAmount = this.payments[0].totalNetAmount as number;
        }
      } else {
        this.payments = [];
        this.metaData = new Metadata();
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  }

  getAppointmentListOfPatients(patientId: number) {
    let role = "";
    switch (this.selectedType) {
      case 1:
        role = "Lab";
        break;
      case 2:
        role = "Pharmacy";
        break;
      case 3:
        role = "Provider";
        break;
      case 4:
        role = "Radiology";
        break;
      default:
        role = "Provider";
      // code block
    }
    // if (this.selectedType == 3) {
    //   role = "Provider";
    // } else if (this.selectedType == 4) {
    //   role = "Radiology";
    // }
    var data = {
      appointmentModes: this.requestData.bookingModes,
      appointmentType: this.requestData.appType,
      fromDate: this.requestData.fromDate,
      toDate: this.requestData.toDate,
      patientId: patientId,
      status: this.requestData.status,
      pageNumber: this.requestData.pageNumber,
      pageSize: this.requestData.pageSize,
      organizationId: this.userData.organizationID,
      role: role,
      staffIdss: this.requestData.staffIdss,
    };
    console.log(data);
    var curDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss a");
    this.paymentService
      .getAppointmentListForPatients(data)
      .subscribe((response) => {
        console.log(response.data);
        if (response.statusCode == 200) {
          this.appointmentList = response.data;
          if (this.appointmentList && this.appointmentList.length > 0) {
            this.appointmentList = this.appointmentList.map((x) => {

              if(x.status==="Cancelled"){
                
                x.remainTime = "complete";
              }
              if (x.status == "Completed") {
                x.remainTime = "complete";
             }
              x.showActionButton =
                this.datePipe.transform(
                  new Date(x.endDateTime),
                  "yyyy-MM-dd HH:mm:ss a"
                ) || '' < curDate!
                  ? false
                  : true;
              return x;
            });
          }
          this.metaData = response.meta;
          this.providerdata();
        } else {
          this.appointmentList = response.data;
          this.metaData = new Metadata;
        }
        if (this.metaData != null) {
          this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
        }
      });
  }
  providerdata() {
    this.paymentService.getAllProviders().subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.providerList = response.data;
        if (this.appointmentList.length > 0) {
          // var str="RupeshSingh"
          for (var i = 0; i < this.appointmentList.length; i++) {
            this.providerList.forEach((elment) => {
              if (elment.staffID == this.appointmentList[i].staffId) {
                this.relist = elment;

                //  console.log("susmit",this.relist)
              }
            });
          }
          // let newFormulalist =   this.relist.filter((v,i) =>  this.relist.findIndex(item => item.staffID == v.staffID) === i);
        }
      }
    });
  }
  clearFilters() {
    this.paymentFormGroup.reset();
    //////debugger
    //this.searchPatient= [];
    this.setPaginatorModel(1, 5, "", "", "", "", "", "", "");
    this.requestData.staffIdss = 0;
    this.getAppointmentListOfPatients(this.userData.id);
    this.selected = "All";
  }

  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    appStatus: any,
    rangeStartDate: any,
    rangeEndDate: any,
    searchText: string,
    appType: any
  ) {
    this.requestData.pageNumber = pageNumber;
    this.requestData.pageSize = pageSize;
    this.requestData.sortColumn = sortColumn;
    this.requestData.sortOrder = sortOrder;

    this.requestData.bookingModes =
      appStatus && appStatus.length > 0 ? appStatus.toString() : "";

    this.requestData.fromDate =
      rangeStartDate != null && rangeStartDate != ""
        ? this.datePipe.transform(new Date(rangeStartDate), 'MM/dd/yyyy')
        : "";
    this.requestData.toDate =
      rangeEndDate != null && rangeEndDate != ""
        ? this.datePipe.transform(new Date(rangeEndDate), 'MM/dd/yyyy')
        : "";
    this.requestData.searchText = searchText;
    this.requestData.appType =
      appType && appType.length > 0 ? appType.toString() : "";
    this.requestData.staffIdss =
      this.filteredPatient != null ? this.filteredPatient.staffID : 0;
  }
  patientStatusChangeHandler = (e:any) => {
    this.filteredPatient = e;
    this.requestData.staffIdss =
      this.filteredPatient != null ? this.filteredPatient.staffID : 0;
    this.applyFilter();
  };

  getMasterData() {
    const data = "APPOINTMENTTYPE,APPOINTMENTSTATUS";
    this.paymentService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.appopintmentTypes =
          response.appointmentType != null ? response.appointmentType : [];
        this.appopintmentStatus =
          response.appointmentStatus != null ? response.appointmentStatus : [];
      }
    });
  }

  onTableActionClick(actionObj?: any) {
    console.log("asdasdasd", actionObj);
    this.IstimeExpired = this.CheckTime(actionObj.data);
    this.currentAppointmentId = actionObj.data.patientAppointmentId;
    this.currentStafftId = actionObj.data.currentStafftId;
    if (actionObj.action == "bookingMode-patient") {
      if (actionObj.data.status == "Cancelled") {
      } else if (actionObj.data.status == "Approved") {
        this.routeer.navigate([
          "/web/waiting-room/" + actionObj.data.patientAppointmentId,
        ]);
      } else {
      }
      //   this.routeer.navigate([
      //     "/web/waiting-room/assessment/" + actionObj.data.patientAppointmentId,
      //   ]);
      // } else if (actionObj.action == "approve") {
      //   const appointmentAcceptData = {
      //     title: "Approved",
      //     appointmentId: actionObj.data.patientAppointmentId,
      //     status: "APPROVED",
      //   };
      //   this.createAcceptRejectInvitationAppointmentModel(appointmentAcceptData);
      // } else if (actionObj.action == "cancel") {
      //   const appointmentRejectData = {
      //     title: "Reject",
      //     appointmentId: actionObj.data.patientAppointmentId,
      //     status: "Invitation_Rejected",
      //   };
      //   this.createAcceptRejectInvitationAppointmentModel(appointmentRejectData);
    } else {
      this.onContextMenu(actionObj.action);
      // this.routeer.navigate(["web/client/profile"], {
      //   queryParams: {
      //     id: this.commonService.encryptValue(actionObj.data.patientID, true),
      //   },
      // });

      // this.routeer.navigate(["web/client/doctor/" + actionObj.data.staffId]);
    }
    if (actionObj.data.staffId != undefined) {
      this.currentStafftId = actionObj.data.staffId;
    }
  }

  createAcceptRejectInvitationAppointmentModel(appointmentData: any) {
    let dbModal;
    dbModal = this.dailog.open(AcceptRejectAppointmentInvitationComponent, {
      hasBackdrop: true,
      data: appointmentData,
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.getPayments();
      }
    });
  }

  documentTypeHandler = (e:any) => {
    if (e !== "") {
      this.filterMasterSearchPatients = this.providerList.filter(
        (doc) => doc.name.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterSearchPatients = [];
      this.filteredPatient = null;
      this.requestData.patientIds = 0;
      this.applyFilter();
    }
  };

  onTabChanged = (event: any) => {
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
    }
    // if (event.index == 0) {
    //   this.getLabAppointmentList("Invitation_Accepted")
    // }  else if (event.index == 1) {
    //   this.getLabAppointmentList("Invitation_Rejected")
    // } else if (event.index == 2) {
    //   this.getLabAppointmentList("Invited")
    // }
  };

  getTodayPatientAppointmentList = () => {
    const filter = {
      patientId: this.userData.id,
      status: "Invitation_Accepted",
      fromDate: format(new Date(), "yyyy-MM-dd"),
      toDate: format(new Date(), "yyyy-MM-dd"),
    };
    this.clientService
      .GetFilterLabAppointmentByPatientId(filter)
      .subscribe((res) => {
        this.todaysAppointmentList = res.data;
        this.todaysAppointmentList = this.todaysAppointmentList.map((x) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
      });
  };
  // onDropDownClosedata(event: boolean) {
  //   if (!event)
  //     this.applyFilter();
  // }

  getAllPatientAppointmentList = () => {
    var today = new Date();
    var tomorrowDate = new Date(today.setDate(today.getDate() + 1));
    const filter = {
      patientId: this.userData.id,
      status: "Invitation_Accepted",
      fromDate: format(new Date(tomorrowDate), "yyyy-MM-dd"),
      toDate: format(addDays(new Date(), 720), "yyyy-MM-dd"),
    };
    this.clientService
      .GetFilterLabAppointmentByPatientId(filter)
      .subscribe((res) => {
        this.UpcomingAppointmentList = res.data;
        this.UpcomingAppointmentList = this.UpcomingAppointmentList.map((x) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
      });
  };

  getCancelledPatientAppointmentList = () => {
    const filter:any = {
      patientId: this.userData.id,
      status: "Invitation_Rejected",
      fromDate: null,
      toDate: null,
    };
    this.clientService
      .GetFilterLabAppointmentByPatientId(filter)
      .subscribe((res) => {
        this.cancelAppointmentList = res.data;
        this.cancelAppointmentList = this.cancelAppointmentList.map((x) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
      });
  };

  getPastPatientAppointmentList = () => {
    var today = new Date();
    var yesterday = new Date(today.setDate(today.getDate() - 1));

    const filter = {
      patientId: this.userData.id,
      status: "Invitation_Accepted",
      fromDate: format(addDays(new Date(today), -720), "yyyy-MM-dd"),
      toDate: format(new Date(yesterday), "yyyy-MM-dd"),
    };
    this.clientService
      .GetFilterLabAppointmentByPatientId(filter)
      .subscribe((res) => {
        this.pastAppointmentList = res.data;
        this.pastAppointmentList = this.pastAppointmentList.map((x) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
      });
  };

  viewAppointmentDetails = (ele: any) => {
    debugger
    console.log("Sagar",ele);
    const modalPopup = this.dialogModal.open(
      ViewLabAppointmentPatientComponent,
      {
        hasBackdrop: true,
        data: ele,
        width: "80%",
      }
    );
  };
  CancelAppointment = (ele: any) => {
    const modalPopup = this.dialogModal.open(
      CancelLabAppointmentPatientComponent,
      {
        hasBackdrop: true,
        data: ele.patientAppointmentId,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "SAVE") {
        this.onTabChanged({ index: this.selectedIndex });
      }
    });
  };

  tabChangehandler = (e:any) => {
    this.selectedTab = e;
    if (e == 0) {
      this.payments = [];
      this.requestData.status = "Approved";
      this.getAppointmentListOfPatients(this.userData.id);
      // this.getPayments();
    } else if (e == 1) {
      this.payments = [];
      this.requestData.status = "Cancelled";
      //  this.getPayments();
      this.getAppointmentListOfPatients(this.userData.id);
    } else {
      this.payments = [];
      this.requestData.status = "Pending";
      // this.getPayments();
      this.getAppointmentListOfPatients(this.userData.id);
    }
  };

  tabChangehandlerforradiology = (e:any) => {
    this.selectedTab = e;
    if (e == 0) {
      this.payments = [];
      this.requestData.status = "Approved";
      this.getAppointmentListOfPatients(this.userData.id);
    } else if (e == 1) {
      this.payments = [];
      this.requestData.status = "Cancelled";
      this.getAppointmentListOfPatients(this.userData.id);
    } else {
      this.payments = [];
      this.requestData.status = "Pending";
      this.getAppointmentListOfPatients(this.userData.id);
    }
  };

  onModeChange(mode: any) {
    //this.confirmation.mode = mode;
    //this.confirmation.mode = mode;
    this.f["appStatus"].setValue(mode);
    this.applyFilter();
  }

  onAppointmentTypeChange(mode: any) {
    //this.confirmation.mode = mode;
    //this.confirmation.mode = mode;
    this.f["appType"].setValue(mode);
    this.applyFilter();
  }

  // getLabAppointmentList = (status: any) => {
  //   this.clientService
  //     .GetFilterLabAppointmentByPatientId(this.userData.id, status, null, null)
  //     .subscribe((res) => {
  //       if (status == "Invitation_Accepted") {
  //         this.approvedAppointmentDetails = res.data;
  //         this.approvedAppointmentDetails[0].startDateTime =
  //           this.approvedAppointmentDetails[0].startDateTime.replace("T", " ");
  //         this.approvedAppointmentDetails[0].endDateTime =
  //           this.approvedAppointmentDetails[0].endDateTime.replace("T", " ");
  //       } else if (status == "Invitation_Rejected") {
  //         this.cancelledAppointmentDetails = res.data;
  //         this.cancelledAppointmentDetails[0].startDateTime =
  //           this.cancelledAppointmentDetails[0].startDateTime.replace("T", " ");
  //         this.cancelledAppointmentDetails[0].endDateTime =
  //           this.cancelledAppointmentDetails[0].endDateTime.replace("T", " ");
  //       } else if (status == "Invited") {
  //         this.penddingAppointmentDetails = res.data;
  //         this.penddingAppointmentDetails[0].startDateTime =
  //           this.penddingAppointmentDetails[0].startDateTime.replace("T", " ");
  //         this.penddingAppointmentDetails[0].endDateTime =
  //           this.penddingAppointmentDetails[0].endDateTime.replace("T", " ");
  //       }
  //     });
  // };

  async addEvent(event: any, type: any): Promise<void> {
    let id = this.currentAppointmentId;
    var appStaff = this.currentStafftId;
    // if (type) {
    //   this.clientModel = await this.getClientInfo(this.currentPatientId);
    // }
    switch (type) {
      case "2":
        this.viewAppointment(this.currentAppointmentId);
        break;
      case "3":
        this.openDialogRecheduleAppointment(
          appStaff,
          appStaff.toString(),
          false
        );
        break;
      case "4":
        this.schedulerService
          .checkfollowupAppointment(id)
          .subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.createCancelAppointmentModel(id);
            } else {
              this.notifierService.notify("error", response.message);
            }
          });
        break;
      // case "5":
      //   const modalPopup = this.dailog.open(SetReminderComponent, {
      //     hasBackdrop: true,
      //     data: { appointmentId: this.currentAppointmentId },
      //   });

      //   modalPopup.afterClosed().subscribe((result) => {
      //     if (result === "save") {
      //     }
      //   });
      //   break;

      // case "6":
      //   if ((this.userRoleName || "").toUpperCase() == "ADMIN") {
      //     // this.router.navigate(["/web/manage-users/users"]);
      //     this.router.navigate(["/web/availability"]);
      //   } else if (
      //     (this.userRoleName || "").toUpperCase() == "PROVIDER" ||
      //     (this.userRoleName || "").toUpperCase() == "STAFF"
      //   ) {
      //     //localStorage.setItem("tabToLoad", "User Info");
      //     // this.router.navigate(["/web/manage-users/user"], {
      //     //   queryParams: {
      //     //     id: this.commonService.encryptValue(this.currentLoginUserId),
      //     //   },
      //     // });
      //     this.router.navigate(["/web/availability"]);
      //   }
      //   break;
      case "7":
        this.addNewCallerService
          .getOTSessionByAppointmentId(this.currentAppointmentId)
          .subscribe((response) => {
            if (response.statusCode == 200) {
              this.createAddPersonModel(
                this.currentAppointmentId,
                response.data.id
              );
            }
          });
        break;
      case "8":
        console.log("profiler--", event);
        this.router.navigate(["web/client/doctor/" + this.currentStafftId]);
    }
  }

  viewAppointment(appointmentId: number) {
    const modalPopup = this.appointmentDailog.open(AppointmentViewComponent, {
      hasBackdrop: true,
      data: appointmentId,
      width: "80%",
    });
  }

  CheckIstimeExpired = (item: any): boolean => {
    return this.IstimeExpired;
  };

  CheckTime(value:any): boolean {
    var curDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss a");
    var selDate = this.datePipe.transform(
      new Date(value.endDateTime),
      "yyyy-MM-dd HH:mm:ss a"
    );
    if (selDate! < curDate!) {
      return false;
    } else {
      return true;
    }
  }

  openDialogRecheduleAppointment(
    staffId: number,
    providerId: string,
    type: boolean
  ) {
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
          patientId: type ? 0 : this.userData.id,
          currentNotes: type ? "" : this.currentNotes,
        },
      }
    );
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "booked") {
        }
      } else {
        this.getAppointmentListOfPatients(this.userData.id);
      }
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
      if (result === "SAVE")
        this.getAppointmentListOfPatients(this.userData.id);
    });
  }

  createAddPersonModel(appointmentId: number, sessionId: number) {
    const modalPopup = this.appointmentDailog.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "save")
        this.getAppointmentListOfPatients(this.userData.id);
    });
  }

  onContextMenu($event: MouseEvent) {
    const target = $event.target as Element | null;
  if (target) {
    // this.contextMenuService.show.next({
    //   anchorElement: target,
    //   contextMenu: this.contextMenu, // Assuming this.contextMenu is defined elsewhere
    //   event: $event,
    //   item: 5,
    // });
    this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';
    this.menuTrigger.openMenu();

  }


    $event.preventDefault();
    $event.stopPropagation();
  }
}
