import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format } from "date-fns";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { CommonService } from "../../../core/services";
import { LabService } from "../../../lab/lab.service";
import { RadiologyAddressComponent } from "./radiology-address/radiology-address.component";
import { RadiologyAwardComponent } from "./radiology-award/radiology-award.component";
import { RadiologyExperienceComponent } from "./radiology-experience/radiology-experience.component";
import { RadiologyInformationComponent } from "./radiology-information/radiology-information.component";
import { RadiologyQualificationnComponent } from "./radiology-qualificationn/radiology-qualificationn.component";

@Component({
  selector: "app-edit-radiology-profile",
  templateUrl: "./edit-radiology-profile.component.html",
  styleUrls: ["./edit-radiology-profile.component.css"],
})
export class EditRadiologyProfileComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  labInfo: Array<any> = [];
  labAddress: Array<any> = [];
  loginData: any;
  labTabs: any;
  selectedIndex: number = 0;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private labService: LabService,
    private commonService: CommonService
  ) {
    this.labTabs = [
      { TabName: "Radiology Information", Component: RadiologyInformationComponent },
      { TabName: "Radiology Address", Component: RadiologyAddressComponent },
      { TabName: "Qualification", Component: RadiologyQualificationnComponent },
      { TabName: "Work & Experience", Component: RadiologyExperienceComponent },
      { TabName: "Awards", Component: RadiologyAwardComponent },
    ];
  }

  ngOnInit() {
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        this.loginData = user.data
        this.labService.GetLabById(user.data.id).subscribe((res)=>{
          this.labInfo = res.data.labInfo
          this.labInfo = this.labInfo.map((x) => {
            x.dob =
              format(x.dob, 'MM/dd/yyyy')
              return x;
          });
          this.labInfo = this.labInfo.map((x) => {
            x.doj =
              format(x.doj, 'MM/dd/yyyy') 
              return x;
          });

          this.labAddress = res.data.labAddressesModel
        })
      }
    });
    this.loadChild("Radiology Information");
  }


  loadComponent(eventType: any): any {
    console.log(eventType)
    this.loadChild(eventType.tab.textLabel);
    
  }

  loadChild(childName: string) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.labTabs.find((x:any) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<RadiologyInformationComponent> =
      this.tabContent.createComponent(factory);
  }
  handleTabChange(data: any): any {

    this.selectedIndex = this.labTabs.findIndex((s:any) => s.TabName == data.tab);

    this.loadChild(data.tab);
  }

}
