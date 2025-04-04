import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { format } from 'date-fns';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EncounterModel } from '../../agency-portal/clients/encounter/encounter.model';
import { FilterModel } from '../../core/modals/common-model';
import { CommonService } from '../../core/services/common.service';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-clientencounter',
  templateUrl: './clientencounter.component.html',
  styleUrls: ['./clientencounter.component.css']
})
export class ClientencounterComponent implements OnInit {
  clientId!: number;
  maxDate = new Date();
  minDate = new Date();
  TominDate = new Date();
  encounterFormGroup!: FormGroup;
  statusList!: any[];
  appointmentType!: any[];
  encounterListModel: EncounterModel[];
  header: string = "Past-Appointments";
  metaData: any;
  clientEncounterFilterModel: FilterModel;
  displayedColumns: Array<any> = [
    { displayName: 'appointment_no', key: 'patientAppointmentId', isSort: true, class: '', width: '5%' },
    { displayName: 'date_of_service', key: 'dateOfService', isSort: true, class: '', width: '20%' },
    { displayName: 'duration', key: 'duration', class: '', width: '5%' },
    { displayName: 'practitioner', key: 'staffName', isSort: true, class: '', width: '12%' },
    { displayName: 'appointment_type', key: 'appointmentType', class: '', width: '17%' },
    //{ displayName: 'Status', key: 'status', isSort: true, width: '10%', type: ['RENDERED', 'PENDING'] },
    { displayName: 'actions', key: 'Actions', class: '', width: '5%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-eye' }
  ];
  constructor(private activatedRoute: ActivatedRoute, private clientsService: ClientsService,
     private formBuilder: FormBuilder, private route: Router,private commonService:CommonService,
     private translate:TranslateService) {
    this.encounterListModel = new Array<EncounterModel>();
    this.clientEncounterFilterModel = new FilterModel();
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
      // this.statusList = [{ id: true, value: 'Pending' }, { id: false, value: 'Rendered' }];
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.clientId = params['id'] == undefined ? null : this.commonService.encryptValue(params['id'],false);
    });

    this.encounterFormGroup = this.formBuilder.group({
      appointmentTypeId: 0,
      staffName: "",
      status: "",
      fromDate: "",
      toDate: ""
    });
    this.getMasterData();
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, "", "", "", "", "");
    // this.getUserPermissions();
  }

  get formControls() { return this.encounterFormGroup.controls; }


  getMasterData() {
    this.translate.get(['new', 'follow_up']).subscribe(translations => {
      this.appointmentType = [
        { value: translations['new'] },
        { value: translations['follow_up'] }
      ];
    });
  }
    // this.clientsService.getMasterData(data).subscribe((response: any) => {
    //   this.appointmentType = response.appointmentType;
    // });
  
  appointmentTypeId: any;
  changeAppointment(e:any){
  this.appointmentTypeId =e.source.value;
  }

  getEncounterList(filterModel: FilterModel, clientId: number, appointmentTypeId: string, staffName: string, status: string, fromDate: string, toDate: string) {
    this.clientsService.getClientEncounters(this.clientEncounterFilterModel, clientId, appointmentTypeId, staffName, status, fromDate, toDate).subscribe((response: ResponseModel) => {
      if (response && response.statusCode == 200){
        this.encounterListModel = response.data;
      this.encounterListModel = (response.data || []).map((obj: any) => {
        obj.dateOfService = format(obj.dateOfService, 'MM/dd/yyyy') + " (" + format(obj.dateOfService, 'h:mm A') + " - " + format(obj.endDateTime, 'h:mm A') + ")";
        return obj;
      });
      this.metaData = response.meta;
    }else{
        this.encounterListModel = [];
      }
    });
  }
  clearFilters() {
    this.encounterFormGroup.reset();
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, "", "", "", "", "");
  }

  currentYear = new Date().getFullYear();
   myDateFilter = (d: Date): boolean => {
     this.TominDate.setDate(d.getDate()+1);
  const year = (d || new Date()).getFullYear();
  return year >= this.currentYear -1 && year <= this.currentYear + 1;
}

  applyFilter() {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(1, this.clientEncounterFilterModel.pageSize, this.clientEncounterFilterModel.sortColumn, this.clientEncounterFilterModel.sortOrder);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, this.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/dd/yyyy') : "", formValues.toDate ? format(formValues.toDate, 'MM/dd/yyyy') : "");
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string) {
    this.clientEncounterFilterModel.pageNumber = pageNumber;
    this.clientEncounterFilterModel.pageSize = pageSize;
    this.clientEncounterFilterModel.sortOrder = sortOrder;
    this.clientEncounterFilterModel.sortColumn = sortColumn;
  }

  onPageOrSortChange(changeState?: any) {
    let formValues = this.encounterFormGroup.value;
    this.setPaginatorModel(changeState.pageIndex + 1, this.clientEncounterFilterModel.pageSize, changeState.sort, changeState.order);
    this.getEncounterList(this.clientEncounterFilterModel, this.clientId, this.appointmentTypeId, formValues.staffName, formValues.status, formValues.fromDate ? format(formValues.fromDate, 'MM/dd/yyyy') : "", formValues.toDate ? format(formValues.toDate, 'MM/dd/yyyy') : "");
  }



  onTableActionClick(actionObj?: any) {
    //////debugger
    const apptId = actionObj.data && actionObj.data.patientAppointmentId,
        encId = actionObj.data && actionObj.data.id,
        isBillableEncounter = actionObj.data && actionObj.data.isBillableEncounter;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
      const redirectUrl = isBillableEncounter ? "/web/waiting-room/" : "/web/client/non-billable-soap";
      if(isBillableEncounter){
        this.route.navigate(["/web/waiting-room/"+apptId]);
      } else {
      this.route.navigate([redirectUrl], {
        queryParams: {
          apptId: apptId,
          encId: encId
        }});
      }
        break;
      default:
        break;
    }
  }

  getUserPermissions() {
    const actionPermissions = this.clientsService.getUserScreenActionPermissions('CLIENT', 'CLIENT_ENCOUNTER_LIST');
    const { CLIENT_ENCOUNTER_LIST_VIEW } = actionPermissions;
    if (!CLIENT_ENCOUNTER_LIST_VIEW) {
      let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
      this.actionButtons.splice(spliceIndex, 1)
    }

  }

  RedirctMyProfil(){
    this.route.navigate(["/web/client/my-profile/"]);
  }

}
