import { ClientsService } from "./../../clients.service";
import { Metadata } from "./../../../../../super-admin-portal/core/modals/common-model";
import { RefundFilterModel } from "./../../../core/modals/common-model";
import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { NotifierService } from "angular-notifier";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { FilterModel } from "src/app/platform/modules/core/modals/common-model";
import { CommonService } from "src/app/platform/modules/core/services";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-refund-history",
  templateUrl: "./refund-history.component.html",
  styleUrls: ["./refund-history.component.css"]
})
export class RefundHistoryComponent implements OnInit {
  metaData: any;
  filterModel: RefundFilterModel;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  displayedColumns: Array<any> = [
    {
      displayName: "refund_date",
      key: "refundDate",
      isSort: true,
      class: ""
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
      displayName: "provider",
      key: "fullName",
      class: ""
    },
    {
      displayName: "appointment_date",
      key: "appointmentDate",
      class: ""
    },
    {
      displayName: "appointment_time",
      key: "appointmentTime",
      class: ""
    },
    {
      displayName: "payment_mode",
      key: "paymentMode",
      class: ""
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
      key: "refundToken",
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
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
     this.filterModel = new RefundFilterModel();
  }
  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: ""
    });

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
      this.f["appDate"].value
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
  applyFilter() {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f["name"].value,
      this.f["payDate"].value,
      this.f["appDate"].value
    );
    this.getPayments(this.filterModel);
  }

  getPayments(filterModel: RefundFilterModel) {    
    this.clientsService
      .getAppointmentRefunds(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;          
          this.payments = this.payments.map(x => { x.netAmount = "JOD " + x.netAmount; return x });
          this.payments = this.payments.map(x => { x.bookingAmount = "JOD " + x.bookingAmount; return x });          
        } else {
          this.payments = [];
          this.metaData = new Metadata();
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
    appDate: any
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.StaffName = name;
    this.filterModel.RefundDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate.setDate(payDate.getDate() )), 'MM/dd/yyyy') ?? ""
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != "" 
        ? this.datePipe.transform(new Date(appDate), 'MM/dd/yyyy') ?? ""
        : "";
  }
}
