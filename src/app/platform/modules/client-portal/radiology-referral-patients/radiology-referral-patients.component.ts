import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients.service";
import { LabTestDownloadPatientComponent } from "../lab-test-download-patient/lab-test-download-patient.component";
import { TranslateService } from "@ngx-translate/core";
import { RadiologyReferralModalComponent } from "src/app/shared/radiology-referral-modal/radiology-referral-modal.component";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";

@Component({
  selector: "app-radiology-referral-patients",
  templateUrl: "./radiology-referral-patients.component.html",
  styleUrls: ["./radiology-referral-patients.component.css"],
})
export class RadiologyReferralPatientsComponent implements OnInit {
  labReferralList: any;
  metaData: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  currentUser: any;
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 100;
  testFormGroup!: FormGroup;
  constructor(
    private commonService: CommonService,
    private clientService: ClientsService,
    private dialogModal: MatDialog,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  displayColumns: Array<any> = [
    { displayName: "Lab Name", key: "labName", class: "", isSort: false },
    {
      displayName: "Provider Name",
      key: "providerName",
      class: "",
      isSort: false,
    },
    { displayName: "Test Name", key: "testName", class: "", isSort: false },
    {
      displayName: "Status",
      key: "status",
      class: "",
      type: "statusReportupload",
      isSort: false,
    },
    { displayName: "Notes", key: "notes", class: "", isSort: false },
    { displayName: "Actions", key: "Actions", class: "", isSort: false },
  ];
  displayedColumns = [
    "Radiology Name",
    "Provider Name",
    "Test Name",
    "Status",
    "Notes",
    "Collection Date",
    // "Insurance/ Others",
    // "Referral",
    "QrCode",
    "Actions",
  ];
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];
  radiologyRoleId: number = 329;
  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    // this.setIntialValues();
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  get radioLogyReferalForm() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    var date = new Date();
    this.radioLogyReferalForm["rangeStartDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() - 0, 1)
    );
    this.radioLogyReferalForm["rangeEndDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.radioLogyReferalForm["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.radioLogyReferalForm["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  getAllReferralByPatientId(patientId: number) {
    let fromDate =
      this.radioLogyReferalForm["rangeStartDate"].value != null &&
      this.radioLogyReferalForm["rangeStartDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.radioLogyReferalForm["rangeStartDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let toDate =
      this.radioLogyReferalForm["rangeEndDate"].value != null &&
      this.radioLogyReferalForm["rangeEndDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.radioLogyReferalForm["rangeEndDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let searchKey =
      this.radioLogyReferalForm["searchKey"].value == null
        ? ""
        : this.radioLogyReferalForm["searchKey"].value;
    this.clientService
      .getAllLabReferrals(
        0,
        patientId,
        "RADIOLOGY",
        0,
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1
      )
      .subscribe((response: any) => {
        if (response.statusCode == 200) {
          response.data.map((ele:any) =>
            ele.radiologyName
              ? (ele.radiologyName = ele.radiologyName)
              : (ele.radiologyName = ele.fullName)
          );
          this.labReferralList = new MatTableDataSource<any>(response.data);
          this.metaData = response.meta;
          this.totalSize =
            response.data.length > 0 ? response.data[0].totalRecord : 0;
        } else {
          this.labReferralList = [];
          this.metaData = null;
        }
      });
  }
  onTableActionClick(actionObj: any) {
    if (actionObj.action == "view") {
      this.openFileDownloadModal(actionObj);
    }
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage = 0;
    this.pageSize = 5;
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  openFileDownloadModal(actionObj: any) {
    const modalPopup = this.dialogModal.open(RadiologyReferralModalComponent, {
      hasBackdrop: true,
      width: "30%",
      data: {
        ...actionObj,
        role: "patient",
      },
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllReferralByPatientId(this.currentUser.id);
      }
    });
  }
  downloadTemplate = (act:any) => {
    let fileName = act.patientName;
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
        if (response) {
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
        }
      });
  };

  viewDocument = (act:any) => {
    // window.open(act.data.url, '_blank')
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
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
      });
  };

  viewInsuranceDocument(act: any) {
    this.clientService
      .PatientInsurancePdfByPatientId(this.currentUser.id)
      .subscribe((response: any) => {
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
      });
  }
  downloadInsuranceTemplate(act: any) {
    let fileName = act.patientName;
    this.clientService
      .PatientInsurancePdfByPatientId(this.currentUser.id)
      .subscribe((response: any) => {
        if (response) {
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
        }
      });
  }

  setPagePaginator = (event: any) => {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllReferralByPatientId(this.currentUser.id);
  };

  imageInhancer = (element: { type: any; },type: any) => {
    element.type = type;
    const modalPopup = this.dialogModal.open(QRImageInhanserComponent, {
      hasBackdrop: true,
      minWidth:"0%",
      width: "20%",
      height: "40vh",
      data: element,
    });
  };
}
