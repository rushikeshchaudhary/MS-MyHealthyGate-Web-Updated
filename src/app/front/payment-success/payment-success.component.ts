import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { UpdatePatAppointmentIdUserDocumentModel } from "src/app/platform/modules/agency-portal/users/users.model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { SchedulerService } from "src/app/platform/modules/scheduling/scheduler/scheduler.service";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import { HomeService } from "../home/home.service";

@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.css"],
})
export class PaymentSuccessComponent implements OnInit {
  Message!: { title: string; message: string; imgSrc: string; };
  PaymentToken: any;
  isBooked!: boolean;
  appId: any;
  userInfo: any;
  staffSpecialities: any[] = [];
  providerId!: string;
  confirmation: any;
  urgentcare: any;

  constructor(
    private schedulerService: SchedulerService,
    private notifierService: NotifierService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.PaymentToken = params["id"];
      this.urgentcare = params["urgentcare"];
    });
    this.getStaffDetail();
  }
  createAppointmentFromPatientPortal() {
    var appointmentData = this.confirmation;
    appointmentData["PaymentToken"] = this.PaymentToken;
    appointmentData["PatientAppointmentId"] = 0;
    this.schedulerService
    // .bookNewAppointmentFromPatientPortal(appointmentData)
    // .subscribe((response) => {});
    this.schedulerService
      .bookNewAppointmentFromPatientPortal(appointmentData)
      .subscribe((response) => {
        if (response.statusCode === 200) {
          if (
            localStorage.getItem("reportObject") != null &&
            localStorage.getItem("reportObject") != undefined
          ) {
            var object = JSON.parse(localStorage.getItem("reportObject")!);
            localStorage.removeItem("reportObject");

            if (object != null && object != undefined) {
              object.patientId = response.data;
              this.schedulerService
                .SaveSymptomatePatientReport(JSON.stringify(object))
                .subscribe((result: any) => { });
            }
          }
          //this.notifierService.notify("success", response.message);
          
          this.isBooked = true;
          this.Message = {
            title: "Success!",
            message:
              "Thank you, Your appointment has been successfully booked with us, please contact administation for further assistance.",
            imgSrc: "../assets/img/user-success-icon.png",
          };
          localStorage.setItem("preAppointmentData", "");
          //this.dialogModalRef.close("SAVE");
          this.appId = response.data;
          this.saveDocuments(response.data);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
  saveDocuments(appId:any) {
    var docsData = JSON.parse(localStorage.getItem("preAppointmentDataDocs")!);
    if (docsData) {
      var postData: UpdatePatAppointmentIdUserDocumentModel[] = [];
      docsData.forEach((res: any) => {
        var objData: UpdatePatAppointmentIdUserDocumentModel = {
          documentName: res.documentName,
          patientAppointmentId: appId,
        };

        postData.push(objData);
      });
      this.userService
        .updatePatientAppointmentDocuments(postData)
        .subscribe((response: ResponseModel) => {
          localStorage.setItem("preAppointmentDataDocs", "");
        });
    }
  }

  closeDialog() {
    // this.router.navigate(["/web/waiting-room/reshedule/" + this.appId]);
    this.router.navigate(["/web/client/managelab"]);
  }
  getStaffDetail() {
    if (this.urgentcare == 0) {
      this.confirmation = JSON.parse(
        localStorage.getItem("preAppointmentData")!
      );
    } else {
      this.confirmation = JSON.parse(
        localStorage.getItem("urgentAppointmentbookedData")!
      );
    }
    if (this.confirmation.AppointmentBookingFor == "LAB") {
      if (this.urgentcare == "0") {
        this.createAppointmentFromPatientPortal();
      } else {
        this.createUrgentAppointmentFromPatientPortal();
      }
    } else {
      this.providerId = this.confirmation.providerId;
      this.homeService.getProviderDetail(this.providerId).subscribe((res) => {
        if (res.statusCode == 200) {
          this.userInfo = res.data;
          //providerCancellationRules
          this.bindStaffProfile();
          //////debugger;
          if (this.urgentcare == "0") {
            this.createAppointmentFromPatientPortal();
          } else {
            this.createUrgentAppointmentFromPatientPortal();
          }
        }
      });

    }

    console.log(this.confirmation);


  }
  bindStaffProfile() {
    this.staffSpecialities = this.userInfo.staffSpecialityModel;
  }

  createUrgentAppointmentFromPatientPortal() {
    var appointmentData = this.confirmation;
    appointmentData["PaymentToken"] = this.PaymentToken;
    appointmentData["PatientAppointmentId"] = 0;
    this.schedulerService
      .bookUrgentCareAppointmentFromPatientPortal(appointmentData)
      .subscribe((response) => {
        //this.submitted = false;
        if (response.statusCode === 200) {
          if (
            localStorage.getItem("reportObject") != null &&
            localStorage.getItem("reportObject") != undefined
          ) {
            var object = JSON.parse(localStorage.getItem("reportObject")!);
            localStorage.removeItem("reportObject");

            if (object != null && object != undefined) {
              object.patientId = response.data;
              this.schedulerService
                .SaveSymptomatePatientReport(JSON.stringify(object))
                .subscribe((result: any) => { });
            }
          }
          this.isBooked = true;
          localStorage.setItem("urgentAppointmentbookedData", "");

          this.router.navigate(["/web/client/dashboard"]);
          this.appId = response.data;
          this.saveDocuments(response.data);
        } else {
          this.notifierService.notify("error", response.message);
        }
      });
  }
}
