import { Component, OnInit } from '@angular/core';
import { FilterModel, ResponseModel, Metadata } from '../../../core/modals/common-model';
// import { PayerModel, PayerListingModel } from '../payers.model';
// import { PayersService } from '../payers.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonService } from '../../../core/services';
import { DialogService } from '../../../../../shared/layout/dialog/dialog.service';
import { PayerListingModel } from '../../payers/payers.model';
import { PayersService } from '../../payers/payers.service';
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-carecategory',
  templateUrl: './carecategory.component.html',
  styleUrls: ['./carecategory.component.css']
})
export class CareCategoryComponent implements OnInit {
    
  payerId!: number;
  metaData: any;
  searchText: string = "";
  filterModel: FilterModel;
  payersData: PayerListingModel[];
  addPermission!: boolean;
  displayedColumns: Array<any> = [
    { displayName: 'care_category_name', key: 'careCategoryName', isSort: true, class: '' },
    //{ displayName: 'Keyword Name', key: 'keywordName', isSort: true, class: '', width: '30%' },
    // { displayName: 'Insurance Type', key: 'insType', class: '', width: '20%' },
    // { displayName: 'Status', key: 'isActive', class: '', width: '10%', type: ['Active', 'Inactive'] },
    { displayName: 'Actions', key: 'Actions', class: '', width: '10%' }

  ];
  actionButtons: Array<any> = [
    { displayName: 'Edit', key: 'edit', class: 'fa fa-pencil' },
    { displayName: 'Delete', key: 'delete', class: 'fa fa-times' },
  ];
  constructor(
    private payersService: PayersService,
    private notifier: NotifierService,
    private router: Router,
    private commonService: CommonService,
    private dialogService: DialogService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
    this.filterModel = new FilterModel();
    this.payersData = new Array<PayerListingModel>();  
  }

  ngOnInit() {
    this.getPayersList();
    this.getUserPermissions();
  }
  onPageOrSortChange(changeState?: any) {
      
    this.setPaginatorModel(changeState.pageIndex + 1, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getPayersList();
  }

  onTableActionClick(actionObj?: any) {
    
    const id = actionObj.data && actionObj.data.id;
    switch ((actionObj.action || '').toUpperCase()) {
      case 'EDIT':
        this.addPayer(id);
        break;
      case 'DELETE':
        {
          this.notifier.hideAll();
          this.dialogService.confirm(`Are you sure you want to delete this care category?`).subscribe((result: any) => {
            if (result == true) {
              this.payersService.deleteCareCtegory(id).subscribe((response: ResponseModel) => {
                if (response.statusCode == 200) {
                  this.notifier.notify('success', response.message)
                  this.getPayersList();
                } else {
                  this.notifier.notify('error', response.message)
                } 
              });
            }
          })
        }
        break;
      default:
        break;
    }
  }


  applyFilter(searchText: string = '') {
    if (searchText == '' || searchText.length > 2) {
      this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, searchText);
      //this.getPayersList();
    }
  }

  getPayersList() {
    this.payersService.getkeywordList(this.filterModel).subscribe((response: ResponseModel) => {
      if (response != null && response.statusCode == 200) {
        this.payersData = response.data || [];
        this.metaData = response.meta;
      }
      else {
      this.payersData = [];
        this.metaData = new Metadata();
      }
    });
  }
  clearFilters() {
    this.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, '');
    //this.getPayersList();
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText;
  }
  addPayer(payerId?: number) {
    this.router.navigate(["/web/Masters/addcarecategory"], { queryParams: { id: payerId != null ? this.commonService.encryptValue(payerId, true) : null } });
  }

  getUserPermissions() {
    // const actionPermissions = this.payersService.getUserScreenActionPermissions('PAYER', 'PAYER_LIST');
    // const { PAYER_LIST_ADD, PAYER_LIST_UPDATE, PAYER_LIST_DELETE } = actionPermissions;
    // if (!PAYER_LIST_UPDATE) {
    //   let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'edit');
    //   this.actionButtons.splice(spliceIndex, 1)
    // }
    // if (!PAYER_LIST_DELETE) {
    //   let spliceIndex = this.actionButtons.findIndex(obj => obj.key == 'delete');
    //   this.actionButtons.splice(spliceIndex, 1)
    // }

    this.addPermission = true;//PAYER_LIST_ADD || false;

  }
}
