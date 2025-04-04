import { ProfileSetupModel } from "./../../../platform/modules/core/modals/loginUser.modal";
import {
  Component,
  HostBinding,
  Input,
  OnChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { NavItem } from "../../models/navItem";
import { CommonService } from "src/app/platform/modules/core/services";
import { NotifierService } from "angular-notifier";
import { LoginUser } from "src/app/platform/modules/core/modals/loginUser.modal";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-menu-list-item",
  templateUrl: "./menu-list-item.component.html",
  styleUrls: ["./menu-list-item.component.scss"],
  animations: [
    trigger("indicatorRotate", [
      state("collapsed", style({ transform: "rotate(0deg)" })),
      state("expanded", style({ transform: "rotate(180deg)" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4,0.0,0.2,1)")
      ),
    ]),
  ],
})
export class MenuListItemComponent implements OnChanges {
  expanded: boolean = false;
  tabOpened: boolean = false;
  profileSetup: ProfileSetupModel;
  @HostBinding("attr.aria-expanded") ariaExpanded = this.expanded;
  @Input() item!: NavItem;
  @Input() depth: number|null=null;
   public pendingAppointment:any;
   public pendingAppointmentLocalStorage:any;
   public inboxCountLocalStorage:any;
   public inboxCount: any;

  constructor(
    public router: Router,
    private _commonService: CommonService,
    private notifier: NotifierService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");

    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.profileSetup = new ProfileSetupModel();
    
  }

  ngOnIt(){

    // this._commonService.getPendingAppointment().subscribe(count=>this.pendingAppointment=count);
    // this._commonService.getInboxCount().subscribe(count=>this.inboxCount=count);

    

    this._commonService.pendingAppointment$.subscribe(value => {
      this.pendingAppointment = value;
    });



    this._commonService.inboxCount$.subscribe(count => {
      this.inboxCount = count;
    });


    this.pendingAppointmentLocalStorage=localStorage.getItem('pendingAppointment');
    this.inboxCountLocalStorage=localStorage.getItem('messageCount');
  }

  ngOnChanges(changes:any) {
    const item: NavItem = changes.item.currentValue || {};
    if (item.children && item.children.length > 0) {
      console.log(item);
      let routeName = this.router.url;
      this.expanded =
        this.item.children!.findIndex((x) => routeName.includes(x.route ?? '')) > -1;
    }
    this.getPendingAppointmentAndMailCount();
  }

 
  
getPendingAppointmentAndMailCount(){
  this._commonService.pendingAppointment$.subscribe(value => {
    this.pendingAppointment = value;
    if(this.pendingAppointment=='0'){
      this.pendingAppointment=localStorage.getItem("pendingAppointment");
    }
  });

  this._commonService.inboxCount$.subscribe(count => {
    this.inboxCount = count;
    if(this.inboxCount=='0'){
      this.inboxCount=localStorage.getItem("messageCount");
    }
  });
}

 

  onItemSelected(item: NavItem) {
    if (item.displayName == "User Management" || item.displayName == "Logs") {
      this.openTab();
    }
   
    this.getPendingAppointmentAndMailCount();
    let staffId: number = 0;
    this._commonService.loginUser.subscribe((user: LoginUser) => {
      if (user && user.data) {
        staffId = user.data.id;
      }
    });
    let isPatient: boolean = true;
    this._commonService.isPatient.subscribe((res) => {
      isPatient = res;
    });
    let userRole: string = "";
    this._commonService.userRole.subscribe((res) => {
      userRole = res;
    });
    this._commonService.isProfileComplete.subscribe((res) => {
      this._commonService.pendingAppointment$.subscribe(value => {
        this.pendingAppointment = value;
      });
      if (!isPatient && (userRole || "").toUpperCase() == "PROVIDER")
        this.profileSetup = res;
      else this.profileSetup.isProfileSetup = 1;
    });

    if (this.profileSetup.isProfileSetup) {
      if (!item.children || !item.children.length) {
        this.router.navigate([item.route], { queryParams: item.params || {} });
        // this.navService.closeNav();
      }
      if (item.children && item.children.length) {
        if (item.displayName == "My Client") {
          item.children = [
            {
              displayName: "View Client List",
              iconName: "",
              route: "/web/clientlist",
            },
            {
              displayName: "Add Client",
              iconName: "",
              route: "/web/client",
            },
          ];
          this.router.navigate([item.children[0].route]);
        } else {
          this.router.navigate([item.children[0].route], {
            queryParams: item.children[0].params || {},
          });
        }
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
          id: this._commonService.encryptValue(staffId),
        },
      });
    }
  }

  isActiveRoute(item: NavItem): boolean {
    // if (!item.route) {
    //   return false;
    // }

    // let routeIndex = this.router.url.indexOf("?"),
    //   isExact = routeIndex > -1 ? false : true;

    // if (item.route == "/web/manage-users/user" || item.route == "/web/client")
    //   isExact = true;

    // return this.router.isActive(item.route, isExact);
    if (!item.route && item.children && item.children.length > 0) {
      const childItem = item.children.find(
        (x) => x.route && x.route == this.router.url
      );
      return childItem ? true : false;
    } else if (item.route) {
      return item.route == this.router.url ? true : false;
    } else {
      return false;
    }
  }
  openTab() {
    console.log(10);
    this.tabOpened = !this.tabOpened;
  }
  closetab() {
    this.expanded = false;
  }
}
