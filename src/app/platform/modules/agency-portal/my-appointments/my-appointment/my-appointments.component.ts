import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap, Params, Router } from "@angular/router";
import { CommonService } from "../../../core/services";
import { Metadata } from "../../../client-portal/client-profile.model";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { SchedulerService } from "../../../scheduling/scheduler/scheduler.service";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { AcceptRejectAppointmentInvitationComponent } from "src/app/shared/accept-reject-appointment-invitation/accept-reject-appointment-invitation.component";
import { AppointmentActionComponent } from "../../appointment-action/appointment-action.component";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { AppointmentReschedulingDialogComponent } from "src/app/shared/appointment-rescheduling-dialog/appointment-rescheduling-dialog.component";
import { Subscription } from "rxjs";
import { AppointmentGraphService } from "src/app/shared/appointment-graph/appointment-graph.service";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { format } from "date-fns";
import { AppointmentViewComponent } from "../../../scheduling/appointment-view/appointment-view.component";
import { CancelAppointmentDialogComponent } from "src/app/shared/cancel-appointment-dialog/cancel-appointment-dialog.component";
import { SetReminderComponent } from "src/app/shared/set-reminder/set-reminder.component";
import { AddNewCallerService } from "src/app/shared/add-new-caller/add-new-caller.service";
import { AddNewCallerComponent } from "src/app/shared/add-new-caller/add-new-caller.component";
import { ContextMenuComponent, ContextMenuService } from "ngx-contextmenu";
import { TranslateService } from "@ngx-translate/core";
import { MatMenuTrigger } from "@angular/material/menu";


