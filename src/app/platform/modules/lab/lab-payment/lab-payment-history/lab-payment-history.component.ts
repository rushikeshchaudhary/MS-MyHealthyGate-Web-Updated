import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute } from "@angular/router";
import { PaymentService } from "../../../agency-portal/Payments/payment.service";
import { Metadata } from "../../../client-portal/client-profile.model";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { CommonService } from "../../../core/services";
import { LabPaymentModel } from "../../lab.model";
import { LabService } from "../../lab.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-payment-history",
  templateUrl: "./lab-payment-history.component.html",
  styleUrls: ["./lab-payment-history.component.css"],
})
export class LabPaymentHistoryComponent implements OnInit {
  metaData: any;
  filterModel: LabPaymentModel;
  paymentFormGroup!: FormGroup;
  payments: Array<any> = [];
  appopintmentTypes: any[] = [];
  appopintmentStatus: any[] = [];
  displayedColumns: Array<any> = [
    {
      displayName: "patient_name",
      key: "fullName",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_date",
      key: "appointmentDate",
      class: "",
      isSort: true,
    },
    {
      displayName: "appointement_time",
      key: "appointmentTime",
      class: "",
    },
    {
      displayName: "payment",
      key: "netAmount",
      class: "",
      isSort: true,
    },
    {
      displayName: "payment_date",
      key: "paymentDate",
      isSort: true,
      class: "",
    },

    {
      displayName: "payment_mode",
      key: "paymentMode",
      isSort: true,
      class: "",
    },

    {
      displayName: "appointment_status",
      key: "status",
      class: "",
    },

    {
      displayName: "transaction_id",
      key: "paymentToken",
      class: "",
    },
  ];
  actionButtons: Array<any> = [];
  totalNetAmount!: number;
  monthstatus!: string;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private labService:LabService,
    private commonService:CommonService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.filterModel = new LabPaymentModel();
  }

  ngOnInit() {
   
    this.activatedRoute.queryParams.subscribe((params) => {
      this.monthstatus = params["monthstatus"];
    });

    this.paymentFormGroup = this.formBuilder.group({
      name: "",
      payDate: "",
      appDate: "",
      appStatus: "",
      appType: "",
      rangeStartDate: "",
      rangeEndDate: "",
      bookingMode: "",
    });
    this.setIntialValues();
    this.getMasterData();
  }
  setIntialValues() {
    if (this.monthstatus != null) {
      var date = new Date();
      this.f["rangeStartDate"].setValue(
        new Date(date.getFullYear(), date.getMonth() - 1, 1)
      );
      this.f["rangeEndDate"].setValue(
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
      this.f["rangeStartDate"].setValue(
        new Date(date.getFullYear(), date.getMonth(), 1)
      );
      this.f["rangeEndDate"].setValue(
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
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.f["name"].value,
      this.f["payDate"].value,
      this.f["appDate"].value,
      this.f["appStatus"].value,
      this.f["appType"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value,
      this.f["bookingMode"].value
    );

    this.getPayments(this.filterModel);
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
      this.f["name"].value,
      this.f["payDate"].value,
      this.f["appDate"].value,
      this.f["appStatus"].value,
      this.f["appType"].value,
      this.f["rangeStartDate"].value,
      this.f["rangeEndDate"].value,
      this.f["bookingMode"].value
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
    this.filterModel.AppointmentType =
      appType && appType.length > 0 ? appType.toString() : "";
    this.filterModel.Status =
      appStatus && appStatus.length > 0 ? appStatus.toString() : "";
    this.filterModel.BookingMode =
      bookingMode && bookingMode.length > 0 ? bookingMode.toString() : "";

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
  getPayments(filterModel: LabPaymentModel) {
    this.labService
      .getAppointmentPayments(filterModel)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 302) {
          this.metaData = response.meta;
          this.payments = response.data;
          if (this.payments && this.payments.length > 0) {
            this.payments = this.payments.map((x) => {
              x.netAmount = "INR " + x.netAmount;
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

  exportPaymentPdf() {
    if (this.filterModel.PatientName == null) {
      this.filterModel.PatientName = "";
    }
    // this.paymentService
    //   .exportPaymentPdf(this.filterModel)
    //   .subscribe((response: any) => {
    //     this.paymentService.downLoadFile(
    //       response,
    //       "application/pdf",
    //       `Payment Report`
    //     );
    //   });
  }
}
