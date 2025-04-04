import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { format } from "date-fns";
import { ViewLabAppointmentPatientComponent } from "../../client-portal/manage-lab-booking/view-lab-appointment-patient/view-lab-appointment-patient.component";
import { Metadata } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { LabClientFilter } from "../lab.model";
import { LabService } from "../lab.service";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-lab-clients",
  templateUrl: "./lab-clients.component.html",
  styleUrls: ["./lab-clients.component.css"],
})
export class LabClientsComponent implements OnInit {
  labId:any;
  labClinetFilter: LabClientFilter;
  searchText: "" = "";
  labClientColumns: Array<any>;
  labClientDetails: Array<any> = [];
  metaDataPrescription: Metadata = new Metadata;
  dataSource = new MatTableDataSource<any>();


  constructor(
    private commonService: CommonService,
    private labService: LabService,
    private matDialog: MatDialog,
    private route:Router,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.labClientColumns = [
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
    this.labClinetFilter = new LabClientFilter();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.labId = user.userID;
      }
    });

    this.labClinetFilter.labId =  this.labId;
    // this.labClinetFilter.labId =  20;
    this.getLabClientData();
  }
  getLabClientData = () => {
    this.labService.getLabClient(this.labClinetFilter).subscribe((res) => {
      if (res.statusCode === 200) {
        this.labClientDetails = (res.data || []).map(
          (obj: any) => {
            obj.dob = format(obj.dob, 'MM/dd/yyyy');
            return obj;
          }
        );
        this.dataSource.data = this.labClientDetails;
        this.metaDataPrescription = res.meta || new Metadata();
      } else {
        this.labClientDetails = [];
        this.metaDataPrescription = new Metadata();
      }
      this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  };

  searchFilter = (e:any) => {
    this.labClinetFilter.searchText = e;
    this.getLabClientData();
  };
  onPageOrSortChange = (schange:any) => {
    this.labClinetFilter.pageNumber = schange.pageNumber;
    this.labClinetFilter.pageSize = schange.pageSize;
    this.labClinetFilter.sortColumn = schange.sort;
    this.labClinetFilter.sortOrder = schange.order;
    this.getLabClientData();
  };
  onTableActionClick = (ev:any) => {
    console.log(ev);
    let dbModal;
    this.route.navigate(["web/lab/labclientsdetails"], {
      queryParams: {
        id: ev!=null?this.commonService.encryptValue(ev.data.patientId, true):null,
      },
    });

    // dbModal = this.matDialog.open(ViewLabAppointmentPatientComponent, {
    //   hasBackdrop: true,
    //   width: "70%",
    //   data: {
    //     userInfo: ev.data,
    //   },
    // });
    // dbModal.afterClosed().subscribe((result: string) => {});
  };
}
