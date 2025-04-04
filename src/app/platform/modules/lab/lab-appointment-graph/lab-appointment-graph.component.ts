import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { format } from "date-fns";
import { ViewLabAppointmentPatientComponent } from "../../client-portal/manage-lab-booking/view-lab-appointment-patient/view-lab-appointment-patient.component";
import { FilterLabReferralModel, FilterModel, Metadata, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { LabService } from "../lab.service";
import { LabActionDialogBoxComponent } from "./lab-action-dialog-box/lab-action-dialog-box.component";
import { ClientsService } from '../../../../../app/platform/modules/client-portal/clients-details/clients.service';
import { LabReferrralFileUploadComponent } from "../../client-portal/lab-referrral-file-upload/lab-referrral-file-upload.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { time } from "console";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { NotifierService } from "angular-notifier";
import { QRImageInhanserComponent } from "src/app/shared/QrCodeScanPage/qrimage-inhanser/qrimage-inhanser.component";


@Component({
  selector: "app-lab-appointment-graph",
  templateUrl: "./lab-appointment-graph.component.html",
  styleUrls: ["./lab-appointment-graph.component.css"],
})
export class LabAppointmentGraphComponent implements OnInit {
  labFilterform!: FormGroup;
  invitedDisplayedColumns: Array<any>;
  invitedPatientAppointment: Array<any> = [];
  invitedActionButtons: Array<any>;
  allAppointmentsActionButtons: Array<any>;
  invitedAppointmentMeta!: Metadata;
  showTooltip: boolean = false;
  labData: any;
  labFilterData = new FilterLabReferralModel(128,0,'',null,null,null,null,1,10,'','','');
  pendingsAppointment: any;
  cancelAppointment: any;
  approvedAppointment: any;
  labAppointmentFilter: FilterModel;
  metaDataPrescription!: Metadata;
  labReferrals: any;
  metaData: any;
  totalReferral:number=0;
  testFormGroup!: FormGroup;
  referralStatus: any = ["All", "Request Raised", "Pending Report", "Report Uploaded"];
  selected:any;
  isLoadAppointment:boolean=true;
  labRoleId: number = 325;
  pageSize = 5;
  currentPage = 0;
  currentUser: any;
  totalSize=0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private formbuilder: FormBuilder,
    private labService: LabService,
    private commonService: CommonService,
    private dailog: MatDialog,
    private router: Router,
    private clientService: ClientsService,
    private datePipe: DatePipe,
    private translate:TranslateService,
    private dialogModal: MatDialog,
    private notifireService:NotifierService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.invitedDisplayedColumns = [
      {
        displayName: "patient_name",
        key: "patientName",
        width: "120px",
        type: "link",
        sticky: true,
      },
      {
        displayName: "appointment_type",
        key: "bookingType",
        width: "130px",
      },
      {
        displayName: "appointment_mode",
        key: "bookingMode",
        width: "120px",
      },
      {
        displayName: "date_time",
        key: "startDateTime",
        width: "250px",
        type: "link",
        url: "/web/member/scheduling",
        queryParamsColumn: "queryParamsObj",
      },

      { displayName: "actions", key: "Actions", width: "80px", sticky: true },
    ];
    this.invitedActionButtons = [
      {
        displayName: "Accept Invitation",
        key: "accept",
        class: "fa fa-check",
      },
      { displayName: "Reject Invitation", key: "reject", class: "fa fa-ban" },
    ];
    this.allAppointmentsActionButtons = [
      {
        displayName: "Waiting-room info",
        key: "video",
        class: "fa fa-wpforms fa-custom",
        //class:" fa fa-video-camera"
      },
    ];
    this.labAppointmentFilter = new FilterModel();
  }
  // displayColumns: Array<any> = [
  //   { displayName: "patient_name", key: "patientName", class: "", isSort: false },
  //   { displayName: "provider_name", key: "providerName", class: "", isSort: false },
  //   { displayName: "Test Name", key: "testName", class: "", isSort: false },
  //   { displayName: "Status", key: "status", class: "", type: "statusReportupload", isSort: false },
  //   { displayName: "Referral Date", key: "referralDate", class: "", type: "date", isSort: false },
  //   { displayName: "Test Date", key: "testDate", class: "", type: "date", isSort: false },
  //   { displayName: "notes", key: "notes", class: "", isSort: false },
  //   { displayName: "actions", key: "Actions", class: "", isSort: false }
  // ];
  // actionButtons: Array<any> = [
  //   { displayName: "Download", key: "download", class: "fa fa-download" },
  //   { displayName: "View", key: "view", class: "fa fa-eye" }
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

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.testFormGroup = this.formbuilder.group({
      searchKey: "",
      rangeStartDate: "",
      rangeEndDate: "",
    });
    this.getAllLabReferralList(this.currentUser.id);
    // this.labFilterData.labId = this.labData.id;
    // this.getAllFilterLabReferralsByLabId();
    // this.labFilterform = this.formbuilder.group({
    //   referralDate: [],
    //   testDate: [],
    //   endreferralDate:[],
    //   endtestDate:[],
    //   searchText: [],
    //   referralstatus: []     
    // });
  }
  get labReferalForm() {
    return this.testFormGroup.controls;
  }
  searchFilter(event: any) {
    console.log(event.target.value);
    this.labFilterData.searchText = event.target.value;
    this.getAllFilterLabReferralsByLabId();
  }
  get f() {
    return this.labFilterform.controls;
  }
  onTabChanged = (event: any) => {
    //this.selectedIndex = event.index;
    this.showTooltip = false;
    if (event.index == 0) {
      // this.getDataForAppointmentLineChart(this.filterParamsForAppointent);
      //this.getAllFilterLabReferralsByLabId();
      this.getAllLabReferralList(this.currentUser.id);
    } else if (event.index == 1) {
      this.showTooltip = true;
      this.getApprovedPatientAppointmentList();
    } else if (event.index == 2) {
      this.getCancelledPatientAppointmentList();
    } else if (event.index == 3) {
      //this.getCancelledPatientAppointmentList();
      this.getPendingInvitedAppointmentList();
    }
  };

  getPendingInvitedAppointmentList = () => {
    this.labService
      .GetFilterLabAppointmentByLabId(this.labData.id, "Invited", null, null, this.labAppointmentFilter, null)
      .subscribe((res) => {
        this.pendingsAppointment = res.data;
        this.pendingsAppointment = this.pendingsAppointment.map((x:any) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
        this.metaDataPrescription = res.meta || new Metadata();
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];

      });
  };
  getCancelledPatientAppointmentList = () => {
    this.labService
      .GetFilterLabAppointmentByLabId(this.labData.id, "INVITATION_REJECTED", null, null, this.labAppointmentFilter, null)
      .subscribe((res) => {
        this.cancelAppointment = res.data;
        this.cancelAppointment = this.cancelAppointment.map((x:any) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
        this.metaDataPrescription = res.meta || new Metadata();
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];

      });
  }
  getApprovedPatientAppointmentList = () => {
    this.labService
      .GetFilterLabAppointmentByLabId(this.labData.id, "INVITATION_ACCEPTED", null, null, this.labAppointmentFilter, null)
      .subscribe((res) => {
        this.approvedAppointment = res.data;
        this.approvedAppointment = this.approvedAppointment.map((x:any) => {
          x.startDateTime =
            format(x.startDateTime, 'MM/dd/yyyy') +
            " (" +
            format(x.startDateTime, 'h:mm a') +
            " - " +
            format(x.endDateTime, 'h:mm a') +
            ")";
          return x;
        });
        this.metaDataPrescription = res.meta || new Metadata();
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];

      });
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
        "LAB",
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
          this.labReferrals.paginator = this.paginator;
          // this.labReferrals = response.data;
          this.metaData = response.meta;
        } else {
          this.labReferrals = [];
          this.metaData = null;
        }
      });
  }
  getAllFilterLabReferralsByLabId() {
    this.clientService.getAllFilterLabReferralsByLabId(this.labFilterData).subscribe
      ((response: ResponseModel) => {
        if (response.statusCode == 200) {
          this.labReferrals = response.data;
          this.labReferrals = this.labReferrals.map((x:any)=>{
            x.testDate=x.testDate=="0001-01-01T00:00:00"?"":x.testDate;
            return x;
          });
          this.metaData = response.meta;
          this.totalReferral=this.metaData.totalRecords!=undefined?this.metaData.totalRecords:0;
        } else {
          this.labReferrals = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  // applyreferralDateFilter(event: MatDatepickerInputEvent<Date>) {
  //   this.f.referralDate.setValue(new Date(event.value));
  //   this.labFilterData.referralDate = this.f.referralDate.value!=null && this.f.referralDate.value!= ""? this.datePipe.transform(new Date(this.f.referralDate.value), 'MM/dd/yyyy'):"";
  //   this.applyFilter();
  // }

  applyStartDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeStartDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferralList(this.currentUser.id);
  }
  applyEndDateFilter(event: MatDatepickerInputEvent<Date>) {
    this.labReferalForm["rangeEndDate"].setValue(event.value ? new Date (event.value) : null);
    this.getAllLabReferralList(this.currentUser.id);
  }

  // applyTestDateFilter(event: MatDatepickerInputEvent<Date>) {
  //   this.f.testDate.setValue(new Date(event.value));
  //   this.labFilterData.testDate = this.f.testDate.value != null && this.f.testDate.value!=""?this.datePipe.transform(new Date(this.f.testDate.value), 'MM/dd/yyyy'):"";
  //   this.applyFilter();
  // }
  // applyendTestDateFilter(event: MatDatepickerInputEvent<Date>){
  //   this.f.endtestDate.setValue(new Date(event.value));
  //   this.labFilterData.endtestDate = this.f.endtestDate.value != null && this.f.endtestDate.value!=""?this.datePipe.transform(new Date(this.f.endtestDate.value), 'MM/dd/yyyy'):"";
  //   this.applyFilter();
  // }
  // applyendreferralDateFilter(event: MatDatepickerInputEvent<Date>){
  //   this.f.endreferralDate.setValue(new Date(event.value));
  //   this.labFilterData.endreferralDate = this.f.endreferralDate.value!=null && this.f.endreferralDate.value!= ""? this.datePipe.transform(new Date(this.f.endreferralDate.value), 'MM/dd/yyyy'):"";
  //   this.applyFilter();
  // }
  // applyFilter() {
  //   this.setPaginatorModel(
  //     this.labFilterData.organizationId,
  //     this.labFilterData.labId,
  //     this.labFilterData.searchText,
  //     this.labFilterData.referralDate,
  //     this.labFilterData.endreferralDate,      
  //     this.labFilterData.testDate,
  //     this.labFilterData.endtestDate,
  //     this.labFilterData.pageNumber,
  //     this.labFilterData.pageSize,
  //     this.labFilterData.sortColumn,
  //     this.labFilterData.sortOrder,
  //     this.labFilterData.status);
  // }
  // clearFilters(){
  //   this.labFilterform.reset();
  //   this.setPaginatorModel( 
  //     this.labFilterData.organizationId,
  //     this.labFilterData.labId,
  //     null,
  //     null,
  //     null,
  //     null,
  //     null,
  //     1,
  //     10,
  //     null,
  //     null,
  //     null);
  // }
  clearFilters() {
    this.testFormGroup.reset();
    this.currentPage=0;
    this.pageSize=5
    this.getAllLabReferralList(this.currentUser.id);
  }
  // statusChangeHandler(event:any){
  //   this.labFilterData.status=event!=null && event!=""?event:"";
  //   this.applyFilter();
  // }
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
  onTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
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

  onPendingInvitationTableActionClick=(actionObj:any)=>{
    console.log(event)
       switch ((actionObj.action || "").toUpperCase()) {
      case "ACCEPT":
        this.createActionAppointmentModel(actionObj);
        break;
      case "REJECT":
        this.createActionAppointmentModel(actionObj);
        break;

      default:
        break;
    }
  }

  onTableRowClick(actionObj?: any) {
    
    if((actionObj.action).toUpperCase()=="VIDEO"){
      this.labService.setLabAppointmentDetails(actionObj)
      this.router.navigate([
        "/web/lab/waitingroom/" + actionObj.data.patientAppointmentId,
      ]);
    }else{
      const modalPopup = this.dailog.open(ViewLabAppointmentPatientComponent, {
        hasBackdrop: true,
        data: actionObj.data,
        width: "80%",
      });

    }

   
  }
  

 

  createActionAppointmentModel=(allData:any)=>{
    let dbModal;
    dbModal = this.dailog.open(LabActionDialogBoxComponent, {
      hasBackdrop: true,
      data: allData
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "SAVE") {
        this.getPendingInvitedAppointmentList();
      }
    });
  }
  // setPaginatorModel(organizationId: number, labId: number, searchText: string, referralDate: any,endreferralDate: any, testDate: any, endtestDate: any,pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, status: string) {
  //   this.labFilterData.organizationId = organizationId;
  //   this.labFilterData.labId = labId;
  //   this.labFilterData.searchText = searchText!=""?searchText:null;
  //   this.labFilterData.referralDate = referralDate;
  //   this.labFilterData.endreferralDate = endreferralDate;
  //   this.labFilterData.testDate = testDate;
  //   this.labFilterData.endtestDate = endtestDate;
  //   this.labFilterData.pageNumber = pageNumber;
  //   this.labFilterData.pageSize = pageSize;
  //   this.labFilterData.sortColumn = sortColumn !=""?sortColumn:null;
  //   this.labFilterData.sortOrder = sortOrder!=""?sortOrder:null;
  //   this.labFilterData.status = status!=""?status:null;
  //   this.getAllFilterLabReferralsByLabId();
  // }
  setPagePaginator = (event: any) => {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getAllLabReferralList(this.currentUser.id);

    // this.getAllReferralByPatientId(this.currentUser.id);
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
