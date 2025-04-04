import { ClientsService } from "./../../clients.service";
import { Metadata } from "./../../../../../super-admin-portal/core/modals/common-model";
import { PaymentFilterModel } from "./../../../core/modals/common-model";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { Router,ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-payment-history",
  templateUrl: "./payment-history.component.html",
  styleUrls: ["./payment-history.component.css"]
})
export class PaymentHistoryComponent implements OnInit {
  metaData: any;
  filterModel: PaymentFilterModel;
  paymentFormGroup!: FormGroup;
  totalNetAmount:any;
  payments: Array<any> = [];
  type:any='';
  displayedColumns: Array<any> = [
    {
      displayName: "payment_date",
      key: "paymentDate",
      isSort: true,
      class: "",
      width: "140px"
    },
    // {
    //   displayName: "Payment Amount",
    //   key: "bookingAmount",
    //   class: ""
    // },
    // {
    //   displayName: "Commission",
    //   key: "commissionPercentage",
    //   class: ""
    // },
    {
      displayName: "payment",
      key: "bookingAmount",
      class: "",
      // type: "decimal"
    },
    {
      displayName: "provider_name",
      key: "fullName",
      class: "",
      width: "150px"
    },
    {
      displayName: "appointement_date",
      key: "appointmentDate",
      class: ""
    },
    {
      displayName: "appointement_time",
      key: "appointmentTime",
      class: ""
    },
    {
      displayName: "payment_mode",
      key: "paymentMode",
      class: "",
      width: "145px"
    },
    // {
    //   displayName: "Payment Status",
    //   key: "isActive",
    //   class: "",
    //   width: "10%",
    //   type: "togglespan",
    //   permission: true
    // },
    {
      displayName: "transaction_id",
      key: "paymentToken",
      class: ""
    }
    //{ displayName: "Actions", key: "Actions", class: "", width: "10%" }
  ];
  actionButtons: Array<any> = [
    // { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    // { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private clientsService: ClientsService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private translate:TranslateService
  ) {
    this.filterModel = new PaymentFilterModel();
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  ngOnInit() {

  
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: "",
      rangeStartDate:"",
      rangeEndDate:""
    });
    this.route.queryParams
    .subscribe(params => {
     this.type=params["type"];
    });
    
    if(this.type=='mon')
    {
    this.setIntialValues();
    }
    this.getPayments(this.filterModel);
    
  }
  get f() {
    return this.paymentFormGroup.controls;
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f["name"].value,
      this.f["payDate"].value,
      this.f["appDate"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value
    );
    this.getPayments(this.filterModel);
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["payDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    let d = event.value;
    let dd = (event.value ? new Date (event.value) : null);
    this.f["appDate"].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  setIntialValues()
  {
    
    var date = new Date();
    this.f["rangeStartDate"].setValue(new Date(date.getFullYear(), date.getMonth(), 1));
    this.f["rangeEndDate"].setValue(new Date(date.getFullYear(), date.getMonth() + 1, 0));this.filterModel.RangeStartDate=new Date(date.getFullYear(), date.getMonth(), 1).toString();
    this.filterModel.RangeEndDate=new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0)).toString();

    this.applyFilter();

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
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f["name"].value,
      this.f["payDate"].value,
      this.f["appDate"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value
    );
    this.getPayments(this.filterModel);
  }

  getPayments(filterModel: PaymentFilterModel) {
    
    this.clientsService
      .getAppointmentPayments(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          
          this.metaData = response.meta;
          this.payments = response.data;
          this.totalNetAmount=this.payments[0].totalNetAmount;
          this.payments = this.payments.map(x => { x.bookingAmount = "JOD " + x.bookingAmount; return x });
        } else {
          this.payments = [];
          this.metaData = new Metadata();
          this.totalNetAmount=null;;
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  clearFilters() {
    this.paymentFormGroup.reset();
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      "",
      "",
      "",
      "",
      ""
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
    appDate: any,
    rangeStartDate:any,
    rangeEndDate:any
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.StaffName = name;
    this.filterModel.PayDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate), 'MM/dd/yyyy') ?? ""
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != ""
        ? this.datePipe.transform(new Date(appDate), 'MM/dd/yyyy') ?? ""
        : "";

        this.filterModel.RangeStartDate =
        rangeStartDate != null && rangeStartDate != ""
          ? this.datePipe.transform(new Date(rangeStartDate), 'MM/dd/yyyy') ?? ""
          : "";
          this.filterModel.RangeEndDate =
          rangeEndDate != null && rangeEndDate != ""
            ? this.datePipe.transform(new Date(rangeEndDate), 'MM/dd/yyyy') ?? ""
            : "";
  }
}
