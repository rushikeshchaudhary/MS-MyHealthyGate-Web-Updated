import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";

import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoginUser } from "../../../platform/modules/core/modals/loginUser.modal";
import { ChangePasswordComponent } from "../../../platform/modules/agency-portal/change-password/change-password.component";
import { ResponseModel } from "../../../super-admin-portal/core/modals/common-model";
import { SharedService } from "../../shared.service";
import { CommonService } from "../../../platform/modules/core/services";
import * as moment from "moment";
import {
  HeaderInfo,
  NavItem,
  MessageNotificationModel,
  UserDocumentNotificationModel
} from "../../models";
import { debug } from "util";
import { TranslateService } from "@ngx-translate/core";
import { HubConnection } from "src/app/hubconnection.service";

@Component({
  selector: "app-client-header-layout",
  templateUrl: "./client-header-layout.component.html",
  styleUrls: ["./client-header-layout.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class ClientHeaderLayoutComponent implements OnInit, OnChanges {
  @Input() headerInfo!: HeaderInfo;
  @Output() eventChangePassword: EventEmitter<any> = new EventEmitter<any>();
  //documentNotifications: Array<UserDocumentNotificationModel> = [];
  documentNotifications: any[]=[];;
  notificationsURL = "api/Notification/GetHeaderNotification";
  MarkNotificationById = "api/Notification/MarkNotificationById";
  changeMessageStatusURL = "api/Message/ChangeMessageStatus";
  totalUnreadNotificationCount: number=0;
  userInfo: any;
  patientData: any;
  userNavigations: NavItem[];
  //userLocations: Array<any>;
  //currentLocationId: number;
  subscription!: Subscription;
  notificationRead:number[]=[];
  userId: any;
  messageNotification: any;

  constructor(
    private sharedService: SharedService,
    private commonService: CommonService,
    private router: Router,
    private translate: TranslateService,
    private hubconnectionservice:HubConnection
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    //this.userLocations = [];
    this.userInfo = {};
    this.userNavigations = [];
    //this.currentLocationId = null;
  }

  ngOnChanges(changes:any) {
    const headerInfo = changes.headerInfo || null;
    if (headerInfo && headerInfo.currentValue) {
      this.userInfo = headerInfo.currentValue.user;
      //this.userLocations = headerInfo.currentValue.userLocations;
      localStorage.setItem('organizationID', this.userInfo.organizationID);
      // //////debugger;
      this.userNavigations = headerInfo.currentValue.userNavigations;


    }
  }
  onSelectBooking=(type:string)=>{
    if(type=="doctor"){
      //this.router.navigateByUrl("/doctor-list")

      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = "/doctor-list";
      link.click();
    }else{
      //this.router.navigateByUrl('/health-services')
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.href = "/health-services";
      link.click();
    }
  }

  onSelectUserMenu(item: NavItem) {
    switch (item.route) {
      case "/web/sign-out":
        this.commonService.logout();
        //sessionStorage.setItem('redirectTo','/web/client-login');
       // sessionStorage.setItem("redirectTo", "/web/client-login");

        this.router.navigateByUrl('');
         location.reload();
        break;
      case "":
        this.eventChangePassword.emit();
        break;
      default:
        item.route && this.router.navigate([item.route]);
        break;
    }
  }

  ngOnInit() {

    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {
        console.log(user);
        this.userId=user.data.userID
        this.patientData = user.patientData;
      }
    });
    this.notificationRead=[];
    this.hubconnectionservice.startHubConnectionForNotification();
    this.hubconnectionservice.getNotificationListener().subscribe(message => {
      console.log('Received Notification:', message);
      this.onReceiveNotification(message); // Handle real-time notification
    });
    this.getHeaderNotifications();
  }

  toggleSidenav() {
    this.sharedService.toggle();
  }

  markRead(notificationId:any){
    let filter=this.notificationRead.filter(d=>d==notificationId);
    if(filter && filter.length <= 0){
      this.commonService.postWithNoLoader(this.MarkNotificationById+'?id='+notificationId,{},false).subscribe((response:ResponseModel)=>{
        if (
          response &&
          response.data != undefined &&
          response.statusCode == 200
        ) {
          this.notificationRead.push(notificationId);
        }
      });
    }
  }

  formatDate(timeStamp: any): string {
    if (!timeStamp) return 'Invalid date';
    const date = new Date(timeStamp);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
  }

  getHeaderNotifications() {
    //debugger
    this.commonService
      .getAll(this.notificationsURL, {}, false)
      .subscribe((response: ResponseModel) => {
        if (
          response &&
          response.data != undefined &&
          response.statusCode == 200
        ) {
          this.onReceiveNotification(response.data);
        }
      });
  }
  onReceiveNotification(notificationResponse: any) {
    //debugger
    console.log('UserId:', this.userId);
    console.log('Notification UserId:', notificationResponse.userId);
  
    if (notificationResponse.userId == this.userId) {
    console.log('User IDs match');
  
    this.totalUnreadNotificationCount = notificationResponse.unReadNotificationCount != undefined ?
      notificationResponse.unReadNotificationCount.totalUnReadNotification : 0;

    this.messageNotification =
      notificationResponse.messageNotification != undefined
        ? notificationResponse.messageNotification
        : [];

       // debugger
    const newDocumentNotifications = notificationResponse.userDocumentNotification != undefined
    ? notificationResponse.userDocumentNotification
    : (notificationResponse.message != undefined ? [notificationResponse] : []);
  
    this.documentNotifications = [
      ...newDocumentNotifications,
      ...this.documentNotifications
    ];

    this.documentNotifications.forEach(v => {
      v.timeStamp = moment
        .utc(v.timeStamp)
        .local()
        .format("yyyy-MM-dd, h:mm a");
      switch (v.type) {
        case "UserInvitation":
          v.notificationAction = v.type;
          v.message = v.message;

          //  v.message = v.patientName + " has requested appointment at ";
          break;

        case "ChatMessage":
          v.message = v.message;
          break;
      }
    }); 
  
  }else{
    console.log('userId does not match')
  }
}
  changeNotificationStatus(messageId: number) {
    this.commonService
      .patch(
        this.changeMessageStatusURL +
          "?MessageId=" +
          messageId +
          "&Unread=" +
          false,
        {}
      )
      .subscribe((response: ResponseModel) => {
        // //////debugger
        if (response != null && response.statusCode == 200) {
          this.getHeaderNotifications();
        }
      });
  }
  btnClick= () => {
    this.router.navigateByUrl('/web/client/favourite');
};
useLanguage(language: string): void {
  localStorage.setItem("language",language);
  this.translate.use(language);
}
}
