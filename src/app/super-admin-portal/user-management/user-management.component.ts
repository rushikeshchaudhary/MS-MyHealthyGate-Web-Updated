import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ManageLabsComponent } from "../manage-labs/manage-labs.component";
import { ManagePatientsComponent } from "../manage-patients/manage-patients.component";
import { ManagePharmacyComponent } from "../manage-pharmacy/manage-pharmacy.component";
import { ManageProvidersComponent } from "../manage-providers/manage-providers.component";
import { ManageRadiologyComponent } from "../manage-radiology/manage-radiology.component";
import { ManageTopProvidersComponent } from "../manage-top-providers/manage-top-providers.component";
import { SupeAdminDataService } from "../supe-admin-data.service";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.css"],
})
export class UserManagementComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  private tabContent!: ViewContainerRef;
  selectedIndex: number = 0;
  clientTabs: any;
  userType: string= '';

  constructor(
    private cfr: ComponentFactoryResolver,
    private supeAdminDataService: SupeAdminDataService
  ) {
    this.clientTabs = [
      "Provider List",
      "Patients",
      "Labs",
      "Pharmacy",
      "Radiology",
      "Top Providers",
    ];
  }

 async ngOnInit() {
    this.userType = await this.supeAdminDataService.getUserType();
    if (this.userType == "Users" || this.userType == "Provider" || this.userType =="") {
      this.selectedIndex = 0;
      this.loadChild(0);
    }else if(this.userType == "Patient"){
      this.selectedIndex = 1;
      this.loadChild(1);
    }
    else if(this.userType == "Lab"){
      this.selectedIndex = 2;
      this.loadChild(2);
    }
    else if(this.userType == "Pharmacy"){
      this.selectedIndex = 3;
      this.loadChild(3);
    }
    else if(this.userType == "Radiology"){
      this.selectedIndex = 4;
      this.loadChild(4);
    }
   
  }

  loadComponent(eventType: any): any {
    this.loadChild(eventType.index);
  }

  loadChild(childName: number) {
    //  this.selectedIndex = this.clientTabs.indexOf(childName);
    this.selectedIndex = childName;
    let factory: any;
    if (childName == 0)
      factory = this.cfr.resolveComponentFactory(ManageProvidersComponent);
    else if (childName == 1)
      factory = this.cfr.resolveComponentFactory(ManagePatientsComponent);
    else if (childName == 2)
      factory = this.cfr.resolveComponentFactory(ManageLabsComponent);
    else if (childName == 3)
      factory = this.cfr.resolveComponentFactory(ManagePharmacyComponent);
    else if (childName == 4)
      factory = this.cfr.resolveComponentFactory(ManageRadiologyComponent);
    else if (childName == 5)
      factory = this.cfr.resolveComponentFactory(ManageTopProvidersComponent);

    this.tabContent.clear();
    let comp: ComponentRef<ManageProvidersComponent> =
      this.tabContent.createComponent(factory);
  }
}
