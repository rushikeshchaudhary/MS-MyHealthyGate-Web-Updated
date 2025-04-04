import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { MasterTemplate } from '../template.model';
import { FilterModelCreatedBy, Metadata, ResponseModel } from '../../core/modals/common-model';
import { TemplateService } from '../template.service';
import { DialogService } from '../../../../shared/layout/dialog/dialog.service';
import { Router } from '@angular/router';
import { CommonService } from '../../core/services';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-template-listing',
  templateUrl: './template-listing.component.html',
  styleUrls: ['./template-listing.component.css']
})
export class TemplateListingComponent implements OnInit {
  subscription!: Subscription;
  masterTemplatesList: MasterTemplate[] = [];
  metaData: Metadata;
  displayedColumns: Array<any>;
  commonColumns!: Array<any>;
  actionButtons: Array<any>;

  searchText: string = "";
  filterModel!: FilterModelCreatedBy;

  loading = false;
  addPermission: boolean = true;
  currentUser: any;
  UserRole:string;
  

  constructor(
    public activityModal: MatDialog,
    public templateService: TemplateService,
    private notifier: NotifierService,
    private dialogService: DialogService,
    private router: Router,
    private commonService: CommonService,
    private translate: TranslateService
  ) {
    this.metaData = new Metadata();
    translate.setDefaultLang(localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    //const userType = 'Supderadmin';
    this.UserRole = localStorage.getItem('UserRole')!;

    this.displayedColumns = [
      { displayName: 'template_name', key: 'templateName', isSort: true, class: '', width: '25%' },
      { displayName: 'template_category', key: 'templateCategoryName', class: '', width: '25%' },
      { displayName: 'template_subcategory', key: 'templateSubCategoryName', class: '', width: '25%' },
      { displayName: "Status", key: "status", class: '', width: "10%" },
      { displayName: 'Show to Provider', key: 'providerAccess', type: 'togglespan', class: '', permission: true },
      { displayName: 'actions', key: 'Actions' }
    ];
    this.actionButtons = [
      { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
      { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
    ];
//debugger
    if(this.UserRole === 'PROVIDER'){
      //this.UserRole = localStorage.getItem('userRole');
      this.displayedColumns = this.displayedColumns.filter(col => col.key !== 'providerAccess');
    } 
}

  clearFilters() {
    this.searchText = '';
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    this.getListData();
  }

  openDialog(id?: number): void {
   // debugger
    const encryptId = this.commonService.encryptValue(id, true);
    if(this.UserRole==="PROVIDER")
    {
      this.router.navigate(['/web/Masters/template/builder'], { queryParams: { id: encryptId } });
    }
    else
    {
      this.router.navigate(['/webadmin/Masters/template/builder'], { queryParams: { id: encryptId } });
  }}

  ngOnInit() {
    this.currentUser = localStorage.getItem("UserID");
    this.filterModel = new FilterModelCreatedBy();
    this.filterModel.createdBy = this.currentUser;
    this.UserRole = localStorage.getItem('UserRole')!;

    this.getListData();
  }

  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageIndex + 1, changeState.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getListData();
  }

  applyFilter(searchText: string = '') {
    if (this.searchText.trim() === '' || this.searchText.trim().length >= 3) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
      this.getListData();
    }
  }

  onTableActionClick(actionObj?: any) {

    console.log(actionObj);
    const id = actionObj.data && actionObj.data.id;
    const name = actionObj.data && actionObj.data.name;
    const createdBy = actionObj.data && actionObj.data.createdBy; 
    if (createdBy === 1 && this.UserRole === 'PROVIDER') {
      this.notifier.notify("error","You cannot edit or delete this item as it is added by SuperAdmin.");
      return; // Prevent further action if createdBy is 1
    }
    switch ((actionObj.action || "").toUpperCase()) {
      case 'EDIT':
        this.openDialog(id);
        break;
      case 'DELETE':
        this.deleteDetails(id, name);
        break;
      case 'PROVIDERACCESS':
        this.onToggleAccept(actionObj);
        break;
      default:
        break;
    }
  }

  onToggleAccept(actionObj: any = null) {
   /// debugger
    console.log(actionObj)
    const data = actionObj.data;
    if(actionObj.state==true){
      data.providerAccess=true
    }
    else{
      data.providerAccess=false
    }
    // const templateToUpdate = new MasterTemplate();
    // templateToUpdate.id = data.id;
    // templateToUpdate.state = !data.state; // Toggle the current state
    // if(templateToUpdate.state==true){
    //   data.providerAccess=true;
    // }

    this.templateService.UpdateTemplateIsApproveStatus(data).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.notifier.notify("success", response.message);
        this.getListData();
      } else {
        this.notifier.notify("error", response.message);
      }
    });
  }

  getListData() {
    //debugger
    this.templateService.getMasterTemplates(this.filterModel).subscribe((response: any) => {
      if (response.statusCode === 200) {
        response.data.forEach((ele:any) => {
          ele.status = ele.isActive ? "Active" : "Inactive";
        });
      //  debugger
        this.masterTemplatesList = response.data;
        this.metaData = response.meta;
      } else {
        this.masterTemplatesList = [];
        this.metaData = new Metadata();
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    });
  }

  deleteDetails(id: number, name: string) {
    this.dialogService.confirm(`Are you sure you want to delete this template?`).subscribe((result: any) => {
      if (result === true) {
        this.templateService.deleteTemplate(id).subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.notifier.notify('success', response.message);
            this.getListData();
          } else if (response.statusCode === 401) {
            this.notifier.notify('warning', response.message);
          } else {
            this.notifier.notify('error', response.message);
          }
        });
      }
    });
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
    this.filterModel.createdBy = this.currentUser;
    this.metaData.pageSize = pageSize;
    this.metaData.currentPage = pageNumber;
    this.metaData.defaultPageSize = 5;
  }
}
