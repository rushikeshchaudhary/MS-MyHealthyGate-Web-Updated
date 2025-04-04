import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from "angular-notifier";
import { ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService } from "../clients-details/clients.service";
import { LabReferrralFileUploadComponent } from "../lab-referrral-file-upload/lab-referrral-file-upload.component";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";

@Component({
  selector: "app-lab-referral",
  templateUrl: "./lab-referral.component.html",
  styleUrls: ["./lab-referral.component.css"],
})
export class LabReferralComponent implements OnInit {
  SampleCollectionDate: any = "";
  labReferrals: any;
  metaData: any;
  currentUser: any;
  checked = false;
  labRoleId: number = 325;
  testFormGroup!: FormGroup;
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  selectedStatusRow:any;
  isDropDownShow:boolean=false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // displayColumns: Array<any> = [
  //   {
  //     displayName: "Patient Name",
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
  //   // { displayName: "SampleCollected", key: "sample", class: "", isSort: false },
  //   {
  //     displayName: "Collection Date",
  //     key: "sampledate",
  //     class: "",
  //     isSort: false,
  //   },
  //   { displayName: "Insurance/ Others", key: "Inc", class: "", isSort: false },
  //   { displayName: "Referral", key: "Referral", class: "", isSort: false },
  //   { displayName: "Actions", key: "Actions", class: "", isSort: false },
  // ];
  displayedColumns = [
    "Patient Name",
    "Provider Name",
    "Test Name",
    "Status", 
    "Referal Date",
    "Notes",
    "Collection Date",
    "QrCode",
    //"Insurance/ Others",
    //"Referral",
    "Actions",
  ];
  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];

  statusArray = [
    'Request Raised',
    'In Progress',
    'Sample Collected',
    'Partialy Uploaded',
    'Report Uploaded'
  ]

  constructor(
    private dialogModal: MatDialog,
    private clientService: ClientsService,
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private notifireService:NotifierService
  ) {}

  



  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.testFormGroup = this.formBuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
      Searchbydob:"",

    });
    this.getAllLabReferralList(this.currentUser.id);
  }



  get labReferalForm() {
    return this.testFormGroup.controls;
  }

  setIntialValues() {
    var date = new Date();
    this.labReferalForm["Searchbydob"].setValue(
      new Date(date.getFullYear(), date.getMonth() - 0, 1)
    );
    this.labReferalForm["rangeStartDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() - 0, 1)
    );
    this.labReferalForm["rangeEndDate"].setValue(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    );
  }
  onTableActionClick(action: any, data: any) {
    const actionObj = {
      action,
      data,
    };
    switch ((action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.downloadTemplate(actionObj);
        break;
      case "VIEW":
        this.openFileUploadModal(actionObj);
        break;
      default:
        break;
    }
  }
  openFileUploadModal(data: any) {
    const modalPopup = this.dialogModal.open(LabReferrralFileUploadComponent, {
      hasBackdrop: true,
      width: "70%",
      height: "60%",
      data: data,
    });
    modalPopup.afterClosed().subscribe((result) => {
      if (result == "save") {
        this.getAllLabReferralList(this.currentUser.id);
      }
    });
  }

  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage=0;
    this.pageSize=5
    this.getAllLabReferralList(this.currentUser.id);
  }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferralList(this.currentUser.id);
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferralList(this.currentUser.id);
  }
  applyDobFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["Searchbydob"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferralList(this.currentUser.id);
  }

  getAllLabReferralList(labId: number) {
    debugger;
    let dob =
    this.labReferalForm["Searchbydob"].value != null &&
    this.labReferalForm["Searchbydob"].value != ""
      ? this.datePipe.transform(
          new Date(this.labReferalForm["Searchbydob"].value),
          'MM/dd/yyyy'
        )
      : "";
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
       "LAB",
        searchKey,
        fromDate,
        toDate,
        this.pageSize,
        this.currentPage + 1,
        dob
      )
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          console.log(response);

          this.labReferrals = new MatTableDataSource<any>(response.data);
          this.labReferrals.paginator = this.paginator;
          // this.labReferrals = response.data;
          this.metaData = response.meta;
        } else {
          this.labReferrals = [];
          this.metaData = null;
        }
      });
  }
  downloadTemplate = (act:any) => {
    let fileName = act.patientName;
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
        if (response && response.data && Object.keys(response.data).length > 0){
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
        else{
          this.notifireService.notify('error', "Data not found");
        }
      });
  };
  viewDocument = (act:any) => {
    // window.open(act.data.url, '_blank')
    this.clientService
      .getLabReferralPdfById(act.labReferralId)
      .subscribe((response: any) => {
        if (response && response.data && Object.keys(response.data).length > 0){
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
      }
      else{
        this.notifireService.notify('error', "Data not found");
      }
      });
  };
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
        if (response && response.data && Object.keys(response.data).length > 0){
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
      }
      else{
        this.notifireService.notify('error', "Data not found");
      }
      });
  }
  downloadInsuranceTemplate(act: any) {
    let fileName = act.patientName;
    this.clientService
      .PatientInsurancePdfByPatientId(act.patientId)
      .subscribe((response: any) => {
        if (response && response.data && Object.keys(response.data).length > 0){
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
        else{
          this.notifireService.notify('error', "Data not found");
        }
      });
  }

  setPagePaginator = (event: any) => {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllLabReferralList(this.currentUser.id);

    // this.getAllReferralByPatientId(this.currentUser.id);
  };



  onStatusChange(event: MatSelectChange, element: any) {
    element.status = event.value; // Assign the selected value to element.status
    let reqData = {
      LabReferralId:element.labReferralId,
      status:event.value
    }
    this.clientService.updateLabReferralStatus(reqData).subscribe((res)=>{
      if(res.statusCode==200){
        this.notifireService.notify('success',res.message)
        this.getAllLabReferralList(this.currentUser.id);
      }else{
        this.notifireService.notify('error',res.message)
      }
    })
    
  }
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
