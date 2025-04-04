import {
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { LoginUser } from "../core/modals/loginUser.modal";
import { MediaMatcher } from "@angular/cdk/layout";
import { HeaderInfo, NavItem, SidebarInfo } from "../../shared/models";
import { CommonService } from "../core/services";

@Component({
  selector: "app-main-container",
  templateUrl: "./main-container.component.html",
  styleUrls: ["./main-container.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class MainContainerComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  headerInfo!: HeaderInfo;
  sidebarInfo!: SidebarInfo;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private commonService: CommonService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia("(min-width: 768px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.subscription = this.commonService.loginUser.subscribe(
      (user: LoginUser) => {
        if (user.data) {
          this.headerInfo = {
            user: user.data,
            userNavigations: this.getUserNaviagations(user),
          };
          this.sidebarInfo = {
            navigations: this.getSideNavigations(user),
          };
        } else {
          const tempUser: LoginUser = {
            access_token: "",
            appConfigurations: [],
            data: { roleName: "superadmin" },
            expires_in: null,
            firstTimeLogin: false,
            notifications: {},
            passwordExpiryStatus: {},
            statusCode: null,
            userLocations: [],
            userPermission: {},
          };
          this.headerInfo = {
            user: tempUser,
            userNavigations: this.getUserNaviagations(tempUser),
          };
          this.sidebarInfo = {
            navigations: this.getSideNavigations(tempUser),
          };
        }
      }
    );
  }

  getUserNaviagations(user: LoginUser) {
    let navigations: NavItem[] = [];
    const userRoleName = user.data.roleName;
    if ((userRoleName || "").toUpperCase() === "SUPERADMIN") {
      navigations = [
        {
          displayName: "Sign Out",
          iconName: '<i class="la la-power-off"></i>',
          route: "/webadmin/sign-out",
        },
      ];
    }

    return navigations;
  }

  getSideNavigations(user: LoginUser) {
    let navigations: NavItem[] = [];

    const userRoleName = user.data.roleName;
    if ((userRoleName || "").toUpperCase() === "SUPERADMIN") {
      navigations = [
        {
          displayName: "Dashboard",
          iconName: '<i class="la la-cog"></i>',
          route: "/webadmin/dashboard",
        },
        {
          displayName: "All Appointments",
          iconName: '<i class="la la-database"></i>',
          route: "/webadmin/all-appointments",
        },
        //{ displayName: 'Manage Agency', iconName: '<i class="la la-users"></i>', route: '/webadmin/agency' },
        // { displayName: 'Manage Database', iconName: '<i class="la la-database"></i>', route: '/webadmin/manage-database' },
        /*{
        displayName: 'User Management', iconName: '<i class="fa fa-user"></i>', children: [
          { displayName: 'Manage Home Care', iconName: '<i class ="la la-user"></i>', route: '/webadmin/manage-providers' },
          { displayName: 'Manage Patients', iconName: '<i class="la la-wheelchair">', route: '/webadmin/manage-patients' },
          { displayName: 'Manage Labs', iconName: '<i class="la la-flask"></i>', route: '/webadmin/manage-labs' },
          { displayName: 'Manage Pharmacies', iconName: '<i class="la la-medkit"></i>', route: '/webadmin/manage-pharmacy' },
          { displayName: 'Manage Radiology', iconName: '<i class="la la-ambulance">', route: '/webadmin/manage-radiology' },
          { displayName: 'Top 10 Provider List', iconName: '<i class="la la-user">', route: '/webadmin/manage-top-providers' }
        ]
      }*/
        {
          displayName: "User Management",
          iconName: '<i class="fa fa-user"></i>',
          route: "/webadmin/manage-user",
        },
        {
          displayName: "Logs",
          iconName: '<i class="fa fa-sign-in"></i>',
          children: [
            {
              displayName: "Manage Login Logs",
              iconName: '<i class="la la-briefcase">',
              route: "/webadmin/manage-login-logs",
            },
            {
              displayName: "Manage Audit Logs",
              iconName: '<i class="fa fa-history">',
              route: "/webadmin/manage-audit-logs",
            },
          ],
        },
        {
          displayName: "Manage Testimonial",
          iconName: '<i class="la la-map-marker"></i>',
          route: "/webadmin/manage-testimonial",
        },
        {
          displayName: "Notification",
          iconName: '<i class="la la-database">',
          route: "/webadmin/manage-Notification",
        },
        {
          displayName: "Manage Locations",
          iconName: '<i class="la la-map-marker"></i>',
          route: "/webadmin/manage-locations",
        },
        {
          displayName: "Manage Subscription Plans",
          iconName: '<i class="la la-usd">',
          route: "/webadmin/manage-subscriptionplans",
        },
        {
          displayName: "Manage Ads",
          iconName: '<i class="la la-image">',
          route: "/webadmin/manage-ads",
        },
        {
          displayName: "Manage Static Page",
          iconName: '<i class="la la-file-o">',
          route: "/webadmin/manage-static-page",
        },
        {
          displayName: "Manage Documents",
          iconName: '<i class="la la-file-text-o">',
          route: "/webadmin/manage-documents",
        },
        {
          displayName: "Masters",
          iconName: '<i class="la la-database">',
          route: "/webadmin/Masters",
        },
        {
          displayName: "Payments",
          iconName: '<i class="la la-database">',
          route: "/webadmin/manage-PaymentforadminComponent",
        },
        {
          displayName: "Help Desk",
          iconName: '<i class="la la-file-text-o">',
          route: "/webadmin/raiseticket",
        },
      ];
    }

    return navigations;
  }

 
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.mobileQuery && this._mobileQueryListener) {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }
  }
}
