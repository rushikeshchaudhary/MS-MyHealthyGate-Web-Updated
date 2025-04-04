import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { PaymentService } from '../../../agency-portal/Payments/payment.service';
import { Metadata, RefundFilterModel } from '../../../core/modals/common-model';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-lab-refund-history',
  templateUrl: './lab-refund-history.component.html',
  styleUrls: ['./lab-refund-history.component.css']
})
export class LabRefundHistoryComponent implements OnInit {
  metaData: any;
  filterModel: RefundFilterModel;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  displayedColumns: Array<any> = [
    {
      displayName: "refund_date",
      key: "refundDate",
      isSort: true,
      class: "",
      width: "12%"
    },
   
    {
      displayName: "payment",
      key: "netAmount",
      class: "",
      // type: "decimal"
    },
    {
      displayName: "patient_name",
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
      class: "",
      width: "14%"
    },
    
    {
      displayName: "transaction_id",
      key: "refundToken",
      class: ""
    }
  ];
  actionButtons: Array<any> = [
    // { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    // { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private paymentService: PaymentService,
    private translate:TranslateService,

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
    //////debugger;
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f['name'].value,
      this.f['payDate'].value,
      this.f['appDate'].value
    );
    this.getPayments(this.filterModel);
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f['payDate'].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {  
    let d = event.value;
    let dd = (event.value ? new Date (event.value) : null);
    this.f['appDate'].setValue(event.value ? new Date (event.value) : null);
    this.applyFilter();
  }

  applyFilter() {
    //////debugger;
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f['name'].value,
      this.f['payDate'].value,
      this.f['appDate'].value
    );
    this.getPayments(this.filterModel);
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
    this.filterModel.PatientName = name;
    this.filterModel.RefundDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate), 'MM/dd/yyyy') ?? ""
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != ""
        ? this.datePipe.transform(new Date(appDate), 'MM/dd/yyyy') ?? ""
        : "";
  }
  getPayments(filterModel: RefundFilterModel) {
    this.paymentService
      .getAppointmentRefunds(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
          this.payments = this.payments.map(x => { x.netAmount = "INR " + x.netAmount; return x });
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
}
