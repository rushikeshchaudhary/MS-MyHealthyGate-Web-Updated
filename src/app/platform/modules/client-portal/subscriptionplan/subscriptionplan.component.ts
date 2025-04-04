import { Component, OnInit } from '@angular/core';
import { ResponseModel } from "src/app/platform/modules/core/modals/common-model";
import { Subscriptionplan } from "src/app/platform/modules/client-portal/client-profile.model";
import { ClientsService } from "src/app/platform/modules/agency-portal/clients/clients.service";
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'src/app/shared/layout/dialog/dialog.service';
import { NotifierService } from 'angular-notifier';
import { CommonService } from '../../core/services';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-subscriptionplan',
  templateUrl: './subscriptionplan.component.html',
  styleUrls: ['./subscriptionplan.component.css']
})
export class SubscriptionplanComponent implements OnInit {
  clientId!: number;
  header: string = "Subscription Plan Upload";
  userId: number = 714;
  metaData: any;
  locationId: number = 101;
  todayDate = new Date();
  fromDate!: string;
  toDate!: string;
  plan:boolean=false;
  subscriptionPlan: any = [];
  premiumPlan: any = [];
  locationUsers: any = [];
  uploadPermission: boolean = true;
  downloadPermission: boolean = true;
  deletePermission: boolean = true;
  subscription!: Subscription;
  maxDate: any;
  value!: Subscriptionplan;
  fromUserId!: number;
  fromDateSort: any;
  toDateSort: any;
  searchBox: boolean = true;
  filtermasterDocumentTypes: any = [];
  filterString: any;

  constructor(private dialogModal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private clientService: ClientsService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private translate:TranslateService) {
      translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    
     }

  ngOnInit() {
    this.subscription = this.commonService.currentLoginUserInfo.subscribe(
      (user: any) => {
        if (user) {
          // this.userId = this.clientId = user.id;
          console.log(user);
          this.clientId = user.id;
          this.fromUserId = user.userID;
          this.locationId = user.locationID;
          //this.userId = this.clientId = user.userID;
          this.getPatientSubscriptionPlan();
          //this.getUserPermissions();
        }
      }
    );
  }
  getPatientSubscriptionPlan() {
   // ////debugger;
    this.clientService.getPatientSubscriptionPlan(this.clientId).subscribe((response: any) => {
      console.log(response);   
      if(response !=null){      
      this.subscriptionPlan = response.data != null && response.data.length > 0
      ? response.data
      : []; 
      this.plan = true;
    } 
              
    });
  }
}
