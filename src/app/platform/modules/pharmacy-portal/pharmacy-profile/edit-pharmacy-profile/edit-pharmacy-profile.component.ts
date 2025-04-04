import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { format } from "date-fns";
import { LoginUser } from "../../../core/modals/loginUser.modal";
import { CommonService } from "../../../core/services";
import { PharmacyService } from "../../pharmacy.service";
import { PharmacyAddressComponent } from "./pharmacy-address/pharmacy-address.component";
import { PharmacyAvaibilityComponent } from "./pharmacy-avaibility/pharmacy-avaibility.component";
import { PharmacyInformationComponent } from "./pharmacy-information/pharmacy-information.component";
import { Pharmacy } from "../Pharmacy.model";
import { TranslateService } from "@ngx-translate/core";
import { PharmacyQualificationnComponent } from "./pharmacy-qualificationn/pharmacy-qualificationn.component";
import { PharmacyExperieceComponent } from "./pharmacy-experiece/pharmacy-experiece.component";
import { PharmacyAwardComponent } from "./pharmacy-award/pharmacy-award.component";


@Component({
  selector: "app-edit-pharmacy-profile",
  templateUrl: "./edit-pharmacy-profile.component.html",
  styleUrls: ["./edit-pharmacy-profile.component.css"],
})
export class EditPharmacyProfileComponent implements OnInit {
  @ViewChild("tabContent", { read: ViewContainerRef })
  tabContent!: ViewContainerRef;
  PharmacyInfo: Array<Pharmacy> = [];
  PharmacyAddress: Array<any> = [];
  loginData: any;
  pharmacyTabs: any;
  selectedIndex: number = 0;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private pharmacyService: PharmacyService,
    private commonService: CommonService,
    private translate:TranslateService,
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en"|| "en");
    translate.use(localStorage.getItem("language") || "en"|| "en");
    this.pharmacyTabs = [
      { TabName: "Pharmacy Information", Component: PharmacyInformationComponent },
      { TabName: "Pharmacy Address", Component: PharmacyAddressComponent },
      { TabName: "Qualification", Component: PharmacyQualificationnComponent },
      { TabName: "Work & Experience", Component: PharmacyExperieceComponent },
      { TabName: "Awards", Component: PharmacyAwardComponent },
      
    ];
  }
  pharmacyId: any;
  ngOnInit() {
    const UserRole = localStorage.getItem("UserRole");
    if(UserRole=="PHARMACY"){
      this.commonService.loginUser.subscribe((user: LoginUser) => {
        if (user.data) {
          this.loginData = user.data;
          this.pharmacyService.GetPharmacyById(user.data.id).subscribe((res) => {
            this.PharmacyInfo = res.data.pharmacyInfo;
            this.PharmacyInfo = this.PharmacyInfo.map((x) => {
              x.dob = format(new Date(x.dob), 'MM/dd/yyyy');
              return x;
            });
            this.PharmacyInfo = this.PharmacyInfo.map((x) => {
              x.registerDate = format(new Date(x.registerDate), 'MM/dd/yyyy');
              return x;
            });
            this.PharmacyAddress = res.data.pharmacyAddressInfo;
          });
        }
      });
    }else{
      this.pharmacyId = this.activatedRoute.snapshot.paramMap.get('id');
      this.pharmacyService.GetPharmacyById(this.pharmacyId).subscribe((res) => {
        this.PharmacyInfo = res.data.pharmacyInfo;
        this.PharmacyInfo = this.PharmacyInfo.map((x) => {
          x.dob = format(new Date(x.dob), 'MM/dd/yyyy');
          return x;
        });
        this.PharmacyInfo = this.PharmacyInfo.map((x) => {
          x.registerDate = format(new Date(x.registerDate), 'MM/dd/yyyy');
          return x;
        });
        this.PharmacyAddress = res.data.pharmacyAddressInfo;
      });
    }
   

    this.loadChild("Pharmacy Information");
  }

  loadComponent(eventType: any): any {
    console.log(eventType)
    this.loadChild(eventType.tab.textLabel);
    
  }

  loadChild(childName: string) {
    let factory: any;
    factory = this.cfr.resolveComponentFactory(
      this.pharmacyTabs.find((x:any) => x.TabName == childName).Component
    );
    this.tabContent.clear();
    let comp: ComponentRef<PharmacyInformationComponent> =
      this.tabContent.createComponent(factory);
  }
  handleTabChange(data: any): any {

    this.selectedIndex = this.pharmacyTabs.findIndex((s:any) => s.TabName == data.tab);

    this.loadChild(data.tab);
  }
  useLanguage(language: string): void {
    localStorage.setItem("language", language);
    this.translate.use(language);
  }

}
