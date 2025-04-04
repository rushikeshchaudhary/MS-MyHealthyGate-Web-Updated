import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { PaymentService } from 'src/app/platform/modules/agency-portal/Payments/payment.service';
import { Metadata, RefundFilterModelForAdmin } from 'src/app/platform/modules/core/modals/common-model';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';

@Component({
  selector: 'app-total-refund-history',
  templateUrl: './total-refund-history.component.html',
  styleUrls: ['./total-refund-history.component.css']
})
export class TotalRefundHistoryComponent implements OnInit {
  metaData: any;
  filterModel: RefundFilterModelForAdmin;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  totalNetAmount: number= 0;
  displayedColumns: Array<any> = [
    {
      displayName: "Refund Date",
      key: "refundDate",
      isSort: true,
      class: "",
      width: "12%"
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
      displayName: "Payment",
      key: "netAmount",
      class: "",
      // type: "decimal"
    },
    {
      displayName: "Patient Name",
      key: "fullName",
      class: ""
    },
    {
      displayName: "ProviderName",
      key: "providerFullName",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt. Date",
      key: "appointmentDate",
      class: ""
    },
    {
      displayName: "Appt. Time",
      key: "appointmentTime",
      class: ""
    },
    {
      displayName: "Payment Mode",
      key: "paymentMode",
      class: "",
      width: "14%"
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
      displayName: "Transaction ID",
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
    private paymentService: PaymentService,
    private datePipe: DatePipe
  ) {
    this.filterModel = new RefundFilterModelForAdmin();
  }

  ngOnInit() {
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: "",
      ProviderName:"",
    });

    this.getPayments(this.filterModel);
  }
  get f() {
    return this.paymentFormGroup.controls;
  }
  getPayments(filterModel: RefundFilterModelForAdmin) {
    this.paymentService
      .getAppointmentRefundsForAdmin(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
          this.payments = this.payments.map(x => { x.netAmount = "JOD " + x.netAmount; return x });
          this.totalNetAmount = this.payments[0].totalNetAmount as number;
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5,10,25,50,100];
      });
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f['payDate'].setValue(event.value ? new Date(event.value) : null);
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
      this.f['ProviderName'].value,
      this.f['payDate'].value,
      this.f['appDate'].value
    );
    this.getPayments(this.filterModel);
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    name: string,
    ProviderName:string,
    payDate: any,
    appDate: any
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.PatientName = name;
    this.filterModel.ProviderName=ProviderName;
    this.filterModel.RefundDate =
      payDate != null && payDate != ""
        ? this.datePipe.transform(new Date(payDate), 'MM/dd/yyyy') ?? ""
        : "";
    this.filterModel.AppDate =
      appDate != null && appDate != ""
        ? this.datePipe.transform(new Date(appDate), 'MM/dd/yyyy') ?? ""
        : "";
  }
  applyAppDateFilter(event: MatDatepickerInputEvent<Date>) {
    let d = event.value;
    let dd = event.value ? new Date(event.value) : null
    this.f['appDate'].setValue(event.value ? new Date(event.value) : null);
    this.applyFilter();
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
      ""
    );
    this.getPayments(this.filterModel);
  }
  onPageOrSortChange(changeState?: any) {
    //////debugger;
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f['name'].value,
      this.f['ProviderName'].value,
      this.f['payDate'].value,
      this.f['appDate'].value
    );
    this.getPayments(this.filterModel);
  }

}
