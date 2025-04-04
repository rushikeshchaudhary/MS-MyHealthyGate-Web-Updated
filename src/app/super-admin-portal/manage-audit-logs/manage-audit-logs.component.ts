import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ResponseModel } from 'src/app/platform/modules/core/modals/common-model';
import { FilterModel } from '../core/modals/common-model';
import { ManageLogsService } from '../manage-login-logs/manage-logs.service';

@Component({
  selector: 'app-manage-audit-logs',
  templateUrl: './manage-audit-logs.component.html',
  styleUrls: ['./manage-audit-logs.component.css']
})
export class ManageAuditLogsComponent implements OnInit {

  displayColumns: Array<any> = [
    { displayName: "Username", key: "userName", isSort: true, class: "", width: "15%" },
    { displayName: "Action", key: "type", isSort: true, class: "", width: "10%" },
    { displayName: "DateTime", key: "dateTime", isSort: true, class: "", width: "40%" },
    { displayName: "Screen", key: "tableName", isSort: true, class: "", width: "20%" },
    { displayName: "OldValues", key: "oldValues", isSort: true, class: "", width: "10%" },
    { displayName: "NewValues", key: "newValues", isSort: true, class: "", width: "5%" }
  ];
  filterModel!: FilterModel;
  auditLogs: Array<any> = [];
  searchText: string = "";
  metaData: any;
  constructor(private logService: ManageLogsService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.filterModel = new FilterModel();
    this.getAllAuditLogs();
  }

  onPageOrSortChange(changeState?: any) {
    console.log(changeState);
    this.setPaginatorModel(changeState.pageIndex + 1, changeState.pageSize, changeState.sort, changeState.order, changeState.searchText);
    this.getAllAuditLogs();
  }
  setPaginatorModel(pageNumber: number, pageSize: number, sortColumn: string, sortOrder: string, searchText: string) {
    this.filterModel.pageNumber = pageNumber;
    this.filterModel.pageSize = pageSize;
    this.filterModel.sortOrder = sortOrder != undefined ? sortOrder : "";
    this.filterModel.sortColumn = sortColumn != undefined ? sortColumn : "";
    this.filterModel.searchText = searchText != undefined ? searchText : "";
  }
  getAllAuditLogs() {
    this.logService.getAllAuditLogs(this.filterModel).subscribe((response: ResponseModel) => {
      if (response.statusCode == 200) {
        this.auditLogs = response.data;
        this.auditLogs.forEach(ele => {
          ele.userName = ele.userName ? ele.userName : "-";
          ele.dateTime = this.datepipe.transform(ele.dateTime, 'MMM d, y, h:mm:ss a')
        })
        this.metaData = response.meta;
      } else {
        this.auditLogs = [];
        this.metaData = null
      }
      this.metaData.pageSizeOptions = [5, 10, 25, 50, 100];
    })
  }
  clearFilters() {
    this.searchText = "";
    this.filterModel.searchText = "";
    this.setPaginatorModel(1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.filterModel.searchText)
    this.getAllAuditLogs();
  }
  applyFilter(searchText: string = "") {
    this.setPaginatorModel(
      1, this.filterModel.pageSize, this.filterModel.sortColumn, this.filterModel.sortOrder, this.searchText);
    if (this.searchText.trim() == "" || this.searchText.trim().length >= 3)
      this.getAllAuditLogs();
  }

}
