import { UserAwardComponent } from "./../user-award/user-award.component";
import { UserQualificationComponent } from "./../user-qualification/user-qualification.component";
import { UserExperienceComponent } from "./../user-experience/user-experience.component";
import { DataTableComponent } from "./../../../../../shared/data-table/data-table.component";
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewEncapsulation,
} from "@angular/core";
import { AddUserComponent } from "../add-user/add-user.component";
import { CustomFieldsComponent } from "../custom-fields/custom-fields.component";
import { AvailabilityComponent } from "../availability/availability.component";
import { UserModel, UserProfile } from "../users.model";
import { userInfo } from "os";
import { ResponseModel } from "../../../core/modals/common-model";
import { UsersService } from "../users.service";
import { ActivatedRoute, Router } from "@angular/router";
import { format } from "date-fns";
import { CommonService } from "../../../core/services";
import { AddVideoComponent } from "../add-video/add-video.component";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { AgencyadduserComponent } from "../agencyadduser/agencyadduser.component";


@Component({
  selector: 'app-agencyadduserparent',
  templateUrl: './agencyadduserparent.component.html',
  styleUrls: ['./agencyadduserparent.component.css']
})
export class AgencyadduserparentComponent implements OnInit {

  //@ViewChild("tabContent", { read: ViewContainerRef })
 // tabContent!: ViewContainerRef;
  @ViewChild('tabContent', { read: ViewContainerRef, static: true }) tabContent!: ViewContainerRef;

  userTabs: any;
  isProvider:any;
  staffId!: number;
  selectedIndex: number = 0;
  userProfile: UserProfile;
  tabName: any = "";
  isProfileComplete:boolean=true;
  show!: boolean;
  constructor(
    private cfr: ComponentFactoryResolver,
    private usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService
  ) {
    this.userTabs = [
      { TabName: "User Info", Component: AgencyadduserComponent },
      { TabName: "Work & Experience", Component: UserExperienceComponent },
      { TabName: "Qualifications", Component: UserQualificationComponent },
      { TabName: "Awards", Component: UserAwardComponent },
    ];

    this.commonService.loginUserSubject.subscribe((user: LoginUser) => {
      if (user.data) {
        if (user.data.userRoles.roleName == "Provider") {
          this.isProvider = true;
        } else {
        }
      } else {
        this.userTabs.push({
          TabName: "Upload Video",
          Component: AddVideoComponent,
        });
      }
    });
    this.userProfile = new UserProfile();
  }

  ngOnInit() {
    this.commonService.isProfileComplete.subscribe(res => {
    });

    // this.commonService.showCompleteProfileMessage$.subscribe((res)=>{
    //   this.show=res;
    // })
    this.tabName = "User Info";
    this.activatedRoute.queryParams.subscribe((params) => {
      this.staffId =
        params["id"] == undefined
          ? null
          : this.commonService.encryptValue(params["id"], false);
      if (this.tabName != undefined && this.tabName != "") {
        this.selectedIndex = this.userTabs.findIndex(
          (x: { TabName: any; }) => x.TabName == this.tabName
        );
      }

      this.loadChild(
        this.tabName == "" || this.tabName == undefined
          ? this.userTabs[0].TabName
          : this.tabName
      );
      this.getProfileUpdate();
      //localStorage.removeItem('tabToLoad');
    });

    this.commonService.profileMatChngTabSubject.subscribe(res=>{
      if(res == 'callGetProfileUpdateMethod'){
        this.getProfileUpdate();
      }
    });
  }

  getProfileUpdate = () => {
    this.commonService.getProfileUpdated(this.staffId).subscribe((res)=>{
      var matTabLabels  = document.getElementsByClassName("mat-tab-labels");
      if(res){
        if(!res.data.staffExperiences){
          matTabLabels[0].children[1].children[0].classList.add("mat-tab-text-color");
        }else{
          matTabLabels[0].children[1].children[0].classList.remove("mat-tab-text-color");
        }
        if(!res.data.staffQualifications){
          matTabLabels[0].children[2].children[0].classList.add("mat-tab-text-color");
        }else{
          matTabLabels[0].children[2].children[0].classList.remove("mat-tab-text-color");
        }
        if(!res.data.staffAwards){
          matTabLabels[0].children[3].children[0].classList.add("mat-tab-text-color");
        }else{
          matTabLabels[0].children[3].children[0].classList.remove("mat-tab-text-color");
        }
        if(!res.data.isProfileSetup){
          this.isProfileComplete=false;
        }
      }
    })
  };
  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    if (this.staffId != null && this.staffId > 0) this.getStaffProfileInfo();
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.userTabs.find((x: { TabName: string; }) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<AddUserComponent> =
      this.tabContent.createComponent(factory);
    comp.instance.staffId = this.staffId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  handleTabChange(data: any): any {
    this.staffId = data.id;
    this.getStaffProfileInfo();
    this.getProfileUpdate();

    this.selectedIndex = this.userTabs.findIndex((s: { TabName: any; }) => s.TabName == data.tab); // this.userTabs.findIndex(i => i == data.tab);//data.tab == this.userTabs[1] ? 1 : data.tab == this.userTabs[2] ? 2 : 0;

    this.loadChild(data.tab);
  }

  getStaffProfileInfo() {
    this.usersService
      .getStaffHeaderInfo(this.staffId)
      .subscribe((response: ResponseModel) => {
        if (response != null && response.statusCode == 200) {
          this.userProfile = response.data;
          this.userProfile.dob = format(new Date(this.userProfile.dob), 'MM/dd/yyyy');
        }
      });
    localStorage.setItem("staffdob", this.userProfile.dob);
  }
  onNavigate(url: string) {
    if(this.staffId)
      this.router.navigate([url], { });
  }

}
