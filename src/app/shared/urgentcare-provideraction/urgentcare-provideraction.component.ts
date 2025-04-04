import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { AppService } from "src/app/app-service.service";
import { CallInitModel, CallStatus, UrgentCareProviderActionInitModel } from "../models/callModel";
import { CommonService } from "src/app/platform/modules/core/services";
import { Router } from "@angular/router";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotifierService } from "angular-notifier";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-urgentcare-provideraction",
  templateUrl: "./urgentcare-provideraction.component.html",
  styleUrls: ["./urgentcare-provideraction.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class UrgentCareProviderActionComponent implements OnInit {
  userId: number = 0;
  appointmentId: number;
  masterDocumentTypes: any = []
  //addDocumentForm: FormGroup;
  fileList: any = [];
  dataURL: any;
  submitted: boolean = false;
  todayDate = new Date();
  constructor(private dialogModalRef: MatDialogRef<UrgentCareProviderActionComponent>,
    private router: Router, private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier: NotifierService, private schedulerService: SchedulerService, private commonService: CommonService, private appService: AppService) {
    translate.setDefaultLang(localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.appointmentId = this.data;
  }

  ngOnInit() {

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.userId = user.data.userID;

      }
    });
  }


  closeDialog(action: string): void {
    this.dialogModalRef.close(action);
  }

  onAccept() {
    //this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
    this.router.navigate(["/web/encounter/soap"], {
      queryParams: {
        apptId: this.appointmentId,
        encId: 0
      },
    });
    //this.router.navigate(["/web/waiting-room/"+this.appointmentId]);
    this.dialogModalRef.close();
  }

  onReject() {

    this.schedulerService
      .urgentCareRefundAppointmentFee(this.appointmentId)
      .subscribe((response: any) => {
        if (response.statusCode === 200) {
          //////debugger;
          //this.callPatientInformProviderAvailability(this.appointmentId);
        } else {

        }
      });
    this.dialogModalRef.close();
  }


  callPatientInformProviderAvailability(pateintapptid: number) {
    //////debugger;
    if (pateintapptid > 0 && this.userId > 0) {
      this.appService
        .getcallPatientInformProviderAvailability(pateintapptid, this.userId)
        .subscribe((res) => {
          console.log(res);
        });
    }
    //   let callInitModel: UrgentCareProviderActionInitModel = new UrgentCareProviderActionInitModel();
    //   callInitModel.AppointmentId = pateintapptid;
    //   //callInitModel.CallStatus = CallStatus.Picked;
    //   this.appService.ProviderActioncallStarted(callInitModel);
  }

}
