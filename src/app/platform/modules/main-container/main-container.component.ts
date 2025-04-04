import { ProfileSetupModel } from "./../core/modals/loginUser.modal";
import { debug } from "util";
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";
import { LoginUser } from "../core/modals/loginUser.modal";
import { MediaMatcher } from "@angular/cdk/layout";
import { HeaderInfo, NavItem, SidebarInfo } from "../../../shared/models";
import { MatDialog } from "@angular/material/dialog";
import { MatSidenav } from '@angular/material/sidenav';
import { CommonService, LayoutService } from "../core/services";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RouterEvent,
} from "@angular/router";
import { ChangePasswordComponent } from "../agency-portal/change-password/change-password.component";
import { userInfo } from "os";
import { HubConnection } from "../../../hubconnection.service";
import { SubDomainService } from "../../../subDomain.service";
import { HubService } from "./hub.service";
import { AppService } from "src/app/app-service.service";
import { filter, map } from "rxjs/operators";
import { NotifierService } from "angular-notifier";


@Component({
  selector: "app-main-container",
  templateUrl: "./main-container.component.html",
  styleUrls: ["./main-container.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MainContainerComponent implements OnInit, OnDestroy {
  @ViewChild("sidenav") public sidenav!: MatSidenav;
  @ViewChild("clientDrawer") public clientDrawer!: MatSidenav;

  private subscription: Subscription;
  private subscriptionClientNavs: Subscription = new Subscription;
  private subscriptionLoading: Subscription = new Subscription;
  logoUrl!: string;
  headerInfo!: HeaderInfo;
  sidebarInfo!: SidebarInfo;
  sidebarInfoALl!: SidebarInfo;
  allNavigations: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpenClientDrawer: boolean = false;
  loading: boolean = false;
  isPatient: boolean = false;
  loaderImage = "/assets/loader.gif";
  private hubConnection: HubConnection = new HubConnection;
  staffId: number = 0;
  fullName: string = "";
  moduleTabs: any;
  selectedTabIndex: any;
  profileSetup: ProfileSetupModel;
  firstTimeLogin: boolean = false;
  isCallStarted: boolean = false;
  audio: HTMLAudioElement;

  constructor(
    public dialogModal: MatDialog,
    private commonService: CommonService,
    private subDomainService: SubDomainService,
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private hubService: HubService,
    private appService: AppService,
    private notifier: NotifierService
  ) {
    this.profileSetup = new ProfileSetupModel();
    this.mobileQuery = media.matchMedia("(min-width: 992px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.subscription = this.commonService.loginUser.subscribe(
      (user: LoginUser) => {
        this.firstTimeLogin = user.firstTimeLogin
          ? !this.firstTimeLogin
          : this.firstTimeLogin;
        if (user.data) {
          this.fullName = user.data.firstName + " " + user.data.lastName;
          const userRoleName =
            user.data.users3 && user.data.users3.userRoles.userType;
          const roles = ["CLIENT"];
          if (roles.includes((userRoleName || "").toUpperCase())) {
            this.fullName =
              user.patientData.firstName + " " + user.patientData.lastName;
            this.isPatient = true;
          } else {
            this.isPatient = false;
            this.fullName = user.data.firstName + " " + user.data.lastName;
          }
          this.staffId = user.data.id;
          if (!this.isPatient)
            this.commonService.isProfileUpdated(Number(this.staffId));
          this.headerInfo = {
            user: user.data,
            userLocations: user.userLocations || [],
            userNavigations: this.getUserNaviagations(user),
          };
          this.sidebarInfo = {
            navigations: this.getSideNavigations(user),
          };
          this.sidebarInfoALl = this.sidebarInfo;
          if (!this.isPatient) {
            this.allNavigations = this.sidebarInfo;
            debugger
            this.updateClientRoutes(0, 0);
          }
          this.commonService.setIsPatient(this.isPatient);
          this.hubService.createHubConnection(user.data.userID);
          const initialModule = this.extractModuleName(this.router.url);
          if (initialModule) {
            this.filterTabs(initialModule);
          }
        }
      }
    );

    this.audio = new Audio("/assets/incomming_call.mp3");
    // this.audio.src = "../../../../assets/incomming_call"; // Path to your audio file
    this.audio.loop = true;
    this.audio.muted = true;
  }

  ngOnInit() {
    this.layoutService.setSidenav(this.sidenav);
    this.layoutService.setClientDrawer(this.clientDrawer);

    this.subscriptionLoading = this.commonService.loadingState.subscribe(
      (isloading: boolean) => {
        this.loading = isloading;
      }
    );

    this.subscription = this.subDomainService
      .getSubDomainInfo()
      .subscribe((domainInfo) => {
        if (domainInfo)
          this.logoUrl =
            "data:image/png;base64," + domainInfo.organization.logoBase64;
      });

    this.subscriptionClientNavs =
      this.commonService.updateClientNavigation.subscribe((clientInfo) => {
        const { clientId, userId } = clientInfo;
        debugger
        this.updateClientRoutes(clientId, userId);
      });
    var asyncLoadCount = 0;
    this.redirectToDashboard(this.router.url);
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.redirectToDashboard(event.url);

        // on route change toggle sidebar...
        if (window.innerWidth < 991) this.layoutService.toggleSideNav(false);
      }
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.loading = !!asyncLoadCount;
    });

    this.router.events
    //.pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((res: RouterEvent) => {
        const module = this.extractModuleName(res.url);
        this.filterTabs(module);
      });

    //debugger;
    this.appService.call.subscribe((res: any) => {
      if (res.CallStatus && res.CallStatus == 1) {
        this.play()
      } else {
        this.stop();
      }
      console.log("MainContainerrerwfvewr", res);
    });
  }

  play() {
    this.audio = new Audio("/assets/incomming_call.mp3");
    this.audio.muted = false;
    this.audio.loop = true;
    this.audio.play();
  }

  stop() {
    this.audio.muted = true;
    this.audio.loop = false;
    this.audio.pause();
  }

  extractModuleName(url: any): string {
    debugger
    url = url.replace("/web/", "");
    const index = url.indexOf("/");
    if (index != -1) {
      url = url.slice(0, index);
      return url;
    } else {
      return url;
    }
  }
  filterTabs(module: string) {
    debugger
    if (module && module != "waiting-room") {
      const moduleWithNoChildren = this.sidebarInfo.navigations.find((x) => {
        if (x.route) {
          const r = this.extractModuleName(x.route);
          return r == module ? true : false;
        } else {
          return false;
        }
      });
      if (moduleWithNoChildren) {
        this.moduleTabs = [];
      } else {
        const modulesWithChildren = this.sidebarInfo.navigations.filter(
          (x) => x.children && x.children.length > 0
        );
        if (modulesWithChildren && modulesWithChildren.length > 0) {
          const selectedModules = modulesWithChildren.filter((x:any) => {
            debugger
            if (x.children[1].displayName == "Profile Summary") {
              let enId = x.children[1].params["id"];
              console.log(enId, "x.children45454");
              const healthcoverage = {
                displayName: "Health Coverage Plan",
                iconName: "",
                params: {
                  id: enId,
                },
                route: "/web/client/healthplancoverage",
              };
              x.children.splice(7, 0, healthcoverage);
              let arr = x.children;
              console.log(arr, "x.children45454   Profile Summary");
              arr.shift();
              return arr;
            } else if (module == "clientlist") {
              // let r = this.extractModuleName(x.children[0].route);
              // return r == module ? true : false;
              if (x.children && x.children.length > 0) {
                let r = this.extractModuleName(x.children[0].route);
                return r === module;
              }
              return false;
            } else {
              //   let r = this.extractModuleName(x.children[0].route);
              //   return r == module ? true : false;
              // }
              if (x.children && x.children.length > 0) {
                let r = this.extractModuleName(x.children[0].route);
                return r === module;
              }
              return false;
            }
          });
          if (selectedModules && selectedModules.length > 0) {
            const selectedModule = selectedModules[0];
            if (selectedModule.children) {
              const newtabList = selectedModule.children.filter(
                (obj) => obj.displayName !== "Speciality"
              );
              this.moduleTabs = newtabList;
              let currentUrl = this.router.url;
              const indexPrm = currentUrl.indexOf("?");
              if (indexPrm != -1) {
                currentUrl = currentUrl.slice(0, indexPrm);
              }
              if (this.moduleTabs && this.moduleTabs.length) {
                const currentTabIndex = this.moduleTabs.findIndex(
                  //(x: any) => x.route && x.route == currentUrl
                  (x: any) => x.route && x.route.includes(currentUrl)
                );
                if (currentTabIndex != -1) {
                //  console.log("currentTabIndex",currentTabIndex);
                  
                  this.selectedTabIndex = currentTabIndex;
                }
              }
            } else this.moduleTabs = [];
          } else this.moduleTabs = [];
        } else this.moduleTabs = [];
      }
    } else this.moduleTabs = [];
  }

  isActiveTab(tab: any): boolean {
    let currentlUrl = this.router.url;
    return tab.route && tab.route == currentlUrl ? true : false;
  }

  onItemSelected(item: NavItem) {
    let staffId: number = 0;
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user) {
        staffId = user.data.id;
      }
    });
    let isPatient: boolean = true;
    this.commonService.isPatient.subscribe((res) => {
      isPatient = res;
    });
    let userRole: string = "";
    this.commonService.userRole.subscribe((res) => {
      userRole = res;
    });
    this.commonService.isProfileComplete.subscribe((res) => {
      if (!isPatient && (userRole || "").toUpperCase() == "PROVIDER")
        this.profileSetup = res;
      else this.profileSetup.isProfileSetup = 1;
    });

    if (this.profileSetup.isProfileSetup) {
      if (!item.children || !item.children.length) {
        console.log([item.route], { queryParams: item.params || {} }, "route");
        this.router.navigate([item.route], { queryParams: item.params || {} });
        this.changeDetectorRef.detectChanges();
        // this.navService.closeNav();
      }
      if (item.children && item.children.length) {
        // this.expanded = !this.expanded;
      }
    } else {
      this.notifier.hideAll();
      if (this.profileSetup == undefined || this.profileSetup == null)
        this.profileSetup = new ProfileSetupModel();
      if (this.profileSetup.basicProfile == 0)
        this.notifier.notify(
          "error",
          "Your Basic Profile Not Completed, Please Complete Your Profile First..!!"
        );
      else if (this.profileSetup.staffServices == 0)
        this.notifier.notify(
          "error",
          "Services Not Added, Please Add Services First..!!"
        );
      else if (this.profileSetup.staffTaxonomies == 0)
        this.notifier.notify(
          "error",
          "Taxonmoies Not Added, Please Add Taxonmoies First..!!"
        );
      else if (this.profileSetup.staffSpecialities == 0)
        this.notifier.notify(
          "error",
          "Specialities Not Added, Please Add Specialities First..!!"
        );
      // else if (this.profileSetup.staffAvailability == 0)
      //   this.notifier.notify(
      //     "error",
      //     "Availability Not Found, Please Add Availability First..!!"
      //   );
      // else if (this.profileSetup.staffExperiences == 0)
      //   this.notifier.notify(
      //     "error",
      //     "Experience Not Added, Please Add Experience First..!!"
      //   );
      // else if (this.profileSetup.staffQualifications == 0)
      //   this.notifier.notify(
      //     "error",
      //     "Qualification Not Added, Please Add Qualification First..!!"
      //   );
      // else if (this.profileSetup.staffAwards == 0)
      //   this.notifier.notify(
      //     "error",
      //     "Awards Not Added, Please Add Awards First..!!"
      //   );

      this.router.navigate(["/web/manage-users/user"], {
        queryParams: {
          id: this.commonService.encryptValue(staffId),
        },
      });
    }
  }

  redirectToDashboard(url: string) {
    let ProfileSetup: ProfileSetupModel = new ProfileSetupModel();
    let userRole: string = "";
    this.commonService.userRole.subscribe((res) => {
      userRole = res;
    });
    if (!this.isPatient) {
      //
      if ((userRole || "").toUpperCase() == "PROVIDER") {
        this.commonService.getProfileUpdated(this.staffId).subscribe((res) => {
          //this.commonService.isProfileComplete.subscribe(res => {
          if (res.statusCode == 200) {
            ProfileSetup = res.data;
          }
          //ProfileSetup = res;
          this.commonService.setIsProfileComplete(ProfileSetup);
          if (!ProfileSetup.isProfileSetup)
            this.router.navigate(["/web/manage-users/user"], {
              queryParams: {
                id: this.commonService.encryptValue(this.staffId),
              },
            });
          else {
            if (url == "/web/dashboard" || url == "/web") {
              this.router.navigate(["/web/dashboard"]);
            }
          }
        });
      } else {
        if (url == "/web/dashboard" || url == "/web") {
          this.router.navigate(["/web/dashboard"]);
        }
      }
      //}
    } else {
      if (url == "/web/client/dashboard" || url == "/web") {
        this.router.navigate(["/web/client/dashboard"]);
      }
    }

    // this.commonService.isProfileComplete.subscribe(
    //   (isProfileComplete: boolean) => {
    //     if (!this.isPatient && !isProfileComplete)
    //       this.router.navigate(["/web/manage-users/user"], {
    //         queryParams: {
    //           id: this.commonService.encryptValue(this.staffId)
    //         }
    //       });
    //     else {
    //       if (url == "/web") {
    //         const redirectUrl = this.isPatient
    //           ? "/web/client/dashboard"
    //           : "/web/dashboard";
    //         this.router.navigate([redirectUrl]);
    //       }
    //     }
    //   }
    // );
  }

  createConnection(user: LoginUser) {
    this.hubConnection = new HubConnection();
    this.hubConnection.createHubConnection(user.access_token);
    //Hub Connection setting ......
    let userId = user.data && user.data.userID;
    let self = this;
    if (this.hubConnection.isConnected()) {
      this.hubConnection.getHubConnection().onclose(() => {
        this.ReconnectOnClose(userId);
      });
      this.hubConnection.ConnectToServerWithUserId(userId, 1).then((res: any) => {
        // console.log('Connection: user id sent to server : ' + userId);
        self.getMessageNotifications();
      });
    } else {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.getHubConnection().onclose(() => {
          this.ReconnectOnClose(userId);
        });
        this.hubConnection.ConnectToServerWithUserId(userId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + userId);
          self.getMessageNotifications();
        });
      });
    }
  }
  ReconnectOnClose(userId: any) {
    setTimeout(() => {
      this.hubConnection.restartHubConnection().then(() => {
        this.hubConnection.ConnectToServerWithUserId(userId, 1).then(() => {
          // console.log('Restart Connection: user id sent to server : ' + userId);
        });
      });
    }, 5000);
  }

  getMessageNotifications() {
    this.hubConnection
      .getHubConnection()
      .on("NotificationResponse", (response: any) => {
        console.log("message from server", response);
      });
  }
  updateClientRoutes(clientId: number, userId: number) {
    const navs: SidebarInfo = this.allNavigations;
    const clientIndex =
      navs &&
      navs.navigations.findIndex((obj) => obj.displayName === "My Client");
    if (clientIndex > -1) {
      const clientChildrens = navs.navigations[clientIndex].children;
      let updateClientChildrens: any[] = [];
      clientChildrens!.forEach((item) => {
        if (item.route?.includes("/web/client") && clientId) {
          if (item.route != "/web/client")
            item.params = {
              id: this.commonService.encryptValue(clientId, true),
            };

          // for client documents changes
          if (item.route == "/web/client/documents" && userId) {
            item.params = {
              ...item.params,
              uid: this.commonService.encryptValue(userId, true),
            };
          }
          if (item.route != "/web/client") {
            updateClientChildrens.push(item);
          }
        } else if (item.route == "/web/client" && !clientId) {
          updateClientChildrens.push(item);
        } else if (item.route == "/web/clientlist") {
          updateClientChildrens.push(item);
        }
      });

      let updatedNavs: SidebarInfo = { navigations: [] };

      navs.navigations.forEach((navObj) => {
        if (navObj.displayName === "My Client") {
          updatedNavs.navigations.push({
            ...navObj,
            children: updateClientChildrens,
          });
        } else {
          updatedNavs.navigations.push(navObj);
        }
      });
      this.sidebarInfo = Object.assign({}, updatedNavs);
      this.sidebarInfoALl = this.sidebarInfo;
      const initialModule = this.extractModuleName(this.router.url);
      if (initialModule) {
        this.filterTabs(initialModule);
      }
    }
  }

  onClientToggle(sidenav: MatSidenav) {
    this.isOpenClientDrawer = !sidenav.opened;
    sidenav.toggle();
  }
  createModal() {
    let chnagePasswordModal;
    chnagePasswordModal = this.dialogModal.open(ChangePasswordComponent, {
      hasBackdrop: true,
      data: {},
    });
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
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
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
    } else if (
      (userRoleName || "").toUpperCase() === "STAFF" ||
      (userRoleName || "").toUpperCase() === "PROVIDER"
    ) {
      navigations = [
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/manage-users/user-profile",
        },
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if (
      (userRoleName || "").toUpperCase() === "CLIENT" ||
      (userRoleName || "").toUpperCase() === "LAB" ||
      (userRoleName || "").toUpperCase() === "PHARMACY" ||
      (userRoleName || "").toUpperCase() === "RADIOLOGY"
    ) {
      navigations = [
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/client/my-profile",
        },
        {
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    } else if (
      (userRoleName || "").toUpperCase() === "CLIENT" ||
      (userRoleName || "").toUpperCase() === "LAB"
    ) {
      navigations = [
        /*{
          displayName: "Change Password",
          iconName: '<i class="la la-key"></i>',
          route: "",
        },*/
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/web/sign-out",
        },
      ];
    }

    return navigations;
  }

  getSideNavigations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName =
      user.data.users3 && user.data.users3.userRoles.userType;

    console.log(`User Info: ${user}`, user);
    const roles = ["CLIENT", "LAB", "PHARMACY", "RADIOLOGY"];
    console.log(`UserRoleName:${userRoleName}`);
    if ((userRoleName || "").toUpperCase() == "CLIENT") {
      // if (roles.includes((userRoleName || "").toUpperCase()))
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/client/dashboard",
        },
        {
          displayName: "My Calendar",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/client/my-scheduling",
        },

        {
          // displayName: "Lab Appointment",
          displayName: "My Appointment",
          iconName: '<i class="la la-database"></i>',
          route: "/web/client/managelab",
        },
        {
          displayName: "My Care Library",
          iconName: '<i class="la la-user"></i>',
          route: "/web/client/my-care-library",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/client/my-profile",
        },
        // {
        //   displayName: "Documents",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/my-documents",
        // },

        {
          displayName: "Payment",
          iconName: '<i class="la la-dollar"></i>',
          route: "/web/client/payment/payment-history",
          // children:[
          //   {
          //     displayName: "Payments",
          //     iconName: '<i class="la la-dollar"></i>',
          //     route: "/web/client/payment/payment-history",
          //   },
          //   {
          //     displayName: "Refunds",
          //     iconName: '<i class="la la-dollar"></i>',
          //     route: "/web/client/payment/refund-history",
          //   }
          // ]
        },
        // {
        //   // displayName: "Lab Appointment",
        //   displayName: "My Appointment",
        //   iconName: '<i class="la la-database"></i>',
        //   route: "/web/client/managelab",
        // },
        {
          displayName: "Mailbox",
          iconName: '<i class="la la-envelope-o"></i>',
          route: "/web/client/mailbox",
        },
        // {
        //   displayName: "History",
        //   iconName: '<i class="la la-history"></i>',
        //   route: "/web/client/history/my-family-history",
        //   // children:[
        //   //   {
        //   //     displayName: "Family history",
        //   //     iconName: '<i class="la la-users"></i>',
        //   //     route: "/web/client/history/my-family-history",
        //   //   },
        //   //   {
        //   //     displayName: "Social history",
        //   //     iconName: '<i class="la la-share-alt"></i>',
        //   //     route: "/web/client/history/my-social-history",
        //   //   },
        //   // ],
        // },
        {
          displayName: "Vitals",
          iconName: '<i class="la la-heartbeat"></i>',
          route: "/web/client/my-vitals",
        },
        // {
        //   displayName: "Favourite Pharmacy",
        //   iconName: '<i class="la la-star"></i>',
        //   route: "/web/client/favourite-pharmacy"
        // },
        {
          displayName: "My Favourite",
          iconName: '<i class="la la-star"></i>',
          route: "/web/client/favourite",
        },
        // {
        //   displayName: "Subscription Plan",
        //   iconName: '<i class="la la-calendar"></i>',
        //   route: "/web/client/subscriptionplan",
        // },
        {
          displayName: "Lab Referral",
          iconName: '<i class="la la-file-text-o"></i>',
          route: "/web/client/labreferral-patients",
        },
        {
          displayName: "Radiology Referral",
          iconName: '<i class="la la-file-text-o"></i>',
          route: "/web/client/radiologyreferral-patients",
        },
        {
          displayName: "Help Desk",
          iconName: '<i class="la la-file-text-o"></i>',
          route: "/web/client/raiseticket",
        },

        // {
        //   displayName: "Assign Questionnaire",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/assigned-documents",
        // },
        /*{
          displayName: "Lab Referral",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/client/labreferral"
        }*/
      ];
    } else if ((userRoleName || "").toUpperCase() == "LAB") {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/lab/dashboard",
        },
        {
          displayName: "My Appointments",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/lab/appointment",
        },
        {
          displayName: "My Calender",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/lab/scheduling",
        },
        {
          displayName: "My Clients",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/lab/client",
        },
        // {
        //   displayName: "Payment",
        //   iconName: '<i class="la la-dollar"></i>',
        //   route: "/web/lab/payment",

        // },
        // {
        //   displayName: "Set Availability",
        //   iconName: '<i class="la la-dollar"></i>',
        //   route: "/web/lab/availability",

        // },
        // {
        //   displayName: "Document",
        //   iconName: '<i class="la la-user"></i>',
        //   route: "/web/lab/lab-document",
        // },
        {
          displayName: "Mailbox",
          iconName: '<i class="la la-envelope-o"></i>',
          route: "/web/lab/mailbox",
        },
        {
          displayName: "My profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/lab/profile",
        },
        {
          displayName: "Lab Referral",
          iconName: '<i class="la la-user"></i>',
          route: "/web/lab/labreferral",
        },
        // {
        //   displayName: "Assign Questionnaire",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/assigned-documents",
        // },
      ];
    } else if ((userRoleName || "").toUpperCase() == "RADIOLOGY") {
      console.log("Radiology");

      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/radiology/dashboard",
        },
        {
          displayName: "My Appointments",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/radiology/appointment",
        },
        {
          displayName: "My Calender",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/radiology/scheduling",
        },
        {
          displayName: "My Clients",
          iconName: '<i class="la la-calendar"></i>',
          route: "/web/radiology/client",
        },
        // {
        //   displayName: "Payment",
        //   iconName: '<i class="la la-dollar"></i>',
        //   route: "/web/lab/payment",

        // },
        // {
        //   displayName: "Set Availability",
        //   iconName: '<i class="la la-dollar"></i>',
        //   route: "/web/lab/availability",

        // },
        // {
        //   displayName: "Document",
        //   iconName: '<i class="la la-user"></i>',
        //   route: "/web/radiology/lab-document",
        // },
        {
          displayName: "Mailbox",
          iconName: '<i class="la la-envelope-o"></i>',
          route: "/web/radiology/mailbox",
        },
        {
          displayName: "My profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/radiology/profile",
        },
        {
          displayName: "Radiology Referral",
          iconName: '<i class="la la-user"></i>',
          route: "/web/radiology/radiologyreferral",
        },
        // {
        //   displayName: "Assign Questionnaire",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/assigned-documents",
        // },
      ];
    } else if ((userRoleName || "").toUpperCase() == "PHARMACY") {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/pharmacy/dashboard",
        },
        // {
        //   displayName: "Scheduling",
        //   iconName: '<i class="la la-calendar"></i>',
        //   route: "/web/pharmacy/scheduling",
        // },
        {
          displayName: "Shared Prescription",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/pharmacy/shared-prescription",
        },
        {
          displayName: "My Clients",
          iconName: '<i class="la la-cog"></i>',
          route: "/web/pharmacy/my-client",
        },
        {
          displayName: "Mailbox",
          iconName: '<i class="la la-envelope-o"></i>',
          route: "/web/pharmacy/mailbox",
        },
        {
          displayName: "My Profile",
          iconName: '<i class="la la-user"></i>',
          route: "/web/pharmacy/my-profile",
        },
        // {
        //   displayName: "Assign Questionnaire",
        //   iconName: '<i class="la la-file-text-o"></i>',
        //   route: "/web/client/assigned-documents",
        // },
      ];
    } else if (user.userPermission) {
      let modules = user.userPermission.modulePermissions || [];
      const screens = user.userPermission.screenPermissions || [],
        // modules which has the permission true
        //   isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN" || (userRoleName || "").toUpperCase() === "PROVIDER";
        isAdminLogin = (userRoleName || "").toUpperCase() === "ADMIN";
      //isAdminLogin = (userRoleName || "").toUpperCase() === "PROVIDER";
      modules = modules.filter((obj: any) => obj.permission || isAdminLogin);
      //modules = modules.filter((obj) => obj.moduleName!="Manage Users");
      modules = modules.filter((obj: any) => obj.moduleName != "Reports"); //agencyremove
      modules = modules.filter((obj: any) => obj.moduleName != "Questionnaire");

      navigations = modules.map((moduleObj: any) => {
        // screens which has the permission true
        const moduleScreens = screens.filter(
          (obj: any) =>
            obj.moduleId === moduleObj.moduleId &&
            (obj.permission || isAdminLogin)
        );
        // moduleScreens== screens.filter(
        //   (obj) =>obj.screenKey!="MASTERS_APPOINTMENTTYPES_LIST"
        // );

        let nestedScreens: { route?: string; children?: any } = {
          route: `/web${moduleObj.navigationLink}`,
        };
        if (!moduleObj.navigationLink) {
          nestedScreens = {
            children: moduleScreens.map((screenObj: any) => {
              // routing changes due to some conditions ....

              let appendRoute = "";
              if (
                moduleObj.moduleName == "Masters" ||
                // moduleObj.moduleName == "Clinic Management" ||
                moduleObj.moduleName == "Billing" ||
                moduleObj.moduleName == "Logs"
              )
                appendRoute = `/${moduleObj.moduleName}`;

              if (moduleObj.moduleName == "Manage Users")
                appendRoute = "/manage-users";
              if (moduleObj.moduleName == "Payments") appendRoute = "/payment";
              if (moduleObj.moduleName == "Help Desk") appendRoute = moduleObj.navigationLink;
              const screenNavigation = `/web${appendRoute}${screenObj.navigationLink}`;
              return {
                displayName: screenObj.screenName,
                iconName: "",
                route: screenNavigation,
              };
            }),
          };
        }
        return {
          displayName: moduleObj.moduleName,
          iconName: moduleObj.moduleIcon,
          ...nestedScreens,
        };
      });
    }

    console.log("navigations", navigations);

    return navigations;
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  //   this.subscriptionLoading.unsubscribe();
  //   this.subscriptionClientNavs.unsubscribe();
  //   this.mobileQuery.removeListener(this._mobileQueryListener);
  // }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionLoading) {
      this.subscriptionLoading.unsubscribe();
    }
    if (this.subscriptionClientNavs) {
      this.subscriptionClientNavs.unsubscribe();
    }
    if (this.mobileQuery && this._mobileQueryListener) {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
  }
  
  get isDashboardScreen(): boolean {
    return this.router.url.includes("dashboard") ? true : false;
  }

  onTabChange(selectedTabIndex: any) {
    console.log("moduleTabs", this.moduleTabs);
    const tab = this.moduleTabs[selectedTabIndex];
    console.log(tab);
    this.onItemSelected(tab);
  }
}
