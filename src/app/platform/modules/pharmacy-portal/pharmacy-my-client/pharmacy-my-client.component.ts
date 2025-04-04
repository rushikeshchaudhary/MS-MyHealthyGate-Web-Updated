import { Component, OnInit } from "@angular/core";

import { NotifierService } from "angular-notifier";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";

import { Subscription } from "rxjs";
import {
  PrescriptionDownloadModel,
  PrescriptionModel,
} from "../../agency-portal/clients/prescription/prescription.model";
import { FilterModel, Metadata } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { SelectionModel } from "@angular/cdk/collections";
import { format } from "date-fns";
import { Console } from "console";
import { PharmacyClientDetailsComponent } from "./pharmacy-client-details/pharmacy-client-details.component";
import { filter } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-pharmacy-my-client",
  templateUrl: "./pharmacy-my-client.component.html",
  styleUrls: ["./pharmacy-my-client.component.css"],
})
export class PharmacyMyClientComponent implements OnInit {
  clientPrescriptionModel: Array<any> = [];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel;
  prescriptionColumns: Array<any>;
  metaDataPrescription: Metadata = new Metadata;
  stringprescriptionIds!: string;
  selection = new SelectionModel<any>(true, []);
  subscription: Subscription = new Subscription;
  clientId!: number;
  searchText: "" = "";
  dataSource = new MatTableDataSource<any>();
  displayedColumnsPrescription: string[] = ["patientName", "sharedDate"];
  prescriptionIds: any[] = [];
  constructor(
    private notifier: NotifierService,
    private commonService: CommonService,
    private clientsAgencyService: AgencyClientsService,
    private matDialog: MatDialog,
    private translate:TranslateService,
    private router: Router
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.prescriptionColumns = [
      {
        displayName: "first_name",
        key: "patientFirstName",
        sticky: true,
        isSort: true,
      },
      {
        displayName: "last_name",
        key: "patientLastName",
        sticky: true,
        isSort: true,
      },
      {
        displayName: "gender",
        key: "gender",
        sticky: true,
        isSort: true,
      },
      {
        displayName: "dob",
        key: "dob",
        sticky: true,
        isSort: true,
      },
      {
        displayName: "email",
        key: "email",
        sticky: true,
        isSort: true,
      },
      {
        displayName: "phone_number",
        key: "phoneNumber",
        sticky: true,
        isSort: true,
      },
    ];
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.prescriptionIds = [];
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
          this.getPrescriptionList();
        }
      }
    );
  }
  getPrescriptionList() {
    const filterclientData = {
      pharmacyId: this.clientId,
      searchText: this.filterModel.searchText,
      pageNumber: this.filterModel.pageNumber,
      pageSize: this.filterModel.pageSize,
      sortColumn: this.filterModel.sortColumn,
      sortOrder: this.filterModel.sortOrder,
    };
    this.clientsAgencyService
      .getSharedPrescriptionsClients(filterclientData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.clientPrescriptionModel = (response.data || []).map(
            (obj: any) => {
              obj.createdDate = format(obj.createdDate, 'MM/dd/yyyy');
              obj.dob = format(obj.dob, 'MM/dd/yyyy');
              return obj;
            }
          );
          this.dataSource.data = this.clientPrescriptionModel;
          this.metaDataPrescription = response.meta || new Metadata();
        } else {
          this.clientPrescriptionModel = [];
          this.metaDataPrescription = new Metadata();
        }
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onTableActionClick = (ev:any) => {
    console.log(ev);
    let dbModal;
    this.router.navigate(["web/pharmacy/client-details"], {
      queryParams: {
        id: ev!=null?this.commonService.encryptValue(ev.data.patientId, true):null,
        pharmacyId:ev!=null?this.commonService.encryptValue(ev.data.pharmacyId, true):null,
      }
    }
    )
  };
  onPageOrSortChange = (schange:any) => {
    this.filterModel.pageNumber = schange.pageNumber;
    this.filterModel.pageSize = schange.pageSize;
    this.filterModel.sortColumn = schange.sort;
    this.filterModel.sortOrder = schange.order;
    this.getPrescriptionList();
  };

  searchFilter = (e:any) => {
    this.filterModel.searchText = e;
    this.getPrescriptionList();
  };
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
