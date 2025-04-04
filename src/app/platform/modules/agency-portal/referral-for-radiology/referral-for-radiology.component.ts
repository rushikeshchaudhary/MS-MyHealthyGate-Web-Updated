import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../client-portal/clients-details/clients.service";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { RadiologyReferralFileUploadComponent } from "../radiology-referral-file-upload/radiology-referral-file-upload.component";
import { TranslateService } from "@ngx-translate/core";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";

@Component({
  selector: "app-referral-for-radiology",
  templateUrl: "./referral-for-radiology.component.html",
  styleUrls: ["./referral-for-radiology.component.css"],
})
export class ReferralForRadiologyComponent implements OnInit {
  SampleCollectionDate: any = "";
  checked = false;
  labReferralList: any;
  metaData: any;
  currentUser: any;
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  testFormGroup!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // displayColumns: Array<any> = [
  //   {
  //     displayName: "PatientName",
  //     key: "patientName",
  //     class: "",
  //     isSort: false,
  //   },
  //   {
  //     displayName: "Provider Name",
  //     key: "providerName",
  //     class: "",
  //     isSort: false,
  //   },
  //   { displayName: "Test Name", key: "testName", class: "", isSort: false },
  //   {
  //     displayName: "Status",
  //     key: "status",
  //     class: "",
  //     type: "statusReportupload",
  //     isSort: false,
  //   },
  //   { displayName: "Notes", key: "notes", class: "", isSort: false },
  //   { displayName: "Actions", key: "Actions", class: "", isSort: false },
  // ];
  displayedColumns = [
    "Patient Name",
    "Provider Name",
    "Test Name",
    "Status",
    "Notes",
    "Collection Date",
    "QrCode",
    //"Insurance/ Others",
    //"Referral",
    "Actions",
  ];
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];
  statusArray = [
    "Request Raised",
    "In Progress",
    "Sample Collected",
    "Partialy Uploaded",
    "Report Uploaded",
  ];
  radiologyRoleId: number = 329;
  labReferrals: any = [];
  constructor(
    // private clientService: ClientsService,
    private commonService: CommonService,
    private dialogModal: MatDialog,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private notifireService: NotifierService,
    private clientService: ClientsService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.currentUser = user;
    });
    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    this.getAllLabReferralList(this.currentUser.id);
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

  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage = 0;
    this.pageSize = 5;
    this.getAllLabReferralList(this.currentUser.id);
  }

  getAllLabReferralList(labId: number) {
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
      .getAllLabReferralList(
        labId,
        "RADIOLOGY",
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1,
        null
      )
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          console.log(response);

          this.labReferrals = new MatTableDataSource<any>(response.data);
          // this.labReferrals.paginator = this.paginator;
          // this.labReferrals = response.data;
          this.metaData = response.meta;
        } else {
          this.labReferrals = [];
          this.metaData = null;
        }
      });
  }

  onStatusChange(event: MatSelectChange, element: any) {
    element.status = event.value; // Assign the selected value to element.status
    let reqData = {
      LabReferralId: element.labReferralId,
      status: event.value,
    };
    this.clientService.updateLabReferralStatus(reqData).subscribe((res) => {
      if (res.statusCode == 200) {
        this.notifireService.notify("success", res.message);
        this.getAllLabReferralList(this.currentUser.id);
      } else {
        this.notifireService.notify("error", res.message);
      }
    });
  }

  // getAllReferralByPatientId(radiologyId: number) {
  //   let fromDate = "";
  //   let toDate = "";
  //   let searchKey = "";

  //   this.clientService
  //     .getRadiologyReferrals(
  //       null,
  //       null,
  //       radiologyId,
  //       searchKey,
  //       fromDate,
  //       toDate
  //     )
  //     .subscribe((response: any) => {
  //       if (response.statusCode == 200) {
  //         console.log(response);

  //         response.data.map((ele) =>
  //           ele.radiologyName
  //             ? (ele.radiologyName = ele.radiologyName)
  //             : (ele.radiologyName = ele.fullName)
  //         );
  //        // this.labReferralList = response.data;
  //         this.labReferralList = new MatTableDataSource<any>(response.data);
  //         this.labReferralList.paginator = this.paginator;
  //        // console.log(this.labReferralList)
  //         // this.metaData = response.meta;
  //       } else {
  //         this.labReferralList = [];
  //         this.metaData = null;
  //       }
  //     });

  // }

  onTableActionClick(actionObj: any) {
    if (actionObj.action == "view") {
      this.openFileDownloadModal(actionObj);
    }
  }

  openFileDownloadModal(data: any) {
    const modalPopup = this.dialogModal.open(
      RadiologyReferralFileUploadComponent,
      {
        hasBackdrop: true,
        width: "70%",
        height: "60%",
        data: data,
      }
    );

    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllLabReferralList(this.currentUser.id);
      }
    });
  }

  // Uploaddicomfile(data: any) {
  //   const modalPopup = this.dialogModal.open(RadiologyUploadDicomFileComponent, {
  //     hasBackdrop: true,
  //     width: "70%",
  //     height: "60%",
  //     data: data,
  //   });

  //   modalPopup.afterClosed().subscribe((result) => {
  //     if (result == "save") {
  //       this.getAllLabReferralList(this.currentUser.id);
  //     }
  //   });
  // }

  setPagePaginator = (event: any) => {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllLabReferralList(this.currentUser.id);

    // this.getAllReferralByPatientId(this.currentUser.id);
  };

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
  // downloadTemplate = (act) => {
  //   let fileName = act.patientName;
  //   this.clientService
  //     .getLabReferralPdfById(act.labReferralID)
  //     .subscribe((response: any) => {
  //       if (response) {
  //         let byteChar = atob(response.data.toString());
  //         let byteArray = new Array(byteChar.length);
  //         for (let i = 0; i < byteChar.length; i++) {
  //           byteArray[i] = byteChar.charCodeAt(i);
  //         }

  //         let uIntArray = new Uint8Array(byteArray);
  //         let file = new Blob([uIntArray], { type: "application/pdf" });
  //         var fileURL = URL.createObjectURL(file);
  //         var a = document.createElement("a");
  //         document.body.appendChild(a);
  //         a.target = "_blank";
  //         a.href = fileURL;
  //         a.download = fileName;
  //         a.click();
  //         a.remove();

  //         const nav = window.navigator as any;
  //         if (nav && nav.msSaveOrOpenBlob) {
  //           nav.msSaveOrOpenBlob(file);
  //           return;
  //         }
  //         const data = window.URL.createObjectURL(file);
  //         var link = document.createElement("a");
  //         document.body.appendChild(link);
  //         link.href = data;
  //         link.target = "_blank";
  //         link.click();

  //         setTimeout(function () {
  //           document.body.removeChild(link);
  //           window.URL.revokeObjectURL(data);
  //         }, 100);
  //       }
  //     });
  // };

  // viewDocument = (act) => {
  //   // window.open(act.data.url, '_blank')
  //   this.clientService
  //     .getLabReferralPdfById(act.labReferralID)
  //     .subscribe((response: any) => {
  //       let byteChar = atob(response.data.toString());
  //       let byteArray = new Array(byteChar.length);
  //       for (let i = 0; i < byteChar.length; i++) {
  //         byteArray[i] = byteChar.charCodeAt(i);
  //       }

  //       let uIntArray = new Uint8Array(byteArray);
  //       let newBlob = new Blob([uIntArray], { type: "application/pdf" });
  //       const nav = window.navigator as any;
  //       if (nav && nav.msSaveOrOpenBlob) {
  //         nav.msSaveOrOpenBlob(newBlob);
  //         return;
  //       }
  //       const data = window.URL.createObjectURL(newBlob);
  //       var link = document.createElement("a");
  //       document.body.appendChild(link);
  //       link.href = data;
  //       link.target = "_blank";
  //       link.click();

  //       setTimeout(function () {
  //         document.body.removeChild(link);
  //         window.URL.revokeObjectURL(data);
  //       }, 100);
  //     });
  // };
  // changeStatus(data: any) {
  //   this.checked = true;
  //   this.clientService.UpdateSampleCollectionStatus(data.labReferralId, this.checked).subscribe((response: any) => {

  //   });
  // }
  changeStatus(data: any) {
    data.isSampleCollected ? (this.checked = false) : (this.checked = true);
    if (this.checked == false) {
      this.SampleCollectionDate = "";
      this.clientService
        .UpdateSampleCollectionStatus(
          data.labReferralId,
          this.SampleCollectionDate,
          this.checked
        )
        .subscribe((response: any) => {});
    }
  }
  OnDateChange(data: any, eventDate: any) {
    this.SampleCollectionDate = eventDate.value;
    if (
      data.isSampleCollected &&
      this.checked == false &&
      this.SampleCollectionDate != ""
    ) {
      this.checked = data.isSampleCollected;
      this.clientService
        .UpdateSampleCollectionStatus(
          data.labReferralId,
          this.SampleCollectionDate,
          this.checked
        )
        .subscribe((response: any) => {});
    }
    if (
      data.isSampleCollected == false &&
      this.checked == true &&
      this.SampleCollectionDate != ""
    ) {
      this.clientService
        .UpdateSampleCollectionStatus(
          data.labReferralId,
          this.SampleCollectionDate,
          this.checked
        )
        .subscribe((response: any) => {});
    }
    // if (this.checked == false) {
    //   this.SampleCollectionDate = "";
    //   this.clientService.UpdateSampleCollectionStatus(data.labReferralId, this.SampleCollectionDate,
    //     this.checked).subscribe((response: any) => {
    //     });
    // }
    // if (this.checked && this.SampleCollectionDate != "") {
    //   this.clientService.UpdateSampleCollectionStatus(data.labReferralId, this.SampleCollectionDate,
    //     this.checked).subscribe((response: any) => {
    //     });
    // }
  }
  viewInsuranceDocument(act: any) {
    this.clientService
      .PatientInsurancePdfByPatientId(act.patientId)
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
      .PatientInsurancePdfByPatientId(act.patientId)
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

  applyStartDateFilter = (event:any) => {
    console.log(event);
  };
  applyEndDateFilter = (event:any) => {
    console.log(event);
  };
  imageInhancer = (element:any, type:any) => {
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
