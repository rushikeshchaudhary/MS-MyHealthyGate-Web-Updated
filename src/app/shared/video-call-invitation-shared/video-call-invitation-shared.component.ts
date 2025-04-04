import { Component, Input, OnInit } from '@angular/core';
import { AddNewCallerService } from '../add-new-caller/add-new-caller.service';

import { FilterModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { format } from 'date-fns';
import { CommonService } from 'src/app/platform/modules/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-call-invitation-shared',
  templateUrl: './video-call-invitation-shared.component.html',
  styleUrls: ['./video-call-invitation-shared.component.css']
})
export class VideoCallInvitationSharedComponent implements OnInit {


  @Input() appointmentId: number = 0;
  @Input() encryptedPatientId:any;
  metaData: any;
  invitedAptfilterModel: FilterModel;

  invitedDisplayedColumns = [
    {
      displayName: "provider",
      key: "staffName",
      sticky: true,
    },
    {
      displayName: "patient",
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
      displayName: "appointment_type",
      key: "appointmentType",
    },
    {
      displayName: "appointment_mode",
      key: "appointmentMode",
    },
    {
      displayName: "date_time",
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
    private activatedRoute: ActivatedRoute,
    private addNewCallerService: AddNewCallerService,
    private commonService: CommonService
  ) {
    this.invitedAppointmentMeta = null;
    this.invitedAptfilterModel = new FilterModel();
  }


  ngOnInit() {
   debugger
    if (this.encryptedPatientId == undefined) {
      const apptId = this.activatedRoute.snapshot.paramMap.get("id");
      this.activatedRoute.queryParams.subscribe((params) => {
        this.patientId =
          params['id'] == undefined
            ? this.commonService.encryptValue(apptId, false)
            : this.commonService.encryptValue(params['id'], false);
      });
    } else {
      this.patientId = this.commonService.encryptValue(
        this.encryptedPatientId,
        false
      );
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
    console.log("hello")
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

  onPendingInvitationTableActionClick=(actObj: any)=>{
    console.log(actObj);
    
  }

}
