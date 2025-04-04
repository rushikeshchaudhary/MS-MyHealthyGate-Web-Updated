import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { BookAppointmentComponent } from "src/app/front/book-appointment/book-appointment.component";
import { StaffProfileModel } from "src/app/platform/modules/agency-portal/users/users.model";
import { UsersService } from "src/app/platform/modules/agency-portal/users/users.service";
import { CommonService } from "src/app/platform/modules/core/services";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";

@Component({
  selector: "app-profile-doctor",
  templateUrl: "./profile-doctor.component.html",
  styleUrls: ["./profile-doctor.component.css"],
})
export class ProfileDoctorComponent implements OnInit {
  staffId!: number;
  userId!: number;
  selectedIndex: number = 0;
  staffProfile: StaffProfileModel;
  subscription!: Subscription;
  profileTabs: any = ["Documents", "Leaves", "Timesheet"];
  selectedLocation:any;

  constructor(
    private userService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private activateRoute:ActivatedRoute,
    private dialogModal: MatDialog,
  ) {
    this.staffProfile = new StaffProfileModel();
  }

  ngOnInit() {
    this.staffId = parseInt(this.activateRoute.snapshot.paramMap.get('id')!);
    this.getStaffProfileData();
    
  }
  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.staffId)
      .subscribe((response: ResponseModel) => {
        console.log(response)
        if (response != null && response.data != null) {
          this.staffProfile = response.data;
        }
      });
  }

  bookAppointment=()=>{
    this.openDialogBookAppointment(this.staffProfile.staffId,this.staffProfile.providerId)

  }

  openDialogBookAppointment(staffId: number, providerId: string) {
    let dbModal;
    dbModal = this.dialogModal.open(BookAppointmentComponent, {
      hasBackdrop: true,
      data: {
        staffId: staffId,
        userInfo: null,
        providerId: providerId,
        locationId: this.selectedLocation || 0,
      },
      width: "80%",
      height: "70%",
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        // if (result == "booked") {
        // }
        //location.reload();
      }
    });
  }
}
