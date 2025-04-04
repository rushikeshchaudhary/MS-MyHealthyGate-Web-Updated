import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { format } from 'date-fns';
import { SelectionModel } from '@angular/cdk/collections';
import { PrescriptionModel, PrescriptionDownloadModel } from '../prescription.model';
import { ClientsService } from '../../clients.service';
import { FilterModel } from 'src/app/platform/modules/core/modals/common-model';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { CommonService } from 'src/app/platform/modules/core/services';
import { PrescriptionFaxModalComponent } from '../prescription-fax-modal/prescription-fax-modal.component';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-prescription',
  templateUrl: './prescription-sentprescription.component.html',
  styleUrls: ['./prescription-sentprescription.component.css']
})
export class SentPrescriptionComponent implements OnInit {
  allergyData: PrescriptionModel = new PrescriptionModel;
  prescriptionListingData: PrescriptionModel[] = [];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel = new FilterModel;
  metaData: any;
  stringprescriptionIds!: string;
  actionButtons: Array<any> = [];
  clientId!: number;
  addPermission: boolean = false;
  header: string = "Client Prescription";
  selection = new SelectionModel<any>(true, []);
  dataSource = new MatTableDataSource<any>();
  public prescriptionIds: string[] = [];
  displayedColumns: string[] = ['prescriptionDate', 'modeOFTransfer', 'actions'];
  @Input() encryptedPatientId:any;
  constructor(private activatedRoute: ActivatedRoute, private notifier: NotifierService, private clientsService: ClientsService, public activityModal: MatDialog, private dialogService: DialogService, private commonService: CommonService,    private translate:TranslateService) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.metaData = {};
  }

  //on inital load
  ngOnInit() {
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params['id'] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params['id'], false);
      });
    } else {
      debugger
      let encryptedValue: string = this.commonService.encryptValue(this.encryptedPatientId, false);


      this.clientId = parseInt(encryptedValue, 10);
    }

    //initialize filter model
    this.filterModel = new FilterModel();

    //call listing method
    this.getSentPrescriptionList(this.filterModel);
    this.getUserPermissions();
  }


  //listing of sentprescriptions
  getSentPrescriptionList(filterModel:any) {
    this.clientsService.getSentPrescriptionList(this.clientId, this.filterModel)
      .subscribe(
        (response: any) => {

          if (response.statusCode === 200) {
            this.prescriptionListingData = response.data;
            this.dataSource.data = this.prescriptionListingData;
            this.prescriptionListingData = (response.data || []).map((obj: any) => {
              obj.prescriptionDate = format(obj.prescriptionDate, 'dd/MM/yyyy');
              obj.prescriptionSentDate = format(obj.prescriptionSentDate, 'dd/MM/yyyy');
              return obj;
            });
            this.metaData = response.meta || {};
          } else {
            this.prescriptionListingData = [];
            this.metaData = {};
          }
        });
  }

  //page load and sorting
  onPageOrSortChange(changeState?: any) {

    //changeState.pageNumber = changeState.pageIndex + 1;
    this.setPaginatorModel(changeState.pageIndex + 1, this.filterModel.pageSize, '', '', this.filterModel.searchText);
    this.getSentPrescriptionList(this.filterModel);
  }

  //table action
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'DOWNLOAD':
        this.DownloadPrescription(id);
        break;
      case 'FAX':
        this.openfaxDialog(id);
        break;
      default:
        break;
    }
  }

  refreshGrid() {
    this.getSentPrescriptionList(this.filterModel);
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ALLERGIES_LIST');
    const { CLIENT_ALLERGIES_LIST_ADD, CLIENT_ALLERGIES_LIST_UPDATE, CLIENT_ALLERGIES_LIST_DELETE } = actionPermissions;
    if (!CLIENT_ALLERGIES_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }
    if (!CLIENT_ALLERGIES_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
      this.actionButtons.splice(spliceIndex, 1)
    }

    this.addPermission = CLIENT_ALLERGIES_LIST_ADD || false;

  }

  DownloadPrescription(id: string) {
    this.prescriptiondownloadmodel.PrescriptionId = id;
    this.prescriptiondownloadmodel.patientId = this.clientId;
    this.prescriptiondownloadmodel.Issentprescription = true;
    this.clientsService.DownloadPrescription(this.prescriptiondownloadmodel)
      .subscribe((response: any) => {
        this.clientsService.downLoadFile(response, 'application/pdf', `PrescriptionReport`)
      });
  }

  //open popup
  openfaxDialog(id: number) {
    if (id != null && id > 0) {
      this.clientsService.getPrescriptionById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.allergyData = response.data;
          this.createFaxModel(this.allergyData);
        }
      });
    } else {
      this.allergyData = new PrescriptionModel();
      this.createFaxModel(this.allergyData);
    }
  }

  //create modal
  createFaxModel(allergyData: PrescriptionModel) {
    allergyData.patientId = this.clientId;
    allergyData.Issentprescription = true;
    const modalPopup = this.activityModal.open(PrescriptionFaxModalComponent, {
      hasBackdrop: true,
      data: { allergy: allergyData, refreshGrid: this.refreshGrid.bind(this) }
    });
    modalPopup.afterClosed().subscribe(result => {
      if (result === 'SAVE') {
        //this.getPrescriptionList(this.filterModel);
      }
    });
  }
}
