import { Component, OnInit } from '@angular/core';
import { Metadata } from '../../client-portal/client-profile.model';
import { FilterModel } from '../../core/modals/common-model';
import { PrescriptionModel } from '../../agency-portal/clients/prescription/prescription.model';

import { ClientsService } from "../../agency-portal/clients/clients.service";
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../core/services';
import { format } from 'date-fns';
import { Meta } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pharmacy-prescription',
  templateUrl: './pharmacy-prescription.component.html',
  styleUrls: ['./pharmacy-prescription.component.css']
})
export class PharmacyPrescriptionComponent implements OnInit {

  filterModel: FilterModel;
  clientDetails:any;
  clientProfileModel:any;
  selectedIndex: number = 0;
  clientPrescriptionModel: PrescriptionModel[] = [];
  metaDataPrescription: Metadata;
  prescriptionColumns: Array<string>;
  dataSource = new MatTableDataSource<any>();
  patientId:any;
  pharmacyId:any;
  profileTabs = ["Medication"];

  constructor(
    private clientService: ClientsService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
  ) {
    const apptId = this.activatedRoute.snapshot.paramMap.get("id");
    const pharmacyid=this.activatedRoute.snapshot.paramMap.get("pharmacyId");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.patientId =
          params['id'] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params['id'], false);
      });
      this.activatedRoute.queryParams.subscribe((params) => {
        this.pharmacyId =
          params['id'] == undefined
            ? this.commonService.encryptValue(pharmacyid, false)
            : this.commonService.encryptValue(params['pharmacyId'], false);
      });
    // this.clientDetails = data.userInfo;
    this.filterModel = new FilterModel();
    this.metaDataPrescription=new Metadata()
    // this.prescriptionColumns = [
    //   {
    //     displayName: "Prescription Id",
    //     key: "sharedPrescriptionId",
    //     sticky: true,
    //     isSort: true,
    //   },
    //   {
    //     displayName: "createdDate",
    //     key: "createdDate",
    //     sticky: true,
    //     isSort: true,
    //   },
    //   {
    //     displayName: "patientName",
    //     key: "patientName",
    //     sticky: true,
    //     isSort: true,
    //   },
    //   {
    //     displayName: "creatorName",
    //     key: "creatorName",
    //     sticky: true,
    //     isSort: true,
    //   },
    //   // {
    //   //   displayName: "Dose",
    //   //   key: "dose",
    //   //   sticky: true,
    //   //   isSort: true,
    //   // },
    //   // {
    //   //   displayName: "Start Date",
    //   //   key: "startDate",
    //   //   sticky: true,
    //   //   isSort: true,
    //   // },
    //   // {
    //   //   displayName: "End Date",
    //   //   key: "endDate",
    //   //   sticky: true,
    //   //   isSort: true,
    //   // },
    //   {
    //     displayName: "drugNames",
    //     key: "drugNames",
    //     class: "",
    //     width: "30%",
    //   },
    //   {
    //     displayName: "Status",
    //     key: "status",
    //     sticky: true,
    //     isSort: true,
    //   },
    //   {
    //     displayName: "actions",
    //     key: "Actions",
    //     class: "",
    //   },
    // ];

    this.prescriptionColumns  = [
     
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
  }

  actionButtons: Array<any> = [
    { displayName: "Download", key: "download", class: "fa fa-download" },
    // { displayName: "View", key: "view", class: "fa fa-eye" },
    // { displayName: "Delete", key: "delete", class: "fa fa-trash" },
    // { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
  ];

  ngOnInit() {
    console.log(this.filterModel);
    this.getPrescriptionList();
   // this.getClientProfileInfo();
  }

  downloadPrescription = (ele:any) => {
    const downloadModal = {
      IsMedicationDownload: false,
      Issentprescription: false,
      PrescriptionId:  ele.prescriptionNo, //here we are not passing prescrptionid to PrescriptionId instead we are passing PrescriptionNo
      patientId: ele.patientId,
      pharmacyId: this.pharmacyId,
    };
    this.clientService
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

  onTableActionClick(actionObj?: any) {
    switch ((actionObj.action || "").toUpperCase()) {
      case "DOWNLOAD":
        this.downloadPrescription(actionObj);
        break;
    }
  }

  getClientProfileInfo() {
    console.log(this.clientProfileModel);

    this.clientService
      .getClientProfileInfo(this.patientId)
      .subscribe((response) => {
        if (response != null && response.statusCode == 200) {
          this.clientProfileModel = response.data;
          this.getPrescriptionList();
        }
      });
  }

  
  getPrescriptionList() {
   

    this.clientService
      .getSharedPrescriptionList(
        this.pharmacyId,
        this.patientId,
        this.filterModel
      )
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
          this.metaDataPrescription = response.meta;
        } else {
          this.clientPrescriptionModel = [];
          this.metaDataPrescription = new Metadata();
        }
        this.metaDataPrescription.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  loadComponent(event: any) {
    console.log(event);
    this.selectedIndex = event.index;
  }
  
  onPageOrSortChange = (schange:any) => {
    this.filterModel.pageNumber = schange.pageNumber;
    this.filterModel.pageSize = schange.pageSize;
    this.filterModel.sortColumn = schange.sort;
    this.filterModel.sortOrder = schange.order;
    this.getPrescriptionList();
  };

  getDirection = (address:any) => {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = "https://www.google.com/maps/place/" + address;
    link.target = "_blank";
    link.click();
  };

}
