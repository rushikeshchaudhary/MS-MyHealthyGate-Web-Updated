import { DialogService } from "src/app/shared/layout/dialog/dialog.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { debug } from "util";
import { MatDialog } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { format } from "date-fns";
import { VitalModel } from "../../agency-portal/clients/vitals/vitals.model";
import { ClientsService } from "../../agency-portal/clients/clients.service";
import { FilterModel } from "../../core/modals/common-model";
import { VitalsModalComponent } from "./vitals-modal/vitals-modal.component";
import { LoginUser } from "../../core/modals/loginUser.modal";
import { SchedulerService } from "../../scheduling/scheduler/scheduler.service";

@Component({
  selector: "app-vitals-list",
  templateUrl: "./vitals-list.component.html",
  styleUrls: ["./vitals-list.component.css"],
})
export class VitalsListComponent implements OnInit {
  vitalData: VitalModel = new VitalModel;
  vitalListingData: VitalModel[] = [];
  filterModel: FilterModel = new FilterModel;
  metaData: any;
  inches: any;
  feets: any;
  displayedColumns: Array<any>;
  actionButtons: Array<any>;
  clientId!: number;
  addPermission: boolean = false;
  header: string = "Client Vitals";
  isGrid: boolean = true;
  patientId!: number;
  //Charts
  lineChartData: Array<any> = [];
  lineChartLabels: Array<any> = [];
  lineChartType: string = "line";
  isPatient: boolean = false;
  apptId: number = 0;
  appointmentId!: number;

  isHistoryShareable: boolean = true;

