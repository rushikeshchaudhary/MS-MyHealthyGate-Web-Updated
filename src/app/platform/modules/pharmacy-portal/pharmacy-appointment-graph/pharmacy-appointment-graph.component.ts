import { Component, OnInit } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { ClientsService } from "../../client-portal/clients.service";
import { CommonService } from "../../core/services";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";
import { FilterModel, Metadata } from "../../core/modals/common-model";
import { PrescriptionModel } from "../../agency-portal/clients/prescription/prescription.model";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { format } from "date-fns";
import { PharmacyClientDetailsComponent } from "../pharmacy-my-client/pharmacy-client-details/pharmacy-client-details.component";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-pharmacy-appointment-graph",
  templateUrl: "./pharmacy-appointment-graph.component.html",
  styleUrls: ["./pharmacy-appointment-graph.component.css"],
})
export class PharmacyAppointmentGraphComponent implements OnInit {
  sharedPrescriptionColumns: any = [];
  myClientColumns: any = [];
  clientId:any;
  filterModel: FilterModel;
  myClietnFilterModel: FilterModel;
  myClientModel: Array<any> = [];
  clientPrescriptionModel: PrescriptionModel[] = [];
  metaDataPrescription: Metadata = new Metadata;
  metaMyClient: Metadata = new Metadata;
  //dataSource = new MatTableDataSource<any>();
  dataSource:any=[];
  myClientDataSource = new MatTableDataSource<any>();

  constructor(
    private clientService: ClientsService,
    private notifier: NotifierService,
    private commonService: CommonService,
    private clientsAgencyService: AgencyClientsService,
    private matDialog: MatDialog,
    private translate:TranslateService,
    private router: Router

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.myClientColumns = [
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

    this.sharedPrescriptionColumns = [
      {
        displayName: "Prescription Id",
        key: "sharedPrescriptionId",
        class: "",
        width: "12%",
      },
      {
        displayName: "createdDate",
        key: "createdDate",
        class: "",
        width: "20%",
      },
      {
        displayName: "patientName",
        key: "patientName",
        class: "",
        width: "12%",
      },
      {
        displayName: "drugNames",
        key: "drugNames",
        class: "",
        width: "38%",
      },
      {
        displayName: "status",
        key: "status",
        class: "",
        width: "38%",
      },

    ];
    this.myClietnFilterModel = new FilterModel();
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.clientId = user.id;
        this.getPrescriptionList();
      }
    });
  }
  onTabChanged = (e: any) => {
    console.log(e);
    if (e.index == 0) {
      this.getPrescriptionList();
    } else {
      this.getMyClientList();
    }
  };
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
        } else {
          this.clientPrescriptionModel = [];
          this.metaDataPrescription = new Metadata();
        }
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  onPageOrSortChange = (e:any) => {
    this.filterModel.pageSize = e.pageSize;
    this.filterModel.pageNumber = e.pageIndex + 1;
    this.filterModel.sortColumn = "";
    this.filterModel.sortOrder = "";
    this.getPrescriptionList();
  };

  onPageOrSortChangeMyClient = (e:any) => {
    this.myClietnFilterModel.pageSize = e.pageSize;
    this.myClietnFilterModel.pageNumber = e.pageIndex + 1;
    this.myClietnFilterModel.sortColumn = "";
    this.myClietnFilterModel.sortOrder = "";
  };
  onTableActionClick = (e:any) => {
    console.log(e);
  };
  onMyClientTableActionClick = (ev:any) => {
    console.log(ev);
    let dbModal:any;
   
    this.router.navigate(["web/pharmacy/client-details"], {
      queryParams: {
        id: ev!=null?this.commonService.encryptValue(ev.data.patientId, true):null,
        pharmacyId:ev!=null?this.commonService.encryptValue(ev.data.pharmacyId, true):null,
      }
    }
    )
    dbModal.afterClosed().subscribe((result: string) => {});
  };

  getMyClientList() {
    const filterclientData = {
      pharmacyId: this.clientId,
      searchText: this.myClietnFilterModel.searchText,
      pageNumber: this.myClietnFilterModel.pageNumber,
      pageSize: this.myClietnFilterModel.pageSize,
      sortColumn: this.myClietnFilterModel.sortColumn,
      sortOrder: this.myClietnFilterModel.sortOrder,
    };
    this.clientsAgencyService
      .getSharedPrescriptionsClients(filterclientData)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.myClientModel = (response.data || []).map((obj: any) => {
            obj.createdDate = format(obj.createdDate, 'MM/dd/yyyy');
            obj.dob = format(obj.dob, 'MM/dd/yyyy');
            return obj;
          });
          this.myClientDataSource.data = this.myClientModel;
          this.metaMyClient = response.meta || new Metadata();
        } else {
          this.myClientModel = [];
          this.metaMyClient = new Metadata();
        }
        this.metaMyClient.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
