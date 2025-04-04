import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ClientsService } from "../../client-portal/clients.service";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { AddLabReferralModalComponent } from "../add-lab-referral-modal/add-lab-referral-modal.component";
import { LabTestDownloadModalComponent } from "../lab-test-download-modal/lab-test-download-modal.component";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { NotifierService } from "angular-notifier";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";

@Component({
  selector: "app-lab-referral",
  templateUrl: "./lab-referral.component.html",
  styleUrls: ["./lab-referral.component.css"],
})
export class LabReferralComponent implements OnInit {
  @Input() appointmentId: number = 0;
  @Input() encryptedPatientId:any;
  patientId: number = 0;
  dp1: any;
  dp2: Date = new Date();

  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 0;
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];

  displayColumns: Array<any> = [
    {
      displayName: "Lab Name",
      key: "labName",
      isSort: false,
      class: "",
    },
    {
      displayName: "Test Name",
      key: "testName",
      isSort: false,
      class: "",
    },
    {
      displayName: "PatientName",
      key: "patientName",
      isSort: false,
      class: "",
    },
    {
      displayName: "Status",
      key: "status",
      isSort: false,
      class: "",
      type: "statusReportupload",
    },
    {
      displayName: "Created Date",
      key: "createdDate",
      isSort: false,
      class: "",
      type: "date",
    },
    {
      displayName: "Notes",
      key: "notes",
      isSort: false,
      class: "",
    },
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    },
  ];
  displayedColumns = [
    "Lab Name",
    "Test Name",
    "Patient Name",
    "Status",
    "Referal Date",
    "Notes",
    "Collection Date",
    // "Insurance/ Others",
    // "Referral",
    "QrCode",
    "Result QR",
    "Actions",
  ];
  labReferralList: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  metaData: any;
  userId: number = 0;
  currentUser: any;
  roleId: number = 325; // role id for lab
  testFormGroup!: FormGroup;
  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifierService: NotifierService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.dp2 = new Date();
    this.commonService.currentLoginUserInfo.subscribe((user) => {
      this.currentUser = user;
    });
    if (this.encryptedPatientId != undefined) {
      this.patientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    } else {
      this.patientId = 0;
      this.appointmentId = 0;
    }
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    // this.setIntialValues();
    this.getAllLabReferrals();
  }
  get f() {
    return this.testFormGroup.controls;
  }
  setIntialValues() {
    var date = new Date();
    this.f["rangeStartDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() - 0, 1)
    );
    this.f["rangeEndDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }
  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferrals();
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.f["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferrals();
  }

  onTableActionClick(action: any, data: any) {
    const actionObj = {
      action,
      data,
    };
    if (actionObj.action == "view") {
      this.openTestDownloadModal(actionObj);
    }
  }
  openTestDownloadModal(data: any) {
    const modalPopup = this.dialogModal.open(LabTestDownloadModalComponent, {
      hasBackdrop: true,
      width: "30%",
      data: data,
    });
    modalPopup.afterClosed().subscribe((result) => {});
  }
  createReferral() {
    let referralModal;
    referralModal = this.dialogModal.open(AddLabReferralModalComponent, {
      data: {
        id: this.userId,
        referralList: this.labReferralList,
        patientId: this.patientId,
        appointmentId: this.appointmentId,
      },
    });
    referralModal.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllLabReferrals();
      }
    });
  }
  getAllLabReferrals() {
    // let fromDate = this.f.rangeStartDate.value == null? '' : this.f.rangeStartDate.value;
    // let toDate = this.f.rangeEndDate.value == null? '' : this.f.rangeEndDate.value;
    // let searchKey = this.f.searchKey.value == null? '' : this.f.searchKey.value;
    let fromDate =
      this.f["rangeStartDate"].value != null && this.f["rangeStartDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.f["rangeStartDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let toDate =
      this.f["rangeEndDate"].value != null && this.f["rangeEndDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.f["rangeEndDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let searchKey =
      this.f["searchKey"].value == null ? "" : this.f["searchKey"].value;

    this.clientService
      .getAllLabReferrals(
        this.currentUser.id,
        this.patientId,
        'LAB',
        this.appointmentId,
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1
      )
      .subscribe((response: ResponseModel) => {
        // this.clientService.getAllLabReferrals(this.currentUser.id, this.roleId, this.appointmentId, '', new Date(),new Date()).subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          console.log(response.data);

          response.data.map((ele:any) =>
            ele.labName
              ? (ele.labName = ele.labName)
              : (ele.labName = ele.fullLabName)
          );
          this.totalSize = response.data ? response.data[0].totalRecord : 0;
          this.labReferralList = new MatTableDataSource<any>(response.data);
          // this.labReferralList = response.data;
          // this.metaData = response.meta;
        } else {
          this.labReferralList = [];
          this.metaData = null;
          this.totalSize = 0;
        }
      });
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage = 0;
    this.pageSize = 5;

    this.getAllLabReferrals();
  }
  downloadTemplate = (act:any) => {
    debugger
    let fileName = act.patientName;
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
        if (
          response &&
          response.data &&
          Object.keys(response.data).length > 0
        ) {
          let byteChar = atob(response.data.toString());
          let byteArray = new Array(byteChar.length);
          for (let i = 0; i < byteChar.length; i++) {
            byteArray[i] = byteChar.charCodeAt(i);
          }

          let uIntArray = new Uint8Array(byteArray);
          let file = new Blob([uIntArray], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.target = "_blank";
          a.href = fileURL;
          a.download = fileName;
          a.click();
          a.remove();

          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(file);
            return;
          }
          const data = window.URL.createObjectURL(file);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {
          this.notifierService.notify("error", "Data not found");
        }
      });
  };
  viewDocument = (act:any) => {
    // window.open(act.data.url, '_blank')
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
        if (
          response &&
          response.data &&
          Object.keys(response.data).length > 0
        ) {
          let byteChar = atob(response.data.toString());
          let byteArray = new Array(byteChar.length);
          for (let i = 0; i < byteChar.length; i++) {
            byteArray[i] = byteChar.charCodeAt(i);
          }

          let uIntArray = new Uint8Array(byteArray);
          let newBlob = new Blob([uIntArray], { type: "application/pdf" });
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {
          this.notifierService.notify("error", "Data not found");
        }
      });
  };
  viewInsuranceDocument(act: any) {
    this.clientService
      .PatientInsurancePdfByPatientId(this.currentUser.id)
      .subscribe((response: any) => {
        if (
          response &&
          response.data &&
          Object.keys(response.data).length > 0
        ) {
          let byteChar = atob(response.data.toString());
          let byteArray = new Array(byteChar.length);
          for (let i = 0; i < byteChar.length; i++) {
            byteArray[i] = byteChar.charCodeAt(i);
          }

          let uIntArray = new Uint8Array(byteArray);
          let newBlob = new Blob([uIntArray], { type: "application/pdf" });
          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(newBlob);
            return;
          }
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {
          this.notifierService.notify("error", "Data not found");
        }
      });
  }
  downloadInsuranceTemplate(act: any) {
    let fileName = act.patientName;
    this.clientService
      .PatientInsurancePdfByPatientId(this.currentUser.id)
      .subscribe((response: any) => {
        if (
          response &&
          response.data &&
          Object.keys(response.data).length > 0
        ) {
          let byteChar = atob(response.data.toString());
          let byteArray = new Array(byteChar.length);
          for (let i = 0; i < byteChar.length; i++) {
            byteArray[i] = byteChar.charCodeAt(i);
          }

          let uIntArray = new Uint8Array(byteArray);
          let file = new Blob([uIntArray], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.target = "_blank";
          a.href = fileURL;
          a.download = fileName;
          a.click();
          a.remove();

          const nav = window.navigator as any;
          if (nav && nav.msSaveOrOpenBlob) {
            nav.msSaveOrOpenBlob(file);
            return;
          }
          const data = window.URL.createObjectURL(file);
          var link = document.createElement("a");
          document.body.appendChild(link);
          link.href = data;
          link.target = "_blank";
          link.click();

          setTimeout(function () {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(data);
          }, 100);
        } else {
          this.notifierService.notify("error", "Data not found");
        }
      });
  }

  setPagePaginator = (event: any) => {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllLabReferrals();
  };

  imageInhancer = (element: { type: any; }, type: any) => {
    element.type = type;
    const modalPopup = this.dialogModal.open(QRImageInhanserComponent, {
      hasBackdrop: true,
      minWidth: "0%",
      width: "20%",
      height: "40vh",
      data: element,
    });
  };
}
