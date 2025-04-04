import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { FilterModel, ResponseModel } from '../core/modals/common-model';
import { ManageLocationService } from '../manage-locations/manage-location.service';
import { ManageProvidersService } from '../manage-providers/manage-providers.service';
import { ProviderModel } from '../manage-providers/provider-model.model';
import { ShowProviderProfileComponent } from '../manage-providers/show-provider-profile/show-provider-profile.component';
import { ShowProvidersModalComponent } from './show-providers-modal/show-providers-modal.component';

@Component({
  selector: 'app-manage-top-providers',
  templateUrl: './manage-top-providers.component.html',
  styleUrls: ['./manage-top-providers.component.css']
})
export class ManageTopProvidersComponent implements OnInit {
  filterModel!: FilterModel;
  getAllProvidersfilterModel!: FilterModel;
  allProviders!: ProviderModel[];
  metaData: any;
  searchText: string = "";
  topProviders!: ProviderModel[];
  displayColumns: Array<any> = [
    {
      displayName: "Order No.",
      key: "orderNo",
      isSort: true,
      class: "",
      width: "5%"
    },
    {
      displayName: "Name",
      key: "firstName",
      isSort: true,
      class: "",
      width: "20%",
    },
    {
      displayName: "Email",
      key: "email",
      isSort: true,
      class: "",
      width: "20%",
    },
    {
      displayName: "Phone",
      key: "phoneNumber",
      isSort: true,
      class: "",
      width: "10%",
    }
  ];
  isAllProviderLoaded:boolean=false;

  constructor(
    private providerService: ManageProvidersService,
    private notifier: NotifierService,
    private dialogModal: MatDialog,
    private router:Router
  ) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllProvidersfilterModel=new FilterModel();
    this.getAllProviders();
    this.getTopProviders();
  }

  getTopProviders() {
   
    this.providerService
      .getTopProviders(this.filterModel)
      .subscribe((response: ResponseModel) => {
        if (response.statusCode == 200) {
          // console.log(response.data);
          this.topProviders = response.data;
         // this.topProviders = this.allProviders.filter(d => d.orderNo != null);//.sort((a, b) => { if (a.orderNo > b.orderNo) return 1; });
          this.metaData = response.meta;
        } else {
          this.topProviders = [];
          this.metaData = null;
        }
        this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  getAllProviders() {
 
   this.getAllProvidersfilterModel.pageNumber=1;
    this.getAllProvidersfilterModel.pageSize=-1;
    this.providerService
      .getAllProviders(this.getAllProvidersfilterModel,null,null,null)
      .subscribe((response: ResponseModel) => {
        
        if (response.statusCode == 200) {
         
          this.isAllProviderLoaded=true;
          // console.log(response.data);
          this.allProviders = response.data;
         
       //   this.topProviders = this.allProviders.filter(d => d.orderNo != null);//.sort((a, b) => { if (a.orderNo > b.orderNo) return 1; });
        //  this.metaData = response.meta;
        } else {
          this.isAllProviderLoaded=false;
          this.allProviders = [];
         // this.metaData = null;
        }
       // this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
      });
  }
  applyFilter(searchText: string = "") {
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      searchText
    );
    if (this.searchText.trim() == "" || searchText.trim().length >= 3) {
      this.getAllProviders();
    }
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginateorModel(
      1,
      this.filterModel.pageSize,
      this.filterModel.sortColumn,
      this.filterModel.sortOrder,
      this.filterModel.searchText
    );
    this.getAllProviders();
  }
  setPaginateorModel(
    pageNumber: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    searchText: string
  ) {
   
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
   
  }
  onPageOrSortChange(changeState?: any) {
     this.getAllProviders();
    
    this.setPaginateorModel(
     
      changeState.pageIndex + 1,
      changeState.pageSize,
      changeState.sort,
      changeState.order,
      changeState.searchText
    );

    this.getTopProviders();
  }
  openModal() {
    let documentModal = this.dialogModal.open(ShowProvidersModalComponent,
      {
        hasBackdrop: true,
        data: this.allProviders,
        width: '70%'
      });
    documentModal.afterClosed().subscribe((result: string) => {
      console.log("After closed:",result);
      this.getTopProviders();
      this.getAllProviders();
     
    });
  }
  onTableActionClick=(actionObj: { data: any; })=>{
    this.openUser(actionObj.data);
  }

  openUser(user: any) {
    this.router.navigate(["/webadmin/manage-users/user-profile"], {
      queryParams: { staffId: user.staffID, userId: user.userID },
    });
  }
}
