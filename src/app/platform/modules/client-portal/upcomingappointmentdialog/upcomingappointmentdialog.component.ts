
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Metadata } from '../client-profile.model';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-upcomingappointmentdialog',
  templateUrl: './upcomingappointmentdialog.component.html',
  styleUrls: ['./upcomingappointmentdialog.component.css']
})
export class UpcomingappointmentdialogComponent implements OnInit {
  upcomingAptfilterModel: any;
  allAppointmentsMeta: Metadata;
  headerText: string = "Select Any Upcoming Appointments";
  allAppointmentsList: Array<any> = [];
  allAppointmentsDisplayedColumns = [
    {
      displayName: "care_manager",
      key: "staffName",
      class: "",
      width: "160px",
      sticky: true
    },
    {
      displayName: "appointment_type",
      key: "appointmentTypeName",
      width: "140px"
    },
    { displayName: "date_time", key: "dateTimeOfService", width: "250px" },
    {
      displayName: "symptom_ailment",
      key: "notes",
      width: "250px",
      type: "50",
      isInfo: true
    },
    { displayName: "actions", key: "Actions", width: "80px" }
  ];
  upcomingAppointmentsActionButtons = [
    {
      displayName: "select",
      key: "toWaitingRoom",
      class: "fa fa-arrow-right"
    }
  ];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogModalRef: MatDialogRef<UpcomingappointmentdialogComponent>, private route: Router,    private translate:TranslateService,
) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.allAppointmentsList = this.data.popmodel == null ? [] : this.data.popmodel;
    this.allAppointmentsMeta = this.data.popmeta == null ? [] : this.data.popmeta;
  }
  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
    this.route.navigate(["/web/client/dashboard/"]);
  }
  ngOnInit() {
  }
  onUpcomingTableActionClick(actionObj?: any) {
    
    switch ((actionObj.action || '').toUpperCase()) {
      case 'TOWAITINGROOM':
        this.closeDialog("close");
        this.route.navigate([`/web/waiting-room/reshedule/${actionObj.data.patientAppointmentId}/`]);
        break;


      default:
        break;
    }
  }

  onUpcomingAptPageOrSortChange(event: any) {

  }

  setUpcomingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.upcomingAptfilterModel.pageNumber = pageNumber;
    this.upcomingAptfilterModel.pageSize = pageSize;
    this.upcomingAptfilterModel.sortOrder = sortOrder;
    this.upcomingAptfilterModel.sortColumn = sortColumn;
  }

}
