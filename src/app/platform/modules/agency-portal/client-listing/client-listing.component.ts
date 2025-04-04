import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { ClientListingService } from "./client-listing.service";
import { ResponseModel } from "../../core/modals/common-model";
import { ClientListingModel } from "./client-listing.model";
import { format } from "date-fns";
import { Router } from "@angular/router";
import { LayoutService } from "../../core/services/layout.service";
import { CommonService } from "../../core/services";
import { StaffClientRequestModel } from "../client-list/client-list.model";
import { ClientListService } from "../client-list/client-list.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-client-listing",
  templateUrl: "./client-listing.component.html",
  styleUrls: ["./client-listing.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class ClientListingComponent implements OnInit {
  searchKey: string = "";
  active: boolean = false;
  inActive: boolean = false;
  toggle: boolean = false;
  locationId!: number;
  patientList: Array<ClientListingModel> = [];
  isLoadingClients: boolean = false;
  loaderImage = "/assets/loader.gif";
  staffClientRequestModel: StaffClientRequestModel;
  currentStaff:any;
  clientList: Array<any> = [];
  metaData: any;


  constructor(
    // private clientListingService: ClientListingService,
    private clientListingService: ClientListService,
    private commonService: CommonService,
    private route: Router,
    private layoutService: LayoutService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.staffClientRequestModel = new StaffClientRequestModel();
  }

  ngOnInit() {
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.locationId = user.currentLocationId;
        this.staffClientRequestModel.staffId = user.id;
        this.staffClientRequestModel.pageSize=10000;
        this.getStaffClients();
      }
    });
  }
  searchChanged = (e:any) => {
    this.staffClientRequestModel.searchText = e;
    this.getStaffClients();
  };


  getStaffClients = () => {
    console.log(this.staffClientRequestModel);
    this.clientListingService
      .getStaffClient(this.staffClientRequestModel)
      .subscribe((res) => {
        this.isLoadingClients = false;
        if (res != null && res.data != null && res.statusCode == 200) {
          this.clientList = res.data.map((x:any) => {
            x.dob = format(x.dob, 'dd/MM/yyyy');
            return x;
          });
          this.metaData = res.meta;
        } else {
          this.clientList = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };
  // getActiveClients(event: any) {
  //   this.active = event.checked;
  //   this.getClients();
  // }
  // getInactiveClients(event: any) {
  //   this.inActive = event.checked;
  //   this.getClients();
  // }
  // getClients() {
  //   let status: boolean = true;
  //   if (this.active == true && this.inActive == false) {
  //     status = true;
  //   } else if (this.active == false && this.inActive == true) {
  //     status = false;
  //   }

  //   this.isLoadingClients = true;
  //   this.clientListingService
  //     .getPatients(this.searchKey, this.locationId, status)
  //     .subscribe((response: ResponseModel) => {
  //       this.isLoadingClients = false;
  //       if (
  //         response != null &&
  //         response.data != null &&
  //         response.statusCode == 200
  //       )
  //         this.patientList = response.data.map((x) => {
  //           x.dob = format(x.dob, 'MM/dd/yyyy');
  //           return x;
  //         });
  //       else this.patientList = [];
  //     });
  // }

  onClick(item?: ClientListingModel) {
    this.layoutService.toggleClientDrawer(false);
    if (item)
      this.route.navigate(["web/client/profile"], {
        queryParams: {
          id:
            item != null
              ? this.commonService.encryptValue(item.patientId, true)
              : null,
        },
      });
    else this.route.navigate(["web/client"], { queryParams: { id: null } });
  }

  toggleAdvancedFilter(toggle?: boolean) {
    this.toggle = toggle != null ? toggle : !this.toggle;
    // this.toggle = false;
  }
}
