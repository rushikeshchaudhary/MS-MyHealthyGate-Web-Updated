import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-pharmacy-client-details",
  templateUrl: "./pharmacy-client-details.component.html",
  styleUrls: ["./pharmacy-client-details.component.css"],
})
export class PharmacyClientDetailsComponent implements OnInit {
  moduleTabs: Array<any> = [
    {
      displayName: "Profile Summary",
      iconName: "",
      //route: "/web/client/profile",
    },
    // {
    //   displayName: "Documents",
    //   iconName: "",
    //  // route: "/webadmin/Masters/role-permissions",
    // },
    // {
    //   displayName: "Lab Refferal",
    //   iconName: "",
    //  // route: "/webadmin/Masters/role-permissions",
    // },
    // {
    //   displayName: "Radiology Refferal",
    //   iconName: "",
    //  // route: "/webadmin/Masters/role-permissions",
    // },
    {
      displayName: "Health Coverage Plan",
      iconName: "",
     // route: "/webadmin/Masters/role-permissions",
    },
    {
      displayName: "Insurance",
      iconName: "",
     // route: "/webadmin/Masters/role-permissions",
    },
    {
      displayName: "Allergies",
      iconName: "",
     // route: "/webadmin/Masters/role-permissions",
    },
    {
      displayName: "E-prescription",
      iconName: "",
    }
    // {
    //   displayName: "Past Appointments",
    //   iconName: "",
    //  // route: "/webadmin/Masters/role-permissions",
    // }
    
  ];
  // selectedIndex: any;
  selectedTabIndex: any;
  selectedTabDisplayName:any;
  private changeDetectorRef!: ChangeDetectorRef;

  constructor(private router: Router) {}

  ngOnInit() {
    this.onTabChange(0);
    // let currentUrl = this.router.url;
    // if (this.moduleTabs && this.moduleTabs.length) {
    //   const currentTabIndex = this.moduleTabs.findIndex(
    //     (x) => x.route && x.route == currentUrl
    //   );
    //   if (currentTabIndex != -1) {
    //     this.selectedTabIndex = currentTabIndex;
    //     this.onTabChange(this.selectedTabIndex);
    //   }
    // }
  }
  onTabChange(selectedTabIndex:any) {
    // const tab = this.moduleTabs[selectedTabIndex];
    // this.onItemSelected(tab);
    let data = this.moduleTabs.filter((ele, index) => {
      return index == selectedTabIndex;
    });
    this.selectedTabDisplayName = data[0].displayName

    console.log(data)
  }
  onItemSelected(item:any) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route], { queryParams: item.params || {} });
      this.changeDetectorRef.detectChanges();
    }
  }

  

}
