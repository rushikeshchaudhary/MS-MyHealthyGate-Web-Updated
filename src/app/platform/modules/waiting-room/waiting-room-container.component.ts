import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from "@angular/router";
import { NotifierService } from "angular-notifier";
import { NavItem } from "src/app/shared/models";
import { LoginUser } from "../core/modals/loginUser.modal";
import { CommonService } from "../core/services";
import { WaitingRoomService } from "./waiting-room.service";
import { NumberInput } from "@angular/cdk/coercion";

@Component({
  templateUrl: "./waiting-room-container.component.html",
})
export class WaitingRoomContainerComponent implements OnInit {
  moduleTabs: NavItem[] = [];
  selectedTabIndex!: number;
  appointmentId!: number;
  isPatient = false;
  isProvider = false;
  encrytPatientId: any;
 
  constructor(
    private router: Router,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private waitingRoomService: WaitingRoomService,
    private commonService: CommonService,
    private dialogBox: MatDialog
  ) { }

  ngOnInit() {
    //const apptIdStrP = this.route.snapshot.paramMap.get("id");
    const apptIdStrP = this.route.snapshot.queryParams['id'];
    
    let apptId: number;
    if (apptIdStrP) {
      apptId = Number(apptIdStrP);
      this.appointmentId = apptId;
      this.getPatientByAppId(apptId);

      //this.inItTabs(apptId);
    } else {
      const urlPartsArry = this.router.url.split("/");
      const apptIdStr = urlPartsArry[urlPartsArry.length - 1];
      apptId = Number(apptIdStr);
      if (Number.isNaN(apptId)) {
        this.notifier.notify("error", "AppointmentId is not passed");
      } else {
        this.getPatientByAppId(apptId);
        // this.inItTabs(apptId);
      }
    }
  }

  getPatientByAppId = (apptId: number) => {
    this.waitingRoomService.getAppointmentDetails(apptId).subscribe((res) => {
      console.log(res);
      debugger
      this.commonService._isAppointmentCompleted.next(res.data.statusName==="Completed"?true:false);
      this.commonService._isHistoryShareable.next(res.data.isHistoryShareable);
      this.encrytPatientId = this.commonService.encryptValue(
        res.data.patientID,
        true
      );
      this.inItTabs(apptId);
    });
  };

