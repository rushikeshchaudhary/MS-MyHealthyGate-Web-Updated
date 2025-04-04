import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { FormioOptions } from '@formio/angular';
import * as format from "date-fns/format/index.js";
import { Metadata } from "../../../client-portal/client-profile.model";
import { SoapNoteModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";
import { StaffClientRequestModel } from "../../client-list/client-list.model";
import { EncounterService } from "../../encounter/encounter.service";
import { DiagnosisModel } from "../diagnosis/diagnosis.model";
import { FilterModel } from "../medication/medication.model";
import { SoapNoteViewModalComponent } from "../soap-note-view-modal/soap-note-view-modal.component";

@Component({
  selector: "app-client-soap-note",
  templateUrl: "./soap-note.component.html",
  styleUrls: ["./soap-note.component.css"],
})
export class SoapNoteComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  
  tabContent!: ViewContainerRef;
  timesheetTabs: any;
  encounterId!: number;
  searchText: string = "";
  soapNoteId!: number;
  soapForm!: FormGroup;
  patientEncounterDiagnosisCodes!: DiagnosisModel[];
  patientEncounterTemplate!: Array<any>;
  @Input() encryptedPatientId:any;
  masterStaffs!: Array<any>;
  allSoapNotes: any[]=[] ;
  loadingMasterData: boolean = false;
  public jsonFormData: Object = {
    components: [],
  };
  initialFormValues: Object = {
    data: {},
  };
  formioOptions: FormioOptions = {
    disableAlerts: true,
  };
  staffId!: number;
  soapNotes: any;
  filterModel: FilterModel;
  appointmentId: number;
  isSoapCompleted!: boolean;
  isSoap: boolean = false;
  selectedIndex: number = 0;
  clientId!: number;
  locationId!: number;
  patientAppointmentId!: number;
  staffClientRequestModel!: StaffClientRequestModel;
  header: string = " Doctor SOAP Notes";
  displaySoapNoteColumns: Array<any> = [
    {
      displayName: "Patient Name",
      key: "patientName",
      isSort: true,
    },
    {
      displayName: "TemplateName",
      key: "templateName",
      isSort: true,
    },
    // {
    //   displayName: "Objective",
    //   key: "objective",
    //   isSort: true,
    // },
    // {
    //   displayName: "Assessment",
    //   key: "assessment",
    //   isSort: true,
    // },
    // {
    //   displayName: "Plans",
    //   key: "plans",
    //   isSort: true,
    // },
    // {
    //   displayName: "Created Date",
    //   key: "createdDate",
    //   isSort: true,
    //   type:'date'
    // },
    // ,
    {
      displayName: "Actions",
      key: "Actions",
      isSort: true,
      class: "",
    }
  ];
  actionButtons: Array<any> = [
    { displayName: "View", key: "view", class: "fa fa-eye" },
  ];

  metaData: Metadata;
  patientId!: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cfr: ComponentFactoryResolver,
    private commonService: CommonService,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private encounterService: EncounterService,
    private dialogModal: MatDialog
  ) {
    this.appointmentId = data;
    this.metaData = new Metadata();
    this.filterModel = new FilterModel();
  }

  ngOnInit() {
  
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.appointmentId= Number(apptId);
      this.activatedRoute.queryParams.subscribe((params) => {
        this.clientId =
          params["id"] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params["id"], false);});

      
    } else {
      this.clientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    }

    //this.staffId=this.currentLoginUserInfoSubject.value.id;
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        // console.log(user.id);
        this.locationId = user.currentLocationId;
        this.staffId = user.id;

        this.getSoapNotes();
      }
    });
    this.timesheetTabs = ["Doctor SOAP Notes"];
    this.loadChild("Doctor SOAP Notes");
  }
  loadComponent(eventType: any): any {
    if (this.clientId) this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    let factory: any;
    // if (childName == "Soap Note")
    //   factory = this.cfr.resolveComponentFactory(ClientSoapNoteComponent);
    // let comp: ComponentRef<ClientSoapNoteComponent> = this.tabContent.createComponent(factory);
  }
  getSoapNotes = () => {
    console.log(this.filterModel);
    console.log(this.appointmentId);
    console.log(this.clientId);
    this.patientId=this.clientId
    this.encounterService
      .GetAllSoapNotes(this.patientId, this.appointmentId, this.filterModel)
      .subscribe((res) => {
        if (res != null && res.data != null && res.statusCode == 200) {
          console.log(res);
          // this.allSoapNotes = res.data.map((x) => {
          // });
          this.allSoapNotes = res.data;
          this.metaData = res.meta;
        } else {
          this.allSoapNotes = [];
          this.metaData = {} as Metadata;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };
  // onTableActionClick = (e) => {
  //   this.route.navigate(["web/client/profile"], {
  //     queryParams: {
  //       id: this.commonService.encryptValue(this.clientId, true),
  //     },
  //   });
  // };

  onTableActionClick(actionObj: any) {
    ////debugger
    if (actionObj.action == "view") {
      this.openDoctorSoapNoteViewModal(actionObj);
      console.log("open pop up here...");
    }
  }

  openDoctorSoapNoteViewModal(actionObj:any){
    const modalPopup = this.dialogModal.open(SoapNoteViewModalComponent, {
      hasBackdrop: true,
      // width: "50%",
      data: actionObj.data
    });
    modalPopup.afterClosed().subscribe((result) => {
      console.log("closed pop up");
    });
  }

  setPaginateorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  onPageOrSortChange = (changeState?: any) => {
    this.setPaginateorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      ""
    );
    this.getSoapNotes();
  };
  applyFilter(searchText: string = "") {
    console.log(searchText);
    this.setPaginateorModel(
      this.filterModel.pageNumber,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    // if (searchText.trim() == "" || searchText.trim().length >= 3)
    this.getSoapNotes();
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getSoapNotes();
  }
}
