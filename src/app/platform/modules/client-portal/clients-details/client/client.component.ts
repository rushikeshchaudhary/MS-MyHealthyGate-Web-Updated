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
import { ActivatedRoute } from "@angular/router";
import { DemographicInfoComponent } from "../demographic-info/demographic-info.component";
import { AddressComponent } from "../address/address.component";
import { Observable } from "rxjs";
import { ResponseModel } from "../../../core/modals/common-model";
import { ClientsService } from "../clients.service";
import { CommonService } from "../../../core/services";
import { NotifierService } from "angular-notifier";
// import { ClientHeaderComponent } from '../client-header/client-header.component';
import { Router } from "@angular/router";
import { ClientPermissionComponent } from "../client-permission/client-permission.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientComponent implements OnInit {
  // @ViewChild(ClientHeaderComponent) child: ClientHeaderComponent ;
  private header: string = "Manage Client";
 // @ViewChild("tabContent", { read: ViewContainerRef })
 @ViewChild('tabContent', { read: ViewContainerRef, static: true }) tabContent!: ViewContainerRef;

  //private tabContent!: ViewContainerRef;
  clientTabs: any;
  clientId!: number;
  selectedIndex: number = 0;
  dataURL: any;
  constructor(
    private cfr: ComponentFactoryResolver,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientsService,
    private commonService: CommonService,
    private notifier: NotifierService,
    private route: Router,
    private translate: TranslateService
  ) {
    this.clientTabs = ["demographic_info", "address" , "permission"];
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.clientId =
        params["id"] == undefined
          ? 0
          : parseInt(this.commonService.encryptValue(params["id"], false));
      this.selectedIndex = 0;
      this.loadChild(0);
    });
  }

  moveBack() {
    this.route.navigate(["web/client/my-profile"]);
  }
  loadComponent(eventType: any): any {
    this.loadChild(eventType.index);
  }
  loadChild(childName: number) {
    debugger
    //  this.selectedIndex = this.clientTabs.indexOf(childName);
    this.selectedIndex = childName;
    console.log(this.selectedIndex);
    let factory: any;
    if (childName == 0)
      factory = this.cfr.resolveComponentFactory(DemographicInfoComponent);
    else if (childName == 1)
      factory = this.cfr.resolveComponentFactory(AddressComponent);
    else if (childName == 2)
      factory = this.cfr.resolveComponentFactory(ClientPermissionComponent);

    this.tabContent.clear();
    let comp: ComponentRef<DemographicInfoComponent> =
      this.tabContent.createComponent(factory);
    comp.instance.clientId = this.clientId;
    comp.instance.handleTabChange.subscribe(this.handleTabChange.bind(this));
  }

  handleTabChange(data: any): any {
    this.clientId = data.id;
    //if(this.child!=undefined)
    //this.child.getClientHeaderInfo();
    if (data.clickType != "Save") {
      this.loadChild(data.tab);
    }
  }
}
