import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { addDays, format } from 'date-fns';
import { Subscription } from 'rxjs';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { Metadata } from '../../core/modals/common-model';
import { CommonService } from '../../core/services';
import { ClientDashboardService } from '../dashboard/dashboard.service';
import { UpcomingappointmentdialogComponent } from '../upcomingappointmentdialog/upcomingappointmentdialog.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {
  allAppointmentsList: Array<any> = [];
  allAppointmentsMeta: Metadata = new Metadata;
  subscription!: Subscription; 
  currentLoginUserId!: number;
  currentLocationId!: number;
  userRoleName!: string;
  condition = 0;
  constructor(private translate:TranslateService,private dashoboardService: ClientDashboardService, private route: Router, private commonService: CommonService, public dialogModal: MatDialog,) { 
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");

  }
  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          this.currentLoginUserId = user.id;
          this.currentLocationId = user.currentLocationId;
          this.userRoleName =
            user && user.users3 && user.users3.userRoles.userType;
        }
      }
    );
    this.Getlist();
  }
  Getlist() {
    let pageNumber = 1;
    let pageSize = 1000;
    var today = new Date();
    var todayDate = new Date(today.setDate(today.getDate()));
    const filters = {
      locationIds: this.currentLocationId,
      staffIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "STAFF"
          ? this.currentLoginUserId
          : "",
      patientIds:
        !((this.userRoleName || "").toUpperCase() == "ADMIN") &&
          (this.userRoleName || "").toUpperCase() == "CLIENT"
          ? this.currentLoginUserId
          : "",
      fromDate: format(new Date(todayDate), "yyyy-MM-dd"),
      toDate: format(addDays(new Date(), 720), "yyyy-MM-dd"),
      status: "Approved",
      pageNumber,
      pageSize,
    };
    this.dashoboardService
      .GetOrganizationAppointments(filters,true)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.allAppointmentsList = response.data != null && response.data.length > 0 ? response.data : [];
          this.allAppointmentsList =
            response.data != null && response.data.length > 0
              ? response.data
              : [];
          this.allAppointmentsList = (this.allAppointmentsList || []).map(x => {
            const staffsArray = (x.appointmentStaffs || []).map(
              (              y: { staffName: any; }) => y.staffName
            );
            const staffIds = (x.appointmentStaffs || []).map((y: { staffId: any; }) => y.staffId);
            x.staffName = staffsArray.join(", ");
            x.dateTimeOfService =
              format(x.startDateTime, 'MM/dd/yyyy') +
              " (" +
              format(x.startDateTime, 'h:mm a') +
              " - " +
              format(x.endDateTime, 'h:mm a') +
              ")";
            return x;
          });
          this.allAppointmentsMeta = response.meta;
          if (this.allAppointmentsList.length > 1) {
            this.condition=0;
            this.ChooseAppointmentPopUp();

            //if 2 or more appointment exist
          } else if (this.allAppointmentsList.length > 0){
            this.condition=0;
            //if only 1 appointment exist
            //console.log("check",this.allAppointmentsList);
            this.route.navigate([`/web/waiting-room/reshedule/${this.allAppointmentsList[0].patientAppointmentId}/`]);
          }
          else{
            this.condition=1
          }
          //this.allAppointmentsList = (this.allAppointmentsList || []);
        }
      });
  }

  ChooseAppointmentPopUp() {
    let dbModal;
    let popmodel = this.allAppointmentsList;
    let popmeta = this.allAppointmentsMeta;
    dbModal = this.dialogModal.open(UpcomingappointmentdialogComponent, {
      data: { popmodel, popmeta }
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result == "close") {
        // meessage here no record selected..
      } else {
        const appid = result;
      }
    });
  }
}



