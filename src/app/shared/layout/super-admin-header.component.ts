import { Component, OnInit, Input, OnChanges, ViewEncapsulation } from '@angular/core';

import { SharedService } from '../shared.service';
import { HeaderInfo, MessageNotificationModel, NavItem, UserDocumentNotificationModel } from '../models';
import { Router } from '@angular/router';
import { CommonService } from '../../super-admin-portal/core/services';
import * as moment from 'moment';
import { ResponseModel } from 'src/app/super-admin-portal/core/modals/common-model';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-layout-super-admin-header',
  templateUrl: 'super-admin-header.component.html',
  styleUrls: ['./super-admin-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SuperAdminHeaderComponent implements OnInit, OnChanges {
  @Input() headerInfo!: HeaderInfo;
  userInfo: any = {};
  userNavigations: NavItem[] = [];
  totalUnreadNotificationCount: number=0;
  messageNotifications: Array<MessageNotificationModel> = [];
  //documentNotifications: Array<UserDocumentNotificationModel> = [];
  documentNotifications: any[]=[];
  notificationRead:number[]=[];
  notificationsURL = "api/Notification/GetHeaderNotification";
  MarkNotificationById = "api/Notification/MarkNotificationById";

  constructor(private sharedService: SharedService, private commonService: CommonService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnChanges(changes:any) {
    const headerInfo = changes.headerInfo || null;
    if (headerInfo && headerInfo.currentValue) {
      this.userInfo = headerInfo.currentValue.user;
      this.userNavigations = headerInfo.currentValue.userNavigations;
    }
  }

  onSelectUserMenu(item: NavItem) {
    switch (item.route) {
      case '/webadmin/sign-out':
        this.commonService.logout();
        sessionStorage.setItem('redirectTo','/webadmin');
        this.router.navigate(['/webadmin']);
        location.reload();
        break;
      default:
        break;
    }
  }

  ngOnInit() {
    this.getHeaderNotifications();
  }

  getHeaderNotifications() {
    this.commonService
      .getAllNotification(this.notificationsURL, {}, false)
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
    this.totalUnreadNotificationCount = notificationResponse.unReadNotificationCount != undefined ?
      notificationResponse.unReadNotificationCount.totalUnReadNotification : 0;

    this.messageNotifications =
      notificationResponse.messageNotification != undefined
        ? notificationResponse.messageNotification
        : [];

    this.documentNotifications =
      notificationResponse.userDocumentNotification != undefined
        ? notificationResponse.userDocumentNotification
        : [];
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
  }

  markRead(notificationId:any) {
    let filter=this.notificationRead.filter(d => d == notificationId);
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

  toggleSidenav() {
    this.sharedService.toggle();
  }
}