  getAppointmentDetails(id: number, route: string) {
    debugger;
    return this.waitingRoomService
      .getAppointmentDetails(id)
      .subscribe((res) => {
        console.log(res);
        if (res.data) {
          debugger
          this.commonService._isHistoryShareable.next(res.data.isHistoryShareable);
          this.commonService._isAppointmentCompleted.next(res.data.statusName==="Completed"?true:false);
          let patientAppointment = res.data;
          if (patientAppointment.mode != "Face to Face") {
            //////debugger;
            //Commenting the below code to check in at any time
            // let eligibleForCall = this.commonService.checkAvailablityofCallTime(String(patientAppointment.startDateTime), String(patientAppointment.endDateTime));
            // if (!eligibleForCall) {
            //   this.notifier.notify('error', "You can not make call before or after scheduled time");
            // }
            // else {
            //   this.router.navigate([route]);
            // }
            //Comment end see
            this.router.navigate([route]);
          } else {
            this.router.navigate([route]);
            // this.notifier.notify(
            //   "error",
            //   "You can not make call with face to face appointment"
            // );
          }
        }
      });
  }
  inItTabs(apptId: number) {
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        const userRoleName =
          user.data.users3 && user.data.users3.userRoles.userType;
        if ((userRoleName || "").toUpperCase() === "CLIENT") {
          this.isPatient = true;
        } else {
          this.isProvider = true;
        }
      }
    });

    this.appointmentId = apptId;
    this.moduleTabs = [
      {
        displayName: "Reschedule Appointment",
        route: "/web/waiting-room/reshedule/" + apptId,
        iconName: "",
      },

      {
        displayName: "Permission",
        route: "/web/waiting-room/permission/" + apptId,
        iconName: "",
      },
      {
        displayName: "Assessment",
        route: "/web/waiting-room/assessment/" + apptId,
        iconName: "",
      },
      {
        displayName: "Check In",
        route: "/web/waiting-room/check-in/" + apptId,
        iconName: "",
      },
      {
        displayName: "Past Appointment",
        route: "/web/waiting-room/past-appointment/" + this.encrytPatientId,
        iconName: "",
      },
      // {
      //   displayName: "Documents",
      //   route: "/web/waiting-room/documents/" + apptId,
      //   iconName: "",
      // },
      // {
      //   displayName: "Vitals",
      //   route: "/web/waiting-room/vitalslist/" + apptId,
      //   iconName: "",
      // },
      // {
      //   displayName: "Doctor Notes",
      //   route: "/web/waiting-room/doctornotes/" + this.encrytPatientId,
      //   iconName: "",
      // },
      // {
      //   displayName: "Pre-Existing Medications",
      //   route: "/web/waiting-room/medication/" + this.encrytPatientId,
      //   iconName: "",
      // },
      // {
      //   displayName: "E-Prescription",
      //   route: "/web/waiting-room/e-prescription/" + this.encrytPatientId,
      //   iconName: "",
      // },
    ];

    if (this.isProvider) {
      this.moduleTabs = this.moduleTabs.filter(
        (x) =>
          x.displayName == "Check In" || x.displayName == "Past Appointment" || x.displayName == "Assessment"
      );
    }

    const url = this.router.url;

    if (
      url.includes("check-in-call") ||
      url.includes("check-in-video-call") ||
      url.includes("check-in-soap")
    ) {
      this.selectedTabIndex = this.moduleTabs.findIndex(
        (x) => x.displayName == "Check In"
      );
    } else {
      const tabRoutes = [...this.moduleTabs];
      const routestabRoutes = tabRoutes.map((x) => x.route);
      const currentIndex = routestabRoutes.findIndex((x) =>
        this.router.url.includes(x!)
      );
      if (currentIndex != -1) {
        this.selectedTabIndex = currentIndex;
      } else {
        this.selectedTabIndex = 0;

        this.onTabChange(this.selectedTabIndex);
      }
    }
    // if(this.isPatient){
    //   this.onTabChange(this.selectedTabIndex=3);
    // }
  }

  @ViewChild("maintabgroup")
  demo3Tab!: MatTabGroup;
  onTabChange(tabIndex: any): void {
    // if (
    //   (tabIndex == 3 || tabIndex == 4 || tabIndex || 5) &&
    //   localStorage.getItem("isCallStart")
    // ) {
    //   console.log("tabIndex", tabIndex);

    //   const modalPopup = this.dialogBox.open(PatientDetailsOnCallComponent, {
    //     hasBackdrop: true,
    //     data: {
    //       tabIndexGo: tabIndex,
    //       appId: this.appointmentId,
    //       encryptpatientId: this.encrytPatientId,
    //     },
    //   });

    //   modalPopup.afterClosed().subscribe((result) => {});

    //   //jtyjtyhjtyhjtyhjthjtyj
    // } else if (
    //   (tabIndex == 0 || tabIndex == 1 || tabIndex == 2) &&
    //   localStorage.getItem("isCallStart")
    // ) {
    //   console.log(tabIndex);
    // } else {
    const tabGroup = this.demo3Tab;
    if (tabGroup instanceof MatTabGroup) {
      tabGroup.selectedIndex = tabIndex;
    }
    const route = this.moduleTabs[tabIndex].route as string;
    const displayName = this.moduleTabs[tabIndex].displayName as string;
    if (displayName == "Check In") {
      this.getAppointmentDetails(this.appointmentId, route);
    }
    /*else if (displayName == "Past Appointment") {
      this.router.navigate(['/web/client/encounter'], { queryParams: { id: this.encrytPatientId } });
    } */
    else {
      this.router.navigate([route]);
    }
    // }
  }

  nextTab() {
    this.onTabChange(this.selectedTabIndex + 1);
  }

  prevTab() {
    this.onTabChange(this.selectedTabIndex - 1);
  }
}
