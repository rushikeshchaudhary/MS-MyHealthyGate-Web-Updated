import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../core/services";
import { WaitingRoomService } from "../../../waiting-room/waiting-room.service";
import { ClientsService } from "../clients.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-client-permission",
  templateUrl: "./client-permission.component.html",
  styleUrls: ["./client-permission.component.css"],
})
export class ClientPermissionComponent implements OnInit {
  isChecked: boolean=false;
  clientId!: number;
  constructor(
    private commonService: CommonService,
    private clientService: ClientsService,
    private waitingRoomService: WaitingRoomService,
    private translate:TranslateService,

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    var client = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.clientId = user.id;
        }
      }
    );

    this.getClientDetails(this.clientId);
  }
  getClientDetails(id:any) {
    return this.clientService.getClientProfileInfo(id).subscribe((responce) => {
      this.isChecked = responce.data.patientInfo[0].isHistoryShareable;
      this.commonService.loadingStateSubject.next(false);
    });
  }

  checkedHandle = (e:any) => {
    this.commonService.loadingStateSubject.next(true);
    console.log(e.checked);
    const data = {
      patientId: this.clientId,
      isShareable: e.checked,
    };
    this.waitingRoomService.updatePatientPermission(data).subscribe((res) => {
      if (res) {
        this.clientService
          .getClientProfileInfo(this.clientId)
          .subscribe((res) => {
            if (res.data) {
              this.isChecked = res.data.patientInfo[0].isHistoryShareable;
              this.commonService.loadingStateSubject.next(false);
            }
          });
      }
    });
  };
}
