//import { EncounterModel } from './../../dashboard/dashboard.model';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientsService } from "../clients.service";
import { EncounterModel } from "./encounter.model";
import { FilterModel, ResponseModel } from "../../../core/modals/common-model";
import { format, isThisSecond } from "date-fns";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CommonService } from "../../../core/services";
import { LoginUser } from "../../../core/modals/loginUser.modal";

@Component({
  selector: "app-encounter",
  templateUrl: "./encounter.component.html",
  styleUrls: ["./encounter.component.css"],
})
export class EncounterComponent implements OnInit {
  clientId!: number;
  maxDate = new Date();
  encounterFormGroup!: FormGroup;
  statusList!: any[];
  appointmentType!: any[];
  encounterListModel: EncounterModel[];
  header: string = "Client Past-Appointments";
  metaData: any;
  clientEncounterFilterModel: FilterModel;
  appointmentStatus: any = [
    "All",
    "Completed",
    "Cancelled"
  ];
  selectedStatus: string = "All";
  displayedColumns: Array<any> = [
    {
      displayName: "appointment_no",
      key: "patientAppointmentId",
      isSort: true,
      class: "",
      width: "5%",
    },
    {
      displayName: "date_of_service",
      key: "dateOfService",
      isSort: true,
      class: "",
      width: "20%",
      type:'date'
    },
    { displayName: "duration", key: "duration", class: "", width: "5%" },
    {
      displayName: "practitioner",
      key: "staffName",
      isSort: true,
      class: "",
      width: "12%",
    },
    {
      displayName: "appointment_type",
      key: "appointmentType",
      class: "",
      width: "17%",
    },
    {
      displayName: "status",
      key: "status",
      isSort: true,
      width: "10%",
      type: ["RENDERED", "PENDING"],
    },
    { displayName: "actions", key: "Actions", class: "", width: "5%" },
  ];
  actionButtons: Array<any> = [
    { displayName: "Edit", key: "edit", class: "fa fa-eye" },
  ];
  appointmentTypeId: any;
  staffFirstName: string = "";
  appointmentId!: number;
  patientId: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientsService: ClientsService,
    private formBuilder: FormBuilder,
    private route: Router,
    private commonService: CommonService
  ) {
    this.encounterListModel = new Array<EncounterModel>();
    this.clientEncounterFilterModel = new FilterModel();

    //this.statusList = [{ id: true, value: 'Pending' }, { id: false, value: 'Rendered' }]
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.clientId =
        params["id"] == undefined
          ? null
          : this.commonService.encryptValue(params["id"], false);
    });
    if (this.clientId == null) {
      this.clientId = parseInt(
        <string>(
          this.commonService.encryptValue(
            this.activatedRoute.snapshot.params["id"],
            false
          )
        )
      );
    }
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      console.log("user", user);
      console.log("user.data", user.data);
      // this.staffFirstName = user.data.firstName;
      this.encounterFormGroup = this.formBuilder.group({
        appointmentTypeId: 0,
        staffName: this.staffFirstName,
        // status: "",
        fromDate: "",
        toDate: "",
      });
    });

    this.getMasterData();
    this.getEncounterList(
      this.clientEncounterFilterModel,
      this.clientId,
      "",
      "",
      "",
      "",
      ""
    );
    this.getUserPermissions();
  }

  get formControls() {
    return this.encounterFormGroup.controls;
  }

  getMasterData() {
    let data = "appointmentType";
    this.appointmentType = [{ value: "New" }, { value: "Follow-up" }];
    // this.clientsService.getMasterData(data).subscribe((response: any) => {
    //   this.appointmentType = response.appointmentType;
    // });
  }

  getEncounterList(
    filterModel: FilterModel,
    clientId: number,
    appointmentTypeId: string,
    staffName: string,
    status: string,
    fromDate: string,
    toDate: string
  ) {
  
    this.clientsService
      .getClientEncounters(
        this.clientEncounterFilterModel,
        clientId,
        appointmentTypeId,
        staffName,
        status,
        fromDate,
        toDate
      )
      .subscribe((response: ResponseModel) => {
        //////debugger;

        if (response && response.statusCode == 200) {
          this.encounterListModel = response.data;
          // this.encounterListModel = (response.data || []).map((obj: any) => {
          //   obj.dateOfService =
          //     format(obj.dateOfService, 'MM/dd/yyyy') +
          //     " (" +
          //     format(obj.dateOfService, 'h:mm a') +
          //     " - " +
          //     format(obj.endDateTime, 'h:mm a') +
          //     ")";
          //   return obj;
          // });
          this.metaData = response.meta;
        } else {
          this.encounterListModel=[];
        }
      });
  }
  clearFilters() {
    this.encounterFormGroup.reset();
    this.setPaginatorModel(
      1,
      this.clientEncounterFilterModel.pageSize,
      this.clientEncounterFilterModel.sortColumn,
      this.clientEncounterFilterModel.sortOrder
    );
    this.getEncounterList(
      this.clientEncounterFilterModel,
      this.clientId,
      "",
      "",
      "",
      "",
      ""
    );
  }

  statusChangeHandler = (e: string) => {
    this.selectedStatus = e;
    this.applyFilter();
  }
  applyFilter() {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(
      1,
      this.clientEncounterFilterModel.pageSize,
      this.clientEncounterFilterModel.sortColumn,
      this.clientEncounterFilterModel.sortOrder
    );
    this.getEncounterList(
      this.clientEncounterFilterModel,
      this.clientId,
      this.appointmentTypeId,
      formValues.staffName,
      this.selectedStatus,
      formValues.fromDate ? format(formValues.fromDate, 'MM/dd/yyyy') : '',
      formValues.toDate ? format(formValues.toDate, 'MM/dd/yyyy') : ''
    );
  }
  changeAppointment(e: { source: { value: any; }; }) {
    this.appointmentTypeId = e.source.value;
  }
  setPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.clientEncounterFilterModel.pageNumber = pageNumber;
    this.clientEncounterFilterModel.pageSize = pageSize;
    this.clientEncounterFilterModel.sortOrder = sortOrder;
    this.clientEncounterFilterModel.sortColumn = sortColumn;
  }

  onPageOrSortChange(changeState?: any) {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(
      changeState.pageIndex + 1,
      //this.clientEncounterFilterModel.pageSize,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getEncounterList(
      this.clientEncounterFilterModel,
      this.clientId,
      this.appointmentTypeId,
      formValues.staffName,
      "",
      formValues.fromDate ? format(formValues.fromDate, 'MM/dd/yyyy') : "",
      formValues.toDate ? format(formValues.toDate, 'MM/dd/yyyy') : ""
    );
  }

  onTableActionClick(actionObj?: any) {
    debugger
    const apptId = actionObj.data && actionObj.data.patientAppointmentId,
      patId= actionObj.data && actionObj.data.patientID,
      encId = actionObj.data && actionObj.data.id,
      isBillableEncounter =
        actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || "").toUpperCase()) {
      case "EDIT":
        const redirectUrl = isBillableEncounter
          ? "/web/waiting-room/"
          : "/web/encounter/non-billable-soap";
        if (isBillableEncounter) {
          this.route.navigate(["/web/waiting-room/" + apptId + patId]);
        } else {
          // this.route.navigate([redirectUrl], {
          //   queryParams: {
          //     apptId: apptId,
          //     encId: encId
          //   }
          // });
          const url = this.route.serializeUrl(
            this.route.createUrlTree([redirectUrl], {
              queryParams: {
                apptId: apptId,
              //  encId: encId,
                patId: patId
              },
              queryParamsHandling: "merge",
            })
          );
         window.open(url, "_blank");
          // const url = this.route.serializeUrl(this.route.createUrlTree(['/employee'], { queryParams: { selectId: someID }, queryParamsHandling: 'preserve' }));
          //    window.open(url, '_blank');
          //this.router.navigate([]).then(result => {  window.open(link, '_blank'); });
        }
        break;
      default:
        break;
    }
  }

  getUserPermissions() {
    const actionPermissions =
      this.clientsService.getUserScreenActionPermissions(
        "CLIENT",
        "CLIENT_ENCOUNTER_LIST"
      );
    const { CLIENT_ENCOUNTER_LIST_VIEW } = actionPermissions;
    if (!CLIENT_ENCOUNTER_LIST_VIEW) {
      let spliceIndex = this.actionButtons.findIndex(
        (obj) => obj.key == "edit"
      );
      this.actionButtons.splice(spliceIndex, 1);
    }
  }
}
