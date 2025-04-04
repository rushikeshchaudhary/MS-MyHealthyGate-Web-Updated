import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StaffProfileModel } from 'src/app/platform/modules/agency-portal/users/users.model';
import { UsersService } from 'src/app/platform/modules/agency-portal/users/users.service';
import { ResponseModel } from '../core/modals/common-model';
import { CommonService } from '../core/services';

@Component({
  selector: 'app-sup-doctor-profile',
  templateUrl: './sup-doctor-profile.component.html',
  styleUrls: ['./sup-doctor-profile.component.css']
})
export class SupDoctorProfileComponent implements OnInit {
  staffId: number=0;
  userId: number=0;
  selectedIndex: number = 0;
  staffProfile: StaffProfileModel;
  subscription!: Subscription;
  profileTabs: any = ["Documents", "Leaves", "Timesheet"];

  constructor(
    private userService: UsersService,
    private commonService: CommonService,
    private router: Router,
    private activateRoute:ActivatedRoute
  ) {
    this.staffProfile = new StaffProfileModel();
   }

  ngOnInit() {


    const idParam = this.activateRoute.snapshot.paramMap.get('id');
    if (idParam) {
      
      this.staffId = Number(idParam);
    }
    //this.staffId = parseInt(this.activateRoute.snapshot.paramMap.get('id'));
    this.getStaffProfileData();
  }

  getStaffProfileData() {
    this.userService
      .getStaffProfileData(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.data != null) {
          this.staffProfile = response.data;
        }
      });
  }

}
