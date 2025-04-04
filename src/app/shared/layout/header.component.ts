import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
  EventEmitter,
  Output
} from "@angular/core";

import { SharedService } from "../shared.service";
import {
  HeaderInfo,
  NavItem,
  MessageNotificationModel,
  UserDocumentNotificationModel,
  NotificationsModel
} from "../models";
import { Router } from "@angular/router";
import { CommonService } from "../../platform/modules/core/services";
import { Subscription } from "rxjs";
import { LoginUser } from "../../platform/modules/core/modals/loginUser.modal";
import { ChangePasswordComponent } from "../../platform/modules/agency-portal/change-password/change-password.component";
import { ResponseModel } from "../../super-admin-portal/core/modals/common-model";
import * as moment from "moment";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { HubConnection } from "src/app/hubconnection.service";
@Component({
  selector: "app-layout-header",
  templateUrl: "header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() headerInfo!: HeaderInfo;
  @Output() eventChangePassword: EventEmitter<any> = new EventEmitter<any>();
  userInfo: any;
  userNavigations: NavItem[];
  userLocations: Array<any>;
  currentLocationId: number|null=null;
  subscription!: Subscription;
  messageNotifications: Array<MessageNotificationModel> = [];
  //documentNotifications: Array<UserDocumentNotificationModel> = [];
  documentNotifications: any[] = [];
  notificationsURL = "api/Notification/GetHeaderNotification";
  changeMessageStatusURL = "api/Message/  ";
  MarkNotificationById = "api/Notification/MarkNotificationById";
  passwordExpiryColorCode = "Red";
  notificationRead: number[] = [];
  totalUnreadNotificationCount: number=0;
  notification: any;
  userId: any;
  constructor(
    private sharedService: SharedService,
    private commonService: CommonService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService,
    private hubconnectionservice: HubConnection
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.userLocations = [];
    this.userInfo = {};
    this.userNavigations = [];
    this.currentLocationId = null;
  }

  ngOnChanges(changes:any) {
    const headerInfo = changes.headerInfo || null;
    if (headerInfo && headerInfo.currentValue) {
      this.userInfo = headerInfo.currentValue.user;
      this.userLocations = headerInfo.currentValue.userLocations;
      //////debugger;
      this.userNavigations = headerInfo.currentValue.userNavigations;

    }
  }

  markRead(notificationId: any) {
    let filter = this.notificationRead.filter(d => d == notificationId);
    if (filter && filter.length <= 0) {
      this.commonService.postWithNoLoader(this.MarkNotificationById + '?id=' + notificationId, {}, false).subscribe((response: ResponseModel) => {
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

  onSelectUserMenu(item: NavItem) {

    switch (item.route) {
      case "/web/sign-out":
        this.authenticationService.SetUserOffline();
        this.commonService.logout();
        // sessionStorage.setItem('redirectTo','/web/login');//added code to redirect on we login

        // sessionStorage.setItem("redirectTo", "");
        this.router.navigateByUrl('');//commented code to double load
        location.reload();//added code to reload
        break;
      case "":
        this.eventChangePassword.emit();
        break;
      default:
        item.route && this.router.navigate([item.route]);
        break;
    }
  }

  onDropdownSelectionChange(value: number) {
    this.commonService.updateCurrentLoginUserInfo(value);
    this.router.navigate(["/web"]);
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        //debugger
        console.log(user);
        this.userId = user.userID
        this.currentLocationId = user.currentLocationId;
      }
    });


    this.hubconnectionservice.startHubConnectionForNotification();
    this.hubconnectionservice.getNotificationListener().subscribe(message => {
      console.log('Received Notification:', message);
      this.onReceiveNotification(message);

    });

    this.getHeaderNotifications();

  }

  toggleSidenav() {
    this.sharedService.toggle();
  }
  // getHeaderNotifications() {
  //   this.commonService
  //     .getAll(this.notificationsURL, {})
  //     .subscribe((response: ResponseModel) => {
  //       if (
  //         response &&
  //         response.data != undefined &&
  //         response.statusCode == 200
  //       ) {
  //         this.messageNotifications =
  //           response.data.messageNotification != undefined
  //             ? response.data.messageNotification
  //             : [];
  //         this.documentNotifications =
  //           response.data.userDocumentNotification != undefined
  //             ? response.data.userDocumentNotification
  //             : [];
  //       }
  //     });
  // }
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

      this.messageNotifications =
        notificationResponse.messageNotification != undefined
          ? notificationResponse.messageNotification
          : [];

      // this.documentNotifications = notificationResponse.userDocumentNotification != undefined 
      // ? notificationResponse.userDocumentNotification
      // : (notificationResponse.message != undefined ? [notificationResponse] : []);
   //   debugger
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

    } else {
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
        if (response != null && response.statusCode == 200) {
          this.getHeaderNotifications();
        }
      });
  }
  openMailbox(messageId: number , parentMessageId:any = null) {
    if (messageId != null) {
      this.router.navigate(["/web/mailbox"], {
        queryParams: {
          mId: this.commonService.encryptValue(messageId, true),
          pId:
            parentMessageId != null
              ? this.commonService.encryptValue(parentMessageId, true)
              : null
        }
      });
    } else this.router.navigate(["/web/mailbox"]);
  }
  openUser(userInfo: any) {
    this.router.navigate(["/web/manage-users/user-profile"]);
  }
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }
}
