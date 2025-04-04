import { Component, Input, OnInit } from "@angular/core";
import { ResponseModel } from "../../../core/modals/common-model";
import { LabTestDownloadModalComponent } from "../../lab-test-download-modal/lab-test-download-modal.component";
import { AddRadiologyReferralModalComponent } from "../../add-radiology-referral-modal/add-radiology-referral-modal.component";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CommonService } from "../../../core/services";
import { ClientsService } from "../../../client-portal/clients.service";
import { ActivatedRoute } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-radiology-refferral-clients",
  templateUrl: "./radiology-refferral-clients.component.html",
  styleUrls: ["./radiology-refferral-clients.component.css"],
})
export class RadiologyRefferralClientsComponent implements OnInit {
  @Input() appointmentId: number = 0;
  @Input() encryptedPatientId:any;
  patientId: number = 0;
  searchKey: string = "";
  public pageSize = 5;
  public currentPage = 0;
  public totalSize = 100;
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];

  displayColumns: Array<any> = [
    {
      displayName: "radiology_name",
      key: "labName",
      isSort: false,
      class: "",
    },
    {
      displayName: "test_name",
      key: "testName",
      isSort: false,
      class: "",
    },
    {
      displayName: "patient_name",
      key: "patientName",
      isSort: false,
      class: "",
    },
    {
      displayName: "status",
      key: "status",
      isSort: false,
      class: "",
      type: "statusReportupload",
    },
    {
      displayName: "created_date",
      key: "createdDate",
      isSort: false,
      class: "",
      type: "date",
    },
    {
      displayName: "notes",
      key: "notes",
      isSort: false,
      class: "",
    },
    {
      displayName: "actions",
      key: "Actions",
      isSort: true,
      class: "",
    },
  ];
  displayedColumns = [
    "Radiology Name",
    "Patient Name",
    "Test Name",
    "Status",
    "Notes",
    "Collection Date",
    // "Insurance/ Others",
    // "Referral",
    "QrCode",
    "Actions",
  ];
  radiologyReferralList: any;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  metaData: any;
  userId: number = 0;
  currentUser: any;
  roleId: number = 329; // role id for Radiology
  testFormGroup!: FormGroup;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private clientService: ClientsService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user) => {
      this.currentUser = user;
    });
    // if (this.encryptedPatientId != undefined) {
    //   this.patientId = this.commonService.encryptValue(
    //     this.encryptedPatientId,
    //     false
    //   );
    // } else {
    //   this.patientId = 0;
    //   this.appointmentId = 0;
    // }
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.patientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);
      });
    } else {
      this.patientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
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

  onTableActionClick(actionObj: any) {
    if (actionObj.action == "view") {
      this.openTestDownloadModal(actionObj);
    }
  }
  openTestDownloadModal(actionObj: any) {
    const modalPopup = this.dialogModal.open(LabTestDownloadModalComponent, {
      hasBackdrop: true,
      width: "30%",
      data: actionObj,
    });
    modalPopup.afterClosed().subscribe((result) => {});
  }
  createReferral() {
    let referralModal;
    referralModal = this.dialogModal.open(AddRadiologyReferralModalComponent, {
      data: {
        id: this.userId,
        referralList: this.radiologyReferralList,
        patientId: this.patientId,
        appointmentId: this.appointmentId,
      },
    });
    referralModal.afterClosed().subscribe((result) => {
      this.getAllLabReferrals();
    });
  }
  getAllLabReferrals() {
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
        "RADIOLOGY",
        this.appointmentId,
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1
      )
      .subscribe((response: ResponseModel) => {
        // this.clientService.getAllLabReferrals(this.currentUser.id, this.roleId, this.appointmentId, this.searchKey, "", "").subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.radiologyReferralList = new MatTableDataSource<any>(
            response.data
          );
          this.radiologyReferralList = response.data;
          this.metaData = response.meta;
          this.totalSize =
            response.data.length > 0 ? response.data[0].totalRecord : 0;
        } else {
          this.radiologyReferralList = [];
          this.metaData = null;
        }
      });
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.getAllLabReferrals();
  }
  downloadTemplate = (act: { patientName: any; labReferralId: number; }) => {
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
  viewDocument = (act: { labReferralId: number; }) => {
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
