import { Injectable } from '@angular/core';
import { CommonService } from '../core/services';
import { FilterModel } from '../core/modals/common-model';

@Injectable({
  providedIn: 'root'
})
export class ManageLogsService {

  getAllURL: string = "Radiology/GetLoginLogs";
  getAllAuditLogsURL: string = "Radiology/GetAuditLogs";
  constructor(private commonService: CommonService) { }

  getAllLogs(filterModel: FilterModel) {
    var url: string = `${this.getAllURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
  getAllAuditLogs(filterModel: FilterModel) {
    var url: string = `${this.getAllAuditLogsURL}?pageNumber=${filterModel.pageNumber}&pageSize=${filterModel.pageSize}&sortColumn=${filterModel.sortColumn}&sortOrder=${filterModel.sortOrder}&searchText=${filterModel.searchText}`;
    return this.commonService.getAll(url, {});
  }
}
