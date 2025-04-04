import { Component, OnInit } from '@angular/core';
import { AudiLogModel } from '../logs.model';
import { ResponseModel, FilterModel } from '../../../core/modals/common-model';
import { LogsService } from '../logs.service';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
   metaData: any;
   loggedInUserFirstName!: string;
   filterModel!: FilterModel;
   auditLogData!: AudiLogModel[];
   displayedColumns: Array<any> = [
    { displayName: 'screen', key: 'screenName', isSort: true, class: '',width:'20%' },
    { displayName: 'column', key: 'columnName', isSort: false, class: '',width:'10%' },
    { displayName: 'old_value', key: 'oldValue', class: '',width:'10%' },
    { displayName: 'new_value', key: 'newValue', class: '',width:'10%' },
    { displayName: 'name', key: 'patientName', class: '',width:'15%' },
    { displayName: 'actions', key: 'action', class: '',width:'8%' },
    { displayName: 'date', key: 'logDate', class: '',width:'15%' },
    { displayName: 'created_by', key: 'createdByName', class: '',width:'12%' },

  ];
  searchText: any;
  constructor(
    private auditLogService: LogsService,
    private commonService: CommonService,
    private translate:TranslateService
  ) {
    translate.setDefaultLang( localStorage.getItem("language") || "en");
    translate.use(localStorage.getItem("language") || "en");
  }
  ngOnInit() {
    this.commonService.loginUser.subscribe((user: LoginUser) => {
      if (user.data) {
        //////debugger
        this.loggedInUserFirstName=user.data.firstName;
        this.filterModel=new FilterModel();
        this.filterModel.searchText=this.loggedInUserFirstName;
        this.getAuditLogList(this.filterModel);
       console.log('user',user);
        }
      });
   
  }


  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageIndex + 1,this.filterModel.pageSize,changeState.sort,changeState.order,this.filterModel.searchText);
    this.getAuditLogList(this.filterModel);
  }

  getAuditLogList(filterModel:FilterModel) {
    this.auditLogService.getAuditLogListing(filterModel).subscribe((response: ResponseModel) => {
      this.auditLogData = response.data;
      this.auditLogData = (response.data || []).map((obj: any) => {
        obj.logDate = format(obj.logDate, 'dd-MM-yyyy hh:mm:ss');
        obj.patientName = obj.patientName ? obj.patientName : '-'
        obj.oldValue = obj.oldValue ? obj.oldValue : '-'
        obj.newValue = obj.newValue ? obj.newValue : '-'
        return obj;
      })
      this.metaData = response.meta;
    }
    );
  }
  applyFilter(searchText:string='')
  {   
    this.setPaginatorModel(1,this.filterModel.pageSize,this.filterModel.sortColumn,this.filterModel.sortOrder,this.searchText);
    if(this.searchText.trim() =='' || this.searchText.trim().length>=3)
       this.getAuditLogList(this.filterModel);
  }

  setPaginatorModel(pageNumber:number,pageSize:number,sortColumn:string,sortOrder:string,searchText:string)
  {
    this.filterModel.pageNumber=pageNumber;
    this.filterModel.pageSize=pageSize;
    this.filterModel.sortOrder=sortOrder;
    this.filterModel.sortColumn=sortColumn;
    this.filterModel.searchText=searchText ? searchText : this.loggedInUserFirstName ? this.loggedInUserFirstName : '';
    
  }
}
