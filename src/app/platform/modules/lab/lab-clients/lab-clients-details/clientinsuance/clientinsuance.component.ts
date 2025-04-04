import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { LabclientheaderComponent } from '../labclientheader/labclientheader.component';
import { PatientInsuranceModel } from 'src/app/platform/modules/agency-portal/clients/insurance.model';
import { FilterModel, ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/platform/modules/core/services/common.service';
import { NotifierService } from 'angular-notifier';
import { ClientsService } from 'src/app/platform/modules/client-portal/clients.service';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'date-fns';
import { InsuranceModalComponent } from 'src/app/platform/modules/agency-portal/clients/insurance/insurance-modal/insurance-modal.component';

@Component({
  selector: 'app-clientinsuance',
  templateUrl: './clientinsuance.component.html',
  styleUrls: ['./clientinsuance.component.css']
})
export class ClientinsuanceComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @ViewChild(LabclientheaderComponent)
  child!: LabclientheaderComponent;
  @ViewChild("tabContent", { read: ViewContainerRef })
  private tabContent!: ViewContainerRef;
  clientTabs: any;
  header: string = "Insurance";
  insuranceModel: Array<PatientInsuranceModel> = [];
  clientId!: number;
  selectedIndex: number = 0;
  dataURL: any;
  metaData: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  addPermission!: boolean;
  insuranceModelWithoutFilter: Array<any> = [];
  showLoader = false;
  authModel!: PatientInsuranceModel;
  filterModel: FilterModel;
  role!: string;
  isAuth!: boolean;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private notifier: NotifierService,
    private router: Router,
    private clientService: ClientsService,
    private dialogService: DialogService,
    private dialogModal: MatDialog,
  ) {
    this.filterModel=new FilterModel();
    this.displayedColumns = [
      {
        displayName: "Insurance Company",
        key: "insuranceCompanyName",
        isSort: true,
      },
      { displayName: "Issue Date", key: "cardIssueDate", isSort: true },
      { displayName: "Id Number", key: "insuranceIDNumber" },
      { displayName: "Plan Name", key: "insurancePlanName" },
      { displayName: "Insurance Plan Type", key: "insurancePlanTypeID" },
      {
        displayName: "Company Address",
        key: "insuranceCompanyAddress",
        isSort: true,
      },{
        displayName: "Actions",
        key: "Actions",
        class: "",
        width: "15%",
      },
    ];
    this.actionButtons = [
      //{ displayName: "Edit", key: "edit", class: "fa fa-edit" },
       { displayName: "View", key: "view", class: "fa fa-eye" },
      //{ displayName: "Delete", key: "delete", class: "fa fa-trash" },
    ];
  }

  ngOnInit() {
    this.commonService.loadingStateSubject.next(true);


    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params['id'] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params['id'], false);
      });
    } else {
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        
        this.role=user.userRoles.roleName.toLowerCase();
        this.isAuth=user.userRoles.roleName.toLowerCase() == "provider";
      }
    })



    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.clientId =
    //     params.id == undefined
    //       ? null
    //       : this.commonService.encryptValue(params.id, false);
    // });
    //this.getUserPermissions();
    this.getPatientInsuranceList(this.filterModel);
    this.commonService.loadingStateSubject.next(false);
  }
  getPatientInsuranceList(filter:FilterModel) {
    this.clientService
      .getPatientInsurance(this.clientId,filter)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          // console.log(response.data.PatientInsurance);
          this.metaData = response.meta;
          this.insuranceModel = response.data.PatientInsurance.map((x:any) => {
            x.cardIssueDate = format(x.cardIssueDate, 'MM/dd/yyyy');
            return x;
          });
          this.insuranceModelWithoutFilter = JSON.parse(JSON.stringify(response.data));
        }
      });
  }
  sortHandler = (type: string) => {
    if (type === "atoz") {
      this.insuranceModel = this.insuranceModel.sort((a, b) => a.insuranceCompanyName.localeCompare(b.insuranceCompanyName));
      console.log('after sorting', this.insuranceModel);
      this.insuranceModel = [...this.insuranceModel];
    } else if (type === "ztoa") {
      this.insuranceModel = this.insuranceModel.sort((a, b) => b.insuranceCompanyName.localeCompare(a.insuranceCompanyName));
      this.insuranceModel = [...this.insuranceModel];
    } else if (type === "oldest") {
      this.insuranceModel = this.insuranceModel.sort((a, b) => new Date(a.cardIssueDate).getTime() - new Date(b.cardIssueDate).getTime());
      this.insuranceModel = [...this.insuranceModel];
    } else if (type === "latest") {
      this.insuranceModel = this.insuranceModel.sort((a, b) => new Date(b.cardIssueDate).getTime() - new Date(a.cardIssueDate).getTime());
      this.insuranceModel = [...this.insuranceModel];
    } else {
      this.insuranceModel = this.insuranceModelWithoutFilter;
    }
  };
  //page load and sorting
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(
  //     changeState.pageNumber,
  //     this.filterModel.pageSize,
  //     changeState.sort,
  //     changeState.order,
  //     this.filterModel.searchText
  //   );
  //   this.getVitalList(this.filterModel, "grid");
  // }
  // setPaginatorModel(
  //   pageNumber: number,
  //   pageSize: number,
  //   sortColumn: string,
  //   sortOrder: string,
  //   searchText: string
  // ) {
  //   this.filterModel.pageNumber = pageNumber;
  //   this.filterModel.pageSize = pageSize;
  //   this.filterModel.sortOrder = sortOrder;
  //   this.filterModel.sortColumn = sortColumn;
  //   this.filterModel.searchText = searchText;
  // }
  getUserPermissions() {
    const actionPermissions = this.clientService.getUserScreenActionPermissions(
      "CLIENT",
      "CLIENT_VITALS_LIST"
    );
    const {
      CLIENT_VITALS_LIST_ADD,
      CLIENT_VITALS_LIST_UPDATE,
      CLIENT_VITALS_LIST_DELETE,
    } = actionPermissions;
    if (!CLIENT_VITALS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "edit"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }
    if (!CLIENT_VITALS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "delete"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }

    this.addPermission = CLIENT_VITALS_LIST_ADD || false;
  }

    ////Insurance
    openInsuranceDialog(insu?: any) {
      console.log("Id", insu);
      if (insu != null) {
        this.createInsuranceModal(insu.data);
      } else {
        let obj = new PatientInsuranceModel();
        obj.id = 0;
        obj.patientID = this.clientId;
        this.createInsuranceModal(obj);
      }
    }

    loadInsuranceData(insuranceId:number,clientId:number){
     console.log(insuranceId, clientId,"insuranceId, clientId,")
     this.clientService.getPatientInsurancePdf(insuranceId,clientId).subscribe(res=>{
      console.log(res);
      if(res.data){
        let byteChar = atob(res.data);
        let byteArray = new Array(byteChar.length);
        for (let i = 0; i < byteChar.length; i++) {
          byteArray[i] = byteChar.charCodeAt(i);
        }
  
        let uIntArray = new Uint8Array(byteArray);
        let newBlob = new Blob([uIntArray], { type: 'application/pdf' });
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
     });
    }

    createInsuranceModal(clientInsuranceListModel: PatientInsuranceModel) {
      var insuranceModal = this.dialogModal.open(InsuranceModalComponent, {
        hasBackdrop: true,
        data: clientInsuranceListModel,
      });
      insuranceModal.afterClosed().subscribe((result: string) => {
        if (result === "Save") {
          this.getPatientInsuranceList(this.filterModel);
          this.showLoader = true;
        }
      });
    }
  onInsuranceTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openInsuranceDialog(actionObj);
        break;
      case "VIEW":
        this.loadInsuranceData(actionObj.data.id, this.clientId);
        break;
      case "DELETE":
        this.deleteInsurance(actionObj.data.id, this.clientId);
        break;
      default:
        break;
    }
  }
  deleteInsurance(id: number, clientId: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this insurance?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deletePatientInsurance(id, clientId)
            .subscribe((response: any) => {
              if (response != null && response.data != null) {
                if (response.statusCode == 204) {
                  this.notifier.notify("success", response.message);
                  this.getPatientInsuranceList(this.filterModel);
                } else {
                  this.notifier.notify("error", response.message);
                }
              }
            });
        }
      });
  }
  onPageOrSortChange(changeState?: any) {
  //  changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      this.filterModel.pageSize,
      "",
      "",
      this.filterModel.searchText
    );
    this.getPatientInsuranceList(this.filterModel);
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
}
