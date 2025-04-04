import { Component, OnInit, Inject, Output, EventEmitter } from "@angular/core";
import { ImmunizationModel } from "../immunization.model";
import { FormGroup, FormBuilder, AbstractControl } from "@angular/forms";
import { ClientsService } from "../../clients.service";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-immunization-modal",
  templateUrl: "./immunization-modal.component.html",
  styleUrls: ["./immunization-modal.component.css"],
})
export class ImmunizationModalComponent implements OnInit {
  maxDate = new Date();
  clientId!: number;
  IsEditForm: boolean;
  patientId: number;
  immunizationModel: ImmunizationModel;
  immunizationForm!: FormGroup;
  submitted: boolean = false;
  headerText: string = "Add Immunization";
  immunizationEditForm!: FormGroup;
  immunizationAddForm!: FormGroup;
  //master models
  masterStaff!: any[];
  masterVFC!: any[];
  masterImmunization!: any[];
  masterManufacture!: any[];
  masterAdministrationSite!: any[];
  masterRouteOfAdministration!: any[];
  masterImmunityStatus!: any[];
  masterRejectionReason!: any[];
  immunizationIdForEdit!: number;
  filterstring: string = "";
  filtermasterImmunizationTypes:any;
  filterStringId:any;
  filtervfceligibility: string = "";
  filterMasterVfcEligibilityTypes : any=[];
  filterVfcId: any;
  filterManufacture:any;
  filterManufactureId: any;
  filterMasterManufactures : any=[];
  filterRouteOfAdminisValue!: string;
  filterRouteOfAdminstartionId!: number;
  filterRouteOfAdministrationTypes : any=[];
  filterImmunityStatusValue!: string;
  filterImmunityStatus :any=[];
  filterImmunityStatusId!: number;
  filterAdministrationSiteVal!: string;
  filterAdministrationSiteId!: number;
  filterAdminSiteTypes : any=[];
  filterRejectionReasons : any=[];
  filterRejectionReason!: string;
  filterRejectionId!: number;
  appointmentId!: number;
  filterString:any;
  //////////////////
  @Output() refreshGrid: EventEmitter<any> = new EventEmitter<any>();
  // events: string[] = [];
  // myHolidayDates = [];
  myHolidayDates: Date[] = [];
  myHolidayFilter = (d: Date): boolean => {
    const time = d.getTime();
    return !this.myHolidayDates.find((x) => x.getTime() == time);
  };

  //Construtor
  constructor(
    private formBuilder: FormBuilder,
    private immunizationDialogModalRef: MatDialogRef<ImmunizationModalComponent>,
    private clientService: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    //assign data
    this.immunizationModel = data;

    console.log("ImmunizationModel", data);
    if (data.immunization.id<=0) {
      console.log("AddForm Hit");
      this.IsEditForm = false;
      this.headerText = "Add Immunization";
      this.patientId =  data.immunization.patientID;
      this.appointmentId = 0;
    } else {
      console.log("EditForm Hit");
      this.IsEditForm = true;
      this.headerText = "Edit Immunization";
      this.immunizationModel = data.immunization;
      this.immunizationIdForEdit = data.immunization.id;
      this.patientId =  data.immunization.patientID;
      console.log(this.immunizationModel);
    }
    // this.refreshGrid.subscribe(data.refreshGrid);
    // this.patientId = this.immunizationModel.patientID;
    // //update header text
    // if (this.immunizationModel.id != null && this.immunizationModel.id > 0)
    //   this.headerText = 'Edit Immunization';
    // else
    //   this.headerText = 'Add Immunization';
  }