@Component({
  selector: "app-my-appointments",
  templateUrl: "./my-appointments.component.html",
  styleUrls: ["./my-appointments.component.css"],
})
export class MyAppointmentsComponent implements OnInit {
  contextMenu!: ContextMenuComponent;
  staffId: any;
  selectedTab = 0;
  requestData: any;
  searchWithText: string = "";
  selected = "All";
  appointmenType: any = ["New", "Follow-up"];
  appointmentMode: any = ["Online", "Face to Face", "Home Visit"];
  confirmation: any = { type: "New", mode: "Online" };
  appointmentStatus: any = [
    "All",
    "Approved",
    "Cancelled",
    "Completed",
    "Pending",
  ];
  showLoader: boolean = false;
  clientModel: any;
  currentPatientId: number = 0;
  currentLocationId!: number;
  currentLoginUserId!: number;
  subscription!: Subscription;
  currentAppointmentId: number = 0;
  allAppointmentsList: Array<any> = [];
  allAppointmentsMeta!: Metadata;
  userRoleName!: string;
  IstimeExpired = false;
  filterString:any;
  filterMasterSearchPatients: any = [];
  patientList: any[] = [];
  filteredPatient:any;
  isCalendarIconFilter: boolean = false;
  patientId: any = null;
  public menuPosition = { x: '0px', y: '0px' };

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: SchedulerService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private routeer: Router,
    private dailog: MatDialog,
    private clientService: ClientsService,
    private appointmentGraphService: AppointmentGraphService,
    private router: Router,
    private addNewCallerService: AddNewCallerService,
    private contextMenuService: ContextMenuService,
    private translate:TranslateService
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
      patientIds: 0
    };
    // this.filterModel = {
    //   staffIds: 0,
    //   fromDate: "",
    //   toDate: "",
    //   locationIds: 0,
    // };
    this.allAppointmentsMeta;
  }

  // constructor(private activatedRoute: ActivatedRoute,
  //   private cfr: ComponentFactoryResolver,
  //    private myAppointmentsService: MyAppointmentsService,private commonService:CommonService) { }

  metaData: Metadata;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  

  displayedColumns: Array<any> = [
    {
      displayName: "patient_name",
      key: "patientName",
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
      key: "bookingMode",
      class: "",
      isSort: true,
    },

    {
      displayName: "appointment_type",
      key: "bookingType",
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
      key: "statusName",
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
    // { displayName: "Cancel Type", key: "cancelType" },
    { displayName:"messages", key: "cancelReason" },
    { displayName: "actions", key: "Actions" },
  ];
  displayedCancelledColumns: Array<any> = [
    {
      displayName: "patient_name",
      key: "patientName",
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
      key: "statusName",
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
      key: "bookingMode",
      class: "",
      isSort: true,
    },
    { displayName: "cancel_type", key: "cancelType" },
    { displayName: "cancel_reason", key: "cancelReason" },
  ];
  displayedPenddingColumns: Array<any> = [
    {
      displayName: "patient_name",
      key: "patientName",
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
      key: "statusName",
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
      key: "bookingMode",
      class: "",
      isSort: true,
    },
    //{ displayName: "Actions", key: "Actions", width: "80px", sticky: true },
  ];
  actionButtons: Array<any> = [
    {
      displayName: "Action",
      key: "bookingMode",
      class: "fa fa-wpforms fa-custom",
    },
    {
      displayName: "View Document",
      key: "viewDocument",
      type: "document",
      class: "fa fa-eye",
    },
  ];
  totalNetAmount!: number;
  monthstatus!: string;



  ngOnInit() {
    this.commonService.loginUser.subscribe(async (user: LoginUser) => {
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
        this.route.queryParams.subscribe((params: Params) => {
          if (params["cId"]) {
            this.isCalendarIconFilter = true;
            this.patientId = this.commonService.encryptValue(
              params["cId"],
              false
            );
          }
        });

        //Calendar Icon Filter in calendar
        if (this.isCalendarIconFilter) {
          this.filteredPatient = { patientId: this.patientId };
          this.filterMasterSearchPatients = this.patientList.filter(
            (x) => x.patientId == this.patientId
          );
          this.requestData.patientIds = this.patientId;
          this.paymentFormGroup.patchValue({
            searchPatient: this.filterMasterSearchPatients[0].nameWithMRN,
          });
        }

        
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
            this.setIntialValues();
        }
      }
    );
    // this.getPatientList();
  }

  statusChangeHandler = (e:any) => {
    console.log(e);
    this.requestData.status = e;
    this.getPayments();
  };
  setIntialValues() {
    this.requestData.staffIds = this.staffId;
    this.requestData.locationIds = 101;
    this.requestData.status = "All";
    this.requestData.patientIds = 0;
    //////debugger;
    if (this.monthstatus != null) {
      var date = new Date();
      this.f["rangeStartDate"].setValue(
        new Date(date.getFullYear(), date.getMonth() - 1, 1)
      );
      this.f["rangeEndDate"].setValue(
        new Date(date.getFullYear(), date.getMonth(), 0)
      );
      // this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
      // this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
      this.f["appStatus"].setValue(this.appointmentMode);
      this.f["appType"].setValue(this.appointmenType);
      this.requestData.fromDate = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      ).toString();
      this.requestData.toDate = new Date(
        new Date(date.getFullYear(), date.getMonth(), 0)
      ).toString();
    } else {
      var date = new Date();
      // this.f.rangeStartDate.setValue(
      //   new Date(date.getFullYear(), date.getMonth(), 1)
      // );
      // this.f.rangeEndDate.setValue(
      //   new Date(date.getFullYear(), date.getMonth() + 1, 0)
      // );
      //this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
      // this.f.rangeStartDate.setValue(
      //   new Date(date.getFullYear(), date.getMonth(), 1)
      // );
      // this.f.rangeEndDate.setValue(
      //   new Date(date.getFullYear(), date.getMonth() + 1, 0)
      // );
      //this.f.appStatus.setValue(["Home Visit", "Face to Face", "Online"]);
      this.f["appStatus"].setValue(this.appointmentMode);
      this.f["appType"].setValue(this.appointmenType);

      this.requestData.fromDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toString();

      this.requestData.toDate = new Date(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
      ).toString();
    }

    //////debugger;
    this.applyFilter();
  }
  get f() {
    return this.paymentFormGroup.controls;
  }

  clearSearch() {
    this.filterString = '';
    this.documentTypeHandler('');
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
    this.getPayments();
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["payDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["appDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  onDropDownClose(event: boolean) {
    if (!event) this.applyFilter();
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
    );

    this.getPayments();
  }

  getPayments() {
    this.showLoader = true;
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
      patientIds: this.requestData.patientIds,
    };
    console.log(data);
    var curDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss a");

    this.paymentService.getMyAppointment(data).subscribe((response: any) => {
      if (response != null && response.statusCode == 200) {
        this.showLoader = false;
       /// debugger
        this.metaData = response.meta;
        this.payments = response.data;
        if (this.payments && this.payments.length > 0) {
          //////debugger;
          this.payments = this.payments.map((x) => {
            x.netAmount = "JOD " + x.netAmount;
            if (x.statusName == "Invitation_Rejected") {
              x.statusName = "Cancelled";
              x.remainTime = "complete";
            }
            if (x.statusName == "Invited") {
              x.statusName = "Pending";
            }
            x.showActionButton =
            (this.datePipe.transform(new Date(x.endDateTime), "yyyy-MM-dd HH:mm:ss a") ?? '') < curDate!
              ? false
              : true;
            x.showActionButtonforCompleted =
              x.statusName == "Completed" ? true : false;

            if (x.statusName == "Completed") {
                 x.remainTime = "complete";
              }
            console.log(x.remainTime);
            return x;
          });
          this.totalNetAmount = this.payments[0].totalNetAmount as number;
          this.getPatientList();
        }
        
      } else {
        this.payments = [];
        this.metaData = new Metadata();
        this.getPatientList();
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];

     
    });
   
  }
  clearFilters() {
    this.selected = "All";
    this.filterString="";
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
      patientIds: 0,
    };
    this.paymentFormGroup.reset();
    //////debugger
    this.setPaginatorModel(1, 5, "", "", "", "", "", "", "");
    this.isCalendarIconFilter = false;
    this.patientId = null;
    this.requestData.patientIds = 0;
    this.getPayments();
    this.router.navigate(["/web/my-appointments"]);
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
    this.requestData.patientIds =
      this.filteredPatient != null ? this.filteredPatient.patientId : 0;
  }

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

  exportPaymentPdf() {
    //  if (this.filterModel.PatientName == null){this.filterModel.PatientName=""}
    //      this.paymentService.exportPaymentPdf(this.filterModel)
    //        .subscribe((response: any) => {
    //          this.paymentService.downLoadFile(response, 'application/pdf', `Payment Report`)
    //        });
  }

  onTableActionClick(actionObj?: any) {
    debugger
    let dbModal;
    this.IstimeExpired = this.CheckTime(actionObj.data);
    this.currentAppointmentId = actionObj.data.patientAppointmentId;
    this.currentPatientId = actionObj.data.patientID;
    if (actionObj.action == "bookingMode") {
      if (actionObj.data.statusName == "Approved") {
        this.routeer.navigate([
          "/web/waiting-room/assessment/" + actionObj.data.patientAppointmentId,
        ]);
      } else if (actionObj.data.statusName == "Pending") {
        dbModal = this.dailog.open(AppointmentActionComponent, {
          hasBackdrop: true,
          data: actionObj.data,
        });
        dbModal.afterClosed().subscribe((result: string) => {
          if (result == "approve") {
            const appointmentAcceptData = {
              title: "Approved",
              appointmentId: actionObj.data.patientAppointmentId,
              status: "APPROVED",
            };
            this.createAcceptRejectInvitationAppointmentModel(
              appointmentAcceptData
            );
          } else if (result == "cancel") {
            const appointmentRejectData = {
              title: "Reject",
              appointmentId: actionObj.data.patientAppointmentId,
              status: "Invitation_Rejected",
            };
            this.createAcceptRejectInvitationAppointmentModel(
              appointmentRejectData
            );
          } else {
            console.log("close");
          }
        });
      } else if (actionObj.data.statusName == "Invited") {
        dbModal = this.dailog.open(AppointmentActionComponent, {
          hasBackdrop: true,
          data: actionObj.data,
        });
        dbModal.afterClosed().subscribe((result: string) => {
          if (result == "approve") {
            const appointmentAcceptData = {
              title: "Approved",
              appointmentId: actionObj.data.patientAppointmentId,
              status: "APPROVED",
            };
            this.createAcceptRejectInvitationAppointmentModel(
              appointmentAcceptData
            );
          } else if (result == "cancel") {
            const appointmentRejectData = {
              title: "Reject",
              appointmentId: actionObj.data.patientAppointmentId,
              status: "Invitation_Rejected",
            };
            this.createAcceptRejectInvitationAppointmentModel(
              appointmentRejectData
            );
          } else {
            console.log("close");
          }
        });
      } else if (actionObj.data.statusName == "Invitation_Rejected") {
        console.log("close");
      } else if (actionObj.data.statusName == "Completed") {
        this.router.navigate(["/web/encounter/non-billable-soap"], {
          queryParams: {
            apptId: actionObj.data.patientAppointmentId,
            encId: actionObj.data.patientEncounterId,
          },
        });
      } else {
        console.log("close");
      }
    } else if (actionObj.action == "viewDocument") {
      console.log(actionObj.data.patientID);
      this.router.navigate(["web/client/documents"], {
        queryParams: {
          id: this.commonService.encryptValue(actionObj.data.patientID, true),
        },
      });
    } else {
      this.onContextMenu(actionObj.action);
      // this.routeer.navigate(["web/client/profile"], {
      //   queryParams: {
      //     id: this.commonService.encryptValue(actionObj.data.patientID, true),
      //   },
      // });
    }

    // if (actionObj.action == "bookingMode") {
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
    // } else {
    //   this.routeer.navigate(["web/client/profile"], {
    //     queryParams: {
    //       id: this.commonService.encryptValue(actionObj.data.patientID, true),
    //     },
    //   });
    // }
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
  tabChangehandler = (e:any) => {
    this.selectedTab = e;
    if (e == 0) {
      this.payments = [];
      this.requestData.status = "All";
      this.getPayments();
    } else if (e == 1) {
      this.payments = [];
      this.requestData.status = "Cancelled";
      this.getPayments();
    } else {
      this.payments = [];
      this.requestData.status = "Pending";
      this.getPayments();
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

  async addEvent(event: any, type: any): Promise<void> {
    if (type) {
      this.clientModel = await this.getClientInfo(this.currentPatientId);
    }
    switch (type) {
      case "1":
        this.openDialogBookAppointment(
          this.currentLoginUserId,
          this.currentLoginUserId.toString(),
          true
        );
        break;
      case "2":
        this.createViewAppointmentModel(this.currentAppointmentId);
        break;
      case "3":
        this.openDialogBookAppointment(
          this.currentLoginUserId,
          this.currentLoginUserId.toString(),
          false
        );
        break;
      case "4":
        this.createCancelAppointmentModel(this.currentAppointmentId);
        break;
      case "5":
        const modalPopup = this.dailog.open(SetReminderComponent, {
          hasBackdrop: true,
          data: { appointmentId: this.currentAppointmentId },
        });

        modalPopup.afterClosed().subscribe((result) => {
          if (result === "save") {
          }
        });
        break;

      case "6":
        if ((this.userRoleName || "").toUpperCase() == "ADMIN") {
          // this.router.navigate(["/web/manage-users/users"]);
          this.router.navigate(["/web/availability"]);
        } else if (
          (this.userRoleName || "").toUpperCase() == "PROVIDER" ||
          (this.userRoleName || "").toUpperCase() == "STAFF"
        ) {
          //localStorage.setItem("tabToLoad", "User Info");
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
        this.router.navigate(["web/client/profile"], {
          queryParams: {
            id:
              event != null
                ? this.commonService.encryptValue(this.currentPatientId, true)
                : null,
          },
        });
    }
  }

  getClientInfo(patientId:any): Promise<any> {
    return this.clientService.getClientById(patientId).toPromise();
    // .subscribe((response: any) => {
    //   if (response != null) {
    //     this.clientModel = response.data;
    //   }
    // });
  }

  openDialogBookAppointment(
    staffId: number,
    providerId: string,
    type: boolean
  ) {
    let dbModal;
    dbModal = this.dailog.open(AppointmentReschedulingDialogComponent, {
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
        this.getAllPatientAppointmentList();
      }
    });
  }

  getAllPatientAppointmentList(pageNumber: number = 1, pageSize: number = 5) {
    const filters = {
      pageNumber,
      pageSize,
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
              console.log(this.allAppointmentsList);
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
          this.allAppointmentsMeta = response.meta;
        }
        this.allAppointmentsMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  createViewAppointmentModel(appointmentId: number) {
    const modalPopup = this.dailog.open(AppointmentViewComponent, {
      hasBackdrop: true,
      minWidth: "80%",
      maxWidth: "80%",
      data: appointmentId,
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(["web/client/profile"], {
          queryParams: {
            id: this.commonService.encryptValue(result, true),
          },
        });
        console.log(result);
      }
    });
  }

  createCancelAppointmentModel(appointmentId: number) {
    const modalPopup = this.dailog.open(CancelAppointmentDialogComponent, {
      hasBackdrop: true,
      data: appointmentId,
    });

    modalPopup.afterClosed().subscribe((result) => {});
  }

  createAddPersonModel(appointmentId: number, sessionId: number) {
    const modalPopup = this.dailog.open(AddNewCallerComponent, {
      hasBackdrop: true,
      data: { appointmentId: appointmentId, sessionId: sessionId },
    });
  }

//   onContextMenu($event: MouseEvent) {
//  //   debugger
//     this.contextMenuService.show.next({
//       anchorElement: $event.target,
//       // Optional - if unspecified, all context menu components will open
//       contextMenu: this.contextMenu,
//       event: <any>$event,
//       item: 5,
//     });

//     $event.preventDefault();
//     $event.stopPropagation();
//   }
onContextMenu($event: MouseEvent) {
  const target = $event.target as Element | null;
  if (target) {
    // this.contextMenuService.show.next({
    //   anchorElement: target,
    //   contextMenu: this.contextMenu, 
    //   event: $event,
    //   item: 5,
    // });
    this.menuPosition.x = $event.clientX + 'px';
        this.menuPosition.y = $event.clientY + 'px';
    this.menuTrigger.menuData={ item: $event };
    this.menuTrigger.openMenu();
  }
}
  CheckIstimeExpired = (item: any): boolean => {
    debugger
    return this.IstimeExpired;
  };

  CheckTime(value:any): boolean {
    debugger
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
  getPatientList(): any{
     this.clientService.getAllPatients().subscribe((res)=>{
      if(res.data &&res.statusCode ==200){
        let patientList: any =res;
        this.patientList = patientList.data;
      } 
    })
  }

  documentTypeHandler = (e:any) => {
    if (e !== "") {
      this.filterMasterSearchPatients = this.patientList.filter(
        (doc) => doc.nameWithMRN.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterSearchPatients = [];
      this.filteredPatient = null;
      this.requestData.patientIds = 0;
      this.applyFilter();
    }
  };

  patientStatusChangeHandler = (e:any) => {
    this.filteredPatient = e;
    this.requestData.patientIds =
      this.filteredPatient != null ? this.filteredPatient.patientId : 0;
    this.applyFilter();
  };
  
}
