import { Component, Input, OnInit } from "@angular/core";
import { format } from "date-fns";
import { AddNewCallerService } from "src/app/shared/add-new-caller/add-new-caller.service";
import { FilterModel } from "../../../core/modals/common-model";
import { CommonService } from "../../../core/services";

@Component({
  selector: "app-video-call-invitation",
  templateUrl: "./video-call-invitation.component.html",
  styleUrls: ["./video-call-invitation.component.css"],
})
export class VideoCallInvitationComponent implements OnInit {
  @Input() appointmentId: number = 0;
  @Input() encryptedPatientId:any;
  metaData: any;
  invitedAptfilterModel: FilterModel;

  invitedDisplayedColumns = [
    {
      displayName: "Provider",
      key: "staffName",
      sticky: true,
    },
    {
      displayName: "Patient",
      key: "fullName",
      type: "link",
      // url: "/web/member/profile",
      queryParamsColumn: "queryParamsPatientObj",
      sticky: true,
    },
    {
      displayName: "Invitation Receiver",
      key: "inviteReceiverName",
      sticky: true,
    },
    {
      displayName: "Invitation Email",
      key: "inviteReceiverEmail",
      sticky: true,
    },
    {
      displayName: "Appt. Type",
      key: "appointmentType",
    },
    {
      displayName: "Appt. Mode",
      key: "appointmentMode",
    },
    {
      displayName: "Date Time",
      key: "dateTimeOfService",
      type: "link",
      // url: "/web/member/scheduling",
      queryParamsColumn: "queryParamsObj",
    },
    // {
    //   displayName: "Symptom/Ailment",
    //   key: "notes",
    //   type: "50",
    //   isInfo: true,
    // },
    // {
    //   displayName: "Actions",
    //   key: "Actions",
    //   sticky: true,
    // },
  ];
  invitedPatientAppointment: any;
  invitedAppointmentMeta: any;
  patientId: any;

  constructor(
    private addNewCallerService: AddNewCallerService,
    private commonService: CommonService
  ) {
    this.invitedAppointmentMeta = null;
    this.invitedAptfilterModel = new FilterModel();
  }


  ngOnInit() {
    if (this.encryptedPatientId != undefined) {
      this.patientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
    } else {
      this.patientId = 0;
      this.appointmentId = 0;
    }

    this.getInvitedPatientAppointmentList();
  }

  getInvitedPatientAppointmentList() {

    let sendData = {
      pageNumber: this.invitedAptfilterModel.pageNumber,
      pageSize: this.invitedAptfilterModel.pageSize,
      sortColumn: this.invitedAptfilterModel.sortColumn,
      sortOrder: this.invitedAptfilterModel.sortOrder,
      searchText: this.invitedAptfilterModel.searchText,
      patientId:parseInt(this.patientId) ,
    };

    this.addNewCallerService
      .getInvitedMemberList(sendData)
      .subscribe((response: any) => {
        if (response != null && response.statusCode == 200) {
          this.invitedPatientAppointment =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.invitedPatientAppointment = (
            this.invitedPatientAppointment || []
          ).map((x: { dateTimeOfService: string; startDateTime: number | Date; endDateTime: number | Date; }) => {
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.invitedAppointmentMeta = response.meta;
        } else {
          this.invitedPatientAppointment = [];
          this.invitedAppointmentMeta = null;
        }
        this.invitedAppointmentMeta.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }

  onPendingInvitationPageOrSortChange(changeState?: any) {
    this.setInvitePendingPaginatorModel(
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order
    );
    this.getInvitedPatientAppointmentList();
  }
  setInvitePendingPaginatorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string
  ) {
    this.invitedAptfilterModel.pageNumber = pageNumber;
    this.invitedAptfilterModel.pageSize = pageSize;
    this.invitedAptfilterModel.sortOrder = sortOrder;
    this.invitedAptfilterModel.sortColumn = sortColumn;
  }

  onPendingInvitationTableActionClick=(actObj:any)=>{
    console.log(actObj);
    
  }
}