  //inital loading
  ngOnInit() {
    console.log("ngOnIt");
    //page load calling master datarer for dropdowns
   
    this.masterImmunization = [];
    this.masterVFC = [];
    this.masterManufacture = [];
    this.masterRouteOfAdministration = [];
    this.masterImmunityStatus = [];
    this.masterAdministrationSite = [];
    this.masterRejectionReason = [];
    this.getMasterData();
    this.immunizationAddForm = this.formBuilder.group({
      administeredBy: [],
      administeredDate: [],
      administrationSiteID: [],
      administrationSite: [],
      amountAdministered: [],
      expireDate: [],
      immunityStatusID: [],
      immunityStatus: [],
      immunization: [],
      manufactureID: [],
      manufacturerName: [],
      orderBy: [],
      rejectedImmunization: [],
      rejectionReasonID: [],
      rejectionReason: [],
      rejectionReasonNote: [],
      routeOfAdministrationID: [],
      routeOfAdministration: [],
      vaccineLotNumber: [],
      vfcid: [],
    });

    this.immunizationEditForm = this.formBuilder.group({
      administeredBy: [],
      administeredDate: [],
      administrationSiteID: [],
      administrationSite: [],
      amountAdministered: [],
      expireDate: [],
      immunityStatusID: [],
      immunityStatus: [],
      immunization: [],
      manufactureID: [],
      manufacturerName: [],
      orderBy: [],
      rejectedImmunization: [],
      rejectionReasonID: [],
      rejectionReason: [],
      rejectionReasonNote: [],
      routeOfAdministrationID: [],
      routeOfAdministration: [],
      vaccineLotNumber: [],
      vfcid: [],
    });
    if (this.immunizationModel != null) {
      this.setEditFrom();
    }
  }

  //get the form controls on html page
  get addFormControls() {
    return this.immunizationAddForm.controls;
  }

  get editFormControls() {
    return this.immunizationEditForm.controls;
  }

