import { DatePipe } from '@angular/common';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { PaymentService } from 'src/app/platform/modules/agency-portal/Payments/payment.service';
import { Metadata, PaymentFilterModelForAdmin } from 'src/app/platform/modules/core/modals/common-model';

import { SupeAdminDataService } from '../supe-admin-data.service';
import { TotalRefundHistoryComponent } from '../total-refund-history/total-refund-history.component';


@Component({
  selector: 'app-super-admin-payment-history',
  templateUrl: './super-admin-payment-history.component.html',
  styleUrls: ['./super-admin-payment-history.component.css']
})
export class SuperAdminPaymentHistoryComponent implements OnInit {
  metaData: any;
  userType: string = "";
  selectedIndex: number = 0;
  clientTabs: any;
  filterModel: PaymentFilterModelForAdmin;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];

  displayedColumns: Array<any> = [
    {
      displayName: "Patient Name",
      key: "fullName",
      class: "",
      isSort: true,
    },
    {
      displayName: "ProviderName Name",
      key: "providerFullName",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt. Date",
      key: "appointmentDate",
      class: "",
      isSort: true,
    },
    {
      displayName: "Appt. Time",
      key: "appointmentTime",
      class: "",
    },
    {
      displayName: "Payment",
      key: "netAmount",
      class: "",
      isSort: true,
    },
    {
      displayName: "Payment Date",
      key: "paymentDate",
      isSort: true,
      class: "",
    },

    {
      displayName: "Payment Mode",
      key: "paymentMode",
      isSort: true,
      class: "",
    },

    {
      displayName: "Appt. Status",
      key: "status",
      class: "",
    },

    {
      displayName: "Transaction ID",
      key: "paymentToken",
      class: "",
    },
  ];

  actionButtons: Array<any> = [];
  totalNetAmount: number = 0;
  monthstatus: string = "";
  constructor(private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private supeAdminDataService: SupeAdminDataService, private cfr: ComponentFactoryResolver) {
    this.filterModel = new PaymentFilterModelForAdmin();
    this.clientTabs = [
      "Total-RefundHistory",
    ];
  }

  ngOnInit() {
    this.userType = this.supeAdminDataService.getUserType();
    if (this.userType == "Users" || this.userType == "Provider") {
      this.selectedIndex = 0;
      this.loadChild(0);
    }
    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      ProviderName: "",
      payDate: "",
      appDate: "",
      appStatus: "",
      appType: "",
      rangeStartDate: "",
      rangeEndDate: "",
      bookingMode: "",
    });
    // this.setIntialValues();
    // this.getMasterData();
    this.getMasterData();
    this.getPayments(this.filterModel);
    this.setIntialValues();

  }
  loadChild(childName: number) {
    this.selectedIndex = childName;
    let factory: any;
    if (childName == 0)
      factory = this.cfr.resolveComponentFactory(TotalRefundHistoryComponent);
  }
  getPayments(filterModel: PaymentFilterModelForAdmin) {
    this.paymentService
      .getAppointmentPaymentsForAdmin(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
          if (this.payments && this.payments.length > 0) {
            //////debugger;
            this.payments = this.payments.map(x => { x.netAmount = "JOD " + x.netAmount; return x });
            this.totalNetAmount = this.payments[0].totalNetAmount as number;
          }
        } else {
          this.payments = [];
          this.metaData = new Metadata();
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
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
  setIntialValues() {
    //////debugger;
    if (this.monthstatus != null) {
      var date = new Date();
      this.f['rangeStartDate'].setValue(
        new Date(date.getFullYear(), date.getMonth() - 1, 1)
      );
      this.f['rangeEndDate'].setValue(
        new Date(date.getFullYear(), date.getMonth(), 0)
      );
      this.filterModel.RangeStartDate = new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      ).toString();
      this.filterModel.RangeEndDate = new Date(
        new Date(date.getFullYear(), date.getMonth(), 0)
      ).toString();
    } else {
      var date = new Date();
      this.f['rangeStartDate'].setValue(
        new Date(date.getFullYear(), date.getMonth(), 1)
      );
      this.f['rangeEndDate'].setValue(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
      );
      this.filterModel.RangeStartDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toString();
      this.filterModel.RangeEndDate = new Date(
        new Date(date.getFullYear(), date.getMonth() + 1, 0)
      ).toString();
    }

    //////debugger;
    this.applyFilter();
  }
  get f() {
    return this.paymentFormGroup.controls;
  }
  applyFilter() {
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f['name'].value,
      this.f['ProviderName'].value,
      this.f['payDate'].value,
      this.f['appDate'].value,
      this.f['appStatus'].value,
      this.f['appType'].value,
      this.f['rangeStartDate'].value,
      this.f['rangeEndDate'].value,
      this.f['bookingMode'].value
    );

    this.getPayments(this.filterModel);
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    name: string,
    ProviderName: string,
    payDate: any,
    appDate: any,
    appStatus: any,
    appType: any,
    rangeStartDate: any,
    rangeEndDate: any,
    bookingMode: any
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.PatientName = name;
    this.filterModel.ProviderName = ProviderName;
    this.filterModel.AppointmentType =
      appType && appType.length > 0 ? appType.toString() : "";
    this.filterModel.Status =
      appStatus && appStatus.length > 0 ? appStatus.toString() : "";
    this.filterModel.BookingMode =
      bookingMode && bookingMode.length > 0 ? bookingMode.toString() : "";

    this.filterModel.PayDate =
      (payDate != null && payDate !== ""
        ? this.datePipe.transform(new Date(payDate), 'MM/dd/yyyy')
        : "") as string;
    this.filterModel.AppDate =
      (appDate != null && appDate !== ""
        ? this.datePipe.transform(new Date(appDate), 'MM/dd/yyyy')
        : "") as string;

    this.filterModel.RangeStartDate =
      (rangeStartDate != null && rangeStartDate !== ""
        ? this.datePipe.transform(new Date(rangeStartDate), 'MM/dd/yyyy')
        : "") as string;

    this.filterModel.RangeEndDate =
      (rangeEndDate != null && rangeEndDate !== ""
        ? this.datePipe.transform(new Date(rangeEndDate), 'MM/dd/yyyy')
        : "") as string;
  }
  clearFilters() {
    this.paymentFormGroup.reset();
    //////debugger
    this.setPaginatorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    this.getPayments(this.filterModel);
  }
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.f['name'].value,
      this.f['ProviderName'].value,
      this.f['payDate'].value,
      this.f['appDate'].value,
      this.f['appStatus'].value,
      this.f['appType'].value,
      this.f['rangeStartDate'].value,
      this.f['rangeEndDate'].value,
      this.f['bookingMode'].value
    );
    this.getPayments(this.filterModel);
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f['rangeEndDate'].setValue(event.value ? new Date(event.value) : null);
    this.applyFilter();
  }
  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f['rangeStartDate'].setValue(event.value ? new Date(event.value) : null);
    this.applyFilter();
  }
  onDropDownClose(event: boolean) {
    if (!event) this.applyFilter();
  }
  applyPayDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f['payDate'].setValue(event.value ? new Date(event.value) : null);
    this.applyFilter();
  }

}
