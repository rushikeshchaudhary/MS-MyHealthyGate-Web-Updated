import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  Output,
  EventEmitter,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DemographicInfoComponent } from "../demographic-info/demographic-info.component";
import { GuardianComponent } from "../guardian/guardian.component";
import { AddressComponent } from "../address/address.component";
import { InsuranceComponent } from "../insurance/insurance.component";
import { CustomFieldsComponent } from "../custom-fields/custom-fields.component";
import { Observable } from "rxjs";
import { ResponseModel } from "../../../core/modals/common-model";
import { ClientsService } from "../clients.service";
import { ClientHeaderComponent } from "../client-header/client-header.component";
import { CommonService } from "../../../core/services";
import { NotifierService } from "angular-notifier";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientComponent implements OnInit {
  @ViewChild(ClientHeaderComponent) child!: ClientHeaderComponent;
  public header: string = "My Client";
  // @ViewChild("tabContent", { read: ViewContainerRef })
  // private tabContent!: ViewContainerRef;
  @ViewChild('tabContent', { read: ViewContainerRef, static: true }) tabContent!: ViewContainerRef;

  clientTabs: any;
  clientId: number|null=null;
  selectedIndex: number = 0;
  dataURL: any;
  isApproved: boolean = false;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientsService,
    private commonService: CommonService,
    private notifier: NotifierService,
    private route: Router,
    private translate:TranslateService

  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.clientTabs = [
      "Demographic Info",
      "Guardian/Guarantor",
      "Address",
      "Insurance",
      "Custom Fields",
    ];

  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.clientId =
        params["id"] == undefined
          ? null
          : parseInt(this.commonService.encryptValue(params["id"], false));
      this.selectedIndex = 0;
    //  this.loadChild("Demographic Info");
    this.loadChild("demographic_info");
  });

    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        console.log(user);
        this.isApproved = user.isApprove;
        if (user.isApprove == false) {
          this.notifier.notify(
            "error",
            "You are not authorized to access this section!"
          );

          this.route.navigate(["web/clientlist"]);
        }
      }
    });
  }

  loadComponent(eventType: any): any {
    this.loadChild(eventType.tab.textLabel);
  }
  loadChild(childName: string) {
    this.selectedIndex = this.clientTabs.indexOf(childName);
    let factory: any;
    if (childName == "demographic_info")
      factory = this.cfr.resolveComponentFactory(DemographicInfoComponent);
    else if (childName == "Guardian/Guarantor")
      factory = this.cfr.resolveComponentFactory(GuardianComponent);
    else if (childName == "Address")
      factory = this.cfr.resolveComponentFactory(AddressComponent);
    else if (childName == "Insurance")
      factory = this.cfr.resolveComponentFactory(InsuranceComponent);
    else if (childName == "Custom Fields")
      factory = this.cfr.resolveComponentFactory(CustomFieldsComponent);
    this.tabContent.clear();
    let comp: ComponentRef<any> =
      this.tabContent.createComponent(factory!=null?factory:this.cfr.resolveComponentFactory(DemographicInfoComponent));
    comp.instance.clientId = this.clientId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  handleTabChange(data: any): any {
    this.clientId = data.id;
    if (this.child != undefined) this.child.getClientHeaderInfo();
    if (data.clickType != "Save") {
      this.loadChild(data.tab);
    }
  }
  importCCDA(e: any) {
    if (this.commonService.isValidFileType(e.target.files[0].name, "xml")) {
      var input = e.target;
      var reader = new FileReader();
      reader.onload = () => {
        this.dataURL = reader.result;
        this.clientService
          .importCCDA(this.dataURL)
          .subscribe((response: ResponseModel) => {
            if (response != null && response.statusCode == 200)
              this.notifier.notify(
                "success",
                "Patient information has been imported successfully"
              );
            else
              this.notifier.notify(
                "error",
                "Some error occurred while importing patient information"
              );
          });
      };
      reader.readAsDataURL(input.files[0]);
    } else this.notifier.notify("error", "Please select valid file type");
  }
}