  setEditFrom() {
    console.log(this.immunizationModel);
    // var mName = this.masterManufacture.find(x => x.id == this.immunizationModel.manufactureID);

  

    this.immunizationEditForm.patchValue({
      administeredBy: this.immunizationModel.administeredBy,
      administeredDate: this.immunizationModel.administeredDate,
      administrationSiteID: this.immunizationModel.administrationSiteID,
      administrationSite: this.immunizationModel.administrationSite,
      amountAdministered: this.immunizationModel.amountAdministered,
      expireDate: this.immunizationModel.expireDate,
      immunityStatusID: this.immunizationModel.immunityStatusID,
      immunityStatus: this.immunizationModel.conceptName,
      immunization: this.immunizationModel.immunization,
      manufactureID: this.immunizationModel.manufactureID,
      manufacturerName: this.immunizationModel.manufacturerName,
      orderBy: this.immunizationModel.orderBy,
      rejectedImmunization: this.immunizationModel.rejectedImmunization,
      rejectionReasonID: this.immunizationModel.rejectionReasonID,
      rejectionReason: this.immunizationModel.rejectionReason,
      rejectionReasonNote: this.immunizationModel.rejectionReasonNote,
      routeOfAdministrationID: this.immunizationModel.routeOfAdministrationID,
      routeOfAdministration: this.immunizationModel.routeOfAdministration,
      vaccineLotNumber: this.immunizationModel.vaccineLotNumber,
      vfcid: this.immunizationModel.vfcid,
    });
    this.filterstring = this.immunizationModel.immunization;
    this.filterStringId = this.immunizationModel.immunizationId;
    this.filtervfceligibility = this.immunizationModel.vfcid;
    this.filterVfcId = this.immunizationModel.vfcEligibilityId;
    this.filterManufacture = this.immunizationModel.manufacturerName;
    this.filterManufactureId = this.immunizationModel.manufactureID;
    this.filterRouteOfAdminisValue =
      this.immunizationModel.routeOfAdministration;
    this.filterRouteOfAdminstartionId =
      this.immunizationModel.routeOfAdministrationID;
    this.filterImmunityStatusValue = this.immunizationModel.conceptName;
    this.filterImmunityStatusId = this.immunizationModel.immunityStatusID;
    this.filterAdministrationSiteId =
      this.immunizationModel.administrationSiteID;
    this.filterAdministrationSiteVal =
      this.immunizationModel.administrationSite;
    this.filterRejectionReason = this.immunizationModel.rejectionReason;
    this.filterRejectionId = this.immunizationModel.rejectionReasonID;
    console.log(this.immunizationEditForm);
  }
  //submit for create update of immunization
  onAddSubmit(event: any) {
    if (!this.immunizationAddForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.immunizationModel = this.immunizationAddForm.value;
      this.immunizationModel.patientID = this.patientId;
      this.immunizationModel.appointmentId = this.appointmentId;
      this.immunizationModel.immunizationId =
        this.filterStringId == null || this.filterStringId == undefined
          ? 0
          : this.filterStringId;
      this.immunizationModel.vfcEligibilityId =
        this.filterVfcId == null || this.filterVfcId == undefined
          ? 0
          : this.filterVfcId;
      this.immunizationModel.manufactureID =
        this.filterManufactureId == null ||
          this.filterManufactureId == undefined
          ? 0
          : this.filterManufactureId;
      this.immunizationModel.routeOfAdministrationID =
        this.filterRouteOfAdminstartionId == null ||
          this.filterRouteOfAdminstartionId == undefined
          ? 0
          : this.filterRouteOfAdminstartionId;
      this.immunizationModel.immunityStatusID =
        this.filterImmunityStatusId == null ||
          this.filterImmunityStatusId == undefined
          ? 0
          : this.filterImmunityStatusId;
      this.immunizationModel.administrationSiteID =
        this.filterAdministrationSiteId == null ||
          this.filterAdministrationSiteId == undefined
          ? 0
          : this.filterAdministrationSiteId;
      this.immunizationModel.rejectionReasonID =
        this.filterRejectionId == null || this.filterRejectionId == undefined
          ? 0
          : this.filterRejectionId;
      this.clientService
        .createImmunization(this.immunizationModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.immunizationAddForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }

  onEditSubmit(event: any) {
    if (!this.immunizationEditForm.invalid) {
      let clickType = event.currentTarget.name;
      this.submitted = true;
      this.immunizationModel = this.immunizationEditForm.value;
      this.immunizationModel.patientID = this.patientId;
      this.immunizationModel.id = this.immunizationIdForEdit;
      // if (this.masterImmunization.findIndex((d) =>d.value.toLowerCase() ==this.immunizationModel.immunization.toLowerCase()) == -1) {
      //   this.filterStringId = 0;
      // }

      if (this.immunizationModel.immunization && this.masterImmunization.findIndex((d) => d.value && d.value.toLowerCase() === this.immunizationModel.immunization.toLowerCase()) === -1) {
        this.filterStringId = 0;
    }
      this.immunizationModel.immunizationId =this.filterStringId != null || this.filterStringId != undefined? this.filterStringId: 0;
      // if (this.masterVFC.findIndex((x) =>x.value.toLowerCase() ==this.immunizationModel.vfcid.toLocaleLowerCase()) == -1) {
      //   this.filterVfcId = 0;
      // }

      if (this.immunizationModel.vfcid && this.masterVFC.findIndex((x) => x.value&&x.value.toLowerCase() === this.immunizationModel.vfcid.toLocaleLowerCase()) === -1) {
        this.filterVfcId = 0;
    }
      this.immunizationModel.vfcEligibilityId =
        this.filterVfcId == null || this.filterVfcId == undefined
          ? 0
          : this.filterVfcId;
      // if (
      //   this.masterManufacture.findIndex(
      //     (x) =>
      //       x.value.toLowerCase() ==
      //       this.immunizationModel.manufacturerName.toLowerCase()
      //   ) == -1
      // ) {
      //   this.filterManufactureId = 0;
      // }

      if (this.immunizationModel.manufacturerName && this.masterManufacture.findIndex((x) => x.value && x.value.toLowerCase() === this.immunizationModel.manufacturerName.toLowerCase()) === -1) {
        this.filterManufactureId = 0;
    }
      this.immunizationModel.manufactureID =
        this.filterManufactureId == null ||
          this.filterManufactureId == undefined
          ? 0
          : this.filterManufactureId;
      if (
        this.masterRouteOfAdministration.findIndex(
          (x) =>x.value&&
            x.value.toLowerCase() ==
            this.immunizationModel.routeOfAdministration.toLowerCase()
        ) == -1
      ) {
        this.filterRouteOfAdminstartionId = 0;
      }
      this.immunizationModel.routeOfAdministrationID =
        this.filterRouteOfAdminstartionId == null ||
          this.filterRouteOfAdminstartionId == undefined
          ? 0
          : this.filterRouteOfAdminstartionId;
      if (
        this.masterImmunityStatus.findIndex(
          (x) =>x.value&&
            x.value.toLowerCase() ==
            this.immunizationModel.immunityStatus.toLowerCase()
        ) == -1
      ) {
        this.filterImmunityStatusId = 0;
      }
      this.immunizationModel.immunityStatusID =
        this.filterImmunityStatusId == null ||
          this.filterImmunityStatusId == undefined
          ? 0
          : this.filterImmunityStatusId;
      if (
        this.masterAdministrationSite.findIndex(
          (x) =>x.value&&
            x.value.toLowerCase() ==
            this.immunizationModel.administrationSite.toLowerCase()
        ) == -1
      ) {
        this.filterAdministrationSiteId = 0;
      }
      this.immunizationModel.administrationSiteID =
        this.filterAdministrationSiteId == undefined ||
          this.filterAdministrationSiteId == null
          ? 0
          : this.filterAdministrationSiteId;
      if (
        this.masterRejectionReason.findIndex(
          (x) =>x.value&&
            x.value.toLowerCase() ==
            this.immunizationModel.rejectionReason.toLowerCase()
        ) == -1
      ) {
        this.filterRejectionId = 0;
      }
      this.immunizationModel.rejectionReasonID =
        this.filterRejectionId == null || this.filterRejectionId == undefined
          ? 0
          : this.filterRejectionId;
      this.clientService
        .createImmunization(this.immunizationModel)
        .subscribe((response: any) => {
          this.submitted = false;
          if (response.statusCode == 200) {
            this.notifier.notify("success", response.message);
            if (clickType == "Save") this.closeDialog("save");
            else if (clickType == "SaveAddMore") {
              this.refreshGrid.next("");
              this.immunizationEditForm.reset();
            }
          } else {
            this.notifier.notify("error", response.message);
          }
        });
    }
  }
  //call master data api
  getMasterData() {

    console.log("running");
    let data =
      "MASTERSTAFF,MASTERVFC,MASTERIMMUNIZATION,MASTERMANUFACTURE,MASTERADMINISTRATIONSITE,MASTERROUTEOFADMINISTRATION,MASTERIMMUNITYSTATUS,MASTERREJECTIONREASON";
    this.clientService.getMasterData(data).subscribe((response: any) => {
      if (response != null) {
        this.masterStaff = response.staffs != null ? response.staffs : [];
        this.masterVFC = response.masterVFC != null ? response.masterVFC : [];
        this.masterRouteOfAdministration =
          response.masterRouteOfAdministration != null
            ? response.masterRouteOfAdministration
            : [];
        this.masterRejectionReason =
          response.masterRejectionReason != null
            ? response.masterRejectionReason
            : [];
        this.masterManufacture =
          response.masterManufacture != null ? response.masterManufacture : [];
        this.masterImmunization =
          response.masterImmunization != null
            ? response.masterImmunization
            : [];
        this.masterImmunityStatus =
          response.masterImmunityStatus != null
            ? response.masterImmunityStatus
            : [];
        this.masterAdministrationSite =
          response.masterAdministrationSite != null
            ? response.masterAdministrationSite
            : [];
      }
    });
  }
  onSelectChange(data: any, type: any) {
    if (type == "immunization") {
      this.filterstring = data.vaccineName;
      this.filterStringId = data.id;
    } else if (type == "vfceligibility") {
      this.filtervfceligibility = data.value;
      this.filterVfcId = data.id;
    } else if (type == "manufacture") {
      this.filterManufactureId = data.id;
      this.addFormControls["manufactureID"] = data.id;
      this.filterManufacture = data.value;
    } else if (type == "routeofAdministration") {
      this.filterRouteOfAdminisValue = data.value;
      this.filterRouteOfAdminstartionId = data.id;
    } else if (type == "immunityStatus") {
      this.filterImmunityStatusId = data.id;
      this.filterImmunityStatusValue = data.value;
    } else if (type == "adminSite") {
      this.filterAdministrationSiteVal = data.val;
      this.filterAdministrationSiteId = data.id;
    } else if (type == "reason") {
      this.filterRejectionId = data.id;
      this.filterRejectionReason = data.val;
    }
  }
  rejectionReasonHandler = (e:any) => {
    if (e !== "" && e != undefined) {
      this.filterRejectionReasons = this.masterRejectionReason.filter(
        (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterRejectionReasons = [];
    }
  };
  immunizationTypeHandler = (e:any) => {
    if (e !== "" && e != undefined) {
      this.filtermasterImmunizationTypes = this.masterImmunization.filter(
        (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filtermasterImmunizationTypes = [];
    }
  };

  vfcEligibilityTypeHandler = (e:any) => {
    if (e !== "" && e != undefined) {
      this.filterMasterVfcEligibilityTypes = this.masterVFC.filter(
        (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterVfcEligibilityTypes = [];
    }
  };

  manufactureTypeHandler = (e : any) => {
    if (e !== "" && e != undefined) {
      this.filterMasterManufactures = this.masterManufacture.filter(
        (doc) => doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterMasterManufactures = [];
    }
  };
  routeOfAdminTypeHandler = (e: any) => {
    if (e !== "" && e != undefined) {
      this.filterRouteOfAdministrationTypes =
        this.masterRouteOfAdministration.filter(
          (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
        );
    } else {
      this.filterRouteOfAdministrationTypes = [];
    }
  };
  immunityStatusTypeHandler = (e: any) => {
    if (e !== "" && e != undefined) {
      this.filterImmunityStatus = this.masterImmunityStatus.filter(
        (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterImmunityStatus = [];
    }
  };
  administrationSiteTypeHandler = (e : any) => {
    if (e !== "" && e != undefined) {
      this.filterAdminSiteTypes = this.masterAdministrationSite.filter(
        (doc) =>doc.value && doc.value.toLowerCase().indexOf(e) != -1
      );
    } else {
      this.filterAdminSiteTypes = [];
    }
  };
  //close popup
  closeDialog(action: string): void {
    this.immunizationDialogModalRef.close(action);
  }

  dateFilter :(d: Date | null) => boolean = (d: Date | null) =>{
    //////debugger

    if (!d) return false;
    var administeredDate = new Date(
      this.immunizationAddForm.controls["administeredDate"].value
    )
      .toLocaleDateString()
      .split("/");
    const tt = [];
    tt.push(parseInt(administeredDate[1]));
    return tt.indexOf(+d.getDate()) == -1;
  };
  dateEditFilter: (d: Date | null) => boolean = (d: Date | null) => {
    //////debugger
    if (!d) return false;
    var administeredDate = new Date(
      this.immunizationEditForm.controls["administeredDate"].value
    )
      .toLocaleDateString()
      .split("/");
    const tt = [];
    tt.push(parseInt(administeredDate[1]));
    return tt.indexOf(+d.getDate()) == -1;
  };
}
