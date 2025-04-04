import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-manage-masters",
  templateUrl: "./manage-masters.component.html",
  styleUrls: ["./manage-masters.component.css"],
})
export class ManageMastersComponent implements OnInit {
  moduleTabs: Array<any> = [
    // {
    //   displayName: "Role Permission",
    //   iconName: "",
    //   route: "/webadmin/Masters/role-permissions",
    // },
    // {
    //    displayName: "User Roles",
    //   iconName: "",
    //   route: "/webadmin/Masters/user-role",
    // },
    {
      displayName: "Manage Tags",
      iconName: "",
      route: "/webadmin/Masters/tag",
    },
    // {
    //   displayName: "Location",
    //   iconName: "",
    //   route: "/webadmin/Masters/location-master",
    // },
    {
      displayName: "Custom Fields",
      iconName: "",
      route: "/webadmin/Masters/custom-fields",
    },
    {
      displayName: "Insurance Types",
      iconName: "",
      route: "/webadmin/Masters/insurance-type",
    },
    // {
    //   displayName: "Security Questions",
    //   iconName: "",
    //   route: "/webadmin/Masters/security-question",
    // },
    {
      displayName: "Agency Details",
      iconName: "",
      route: "/webadmin/Masters/agency-details",
    },
    {
      displayName: "Services",
      iconName: "",
      route: "/webadmin/Masters/master-services",
    },
    {
      displayName: "Master Template",
      iconName: "",
      route: "/webadmin/Masters/template",
    },
    {
      displayName: "Speciality",
      iconName: "",
      route: "/webadmin/Masters/speciality",
    },
    {
      displayName: "Insurance CompanyDetails",
      iconName: "",
      route: "/webadmin/Masters/Insurance-CompanyDetails",
    },
    {
      displayName: "Catogery-Master",
      iconName: "",
      route: "/webadmin/Masters/Catogery-Master",
    },
    {
      displayName: "Test-List-Master",
      iconName: "",
      route: "/webadmin/Masters/Test-Master",
    },
    {
      displayName: "Icd-Diagnosis Codes",
      iconName: "",
      route: "/webadmin/Masters/Icd-masterdata",
    },
    {
      displayName: "Immunization",
      iconName: "",
      route: "/webadmin/Masters/Immunization-details",
    },
    {
      displayName: "Prescription-Drug",
      iconName: "",
      route: "/webadmin/Masters/PrescriptionDrugDetailsComponent-details",
    },
    {
      displayName: "Allergies",
      iconName: "",
      route: "/webadmin/Masters/MasterAllergiesDetailsComponent-details",
    },
    {
      displayName: "Security-Questions",
      iconName: "",
      route: "/webadmin/Masters/MasterSecurityquestionsComponent-details",
    },
    // {
    //   displayName: "keywords",
    //   iconName: "",
    //   route: "/webadmin/Masters/add-keyword",
    // },
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
  onTabChange(selectedTabIndex: number) {
    // const tab = this.moduleTabs[selectedTabIndex];
    // this.onItemSelected(tab);
    let data = this.moduleTabs.filter((ele, index) => {
      return index == selectedTabIndex;
    });
    if (data[0].displayName === "Master Template") {
      this.router.navigate(["/webadmin/Masters/template"]);
    } else {
      this.selectedTabDisplayName = data[0].displayName;
    }

    console.log(data);
  }
  onItemSelected(item: { children: string | any[]; route: any; params: any; }) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route], { queryParams: item.params || {} });
      this.changeDetectorRef.detectChanges();
    }
  }
}
