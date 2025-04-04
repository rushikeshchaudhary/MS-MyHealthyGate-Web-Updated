import { AppointmentGraphService } from "./../appointment-graph.service";
import {
  FilterModel,
  Metadata
} from "./../../../super-admin-portal/core/modals/common-model";
import { Component, OnInit } from "@angular/core";
import { format } from "date-fns";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
@Component({
  selector: "app-invited-rejected",
  templateUrl: "./invited-rejected.component.html",
  styleUrls: ["./invited-rejected.component.css"]
})
export class InvitedRejectedComponent implements OnInit {
  invitedRejectedDisplayedColumns!: Array<any>;
  invitedRejectedActionButtons!: Array<any>;
  invitedRejectedAptfilterModel: FilterModel;
  invitedRejectedAppointmentMeta: Metadata| null = null;
  invitedRejectedPatientAppointment: Array<any> = [];
  constructor(
    private appointmentGraphService: AppointmentGraphService,
    private commonService: CommonService
  ) {
    this.invitedRejectedAppointmentMeta = null;
    this.invitedRejectedAptfilterModel = new FilterModel();
  }

  ngOnInit() {
    this.invitedRejectedDisplayedColumns = [
      {
        displayName: "Care Manager",
        key: "staffName",
       // width: "110px",
        sticky: true
      },
      {
        displayName: "Member Name",
        key: "fullName",
       // width: "120px",
        type: "link",
        url: "/web/member/profile",
        queryParamsColumn: "queryParamsPatientObj",
        sticky: true
      },
      {
        displayName: "Appt Type",
        key: "appointmentType",
        //width: "130px"
      },
      {
        displayName: "Date Time",
        key: "dateTimeOfService",
        //width: "250px",
        type: "link",
        url: "/web/member/scheduling",
        queryParamsColumn: "queryParamsObj"
      },
      {
        displayName: "Symptom/Ailment",
        key: "notes",
       // width: "250px",
        type: "50",
        isInfo: true
      }
    ];

    this.invitedRejectedActionButtons = [];
    this.getRejectedInvitedPatientAppointmentList();
  }
  getRejectedInvitedPatientAppointmentList() {
    this.appointmentGraphService
      .getRejectedInvitedPatientAppointment(this.invitedRejectedAptfilterModel)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.invitedRejectedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedRejectedPatientAppointment = (this
            .invitedRejectedPatientAppointment || []
          ).map(x => {
            const staffsArray = (x.pendingAppointmentStaffs || []).map(
              (y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.pendingAppointmentStaffs || []).map(
              (y: { staffId: any; }) => y.staffId
            );
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            (x["queryParamsPatientObj"] = {
              id:
                x.patientID > 0
                  ? this.commonService.encryptValue(x.patientID, true)
                  : null
            }),
              (x["queryParamsObj"] = {
                id:
                  x.patientID > 0
                    ? this.commonService.encryptValue(x.patientID, true)
                    : null,
                staffId: staffIds.join(","),
                date: format(x.startDateTime, 'MM/dd/yyyy')
              });
            return x;
          });
          this.invitedRejectedAppointmentMeta = response.meta;
        } else {
          this.invitedRejectedPatientAppointment = [];
          this.invitedRejectedAppointmentMeta = null;
        }
      });
  }
}
