import { Injectable } from "@angular/core";
import { CommonService } from "../../core/services";
import { FilterModel } from "../../core/modals/common-model";

@Injectable({
    providedIn: 'root'
})

export class LogsService {
    private getAuditLogs = "api/AuditLog/GetAuditLogsList";
    private getLoginLogs = "api/AuditLog/GetLoginLogsList";


    constructor(private commonService: CommonService) {
    }

    getAuditLogListing(filterModel: FilterModel) {
        let createdBy = "";
        if (filterModel.searchText != null && filterModel.searchText != undefined) {
            createdBy = filterModel.searchText;
        }
        let url = this.getAuditLogs + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&createdBy=' + createdBy;
        return this.commonService.getAll(url, {});
    }
    getLoginLogListing(filterModel: FilterModel) {
        let createdBy = "";
        if (filterModel.searchText != null && filterModel.searchText != undefined) {
            createdBy = filterModel.searchText;
        }
        let url = this.getLoginLogs + '?pageNumber=' + filterModel.pageNumber + '&pageSize=' + filterModel.pageSize + '&sortColumn=' + filterModel.sortColumn + '&sortOrder=' + filterModel.sortOrder + '&createdBy=' + createdBy;
        return this.commonService.getAll(url, {});
    }
}