import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ClientsService } from "../../client-portal/clients.service";
import { CommonService } from "../../core/services";
import { WaitingRoomService } from "../waiting-room.service";

@Component({
  selector: "app-permission",
  templateUrl: "./permission.component.html",
  styleUrls: ["./permission.component.css"],
})
export class PermissionComponent implements OnInit {
  isChecked: boolean = false;
  appointmentId!: number;
  userId!: number;
  patientId!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private waitingRoomService: WaitingRoomService,
    private clientService: ClientsService
  ) {}

  ngOnInit() {
    const apptId = this.activatedRoute.snapshot.paramMap.get("id");
    this.appointmentId = Number(apptId);
    this.commonService.loadingStateSubject.next(true);

    this.getAppointmentDetails(apptId);
  }

  getAppointmentDetails(id: any) {
    //////debugger;
    return this.waitingRoomService
      .getAppointmentDetails(id)
      .subscribe((res) => {
        if (res.data) {
          this.isChecked = res.data.isHistoryShareable;
          this.commonService.loadingStateSubject.next(false);
          // this.clientService.getClientProfileInfo(res.data.patientID).subscribe(responce => {
          //   this.isChecked = responce.data.patientInfo[0].isHistoryShareable
          //   this.commonService.loadingStateSubject.next(false);
          // })
        }
      });
  }

  checkedHandle = (e:any) => {
    this.commonService.loadingStateSubject.next(true);
   
      this.isChecked = e.checked;
      const data = {
        patientAppointmentId: this.appointmentId,
        isShareable: e.checked,
      };
      this.waitingRoomService.updatePatientAppointmentPermission(data).subscribe((res) => {
        if (res) {
          this.waitingRoomService
            .getAppointmentDetails(this.appointmentId)
            .subscribe((res) => {
              if (res.data) {
                this.isChecked = res.data.isHistoryShareable;
                this.commonService.loadingStateSubject.next(false);
              }
            });
        }
      });
  
  };
}
