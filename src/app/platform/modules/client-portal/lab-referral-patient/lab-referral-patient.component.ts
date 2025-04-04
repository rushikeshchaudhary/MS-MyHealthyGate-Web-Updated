import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients.service";
import { LabTestDownloadPatientComponent } from "../lab-test-download-patient/lab-test-download-patient.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-lab-referral-patient",
  templateUrl: "./lab-referral-patient.component.html",
  styleUrls: ["./lab-referral-patient.component.css"],
})
export class LabReferralPatientComponent implements OnInit {
  labReferralList:any;
  metaData: any;
  currentUser: any;
  labRoleId: number = 325;
  testFormGroup!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 100;

  constructor(
    private commonService: CommonService,
    private clientService: ClientsService,
    private dialogModal: MatDialog,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
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
      displayName: "Refer Date",
      key: "createdDate",
      class: "",
      type: "date",
      isSort: false,
    },
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
    "Lab Name",
    "Provider Name",
    "Test Name",
    "Refer Date",
    "Status",
    "Notes",
    "Collection Date",
    // "Insurance/ Others",
    // "Referral",
    "QrCode",
    "Result QR",
    "Actions",
  ];
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];
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

  get labReferalForm() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    var date = new Date();
    this.labReferalForm["rangeStartDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() - 0, 1)
    );
    this.labReferalForm["rangeEndDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllReferralByPatientId(this.currentUser.id);
  }
  getAllReferralByPatientId(patientId: number) {
    let fromDate =
      this.labReferalForm["rangeStartDate"].value != null &&
      this.labReferalForm["rangeStartDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.labReferalForm["rangeStartDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let toDate =
      this.labReferalForm["rangeEndDate"].value != null &&
      this.labReferalForm["rangeEndDate"].value != ""
        ? this.datePipe.transform(
            new Date(this.labReferalForm["rangeEndDate"].value),
            'MM/dd/yyyy'
          )
        : "";
    let searchKey =
      this.labReferalForm["searchKey"].value == null
        ? ""
        : this.labReferalForm["searchKey"].value;

    this.clientService
      .getAllLabReferrals(
        0,
        patientId,
        "LAB",
        0,
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1
      )
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          response.data.map((ele:any) =>
            ele.labName
              ? (ele.labName = ele.labName)
              : (ele.labName = ele.fullLabName)
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

  onTableActionClick(action: any, data: any) {
    const actionObj = {
      action,
      data,
    };
    if (actionObj.action == "view") {
      this.openFileDownloadModal(actionObj);
    }
  }

  openFileDownloadModal(data: any) {
    const modalPopup = this.dialogModal.open(LabTestDownloadPatientComponent, {
      hasBackdrop: true,
      width: "70%",
      height: "60%",
      data: data,
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllReferralByPatientId(this.currentUser.id);
      }
    });
  }

  onPageOrSortChange(changeState?: any) {
    changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.getAllReferralByPatientId(this.currentUser.id);
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage = 0;
    this.pageSize = 5;
    this.getAllReferralByPatientId(this.currentUser.id);
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
