import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { format } from "date-fns";
import { FilterModel, ResponseModel } from "../../core/modals/common-model";
import { CommonService } from "../../core/services";
import { ClientList, StaffClientRequestModel } from "./client-list.model";
import { LayoutService } from "../../core/services/layout.service";
import { ClientListService } from "./client-list.service";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: "app-client-list",
  templateUrl: "./client-list.component.html",
  styleUrls: ["./client-list.component.css"],
})
export class ClientListComponent implements OnInit {
  searchKey: string = "";
  active: boolean = false;
  metaData: any;
  inActive: boolean = false;
  toggle: boolean = false;
  locationId!: number;
  patientList: Array<ClientList> = [];
  clientList: Array<any> = [];
 
  isLoadingClients!: boolean;
  loaderImage = "/assets/loader.gif";
  filterModel!: FilterModel;
  staffClientRequestModel: StaffClientRequestModel;
  currentStaff:any;
  displayColumns: Array<any> = [
    {
      displayName: "first_name",
      key: "patientFirstName",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "last_name",
      key: "patientLastName",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "gender",
      key: "gender",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "dob",
      key: "dob",
      type: "date",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "email",
      key: "email",
      isSort: true,
      class: "",
      width: "15%",
    },
    {
      displayName: "phone",
       key: "phoneNumber",
      //key: "emergencyContactPhone",
      isSort: true,
      class: "",
      width: "15%",
    },
    { displayName: "mrn", key: "mrn", isSort: true, class: "", width: "15%" },
  ];
 
  constructor(
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
    this.isLoadingClients = true;
    this.commonService.currentLoginUserInfo.subscribe((user: any) => {
      if (user) {
        this.locationId = user.currentLocationId;
        this.staffClientRequestModel.staffId = user.id;
        this.getStaffClients();
      }
    });
  }
  searchChanged = (e:any) => {
    this.staffClientRequestModel.searchText = e;
    this.getStaffClients();
  };
  // setPaginatorModel(
  //   pageNumber: number,
  //   pageSize: number,
  //   sortColumn: string,
  //   sortOrder: string,
  //   searchText: string
  // ) {
  //   this.filterModel.pageNumber = pageNumber;
  //   this.filterModel.pageSize = pageSize;
  //   this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : null;
  //   this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : null;
  //   this.filterModel.searchText = searchText != undefined ? searchText : null;
  // }
  // applyFilter(searchText: string = "") {
  //   this.setPaginatorModel(
  //     1,
  //     this.filterModel.pageSize,
  //     this.filterModel.sortColumn,
  //     this.filterModel.sortOrder,
  //     searchText
  //   );
  //   if (this.searchKey.trim() == "" || searchText.trim().length >= 3) {
  //     this.getClients();
  //   }
  // }
  // clearFilters() {
  //   this.searchKey = "";
  //   this.filterModel.searchText = "";
  //   this.setPaginatorModel(
  //     1,
  //     this.filterModel.pageSize,
  //     this.filterModel.sortColumn,
  //     this.filterModel.sortOrder,
  //     this.filterModel.searchText
  //   );
  //   this.getClients();
  // }
  // onPageOrSortChange(changeState?: any) {
  //   this.setPaginatorModel(
  //     changeState.pageNumber,
  //     changeState.pageSize,
  //     changeState.sort,
  //     changeState.order,
  //     ""
  //   );
  //   this.getClients();
  // }
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
  //       ) {
  //         this.patientList = response.data.map((x) => {
  //           x.dob = format(x.dob, 'MM/dd/yyyy');
  //           return x;
  //         });
  //         this.metaData = response.meta;
  //       } else {
  //         this.patientList = [];
  //         this.metaData = null;
  //       }
  //       this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
  //     });
  // }
 
  // onClick(event?: ClientList) {
  //   this.layoutService.toggleClientDrawer(false);
  //   if (event)
  //     this.route.navigate(["web/client/profile"], {
  //       queryParams: {
  //         id:
  //           event != null
  //             ? this.commonService.encryptValue(event.patientId, true)
  //             : null,
  //       },
  //     });
  //   else this.route.navigate(["web/client"], { queryParams: { id: null } });
  // }
  onPageOrSortChange = (e: { pageIndex: number; pageSize: number; sort: string; order: string; }) => {
    this.staffClientRequestModel.pageNumber = e.pageIndex + 1;
    this.staffClientRequestModel.pageSize = e.pageSize;
    this.staffClientRequestModel.sortColumn = e.sort;
    this.staffClientRequestModel.sortOrder = e.order;
    this.getStaffClients();
  };
  onTableActionClick = (e: { data: { patientId: any; }; }) => {
    this.route.navigate(["web/client/profile"], {
      queryParams: {
        id: this.commonService.encryptValue(e.data.patientId, true),
      },
    });
  };
 
  // toggleAdvancedFilter(toggle?: boolean) {
  //   this.toggle = toggle != null ? toggle : !this.toggle;
  //   // this.toggle = false;
  // }
 
  getStaffClients = () => {
    console.log(this.staffClientRequestModel);
    this.clientListingService
      .getStaffClient(this.staffClientRequestModel)
      .subscribe((res) => {
        this.isLoadingClients = false;
        if (res != null && res.data != null && res.statusCode == 200) {
          this.clientList = res.data.map((x:any) => {
            x.dob = format(x.dob, 'MM/dd/yyyy');
            return x;
          });
          this.clientList = this.clientList.reverse();
          this.metaData = res.meta;
        } else {
          this.clientList = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  };
}
 
