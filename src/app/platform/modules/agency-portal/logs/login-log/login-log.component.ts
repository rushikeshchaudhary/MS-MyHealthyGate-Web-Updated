import { Component, OnInit } from '@angular/core';
import { LogsService } from '../logs.service';
import { FilterModel, ResponseModel } from '../../../core/modals/common-model';
import { LoginLogModel } from '../logs.model';
import { format } from 'date-fns';
import { CommonService } from '../../../core/services';
import { LoginUser } from '../../../core/modals/loginUser.modal';
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.css']
})
export class LoginLogComponent implements OnInit {
  metaData: any;
  filterModel: FilterModel = new FilterModel;
  loggedInUserFirstName!: string;
  loginLogData: LoginLogModel[] = [];
  displayedColumns: Array<any> = [
    { displayName: 'login_by', key: 'createdByName', isSort: true, class: '', width: '20%' },
    { displayName: 'username', key: 'userName', isSort: false, class: '', width: '10%' },
    { displayName: 'role_name', key: 'roleName', class: '', width: '10%' },
    { displayName: 'ip_address', key: 'ipAddress', class: '', width: '10%' },
    { displayName: 'login_attempt', key: 'loginAttempt', class: '', width: '15%' },
    { displayName: 'login_date', key: 'logDate', class: '', width: '15%' },
  ];
  searchText: any;
  constructor(
    private loginLogService: LogsService,
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
        this.getLoginLogList(this.filterModel);
       console.log('user',user);
        }
      });
  }


  onPageOrSortChange(changeState?: any) {
    this.setPaginatorModel(changeState.pageIndex + 1, this.filterModel.pageSize, changeState.sort, changeState.order, this.filterModel.searchText);
    this.getLoginLogList(this.filterModel);
  }
  getLoginLogList(filterModel: FilterModel) {
    this.loginLogService.getLoginLogListing(filterModel).subscribe((response: ResponseModel) => {
      this.loginLogData = response.data;
      this.loginLogData = (response.data || []).map((obj: any) => {
        obj.logDate = format(obj.logDate, 'dd-MM-yyyy hh:mm:ss');
        // this.loginAttemptClass = obj.loginAttempt ? 'greenfont' : 'orangefont';
        return obj;
      })
      this.metaData = response.meta;
    }
    );
  }
  applyFilter(searchText: string = '') {
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == '' || this.searchText.trim().length >= 3)
      this.getLoginLogList(this.filterModel);
  }

  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder;
    this.filterModel.sortColumn = sortColumn;
    this.filterModel.searchText = searchText ? searchText : this.loggedInUserFirstName;
  }
}
