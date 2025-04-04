import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit } from "@angular/core";
import {
  PrescriptionDownloadModel,
  PrescriptionModel,
} from "../../agency-portal/clients/prescription/prescription.model";
import { ClientsService } from "../../client-portal/clients.service";
import { FilterModel, Metadata } from "../../core/modals/common-model";
import { ClientsService as AgencyClientsService } from "../../agency-portal/clients/clients.service";
import { NotifierService } from "angular-notifier";
import { CommonService } from "../../core/services";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { format } from "date-fns";
import { PharmacyClientDetailsComponent } from "../pharmacy-my-client/pharmacy-client-details/pharmacy-client-details.component";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-shared-prescription",
  templateUrl: "./shared-prescription.component.html",
  styleUrls: ["./shared-prescription.component.css"],
})
export class SharedPrescriptionComponent implements OnInit {
  clientPrescriptionModel!: PrescriptionModel[];
  prescriptiondownloadmodel = new PrescriptionDownloadModel();
  filterModel: FilterModel;
  prescriptionColumns: Array<any>;
  metaDataPrescription: Metadata;
  stringprescriptionIds!: string;
  selection = new SelectionModel<any>(true, []);
  subscription!: Subscription;
  clientId!: number;
  metaData!: Metadata;
  searchText!: "";
  dataSource = new MatTableDataSource<any>();
  displayedColumnsPrescription: string[] = [
    "select",
    "PrescriptionId",
    
    "patientName",
    "creatorName",
    "createdDate",
    // "directions",
    // "startDate",
    // "endDate",
    "drugNames",
    "status",
    "Action",
  ];
  prescriptionIds!: any[];
  statusList: string[] = ["Requested", "In progress", "Dispensed"];

  seletectedTableIndex:any = undefined;
  selectedOption = "Requested";

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
    this.prescriptionColumns = [
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
        displayName: "creatorName",
        key: "creatorName",
        class: "",
        width: "12%",
      },
      {
        displayName: "drugNames",
        key: "drugNames",
        class: "",
        width: "38%",
      },
      // {
      //   displayName: "start_date",
      //   key: "startDate",
      //   width: "15%",
      //   type: "date",
      // },
      // {
      //   displayName: "end_date",
      //   key: "endDate",
      //   width: "15%",
      //   type: "date",
      // },
    ];
    this.filterModel = new FilterModel();
    this.metaDataPrescription = new Metadata();
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle(ev:any) {
    //////debugger;
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => {
          this.selection.select(row);
        });

    this.prescriptionIds = [];
    this.dataSource.data.forEach((row) => {
      if (this.selection.isSelected(row)) {
        this.prescriptionIds.push(row.id);
      }
    });
    //console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    //console.log(this.stringprescriptionIds);
  }

  toggle(event:any, row:any) {
    let name = row.id;
    //////debugger;
    if (event.checked) {
      if (this.prescriptionIds.indexOf(name) === -1) {
        this.prescriptionIds.push(name);
        this.selection.select(row);
        // this.disabled = false;
      }
    } else {
      const index = this.prescriptionIds.indexOf(name);
      if (index > -1) {
        this.prescriptionIds.splice(index, 1);
        this.selection.deselect(row);
      }
    }

    console.log(this.prescriptionIds);
    this.stringprescriptionIds = this.prescriptionIds.toString();
    console.log(this.stringprescriptionIds);
  }

  DownloadPrescription(isMedication: any) {
    if (this.stringprescriptionIds) {
      this.prescriptiondownloadmodel.PrescriptionId =
        this.stringprescriptionIds;
      this.prescriptiondownloadmodel.patientId = 0;
      this.prescriptiondownloadmodel.pharmacyId = this.clientId;
      this.prescriptiondownloadmodel.Issentprescription = false;
      this.prescriptiondownloadmodel.IsMedicationDownload = isMedication;
      console.log(this.prescriptiondownloadmodel);

      this.clientsAgencyService
        .DownloadSharePrescription(this.prescriptiondownloadmodel)
        .subscribe((response: any) => {
          const files = Array.isArray(response) ? response : [response];
          files.forEach(file => {
            const byteArray = new Uint8Array(atob(file.fileContent).split("").map(char => char.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: 'application/pdf' });
             const nav = window.navigator as any;
          this.clientService.downloadFile(
            blob,
            "application/pdf",
            `PrescriptionReport`
          );
          })
        });
    } else {
      this.notifier.notify("warning", "Please select Medication");
    }
  }

  downloadPrescription = (ele:any) => {
    const downloadModal = {
      IsMedicationDownload: false,
      Issentprescription: false,
      PrescriptionId:  ele.prescriptionNo, //here we are not passing prescrptionid to PrescriptionId instead we are passing PrescriptionNo
      patientId: ele.patientId,
      pharmacyId: this.clientId,
    };
    this.clientsAgencyService
      .DownloadSharePrescription(downloadModal)
      .subscribe((response: any) => {
        const files = Array.isArray(response) ? response : [response];
        files.forEach(file => {
          const byteArray = new Uint8Array(atob(file.fileContent).split("").map(char => char.charCodeAt(0)));
          const blob = new Blob([byteArray], { type: 'application/pdf' });
           const nav = window.navigator as any;
        this.clientService.downloadFile(
          blob,
          "application/pdf",
          `PrescriptionReport`
        );
        })
      });
  };

  getPrescriptionList() {
    debugger
    this.clientsAgencyService
      .getSharedPrescriptionList(this.clientId, null, this.filterModel)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.seletectedTableIndex = undefined;
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
          this.dataSource.data=[];
          this.metaDataPrescription = new Metadata();
        }
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  statusHandler = (index:any, status:any) => {
    this.selectedOption = status;
    this.seletectedTableIndex = index;
  };

  changeStatusHandler = (status:any, ele:any) => {
    // console.log(status.target.value, ele);
    const data = {
      id: ele.sharedPrescriptionId,
      status: status.target.value,
    };
    this.clientsAgencyService
      .changeStatusOfSharedPrescription(data)
      .subscribe((res) => {
        this.notifier.notify("success", res.message);
        this.getPrescriptionList();
      });
  };

  filterStatusHandler = (event:any) => {
    if (event.target.value != "") {
      this.filterModel.searchText = event.target.value;
      this.getPrescriptionList();
    }
  };
  onPageOrSortChange = (e:any) => {
    this.filterModel.pageSize = e.pageSize;
    this.filterModel.pageNumber = e.pageIndex + 1;
    this.filterModel.sortColumn = "";
    this.filterModel.sortOrder = "";
    this.getPrescriptionList();
  };

  announceSortChange = (e:any) => {
    this.filterModel.sortColumn = e.active;
    this.filterModel.sortOrder = e.direction;
    this.getPrescriptionList();
  };
  searchFilter = (e:any) => {
    this.filterModel.searchText = e;
    // console.log(e);

    this.getPrescriptionList();
  };

  onTableActionClick = (element:any) => {
    console.log(element);
    element.pharmacyId = this.clientId;

    let dbModal;
    // dbModal = this.matDialog.open(PharmacyClientDetailsComponent, {
    //   hasBackdrop: true,
    //   width: "70%",
    //   data: {
    //     userInfo: element,
    //   },
    // });
    // dbModal.afterClosed().subscribe((result: string) => {});
    this.router.navigate(["web/pharmacy/client-details"], {
      queryParams: {
        id: element!=null?this.commonService.encryptValue(element.patientId, true):null,
        pharmacyId:element!=null?this.commonService.encryptValue(element.pharmacyId, true):null,
      }
    }
    )
  };
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
