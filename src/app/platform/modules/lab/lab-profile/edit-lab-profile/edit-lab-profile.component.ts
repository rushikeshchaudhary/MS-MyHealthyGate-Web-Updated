import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { CommonService } from '../../../core/services';
import { LabService } from '../../lab.service';
import { LabAddressComponent } from './lab-address/lab-address.component';
import { LabAvaibilityComponent } from './lab-avaibility/lab-avaibility.component';
import { LabInformationComponent } from './lab-information/lab-information.component';
import { TranslateService } from "@ngx-translate/core";
import { LabQualificationnComponent } from './lab-qualificationn/lab-qualificationn.component';
import { LabExperienceComponent } from './lab-experience/lab-experience.component';
import { LabAwardComponent } from './lab-award/lab-award.component';



@Component({
  selector: 'app-edit-lab-profile',
  templateUrl: './edit-lab-profile.component.html',
  styleUrls: ['./edit-lab-profile.component.css']
})
export class EditLabProfileComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  labInfo:Array<any>=[];
  labAddress:Array<any>=[];
  loginData:any;

labTabs:any;
selectedIndex: number = 0;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private labService:LabService,
    private commonService: CommonService,
    private translate:TranslateService,


  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.labTabs = [
      { TabName: "Lab Information", Component: LabInformationComponent },
      { TabName: "Lab Address", Component: LabAddressComponent },
      { TabName: "Qualifications", Component: LabQualificationnComponent },
      { TabName: "Work & Experience", Component: LabExperienceComponent },
      { TabName: "Awards", Component: LabAwardComponent },

      //{ TabName: "Lab Availability", Component: LabAvaibilityComponent },
      
    ];
   }
labId:any;
  ngOnInit() {
    const UserRole = localStorage.getItem("UserRole");
    if (UserRole == "LAB") {
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
  } else {
    this.labId = this.activatedRoute.snapshot.paramMap.get('id');
    this.labService.GetLabById(this.labId).subscribe((res)=>{
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
    this.loadChild("Lab Information");
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
    let comp: ComponentRef<LabInformationComponent> =
      this.tabContent.createComponent(factory);
  }
  handleTabChange(data: any): any {

    this.selectedIndex = this.labTabs.findIndex((s:any) => s.TabName == data.tab);

    this.loadChild(data.tab);
  }

  

}
