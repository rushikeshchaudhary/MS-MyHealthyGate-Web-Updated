import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from "rxjs";
import {
  PrescriptionDownloadModel,
  PrescriptionModel,
} from "../../agency-portal/clients/prescription/prescription.model";
import { FilterModel, Metadata } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";
import { format } from "date-fns";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-pharmacy-dashboard",
  templateUrl: "./pharmacy-dashboard.component.html",
  styleUrls: ["./pharmacy-dashboard.component.css"],
})
export class PharmacyDashboardComponent implements OnInit {
  showurgentcarebtn = false;
  clientPrescriptionModel: any = [];
  allClientPrescriptionModel: any = [];

  filterModel: FilterModel;
  myClientsFilterModel: FilterModel;
  prescriptionColumns: Array<any> = [];
  metaDataPrescription: Metadata;
  metaDataMyClient: Metadata;
  stringprescriptionIds!: string;
  selection = new SelectionModel<any>(true, []);
  subscription: Subscription = new Subscription;
  clientId!: number;
  searchText: "" = "";
  dataSource = new MatTableDataSource<any>();
  myClientDataSource = new MatTableDataSource<any>();

  constructor(
    private commonService: CommonService,
    private clientsAgencyService: AgencyClientsService,
    private translate:TranslateService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.metaDataMyClient = new Metadata();
    this.metaDataPrescription = new Metadata();
    this.filterModel = new FilterModel();
    this.myClientsFilterModel = new FilterModel();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.clientId = user.id;
        this.getPrescriptionList();
      }
    });
  }

  getPrescriptionList() {
    this.clientsAgencyService
      .getSharedPrescriptionList(this.clientId, null, this.filterModel)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.clientPrescriptionModel = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, 'MM/dd/yyyy');
              obj.startDate = format(obj.startDate, 'MM/dd/yyyy');
              obj.endDate = format(obj.endDate, 'MM/dd/yyyy');
              obj.status =
                obj.status == "Pending"
                  ? "Requested"
                  : obj.status == "Issued"
                  ? "Dispensed"
                  : obj.status;
              return obj;
            }
          );
          this.dataSource.data = this.clientPrescriptionModel;
          this.metaDataPrescription = response.meta || new Metadata();
          this.getMylientList();
          console.log(this.clientPrescriptionModel);
        } else {
          this.clientPrescriptionModel = [];
          this.metaDataPrescription = new Metadata();
        }
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  getMylientList() {
    const filterclientData = {
      pharmacyId: this.clientId,
      searchText: this.myClientsFilterModel.searchText,
      pageNumber: this.myClientsFilterModel.pageNumber,
      pageSize: this.myClientsFilterModel.pageSize,
      sortColumn: this.myClientsFilterModel.sortColumn,
      sortOrder: this.myClientsFilterModel.sortOrder,
    };
    this.clientsAgencyService
      .getSharedPrescriptionsClients(filterclientData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.allClientPrescriptionModel = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, 'MM/dd/yyyy');
              obj.dob = format(obj.dob, 'MM/dd/yyyy');
              return obj;
            }
          );
          this.myClientDataSource.data = this.allClientPrescriptionModel;
          this.metaDataMyClient = response.meta || new Metadata();
          console.log(this.allClientPrescriptionModel);
        } else {
          this.allClientPrescriptionModel = [];
          this.metaDataMyClient = new Metadata();
        }
        this.metaDataMyClient.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
