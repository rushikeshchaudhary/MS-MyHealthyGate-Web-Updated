import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PatientInsuranceModel } from '../insurance.model';
import { InsuranceModalComponent } from '../insurance/insurance-modal/insurance-modal.component';
import { format } from 'date-fns';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from "../../../client-portal/clients.service";
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../../core/services';
import { ClientHeaderComponent } from '../client-header/client-header.component';
import { AuthorizationModalComponent } from '../authorization/authorization-modal/authorization-modal.component';
import { AuthModel } from '../authorization/authorization.model';
import { PatientAuthorizationModel } from '../../../client-portal/client-profile.model';
import { MatTableDataSource } from '@angular/material/table';
class AuthorizationFilterModel extends FilterModel {
  authType!: string;
}
@Component({
  selector: 'app-health-plan-coverage',
  templateUrl: './health-plan-coverage.component.html',
  styleUrls: ['./health-plan-coverage.component.css']
})
export class HealthPlanCoverageComponent implements OnInit {
  @Input() encryptedPatientId:any;
  @ViewChild(ClientHeaderComponent) child!: ClientHeaderComponent;
  // @ViewChild("tabContent", { read: ViewContainerRef })
  // private tabContent: ViewContainerRef;
  clientTabs: any;
  header: string = "Health Coverage Plan";
  clientId!: number;
  selectedIndex: number = 0;
  dataURL: any;
  metaData: any;
  addPermission: boolean = false;
  filterModel: FilterModel;
  authModel: AuthModel = new AuthModel;
  authorizationFilterModel: AuthorizationFilterModel = new AuthorizationFilterModel;
  clientAthorizationListModel:  any = new MatTableDataSource();
  authorizationColumns: Array<any>;
  immunizationActionButtons: Array<any>;
  role!:string;
  isAuth: boolean = false;
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
    this.authorizationColumns = [
      {
        displayName: "authorizations_number",
        key: "authorizationNumber",
        class: "",
        width: "20%",
      },
      {
        displayName: "title",
        key: "authorizationTitle",
        class: "",
        width: "20%",
      },
      {
        displayName: "insurance_company",
        key: "payerName",
        class: "",
        width: "20%",
      },
      {
        displayName: "start_date",
        key: "startDate",
        width: "10%",
        type: "date",
      },
      { displayName: "end_date", key: "endDate", width: "10%", type: "date" },
      {
        displayName: "actions",
        key: "Actions",
        class: "",
        width: "20%",
      },      
    ];
    this.immunizationActionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-edit" },
      // { displayName: "View", key: "view", class: "fa fa-eye" },
      { displayName: "Delete", key: "delete", class: "fa fa-trash" },
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
    this.getPatientAuthorizationList();
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        
        this.role=user.userRoles.roleName.toLowerCase();
        this.isAuth=user.userRoles.roleName.toLowerCase() == "provider";
      }
    })
    this.commonService.loadingStateSubject.next(false);
  }
  onHealthPlanCoverageTableActionClick(event?:any){
    switch ((event.action || "").toUpperCase()) {
      case "EDIT":
        this.openAuthorizationDialog(event.data.authorizationId)
        break;
      case "DELETE":
        this.deleteAuthorizationDetails(event.data.authorizationId);
        break;
      default:
        break;
    }
  }

  deleteAuthorizationDetails(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this authorization?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientService
            .deleteAuthorization(id)
            .subscribe((response: any) => {
              if (response.statusCode == 200 || response.statusCode == 204) {
                this.notifier.notify("success", response.message);
                this.authorizationFilterModel = new AuthorizationFilterModel();
                //listing of all authorization
                this.getPatientAuthorizationList();
              } else if (response.statusCode === 401) {
                this.notifier.notify("warning", response.message);
              } else {
                this.notifier.notify("error", response.message);
              }
            });
        }
      });
  }

  openAuthorizationDialog(id: number) {
    if (id != null && id > 0) {
      this.clientService.getAuthorizationById(id).subscribe((response: any) => {
        if (
          response != null &&
          response.statusCode == 200 &&
          response.data != null
        ) {
          this.authModel = response.data;
          this.createAuthorizationModel(this.authModel);
        }
      });
    } else {
      this.authModel = new AuthModel();
      this.authModel.patientID = this.clientId;
      this.createAuthorizationModel(this.authModel);
    }
  }

  onPageOrSortChange(event:any){
    this.setPaginatorModel(event.pageIndex + 1, event.pageSize, event.sort, event.order, this.filterModel.searchText);
    this.getPatientAuthorizationList();
  }

  createAuthorizationModel(authModel: AuthModel) {
    authModel.patientID = this.clientId;
    const modalPopup = this.dialogModal.open(AuthorizationModalComponent, {
      hasBackdrop: true,
      data: authModel || new AuthModel(),
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "save") {
        this.authorizationFilterModel = new AuthorizationFilterModel();
        //listing of all authorization
        this.getPatientAuthorizationList();
      }
    });
  }
  getPatientAuthorizationList() {
    this.clientService
      .getAllAuthorization(this.clientId, this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.clientAthorizationListModel = response.data.Authorization;
          this.metaData=response.meta;
        }
        console.log(response.data.Authorization);
      });
  }
  
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
      let spliceIndex = this.immunizationActionButtons.findIndex(
        (obj) => obj.key == "edit"
      );
      this.immunizationActionButtons.splice(spliceIndex, 1);
    }
    if (!CLIENT_VITALS_LIST_DELETE) {
      let spliceIndex = this.immunizationActionButtons.findIndex(
        (obj) => obj.key == "delete"
      );
      this.immunizationActionButtons.splice(spliceIndex, 1);
    }

    this.addPermission = CLIENT_VITALS_LIST_ADD || false;
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
