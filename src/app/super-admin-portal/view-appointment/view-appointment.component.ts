import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';
import { LoginUser } from 'src/app/platform/modules/core/modals/loginUser.modal';
import { PaymentFilterModel, ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { Metadata } from 'src/app/platform/modules/client-portal/client-profile.model';
import { SupeAdminDataService } from '../supe-admin-data.service';
import { filter, switchMap } from 'rxjs/operators';
import { MyAppointmentsService } from '../my-appointments/my-appointments.service';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css']
})
export class ViewAppointmentComponent implements OnInit {
  staffId: any;
  providerList: any[] = [];
  patientList: any[] = [];
  appointmentMode: any = ["Online", "Face to Face", "Home Visit"];
  appointmentStatus: any = ["All", "Approved", "Cancelled", "Completed", "Pending"];
  selected = "All"
  selectedMode = ""
  isSpecificProvider: boolean = false;
  userid: number|undefined;
  staffProfile: any;
  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private paymentService: MyAppointmentsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private routeer: Router,
    private superadmindata: SupeAdminDataService,

  ) {
    this.filterModel = {
      staffIds: "",
      fromDate: "",
      toDate: "",
      locationIds: "",
      patientIds: "",
      pageSize: 10,
      pageNumber: 1
    };

  }

  // constructor(private activatedRoute: ActivatedRoute,
  //   private cfr: ComponentFactoryResolver,
  //    private myAppointmentsService: MyAppointmentsService,private commonService:CommonService) { }

  metaData: any;
  filterModel: any;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];
  displayedColumns: Array<any> = [
    {
      displayName: "Patient Name",
      key: "patientName",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt. Date",
      key: "appointmentDateTime",
      class: "",
      isSort: true,
      type: 'date'

    },

    {
      displayName: "Start Date Time",
      key: "startDateTime",
      isSort: true,
      class: "",
      type: 'time'
    },

    {
      displayName: "End Date Time",
      key: "endDateTime",
      isSort: true,
      class: "",
      type: 'time'
    },
    {
      displayName: "Booking Mode",
      key: "bookingMode",
      class: ""
    },
    // { displayName: 'Provider Name', key: 'staffName' },
    {
      displayName: "Status",
      key: "statusName",
      class: "",
      isSort: true,
      type: 'statusstring'
    },
    // {
    //   displayName: "Symptom/Ailment",
    //   key: "notes",
    //   class: "",
    //   isSort: true
    // },
    {
      displayName: "Payment Mode",
      key: "paymentMode",
      class: ""
    },
    {
      displayName: "Transaction ID",
      key: "paymentToken",
      class: ""
    },
    {
      displayName: "Refund ID",
      key: "refundToken",
      class: ""
    },
    { displayName: "Cancel Reason", key: "cancelReason" },
  ];
  actionButtons: Array<any> = [

  ];
  totalNetAmount: number | undefined;
  monthstatus: string | undefined;

  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      patients: "",
      appStatus: "",
      providers: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    debugger
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap(() => this.route.queryParams)
      )
      .subscribe(() => {
        this.checkQueryParams();
      });

    // Call once during initialization
    this.checkQueryParams();
    this.setIntialValues();
      

    // this.getMasterData();
    // this.getPayments(this.filterModel);

    this.paymentService
      .getAllProviders()
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.providerList = response.data;
        }
      });

    this.paymentService
      .getAllPatients()
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.patientList = response.data;
        }
      });
    this.ViewTypeOfData();
    this.getStaffProfileData();
  }

  private checkQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['staffId']) {
        this.staffId = +params['staffId'];
        this.userid= +params['userId'];
        this.isSpecificProvider = true;
      } else {
        this.isSpecificProvider = false;
        this.staffId = undefined;
        this.userid=undefined;
        this.setIntialValues();
      }
    });
  }
  setIntialValues() {
    // this.filterModel.staffIds = this.staffId;
    // this.filterModel.locationIds = 101;
    //////debugger;
    if (this.monthstatus != null) {
      var date = new Date();
      
      
      this.f['rangeStartDate'].setValue(new Date(date.getFullYear(), date.getMonth() - 1, 1));
      this.f['rangeEndDate'].setValue(new Date(date.getFullYear(), date.getMonth(), 0));
      this.filterModel.fromDate = new Date(date.getFullYear(), date.getMonth() - 1, 1).toString();
      this.filterModel.toDate = new Date(new Date(date.getFullYear(), date.getMonth(), 0)).toString();
    }
    else {
      var date = new Date();
      this.f['rangeStartDate'].setValue(new Date(date.getFullYear(), date.getMonth(), 1));
      this.f['rangeEndDate'].setValue(new Date(date.getFullYear(), date.getMonth() + 1, 0));
      this.filterModel.fromDate = new Date(date.getFullYear(), date.getMonth(), 1).toString();
      this.filterModel.toDate = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0)).toString();
    }

    //////debugger;
    this.applyFilter();

  }
  get f() {
    return this.paymentFormGroup.controls;
  }
  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          this.staffProfile = response.data;
        }
        else{
          this.getStaffProfileData();
        }
      });
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f['name'].value,
      this.f['payDate'].value,
      this.f['patients'].value,
      this.f['appStatus'].value,
      this.f['providers'].value,
      this.f['rangeStartDate'].value,
      this.f['rangeEndDate'].value
    );
    this.getPayments(this.filterModel);
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.f['payDate'].setValue(new Date(event.value));
    this.applyFilter();
    }
    
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.f['appDate'].setValue(new Date(event.value));
      this.applyFilter();
    }
  }
  onDropDownClose(event: boolean) {
    if (!event)
      this.applyFilter();
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date> | any) {
    if (event.value) {
    this.f['rangeStartDate'].setValue(new Date(event.value));
    this.applyFilter();
    }
    
  }

  applyEndDateFilter(event: MatDatepickerInputEvent<Date> | any) {
    if (event.value) {
    this.f['rangeEndDate'].setValue(new Date(event.value));
    this.applyFilter();
    }
  }
  statusChangeHandler = (e:any) => {
    console.log(e);
    this.filterModel.status = e;
    this.applyFilter();

  }

  applyFilter() {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f['name'].value,
      this.f['payDate'].value,
      this.f['patients'].value != null ? this.f['patients'].value : "",
      this.f['appStatus'].value,
      this.f['providers'].value != null ? this.f['providers'].value : "",
      this.f['rangeStartDate'].value,
      this.f['rangeEndDate'].value,
    );

    this.getPayments(this.filterModel);
  }

  getPayments(filterModel: PaymentFilterModel) {
    debugger
    // this.route.queryParams.subscribe((params) => {
    //   if (params['staffId']) {
    //     this.staffId = +params['staffId'];
    //     this.isSpecificProvider = true;
    //   } else {
    //     this.isSpecificProvider = false;
    //   }
    // });

    if (this.isSpecificProvider) {
      this.filterModel.staffIds = this.staffId;
    }

    debugger
    this.paymentService
      .getListData(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.metaData = response.meta;
          this.payments = response.data;
          if (this.payments && this.payments.length > 0) {
            //////debugger;
            this.payments = this.payments.map(x => { x.netAmount = "INR " + x.netAmount; return x });
            this.totalNetAmount = this.payments[0].totalNetAmount as number;
          }
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onModeChange(mode: any) {
    //this.confirmation.mode = mode;
    this.f['appStatus'].setValue(mode);
    this.applyFilter();
  }
  clearFilters() {
    this.paymentFormGroup.reset();
    this.selected = "All";
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.status = "All",
      "",
      "",
      "",
      "",
      "",
      "",


    );
    this.getPayments(this.filterModel);
  }


  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    name: string,
    payDate: any,
    patients: any,
    appStatus: any,
    providers: any,
    rangeStartDate: any,
    rangeEndDate: any

  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    // this.filterModel.sortOrder = sortOrder;
    // this.filterModel.sortColumn = sortColumn;
    this.filterModel.bookingModes = appStatus && appStatus.length > 0 ? appStatus.toString() : "";



    this.filterModel.fromDate = rangeStartDate != null && rangeStartDate != ""
      ? this.datePipe.transform(new Date(rangeStartDate), 'MM/dd/yyyy')
      : "";
    this.filterModel.toDate = rangeEndDate != null && rangeEndDate != ""
      ? this.datePipe.transform(new Date(rangeEndDate), 'MM/dd/yyyy')
      : "";

    this.filterModel.staffIds = providers;
    this.filterModel.patientIds = patients;
  }

  getMasterData() {
    const data = "APPOINTMENTTYPE,APPOINTMENTSTATUS";
    // this.paymentService.getMasterData(data).subscribe((response: any) => {
    //   if (response != null) {
    //     this.appopintmentTypes = response.appointmentType != null ? response.appointmentType : [];
    //     this.appopintmentStatus = response.appointmentStatus != null ? response.appointmentStatus : [];
    //   }
    // });
  }

  // exportPaymentPdf() {
  //   if (this.filterModel.PatientName == null) { this.filterModel.PatientName = "" }
  //   this.paymentService.exportPaymentPdf(this.filterModel)
  //     .subscribe((response: any) => {

  //       this.paymentService.downLoadFile(response, 'application/pdf', `Payment Report`)
  //     });
  // }

  onTableActionClick(actionObj?: any) {

    // console.log(this.filterModel.patientIds)
    // if (actionObj.data.bookingMode === "Online" || actionObj.data.bookingMode === "Home Visit") {
    //   if (actionObj.data.statusName === "Approved" || actionObj.data.statusName === "Cancelled") {
    //     this.routeer.navigate(["/webadmin/Non-Billable-SoapSuperadminComponent", { apptId: actionObj.data.patientAppointmentId, patId: actionObj.data.patientID }]);
    //   }
    // }
    // else {
    //   this.routeer.navigate(["/webadmin/Non-Billable-SoapSuperadminComponent", { apptId: actionObj.data.patientAppointmentId }]);
    // }
  }
  //  "webadmin/encounter/non-billable-soap?"+ actionObj.data.patientAppointmentId + actionObj.data.encId,



  ViewTypeOfData() {
    var data = this.superadmindata.getUserType()
    if (data != null) {
      switch (data) {
        case 'AppointementCancelled':
          this.selected = "Cancelled"
          this.applyFilter();
          break;
        case 'AppointementCompleted':
          this.selected = "Completed"
          this.applyFilter();
          break;
        case 'AppointementApproved':
          this.selected = "Approved"
          this.applyFilter();
          break;
        case 'AppointementPending':
          this.selected = "Pending"
          this.applyFilter();
          break;
        case 'OnlineAppointement':
          this.selectedMode = "Online"
          this.f['appStatus'].setValue(this.selectedMode);
          this.applyFilter();
          break;
        case 'FaceToFaceAppointement':
          this.selectedMode = "Face to Face"
          this.f['appStatus'].setValue(this.selectedMode);
          this.applyFilter();
          break;
        case 'HomeVisitAppointement':
          this.selectedMode = "Home Visit"
          this.f['appStatus'].setValue(this.selectedMode);
          this.applyFilter();
          break;
        default:
          break;
      }
      // if(data=="AppointementCancelled"){
      //   this.selected="Cancelled"
      //   this.applyFilter()
      // }
    }
    console.log(data);
  }
}