  //constructor
  constructor(
    private activatedRoute: ActivatedRoute,
    private notifier: NotifierService,
    private schedular: SchedulerService,
    private clientsService: ClientsService,
    public activityModal: MatDialog,
    private dialogService: DialogService,
    private commonService: CommonService
  ) {
    this.displayedColumns = [
      { displayName: "Date", key: "vitalDate", isSort: true, width: "20%",type:'date' },
      {
        displayName: "Height(Cm)",
        key: "displayheight",
        isSort: true,
        width: "10%",
      },
      { displayName: "WEIGHT(Kg)", key: "weightLbs", width: "10%" },
      { displayName: "H-Rate", key: "heartRate", width: "10%" },
      { displayName: "BMI", key: "bmi", isSort: true, width: "10%" },
      { displayName: "BP(H/L)", key: "displayBP", width: "10%" },
      { displayName: "Pulse", key: "pulse", width: "10%" },
      { displayName: "Resp", key: "respiration", width: "10%" },
      { displayName: "Temp(°C)", key: "temperature", width: "10%" },
      { displayName: "Actions", key: "Actions", width: "10%" },
    ];  
    this.actionButtons = [
      { displayName: "Edit", key: "edit", class: "fa fa-pencil" },
      { displayName: "Delete", key: "delete", class: "fa fa-times" },
    ];

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.isPatient = true;
          this.actionButtons = [];
        } else {
          this.isPatient = false;
        }
      }
    });
  }

  //on inital load
  ngOnInit() {
    const apptId = Number(this.activatedRoute.snapshot.paramMap.get("id"));
    this.appointmentId = Number(apptId);
    this.getAppointmentDetails();

    if (apptId != null) {
      this.patientId = Number(this.getClient(Number(apptId)));
    }
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.clientId = user.userID;
        //initialize filter model
        this.filterModel = new FilterModel();
        //call listing method
        this.getVitalList(this.filterModel, "grid");
        //this.getUserPermissions();
      }
    });
  }

  getClient(id: number) {
    if (id != null && id > 0) {
      this.clientsService
        .getPatientWithAppointmentId(id)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.patientId = response.data.patientId;
            this.getVitalList(this.filterModel, "grid");
          }
        });
    }
  }
  getAppointmentDetails() {
    console.log(this.appointmentId);
    this.schedular
      .getAppointmentDetails(this.appointmentId)
      .subscribe((responce) => {
        this.isHistoryShareable = responce.data.isHistoryShareable;
      });
  }

  //listing of vitals
  getVitalList(filterModel:any, type: string = "") {
    // if(type == "chart")
    // {
    //   this.vitalsChartData=[];
    //   this.lineChartLabels=[];
    // }
    this.vitalListingData = [];
    this.clientsService
      .getVitalList(this.patientId, this.filterModel)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.vitalListingData = response.data;
          this.vitalListingData = (response.data || []).map((obj: any) => {
            obj.vitalDate = obj.vitalDate
              ? obj.vitalDate
              : "-";
            obj.displayheight = obj.heightIn
              ? this.convertInches(obj.heightIn)
              : "-";
            obj.displayBP =
              obj.bpDiastolic && obj.bpSystolic
                ? this.convertBP(obj.bpDiastolic, obj.bpSystolic)
                : "-";
            obj.heartRate = obj.heartRate || "-";
            obj.weightLbs = obj.weightLbs || "-";
            obj.bmi = obj.bmi || "-";
            obj.pulse = obj.pulse || "-";
            obj.respiration = obj.respiration || "-";
            obj.temperature = obj.temperature || "-";
            return obj;
          });
          this.isGrid = type == "grid" ? true : false;
          if (type == "chart") {
            //this.vitalListingData = response.data != null ? response.data : {};
            if (this.vitalListingData.length > 0) {
              // this.lineChartLabels = this.vitalListingData.map(
              //   ({ vitalDate }) => format(vitalDate, 'MM/dd/yyyy')
              // );
              this.lineChartData = [
                {
                  data: this.vitalListingData.map(({ bmi }) => bmi),
                  label: "BMI",
                },
                {
                  data: this.vitalListingData.map(
                    ({ bpDiastolic }) => bpDiastolic
                  ),
                  label: "Diastolic BP",
                },
                {
                  data: this.vitalListingData.map(
                    ({ bpSystolic }) => bpSystolic
                  ),
                  label: "Systolic BP",
                },
                {
                  data: this.vitalListingData.map(({ heartRate }) => heartRate),
                  label: "Heart Rate",
                },
                {
                  data: this.vitalListingData.map(({ heightIn }) => heightIn),
                  label: "Height(In)",
                },
                {
                  data: this.vitalListingData.map(({ pulse }) => pulse),
                  label: "Pulse",
                },
                {
                  data: this.vitalListingData.map(
                    ({ respiration }) => respiration
                  ),
                  label: "Respiration",
                },
                {
                  data: this.vitalListingData.map(
                    ({ temperature }) => temperature
                  ),
                  label: "Temperature(c)",
                },
                {
                  data: this.vitalListingData.map(({ weightLbs }) => weightLbs),
                  label: "Weight(Lb)",
                },
              ];
            }
          }
          this.metaData = response.meta;
        } else {
          this.vitalListingData = [];
          this.metaData = {};
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  toggleView(value: string = "") {
    if (value == "grid") {
      this.filterModel.pageSize = 5; //This will be a fixed valeu as we need all the parameters
      this.getVitalList(this.filterModel, "grid");
    } else {
      this.filterModel.pageSize = 100; //This will be changed later
      this.getVitalList(this.filterModel, "chart");
    }
  }

  //page load and sorting
  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      this.filterModel.searchText
    );
    this.getVitalList(this.filterModel, "grid");
  }

  //table action
  onTableActionClick(actionObj?: any) {
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        this.openDialog(id);
        break;
      case "DELETE":
        this.deleteDetails(id);
        break;
      default:
        break;
    }
  }

  //open popup
  openDialog(id: number) {
    if (id != null && id > 0) {
      this.clientsService.getVitalById(id).subscribe((response: any) => {
        if (response != null && response.data != null) {
          this.vitalData = response.data;
          this.createModel(this.vitalData);
        }
      });
    } else {
      this.vitalData = new VitalModel();
      this.createModel(this.vitalData);
    }
  }

  //create modal
  createModel(vitalData: VitalModel) {
    vitalData.patientID = this.patientId;
    const modalPopup = this.activityModal.open(VitalsModalComponent, {
      hasBackdrop: true,
      data: { vital: vitalData, refreshGrid: this.refreshGrid.bind(this) },
    });

    modalPopup.afterClosed().subscribe((result) => {
      if (result === "save") {
        this.getVitalList(
          this.filterModel,
          this.isGrid == true ? "grid" : "chart"
        );
      }
    });
  }
  refreshGrid() {
    this.getVitalList(this.filterModel, this.isGrid == true ? "grid" : "chart");
  }

  deleteDetails(id: number) {
    this.dialogService
      .confirm("Are you sure you want to delete this vital?")
      .subscribe((result: any) => {
        if (result == true) {
          this.clientsService.deleteVital(id).subscribe((response: any) => {
            if (response.statusCode === 200) {
              this.notifier.notify("success", response.message);
              this.getVitalList(this.filterModel, "grid");
            } else if (response.statusCode === 401) {
              this.notifier.notify("warning", response.message);
            } else {
              this.notifier.notify("error", response.message);
            }
          });
        }
      });
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

  convertInches(inches: number) {
    try {
      if (inches && inches > 0) {
        let feetFromInches = Math.floor(inches / 12); //There are 12 inches in a foot
        let inchesRemainder = inches % 12;
        let result = feetFromInches + "'" + inchesRemainder + '"';
        return result;
      } else {
        return "0";
      }
    } catch {
      return "0";
    }
  }
  convertBP(D: any, S:any) {
    try {
      let systolic = "0";
      let diastolic = "0";
      if (D && D > 0) {
        diastolic = D;
      }
      if (S && S > 0) {
        systolic = S;
      }
      return S + "/" + D;
    } catch {
      return "0/0";
    }
  }

  getUserPermissions() {
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_VITALS_LIST"
      );
    const {
      CLIENT_VITALS_LIST_ADD,
      CLIENT_VITALS_LIST_UPDATE,
      CLIENT_VITALS_LIST_DELETE,
    } = actionPermissions;
    if (!CLIENT_VITALS_LIST_UPDATE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "edit"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }
    if (!CLIENT_VITALS_LIST_DELETE) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "delete"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }

    this.addPermission = CLIENT_VITALS_LIST_ADD || false;
  }
}
