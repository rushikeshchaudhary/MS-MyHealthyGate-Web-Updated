import { HomeService } from "./../home/home.service";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { Subscription } from "rxjs";
import {
  HeaderInfo,
  NavItem,
  UserDocumentNotificationModel,
} from "src/app/shared/models";
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { CommonService } from "src/app/platform/modules/core/services";
import {
  Router,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  NavigationEnd,
} from "@angular/router";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { LoginModelComponent } from "src/app/shared/login-model/login-model.component";
import { RegisterModelComponent } from "src/app/shared/register-model/register.component";
import { ChangePasswordComponent } from "src/app/platform/modules/agency-portal/change-password/change-password.component";
import { SecurityQuestionModelComponent } from "src/app/shared/security-question-model/security-question-model.component";
import { AuthenticationService } from "src/app/platform/modules/auth/auth.service";
import { OrganizationModel } from "src/app/platform/modules/agency-portal/masters/agency-detail/agency-detail.Model";
import { SubDomainService } from "src/app/subDomain.service";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { ResponseModel } from "src/app/super-admin-portal/core/modals/common-model";
import * as moment from "moment";

@Component({
  selector: "app-home-header",
  templateUrl: "./home-header.component.html",
  styleUrls: ["./home-header.component.css"],
  providers: [SubDomainService],
  encapsulation: ViewEncapsulation.None,
})
export class HomeHeaderComponent implements OnInit, OnDestroy {
  documentNotifications: Array<UserDocumentNotificationModel> = [];
  notificationsURL = "api/Notification/GetHeaderNotification";
  changeMessageStatusURL = "api/Message/ChangeMessageStatus";
  totalUnreadNotificationCount!: number;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  private subscription!: Subscription;
  private subscriptionLoading!: Subscription;
  headerInfo!: HeaderInfo;
  IsLogin: boolean = false;
  IsSignUp: boolean = false;
  userInfo: any;
  loading: boolean = false;
  loaderImage = "../..//assets/loader.gif";
  loginResponse: any = null;
  isPatient: boolean = false;
  //loginState: boolean = false;
  organizationModel!: string;
  issession: boolean = false;
  constructor(
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef,
    private dialogModal: MatDialog,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private titleService: Title,
    private translate: TranslateService,
    private router: Router //private homeService: HomeService
  ) {
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.mobileQuery = media.matchMedia("(min-width: 992px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subDomainService.subjectlogo.subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.organizationModel = sessionStorage.getItem("logo")!;
        }, 500);
      }
    });
  }
  checkUserLogin() {
    this.subscription = this.commonService.loginUser.subscribe(
      (user: LoginUser) => {
        if (user && user.data) {
          console.log("User log", user);
          this.IsLogin = true;
          this.loading = false;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          if ((userRoleName || "").toUpperCase() === "CLIENT") {
            console.log("UserName", userRoleName);
            this.isPatient = true;
            this.userInfo = user.patientData;
            this.headerInfo = {
              user: user.data,
              userLocations: user.userLocations || [],
              userNavigations: this.getUserNaviagations(user),
            };
          } else {
            this.isPatient = false;
            this.userInfo = user.data;
            this.headerInfo = {
              user: user.data,
              userLocations: user.userLocations || [],
              userNavigations: this.getUserNaviagations(user),
            };
            if((userRoleName || "").toUpperCase() === "LAB"){
              this.router.navigateByUrl("/web/lab/dashboard");
            }else if((userRoleName || "").toUpperCase() === "RADIOLOGY"){
              this.router.navigateByUrl("/web/radiology/dashboard");
            }else{
              this.router.navigateByUrl("/web/dashboard");
            }
            
            //this.isPatient = false;
            //this.redirectToDashboard("/web");
          }

          // this.sidebarInfo = {
          //   navigations: this.getSideNavigations(user),
          // };

          // if (!this.isPatient) {
          //   this.allNavigations = this.sidebarInfo;
          //   this.updateClientRoutes(null, null);
          // }
        } else {
        }
      }
    );
  }

  ngAfterViewChecked() {
    if (sessionStorage.getItem("logo")) {
      this.organizationModel = sessionStorage.getItem("logo")!;
    }
  }
  ngOnInit() {
    if (sessionStorage.getItem("logo")) {
      this.issession = true;
      this.organizationModel = sessionStorage.getItem("logo")!;
    }
    // this.homeService.loginState.subscribe(isLogin => {
    //   this.loginState = isLogin;
    // });
    this.subscriptionLoading = this.commonService.loadingState.subscribe(
      (isloading: boolean) => {
        this.loading = isloading;
      }
    );
    if (localStorage.getItem("access_token")) {
      this.loading = true;
      this.IsLogin = true;
    } else {
      this.IsLogin = false;
    }
    this.checkUserLogin();
    var asyncLoadCount = 0;
    this.redirectToDashboard(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.redirectToDashboard(event.url);

        // on route change toggle sidebar...
        //if (window.innerWidth < 991) this.layoutService.toggleSideNav(false);
      }
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.loading = !!asyncLoadCount;
    });
  }

  registerClick() {
    let url = "/web/sign-up";
    this.redirect(url);
    // this.IsSignUp = true;
  }

  loginClick() {
    this.redirect("/web/login");
  }
  reDirectTo(type: string) {
    let url = "";
    if (this.IsSignUp) {
      url = type === "patient" ? "/web/client-signup" : "/web/provider-signup";
    }
    this.redirect(url);
  }
  redirect(path: string) {
    this.router.navigate([path]);
  }
  // setispateintlogin(){
  //   this.IsLogin=true;
  // }

  onSelectUserMenu(item: NavItem) {
    switch (item.route) {
      case "/web/sign-out":
        this.commonService.logout();
        sessionStorage.setItem("redirectTo", "");
        this.IsLogin = false;
        this.router.navigateByUrl("");
        // location.reload();
        break;
      case "":
        this.createChangePasswordModal();
        break;
      default:
        if (item.route) this.router.navigateByUrl(item.route); //this.router.navigate([item.route]);
        break;
    }
  }
  getUserNaviagations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;
    if ((userRoleName || "").toUpperCase() === "ADMIN") {
      navigations = [
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/manage-users/user-profile",
        },
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Settings",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/app-config",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if ((userRoleName || "").toUpperCase() === "STAFF") {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/dashboard",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/manage-users/user-profile",
        },
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if ((userRoleName || "").toUpperCase() === "CLIENT") {
      navigations = [
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/client/dashboard",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/client/my-profile",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } 
    else if (
      (userRoleName || "").toUpperCase() === "RADIOLOGY"
   
    ) {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/radiology/dashboard",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "web/manage-users/user-profile",
        },
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    }else if (
      (userRoleName || "").toUpperCase() === "LAB" 
    ) {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/lab/dashboard",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "web/manage-users/user-profile",
        },
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    }
    
    

    else if (
      (userRoleName || "").toUpperCase() === "PROVIDER" ||
      (userRoleName || "").toUpperCase() === "PHARMACY"
    ) {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/dashboard",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "web/manage-users/user-profile",
        },
        // {
        //   displayName: "Change Password",
        //   iconName: '<i class="la la-key"></i>',
        //   route: ""
        // },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    }
    return navigations;
  }
  ourCareClick() {
    this.router.navigate(["/"], { fragment: "specialities" });
  }
  createChangePasswordModal() {
    let chnagePasswordModal;
    chnagePasswordModal = this.dialogModal.open(ChangePasswordComponent, {
      hasBackdrop: true,
      data: {},
    });
  }

  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }

  // openDialogLogin() {

  //     this.router.navigate(["/web/login-selection"]);

  //   // let dbModal;
  //   // dbModal = this.dialogModal.open(LoginModelComponent, {
  //   //   hasBackdrop: true,
  //   //   data: {}
  //   // });
  //   // dbModal.afterClosed().subscribe((result: any) => {
  //   //   if (result != null && result != "close") {
  //   //     let response = result.response;
  //   //     if (
  //   //       response.statusCode >= 400 &&
  //   //       response.statusCode < 500 &&
  //   //       response.message
  //   //     ) {
  //   //       //this.errorMessage = response.message;
  //   //       this.loading = false;
  //   //     } else if (response.statusCode === 205) {
  //   //       //this.errorMessage = response.message;
  //   //       this.loading = false;
  //   //     } else if (response.access_token) {
  //   //       this.isPatient = result.isPatient;
  //   //       if (result.isPatient == false) {
  //   //         location.href = "/web/dashboard";
  //   //         //this.router.navigate(["/web/dashboard"]); //this.redirectToDashboard("/web");
  //   //         // this.router.navigateByUrl("/web/dashboard"); //this.redirectToDashboard("/web");
  //   //       } else {
  //   //         this.checkUserLogin();
  //   //         this.IsLogin = true;
  //   //       }
  //   //     } else {
  //   //       this.openDialogSecurityQuestion();
  //   //     }
  //   //     // if (result == "login") {
  //   //     //   this.checkUserLogin();
  //   //     //   this.IsLogin = true;
  //   //     // }
  //   //   }
  //   // });
  // }
  redirectToDashboard(url: string) {
    if (url == "/web") {
      const redirectUrl = this.isPatient
        ? "/web/client/dashboard"
        : "/web/dashboard";
      this.router.navigate([redirectUrl]);
    }
  }
  openDialogSecurityQuestion() {
    let dbModal;
    dbModal = this.dialogModal.open(SecurityQuestionModelComponent, {
      hasBackdrop: true,
      data: {},
    });
    dbModal.afterClosed().subscribe((result: string) => {
      if (result != null && result != "close") {
        if (result == "save") {
          location.reload();
          // this.checkUserLogin();
          // this.IsLogin = true;
        }
      }
    });
  }
  // openDialogRegister() {
  //   this.router.navigate(["/web/signup-selection"]);
  // //  let dbModal;
  // //   dbModal = this.dialogModal.open(RegisterModelComponent, {
  // //     hasBackdrop: true,
  // //     data: {}
  // //   });
  // //   dbModal.afterClosed().subscribe((result: string) => {
  // //     if (result != null && result != "close") {
  // //       if (result == "save") {
  // //         this.checkUserLogin();
  // //       }
  // //     }
  // //   });
  // }
  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
  }
  btnClick =  () => {
    this.router.navigateByUrl("/web/client/favourite");
  };
  getHeaderNotifications() {
    // //////debugger
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
    this.totalUnreadNotificationCount =
      notificationResponse.unReadNotificationCount != undefined
        ? notificationResponse.unReadNotificationCount.totalUnReadNotification
        : 0;

    this.documentNotifications =
      notificationResponse.userDocumentNotification != undefined
        ? notificationResponse.userDocumentNotification
        : [];
    this.documentNotifications.forEach((v) => {
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
}
